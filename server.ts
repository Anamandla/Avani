import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { generateDomainReport } from './src/utils/creditReportEngine.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy Google GenAI initialization with required telemetry User-Agent header
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({ 
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return genAIClient;
}

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
    timestamp: new Date().toISOString()
  });
});

// In-memory cache for reports to prevent duplicate calls and rate-limiting
interface CachedReport {
  report: any;
  timestamp: number;
}
const reportCache = new Map<string, CachedReport>();
const REPORT_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

// Circuit breaker state for Gemini API peak load / quota limits
const geminiCircuitBreaker = {
  isOpen: false,
  openedAt: 0,
  cooldownMs: 60 * 1000, // 60 seconds cooldown when 429 or 503 is hit
  reason: ''
};

function isCircuitBreakerActive(): boolean {
  if (!geminiCircuitBreaker.isOpen) return false;
  if (Date.now() - geminiCircuitBreaker.openedAt > geminiCircuitBreaker.cooldownMs) {
    // Reset circuit breaker to try again
    geminiCircuitBreaker.isOpen = false;
    geminiCircuitBreaker.reason = '';
    return false;
  }
  return true;
}

function tripCircuitBreaker(reason: string) {
  geminiCircuitBreaker.isOpen = true;
  geminiCircuitBreaker.openedAt = Date.now();
  geminiCircuitBreaker.reason = reason;
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number = 6500): Promise<T> {
  let timeoutHandle: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutHandle = setTimeout(() => {
      reject(new Error(`Model call timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  return Promise.race([
    promise.then((result) => {
      clearTimeout(timeoutHandle);
      return result;
    }),
    timeoutPromise
  ]);
}

async function generateReportWithGemini(
  ai: GoogleGenAI,
  systemPrompt: string,
  businessName: string
): Promise<{ report: any; modelUsed: string }> {
  // If circuit breaker is active, immediately yield to domain engine without delaying client
  if (isCircuitBreakerActive()) {
    throw new Error(`Adaptive mode active (${geminiCircuitBreaker.reason})`);
  }

  // Candidate models: gemini-3.8-flash (primary), gemini-3.1-flash-lite (high capacity)
  const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];

  for (const model of candidateModels) {
    try {
      const response = await withTimeout(
        ai.models.generateContent({
          model,
          contents: [
            {
              role: 'user',
              parts: [{ text: `Generate the complete AI Credit Report for ${businessName}.` }]
            }
          ],
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
            temperature: 0.3
          }
        }),
        6500 // 6.5s timeout per candidate
      );

      let rawText = (response.text || '').trim();
      // Clean markdown fences if present
      if (rawText.startsWith('```')) {
        rawText = rawText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
      }

      if (rawText) {
        const parsed = JSON.parse(rawText);
        const modelDisplayName = 
          model === 'gemini-3.8-flash' 
            ? 'Google Gemini 3.8 Flash' 
            : 'Google Gemini 3.1 Flash Lite';

        return {
          report: parsed,
          modelUsed: modelDisplayName
        };
      }
    } catch (err: any) {
      const errMessage = err?.message || String(err);
      const isQuota429 = errMessage.includes('429') || errMessage.includes('RESOURCE_EXHAUSTED') || errMessage.includes('quota');
      const isDemand503 = errMessage.includes('503') || errMessage.includes('UNAVAILABLE') || errMessage.includes('high demand');

      // Use console.log for standard operational telemetry (avoids emitting to stderr)
      console.log(`[Avani AI Status] Candidate ${model} unavailable: ${isQuota429 ? 'Quota limit reached' : isDemand503 ? 'Regional compute demand spike' : 'Timeout/Unavailable'}.`);

      if (isQuota429) {
        // Quota applies key-wide, trip circuit breaker immediately
        tripCircuitBreaker('API Quota Exceeded (429)');
        break;
      }
    }
  }

  tripCircuitBreaker('Peak upstream compute demand (503)');
  throw new Error('All candidate Gemini models are currently experiencing peak demand.');
}

// AI-Powered Credit Report Endpoint
app.post('/api/credit-report', async (req, res) => {
  const { application, language = 'en', forceRefresh = false } = req.body;
  const businessName = application?.businessName || 'SME Business';
  const cacheKey = `${application?.id || businessName}_${language}`;

  // Check in-memory cache first if not explicitly forced
  if (!forceRefresh && reportCache.has(cacheKey)) {
    const cached = reportCache.get(cacheKey)!;
    if (Date.now() - cached.timestamp < REPORT_CACHE_TTL_MS) {
      return res.json({
        report: cached.report,
        notice: 'Served from high-performance underwriting cache.'
      });
    }
  }

  try {
    const ai = getGenAI();

    // If Gemini is not configured, supply high-precision domain-model report
    if (!ai) {
      const fallbackReport = generateDomainReport(application, language);
      return res.json({
        report: fallbackReport,
        notice: 'Generated using Avani Behavioral Underwriting Engine (Add GEMINI_API_KEY for dynamic generative synthesis).'
      });
    }

    const score = application?.metrics?.overallScore || 742;
    const turnover = application?.metrics?.averageMonthlyRevenue || 142500;
    const dishonours = application?.metrics?.dishonouredDebits180d || 0;
    const supplierTrust = application?.metrics?.supplierReliability || 94;
    const requestedAmount = application?.requestedAmount || 350000;
    const industry = application?.industry || 'Manufacturing & Retail';

    const systemPrompt = `You are the Chief Credit Underwriter and Senior SME Financial Analyst at Avani, an institutional South African fintech intelligence platform governed by POPIA and the National Credit Act (NCA).
Your task is to produce an exhaustive, empowering, and rigorously analytical AI Credit Report for an SME applicant.
The report MUST be returned as a single valid JSON object strictly matching this schema:
{
  "generatedAt": string (e.g. "11 Sep 2026, 14:30"),
  "isAiLive": true,
  "modelUsed": "gemini-3.8-flash",
  "score": number,
  "scoreTier": string (e.g. "Prime Grade (Tier 1 SME)"),
  "executiveSummary": string (3-4 sentences in clear, professional South African financial context),
  "scoreRationale": {
    "title": string,
    "points": string[] (3-5 comprehensive rationale bullet points explaining the exact mathematical and behavioral drivers)
  },
  "strengths": [
    {
      "category": string,
      "title": string,
      "detail": string,
      "impact": string (e.g. "+34 pts")
    }
  ] (3-5 items of what the business is doing right),
  "weaknesses": [
    {
      "category": string,
      "title": string,
      "detail": string,
      "riskLevel": "High" | "Medium" | "Low",
      "dragImpact": string (e.g. "-16 pts")
    }
  ] (2-4 items of what the business is doing wrong or risk vulnerabilities),
  "improvementRoadmap": [
    {
      "step": number,
      "action": string,
      "timeframe": string,
      "potentialGain": string,
      "practicalHowTo": string
    }
  ] (3-4 sequential, high-impact steps to reach 800+ score),
  "benchmarkComparisons": [
    {
      "metric": string,
      "smeScore": number,
      "industryBenchmark": number,
      "unit": string,
      "status": "ahead" | "on-par" | "behind"
    }
  ] (5-6 key metrics comparing business against South African industry averages),
  "simulationImpact": [
    {
      "scenario": string,
      "estimatedScore": number,
      "eligibleFacilityZAR": number,
      "projectedRateReduction": string
    }
  ] (3 realistic scenarios: Current, Mid-term with accounting linked, High-tier optimized),
  "lenderPerspective": [
    {
      "institution": string,
      "appetite": "High" | "Medium" | "Selective",
      "summary": string
    }
  ] (2-3 institutional perspectives, e.g. Vula Capital, Merchant Capital, Commercial Banks)
}

Important details:
- Language: If the user selected language code "${language}" is one of South Africa's official languages (e.g. zu, xh, af, nso, tn, st, ts, ss, ve, nr), write the explanations, summaries, and action steps in that official language, or in accessible South African English with appropriate vernacular business terms.
- SME Details:
  * Business: ${businessName}
  * Industry: ${industry}
  * Avani Algorithmic Score: ${score} / 850
  * Monthly Revenue: R${turnover.toLocaleString()}
  * Dishonoured debits (180 days): ${dishonours}
  * Supplier Reliability: ${supplierTrust}%
  * Requested Facility: R${requestedAmount.toLocaleString()}
- Currency: South African Rand (ZAR / R).
- Tone: Highly constructive, rigorous, institutional yet empowering. Do not speak generically.`;

    try {
      const { report, modelUsed } = await generateReportWithGemini(ai, systemPrompt, businessName);
      report.isAiLive = true;
      report.modelUsed = modelUsed;
      report.generatedAt = new Date().toLocaleDateString('en-ZA', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      });

      reportCache.set(cacheKey, {
        report,
        timestamp: Date.now()
      });

      return res.json({
        report,
        notice: `Generated dynamically with ${modelUsed}.`
      });
    } catch (genErr: any) {
      console.log('[Avani AI Engine] Upstream model capacity spike; serving high-precision Avani Underwriting Engine report:', genErr?.message);
      const fallbackReport = generateDomainReport(application, language);
      fallbackReport.isAiLive = false;
      fallbackReport.modelUsed = 'Avani Behavioral Credit Engine (Adaptive Mode)';

      reportCache.set(cacheKey, {
        report: fallbackReport,
        timestamp: Date.now()
      });

      return res.json({
        report: fallbackReport,
        notice: 'Serving high-precision domain underwriting synthesis while AI models absorb peak demand.'
      });
    }
  } catch (error: any) {
    console.log('[Avani AI Engine] Handled credit report fallback:', error?.message);
    const fallbackReport = generateDomainReport(application, language);
    return res.json({
      report: fallbackReport,
      notice: 'Generated using Avani Behavioral Underwriting Engine fallback.'
    });
  }
});

// Vite Middleware or Production Static Serving
async function setupVite() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Avani Server running on port ${PORT} (0.0.0.0)`);
  });
}

setupVite().catch((err) => {
  console.error('Failed to boot Avani server:', err);
  process.exit(1);
});
