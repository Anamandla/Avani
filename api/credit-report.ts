import { GoogleGenAI } from '@google/genai';
import { generateDomainReport } from '../src/utils/creditReportEngine';

export default async function handler(req: any, res: any) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Parse body safely (handles both pre-parsed JSON and raw strings)
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }

  const { application, language = 'en' } = body || {};
  const businessName = application?.businessName || 'Formal Woodwork Specialists';
  const score = application?.metrics?.overallScore || 742;
  const turnover = application?.metrics?.averageMonthlyRevenue || 142500;
  const dishonours = application?.metrics?.dishonouredDebits180d || 0;
  const supplierTrust = application?.metrics?.supplierReliability || 94;
  const requestedAmount = application?.requestedAmount || 350000;
  const industry = application?.industry || 'Light Manufacturing & Retail';

  const apiKey = process.env.GEMINI_API_KEY;

  // Fallback if no API key is set in Vercel Environment Variables
  if (!apiKey) {
    const fallbackReport = generateDomainReport(application, language);
    return res.status(200).json({
      report: fallbackReport,
      notice: 'Generated using Avani Behavioral Underwriting Engine (Add GEMINI_API_KEY to your Vercel Project Settings for dynamic generative AI).'
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const systemPrompt = `You are the Chief Credit Underwriter and Senior SME Financial Analyst at Avani, an institutional South African fintech intelligence platform governed by POPIA and the National Credit Act (NCA).
Your task is to produce an exhaustive, empowering, and rigorously analytical AI Credit Report for an SME applicant.
The report MUST be returned as a single valid JSON object strictly matching this schema:
{
  "generatedAt": string,
  "isAiLive": true,
  "modelUsed": "gemini-3.8-flash",
  "score": number,
  "scoreTier": string,
  "executiveSummary": string,
  "scoreRationale": {
    "title": string,
    "points": string[]
  },
  "strengths": [
    {
      "category": string,
      "title": string,
      "detail": string,
      "impact": string
    }
  ],
  "weaknesses": [
    {
      "category": string,
      "title": string,
      "detail": string,
      "riskLevel": "High" | "Medium" | "Low",
      "dragImpact": string
    }
  ],
  "improvementRoadmap": [
    {
      "step": number,
      "action": string,
      "timeframe": string,
      "potentialGain": string,
      "practicalHowTo": string
    }
  ],
  "benchmarkComparisons": [
    {
      "metric": string,
      "smeScore": number,
      "industryBenchmark": number,
      "unit": string,
      "status": "ahead" | "on-par" | "behind"
    }
  ],
  "simulationImpact": [
    {
      "scenario": string,
      "estimatedScore": number,
      "eligibleFacilityZAR": number,
      "projectedRateReduction": string
    }
  ],
  "lenderPerspective": [
    {
      "institution": string,
      "appetite": "High" | "Medium" | "Selective",
      "summary": string
    }
  ]
}

SME Profile:
- Business: ${businessName}
- Industry: ${industry}
- Avani Algorithmic Score: ${score} / 850
- Monthly Revenue: R${turnover.toLocaleString()}
- Dishonoured debits (180 days): ${dishonours}
- Supplier Reliability: ${supplierTrust}%
- Requested Facility: R${requestedAmount.toLocaleString()}
- Target Language: ${language} (if non-English official SA language, provide localized narratives; otherwise South African English).`;

    let generatedReport: any = null;
    const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: 'Analyze and return the complete Avani Underwriting JSON report strictly following the schema.',
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
            temperature: 0.3
          }
        });

        let raw = (response.text || '').trim();
        if (raw.startsWith('```json')) {
          raw = raw.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (raw.startsWith('```')) {
          raw = raw.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }

        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed.score === 'number' && parsed.strengths) {
          generatedReport = parsed;
          generatedReport.isAiLive = true;
          generatedReport.modelUsed = model === 'gemini-3.8-flash' ? 'Google Gemini 3.8 Flash' : 'Google Gemini 3.1 Flash Lite';
          break;
        }
      } catch {
        // Try alternate candidate
      }
    }

    if (generatedReport) {
      generatedReport.generatedAt = new Date().toLocaleDateString('en-ZA', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      return res.status(200).json({
        report: generatedReport,
        notice: `Generated dynamically with ${generatedReport.modelUsed}.`
      });
    }

    // If Gemini model capacity limit hit, supply high-precision domain report
    const fallback = generateDomainReport(application, language);
    return res.status(200).json({
      report: fallback,
      notice: 'Generated via Avani Behavioral Engine.'
    });
  } catch (error: any) {
    const fallback = generateDomainReport(application, language);
    return res.status(200).json({
      report: fallback,
      notice: 'Generated via Avani Behavioral Engine.'
    });
  }
}
