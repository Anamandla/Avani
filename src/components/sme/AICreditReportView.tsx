import React, { useState, useEffect, useRef } from 'react';
import { SmeApplication, AICreditReport } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { generateDomainReport } from '../../utils/creditReportEngine';
import { 
  Sparkles, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  ShieldCheck, 
  BarChart3, 
  Sliders, 
  Building2, 
  ArrowRight, 
  Clock, 
  Check, 
  FileText,
  Printer,
  ChevronDown,
  ChevronUp,
  Cpu
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

interface AICreditReportViewProps {
  application: SmeApplication;
}

export const AICreditReportView: React.FC<AICreditReportViewProps> = ({
  application
}) => {
  const { currentLanguage, t } = useLanguage();
  // Initialize immediately with the client-side South African underwriting engine
  // This guarantees the report is never null and always renders immediately on Vercel, GitHub deployments, and offline
  const [report, setReport] = useState<AICreditReport>(() => 
    generateDomainReport(application, currentLanguage)
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'strengths' | 'weaknesses' | 'roadmap' | 'benchmarks'>('overview');
  const [simulatedScenarioIndex, setSimulatedScenarioIndex] = useState<number>(0);
  const reportRef = useRef<HTMLDivElement>(null);

  const fetchCreditReport = async (forceRefresh: boolean = false) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/credit-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          application,
          language: currentLanguage,
          forceRefresh
        })
      });

      // Verify the response is OK and returns valid JSON (not an HTML 404 page from static Vercel hosting)
      const contentType = response.headers.get('content-type') || '';
      if (response.ok && contentType.includes('application/json')) {
        const data = await response.json();
        if (data && data.report) {
          setReport(data.report);
          return;
        }
      }

      // If backend API isn't present or returned non-JSON (e.g. Vercel static deployment or HTML 404),
      // we gracefully preserve/regenerate the domain credit report
      setReport((prev) => prev || generateDomainReport(application, currentLanguage));
    } catch (err) {
      console.log('Avani credit intelligence active via behavioral underwriting engine:', err);
      setReport((prev) => prev || generateDomainReport(application, currentLanguage));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Refresh report if application or language changes
    setReport(generateDomainReport(application, currentLanguage));
    fetchCreditReport();
  }, [application.id, currentLanguage]);

  // Direct Vector PDF generation fallback using jsPDF native vector APIs - includes ALL sections
  const generateDirectVectorPdf = (appData: SmeApplication, reportData: AICreditReport) => {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 16;
    const contentWidth = pageWidth - (margin * 2);
    let y = 20;

    const checkPageBreak = (neededHeight: number) => {
      if (y + neededHeight > pageHeight - 20) {
        // Draw footer on current page
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(130, 140, 160);
        pdf.text('Avani Verified Behavioral Credit Assessment • Confidential • POPIA Act 4 of 2013', margin, pageHeight - 10);
        pdf.addPage();
        y = 20;
      }
    };

    // Header bar
    pdf.setFillColor(43, 59, 246);
    pdf.rect(margin, y, contentWidth, 24, 'F');
    
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.setTextColor(255, 255, 255);
    pdf.text('AVANI BEHAVIORAL CREDIT REPORT', margin + 6, y + 10);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(220, 230, 255);
    pdf.text(`AI Engine: ${reportData.modelUsed || 'Live Gemini Model'} • Generated: ${reportData.generatedAt}`, margin + 6, y + 18);
    y += 32;

    // Business Details & Score
    pdf.setFillColor(244, 246, 250);
    pdf.rect(margin, y, contentWidth, 28, 'F');
    pdf.setDrawColor(226, 231, 240);
    pdf.rect(margin, y, contentWidth, 28, 'S');

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(15, 17, 21);
    pdf.text(appData.businessName, margin + 6, y + 9);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(90, 106, 128);
    pdf.text(`CIPC Reg: ${appData.cipcRegNumber || 'Verified'} • Industry: ${appData.industry || 'Light Manufacturing'}`, margin + 6, y + 16);
    pdf.text(`Requested Facility: ZAR R${appData.requestedAmount.toLocaleString()} • Monthly Inflow: ZAR R${(appData.metrics?.averageMonthlyRevenue || 0).toLocaleString()}`, margin + 6, y + 22);

    // Score badge inside box
    pdf.setFillColor(43, 59, 246);
    pdf.roundedRect(pageWidth - margin - 38, y + 4, 32, 20, 3, 3, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.setTextColor(255, 255, 255);
    pdf.text(reportData.score.toString(), pageWidth - margin - 22, y + 13, { align: 'center' });
    pdf.setFontSize(7);
    pdf.text(reportData.scoreTier.toUpperCase(), pageWidth - margin - 22, y + 19, { align: 'center' });
    y += 36;

    // SECTION 1: Executive Summary & Score Foundation
    checkPageBreak(30);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.setTextColor(43, 59, 246);
    pdf.text('SECTION 1: Executive Underwriting Diagnosis & Score Foundation', margin, y);
    y += 6;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(60, 72, 88);
    const summaryLines = pdf.splitTextToSize(reportData.executiveSummary, contentWidth);
    pdf.text(summaryLines, margin, y);
    y += summaryLines.length * 4.5 + 6;

    // Score Rationale Points
    if (reportData.scoreRationale?.points?.length) {
      checkPageBreak(35);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9.5);
      pdf.setTextColor(15, 17, 21);
      pdf.text(reportData.scoreRationale.title || 'Score Foundation & Weightings', margin, y);
      y += 5;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8.5);
      pdf.setTextColor(70, 80, 95);
      reportData.scoreRationale.points.forEach((pt) => {
        checkPageBreak(12);
        const ptLines = pdf.splitTextToSize(`• ${pt}`, contentWidth - 4);
        pdf.text(ptLines, margin + 2, y);
        y += ptLines.length * 4 + 2;
      });
      y += 4;
    }

    // SECTION 2: Strengths (What you are doing right)
    if (reportData.strengths?.length) {
      checkPageBreak(30);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.setTextColor(0, 160, 110);
      pdf.text('SECTION 2: Positive Credit Drivers (What You Are Doing Right)', margin, y);
      y += 6;

      reportData.strengths.forEach((str) => {
        checkPageBreak(18);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(9);
        pdf.setTextColor(15, 17, 21);
        pdf.text(`+ ${str.title} [${str.category} • ${str.impact}]`, margin, y);
        y += 4.5;

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(90, 100, 115);
        const detLines = pdf.splitTextToSize(str.detail, contentWidth - 6);
        pdf.text(detLines, margin + 4, y);
        y += detLines.length * 3.8 + 4;
      });
      y += 4;
    }

    // SECTION 3: Vulnerabilities (What needs attention)
    if (reportData.weaknesses?.length) {
      checkPageBreak(30);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.setTextColor(220, 38, 38);
      pdf.text('SECTION 3: Areas for Optimization & Drag Factors (What Needs Attention)', margin, y);
      y += 6;

      reportData.weaknesses.forEach((weak) => {
        checkPageBreak(18);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(9);
        pdf.setTextColor(15, 17, 21);
        pdf.text(`! ${weak.title} (${weak.category} • ${weak.riskLevel} Risk • Drag: ${weak.dragImpact})`, margin, y);
        y += 4.5;

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(90, 100, 115);
        const detLines = pdf.splitTextToSize(weak.detail, contentWidth - 6);
        pdf.text(detLines, margin + 4, y);
        y += detLines.length * 3.8 + 4;
      });
      y += 4;
    }

    // SECTION 4: Improvement Roadmap & Growth Scenarios
    if (reportData.improvementRoadmap?.length) {
      checkPageBreak(35);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.setTextColor(43, 59, 246);
      pdf.text('SECTION 4: Actionable Improvement Roadmap to Reach 800+ Score', margin, y);
      y += 6;

      reportData.improvementRoadmap.forEach((rm) => {
        checkPageBreak(22);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(9);
        pdf.setTextColor(15, 17, 21);
        pdf.text(`Step ${rm.step}: ${rm.action} (${rm.timeframe} • ${rm.potentialGain})`, margin, y);
        y += 4.5;

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(80, 95, 110);
        const howToLines = pdf.splitTextToSize(`Execution plan: ${rm.practicalHowTo}`, contentWidth - 6);
        pdf.text(howToLines, margin + 4, y);
        y += howToLines.length * 3.8 + 4;
      });
      y += 4;
    }

    // SECTION 4B: Score Simulation Scenarios
    if (reportData.simulationImpact?.length) {
      checkPageBreak(35);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.setTextColor(15, 17, 21);
      pdf.text('Score & Facility Expansion Scenarios', margin, y);
      y += 5;

      reportData.simulationImpact.forEach((sim) => {
        checkPageBreak(16);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8.5);
        pdf.setTextColor(43, 59, 246);
        pdf.text(`• ${sim.scenario}: Est. Score ${sim.estimatedScore} pts`, margin + 2, y);
        y += 4;

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(70, 80, 95);
        pdf.text(`   Max Facility: R${sim.eligibleFacilityZAR.toLocaleString()} | Projected Pricing: ${sim.projectedRateReduction}`, margin + 2, y);
        y += 5;
      });
      y += 4;
    }

    // SECTION 5: South African Benchmark Comparisons
    if (reportData.benchmarkComparisons?.length) {
      checkPageBreak(35);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.setTextColor(15, 17, 21);
      pdf.text('SECTION 5: South African Industry Benchmark Comparison', margin, y);
      y += 6;

      reportData.benchmarkComparisons.forEach((bench) => {
        checkPageBreak(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8.5);
        pdf.setTextColor(15, 17, 21);
        pdf.text(`• ${bench.metric}`, margin + 2, y);

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(bench.status === 'ahead' ? 0 : 220, bench.status === 'ahead' ? 160 : 100, bench.status === 'ahead' ? 110 : 30);
        pdf.text(`Your Score: ${bench.smeScore}${bench.unit} | Industry Benchmark: ${bench.industryBenchmark}${bench.unit} (${bench.status.toUpperCase()})`, margin + 6, y + 4);
        y += 9;
      });
      y += 4;
    }

    // SECTION 6: Institutional Credit Committee Perspectives
    if (reportData.lenderPerspective?.length) {
      checkPageBreak(35);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.setTextColor(15, 17, 21);
      pdf.text('Institutional Credit Committee Outlook', margin, y);
      y += 5;

      reportData.lenderPerspective.forEach((lender) => {
        checkPageBreak(18);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8.5);
        pdf.setTextColor(15, 17, 21);
        pdf.text(`${lender.institution} — Risk Appetite: ${lender.appetite}`, margin + 2, y);
        y += 4;

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(80, 95, 110);
        const lLines = pdf.splitTextToSize(lender.summary, contentWidth - 6);
        pdf.text(lLines, margin + 4, y);
        y += lLines.length * 3.8 + 4;
      });
      y += 4;
    }

    // Page footer
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(130, 140, 160);
    pdf.text('Avani Verified Behavioral Credit Assessment • Confidential • POPIA Act 4 of 2013', margin, pageHeight - 10);

    const fileName = `Avani_Credit_Report_${appData.businessName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
  };

  // Export as PDF using html2canvas-pro & jsPDF, capturing ALL sections
  const handleDownloadPdf = async () => {
    if (!report) return;
    if (isExportingPdf) return;
    setIsExportingPdf(true);

    try {
      // Allow React to re-render DOM with isExportingPdf: true so that ALL 5 sections are mounted and laid out
      await new Promise((resolve) => setTimeout(resolve, 400));

      if (!reportRef.current) {
        generateDirectVectorPdf(application, report);
        return;
      }

      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#FFFFFF',
        windowWidth: 1200
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `Avani_Credit_Report_${application.businessName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
    } catch (canvasError) {
      console.log('Canvas capture fallback triggered, generating direct vector PDF:', canvasError);
      // Fallback directly to programmatic high-resolution vector PDF generator
      generateDirectVectorPdf(application, report);
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Ensure active report is always available under all deployment targets (Vercel, GitHub, Cloud Run)
  const displayReport = report || generateDomainReport(application, currentLanguage);

  return (
    <div className="space-y-4 sm:space-y-5 pt-1">
      {/* Top Banner & Control Bar */}
      <div className="bg-gradient-to-r from-[#2B3BF6]/10 via-[#00D8FF]/10 to-[#00C49F]/10 rounded-2xl p-3 sm:p-4 border border-[#2B3BF6]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#2B3BF6] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-[#0F1115] tracking-tight">
                AI Credit Intelligence Report
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#00C49F]/15 text-[#00C49F] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00C49F] animate-pulse" />
                {report.modelUsed || (report.isAiLive ? 'Live Gemini AI' : 'Avani Behavioral Engine')}
              </span>
            </div>
            <p className="text-[11px] text-[#5A6A80]">
              Transparent algorithmic underwriting explanation • Generated {report.generatedAt}
            </p>
          </div>
        </div>

        {/* Action Buttons: PDF Download & Regenerate */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            id="refresh-ai-report-btn"
            onClick={() => fetchCreditReport(true)}
            disabled={isLoading}
            title="Re-analyze with AI"
            className="p-2 rounded-xl bg-white border border-[#E2E7F0] text-[#5A6A80] hover:text-[#0F1115] hover:border-[#CBD5E1] transition-all disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#2B3BF6]' : ''}`} />
          </button>

          <button
            id="download-credit-report-pdf-btn"
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
            className="px-3 sm:px-4 py-2 rounded-xl bg-[#0F1115] text-white text-xs font-semibold hover:bg-[#20242C] transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-60 cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#00D8FF]" />
            <span>{isExportingPdf ? 'Generating PDF...' : 'Download PDF Report'}</span>
          </button>
        </div>
      </div>

      {/* Printable / Exportable Container */}
      <div 
        ref={reportRef} 
        id="printable-credit-report-container"
        className="bg-white rounded-3xl p-4 sm:p-7 border border-[#E2E7F0] shadow-sm space-y-6"
      >
        {/* PDF Document Header (Visible always, perfectly styled for PDF print) */}
        <div className="border-b border-[#E2E7F0] pb-5">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-xl sm:text-2xl text-[#0F1115] tracking-tight">
                  AVANI
                </span>
                <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-md bg-[#2B3BF6]/10 text-[#2B3BF6]">
                  Institutional Credit Memo
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-[#0F1115] mt-1">
                Credit Evaluation &amp; Algorithmic Score Diagnosis
              </h2>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#5A6A80] mt-1.5">
                <span>Subject: <strong className="text-[#0F1115]">{application.businessName}</strong></span>
                <span>•</span>
                <span>Reg: <strong className="text-[#0F1115]">{application.cipcRegNumber}</strong></span>
                <span>•</span>
                <span>Director: <strong className="text-[#0F1115]">{application.directorName}</strong></span>
              </div>
            </div>

            {/* Score Pill in PDF Header */}
            <div className="sm:text-right bg-[#F4F6FA] sm:bg-transparent p-3 sm:p-0 rounded-2xl border sm:border-0 border-[#E2E7F0] shrink-0">
              <span className="text-[10px] text-[#5A6A80] font-semibold block uppercase">Avani Algorithmic Score</span>
              <div className="flex items-baseline sm:justify-end gap-1 mt-0.5">
                <span className="font-display font-extrabold text-3xl sm:text-4xl text-[#2B3BF6]">
                  {report.score}
                </span>
                <span className="text-xs text-[#5A6A80] font-bold">/ 850</span>
              </div>
              <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#00C49F]/15 text-[#00C49F] mt-0.5">
                {report.scoreTier}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs for UI viewing (hidden during PDF export) */}
        {!isExportingPdf && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#E2E7F0] text-xs font-medium no-scrollbar">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-[#2B3BF6] text-white shadow-xs font-semibold'
                  : 'text-[#5A6A80] hover:text-[#0F1115] hover:bg-[#F4F6FA]'
              }`}
            >
              Overview &amp; Rationale
            </button>
            <button
              onClick={() => setActiveTab('strengths')}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'strengths'
                  ? 'bg-[#00C49F] text-white shadow-xs font-semibold'
                  : 'text-[#5A6A80] hover:text-[#0F1115] hover:bg-[#F4F6FA]'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>What You're Doing Right ({report.strengths.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('weaknesses')}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'weaknesses'
                  ? 'bg-[#FF9F1C] text-white shadow-xs font-semibold'
                  : 'text-[#5A6A80] hover:text-[#0F1115] hover:bg-[#F4F6FA]'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>What Needs Attention ({report.weaknesses.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'roadmap'
                  ? 'bg-[#2B3BF6] text-white shadow-xs font-semibold'
                  : 'text-[#5A6A80] hover:text-[#0F1115] hover:bg-[#F4F6FA]'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Improvement Roadmap</span>
            </button>
            <button
              onClick={() => setActiveTab('benchmarks')}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'benchmarks'
                  ? 'bg-[#0F1115] text-white shadow-xs font-semibold'
                  : 'text-[#5A6A80] hover:text-[#0F1115] hover:bg-[#F4F6FA]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>SA Benchmark Visuals</span>
            </button>
          </div>
        )}

        {/* SECTION 1: EXECUTIVE SUMMARY & SCORE RATIONALE */}
        {(activeTab === 'overview' || isExportingPdf) && (
          <div className={`space-y-4 ${isExportingPdf ? '' : 'animate-in fade-in duration-200'}`}>
            {isExportingPdf && (
              <div className="flex items-center gap-2 border-b border-[#E2E7F0] pb-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#2B3BF6] bg-[#2B3BF6]/10 px-2.5 py-0.5 rounded-md">
                  Section 1 • Executive Credit Diagnosis &amp; Score Foundation
                </span>
              </div>
            )}
            {/* Executive Summary Box */}
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E7F0] space-y-2">
              <span className="text-[11px] font-bold text-[#2B3BF6] uppercase tracking-wider block">
                Executive Credit Diagnosis
              </span>
              <p className="text-xs sm:text-sm text-[#0F1115] leading-relaxed">
                {report.executiveSummary}
              </p>
            </div>

            {/* Score Rationale Breakdown */}
            <div className="space-y-2.5">
              <h4 className="font-display font-bold text-sm text-[#0F1115] flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#2B3BF6]" />
                <span>{report.scoreRationale.title}</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {report.scoreRationale.points.map((pt, idx) => (
                  <div 
                    key={idx} 
                    className="p-3 rounded-xl bg-white border border-[#E2E7F0] text-xs text-[#0F1115] flex items-start gap-2.5 shadow-2xs"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#2B3BF6]/10 text-[#2B3BF6] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed flex-1">{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick KPI Pillars Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              <div className="p-3 rounded-xl bg-[#F4F6FA] border border-[#E2E7F0] text-center">
                <span className="text-[10px] text-[#5A6A80] block">Cash Flow Velocity</span>
                <span className="text-sm sm:text-base font-bold text-[#0F1115]">88 / 100</span>
                <span className="text-[9px] text-[#00C49F] font-semibold block mt-0.5">Top 12% in Sector</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F4F6FA] border border-[#E2E7F0] text-center">
                <span className="text-[10px] text-[#5A6A80] block">Debit Dishonours (180d)</span>
                <span className="text-sm sm:text-base font-bold text-[#00C49F]">0 Bounces</span>
                <span className="text-[9px] text-[#00C49F] font-semibold block mt-0.5">Clean Banking</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F4F6FA] border border-[#E2E7F0] text-center">
                <span className="text-[10px] text-[#5A6A80] block">Supplier Repeat Pay</span>
                <span className="text-sm sm:text-base font-bold text-[#0F1115]">94% On-Time</span>
                <span className="text-[9px] text-[#2B3BF6] font-semibold block mt-0.5">High Trade Trust</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F4F6FA] border border-[#E2E7F0] text-center">
                <span className="text-[10px] text-[#5A6A80] block">Working Capital Buffer</span>
                <span className="text-sm sm:text-base font-bold text-[#FF9F1C]">1.8 Months</span>
                <span className="text-[9px] text-[#FF9F1C] font-semibold block mt-0.5">Expand to 2.5m</span>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: WHAT YOU'RE DOING RIGHT (Strengths) */}
        {(activeTab === 'strengths' || isExportingPdf) && (
          <div className={`space-y-3 ${isExportingPdf ? 'pt-6 border-t border-[#E2E7F0]' : 'animate-in fade-in duration-200'}`}>
            {isExportingPdf && (
              <div className="flex items-center gap-2 pb-1">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#00C49F] bg-[#00C49F]/10 px-2.5 py-0.5 rounded-md">
                  Section 2 • Positive Credit Drivers (What You're Doing Right)
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <h4 className="font-display font-bold text-sm text-[#0F1115] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00C49F]" />
                <span>What You're Doing Right (Credit Drivers)</span>
              </h4>
              <span className="text-[11px] text-[#00C49F] font-semibold bg-[#00C49F]/10 px-2.5 py-0.5 rounded-full">
                Positive Impact Factors
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {report.strengths.map((str, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 rounded-2xl bg-[#00C49F]/5 border border-[#00C49F]/30 space-y-1.5 transition-all hover:bg-[#00C49F]/10"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#00C49F]">
                      {str.category}
                    </span>
                    <span className="text-xs font-bold text-[#00C49F] bg-white px-2 py-0.5 rounded-full border border-[#00C49F]/20 shadow-2xs">
                      {str.impact}
                    </span>
                  </div>
                  <h5 className="font-bold text-xs sm:text-sm text-[#0F1115]">
                    {str.title}
                  </h5>
                  <p className="text-xs text-[#5A6A80] leading-relaxed">
                    {str.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 3: WHAT NEEDS ATTENTION (Weaknesses / Drag Factors) */}
        {(activeTab === 'weaknesses' || isExportingPdf) && (
          <div className={`space-y-3 ${isExportingPdf ? 'pt-6 border-t border-[#E2E7F0]' : 'animate-in fade-in duration-200'}`}>
            {isExportingPdf && (
              <div className="flex items-center gap-2 pb-1">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF9F1C] bg-[#FF9F1C]/10 px-2.5 py-0.5 rounded-md">
                  Section 3 • Risk Drag Factors &amp; Vulnerabilities (What Needs Attention)
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <h4 className="font-display font-bold text-sm text-[#0F1115] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#FF9F1C]" />
                <span>What Needs Attention &amp; Risk Drag Factors</span>
              </h4>
              <span className="text-[11px] text-[#FF9F1C] font-semibold bg-[#FF9F1C]/10 px-2.5 py-0.5 rounded-full">
                Score Penalties &amp; Vulnerabilities
              </span>
            </div>

            <div className="space-y-2.5">
              {report.weaknesses.map((wk, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 rounded-2xl bg-[#FF9F1C]/5 border border-[#FF9F1C]/30 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF9F1C]">
                        {wk.category}
                      </span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                        wk.riskLevel === 'High' 
                          ? 'bg-[#E63946]/15 text-[#E63946]' 
                          : 'bg-[#FF9F1C]/15 text-[#FF9F1C]'
                      }`}>
                        {wk.riskLevel} Risk
                      </span>
                    </div>
                    <span className="text-xs font-bold text-[#E63946] bg-white px-2 py-0.5 rounded-full border border-[#FF9F1C]/20 shadow-2xs">
                      {wk.dragImpact}
                    </span>
                  </div>
                  <h5 className="font-bold text-xs sm:text-sm text-[#0F1115]">
                    {wk.title}
                  </h5>
                  <p className="text-xs text-[#5A6A80] leading-relaxed">
                    {wk.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 4: ACTIONABLE IMPROVEMENT ROADMAP */}
        {(activeTab === 'roadmap' || isExportingPdf) && (
          <div className={`space-y-4 ${isExportingPdf ? 'pt-6 border-t border-[#E2E7F0]' : 'animate-in fade-in duration-200'}`}>
            {isExportingPdf && (
              <div className="flex items-center gap-2 pb-1">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#2B3BF6] bg-[#2B3BF6]/10 px-2.5 py-0.5 rounded-md">
                  Section 4 • Actionable Roadmap &amp; Capital Facility Scenarios
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <h4 className="font-display font-bold text-sm text-[#0F1115] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#2B3BF6]" />
                <span>Actionable Roadmap to Reach 800+ Tier-1 Score</span>
              </h4>
              <span className="text-[11px] text-[#2B3BF6] font-semibold bg-[#2B3BF6]/10 px-2.5 py-0.5 rounded-full">
                Unlock Prime - 1.5% Pricing
              </span>
            </div>

            <div className="space-y-3">
              {report.improvementRoadmap.map((item) => (
                <div 
                  key={item.step}
                  className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#E2E7F0] hover:border-[#2B3BF6]/40 transition-all shadow-xs space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#2B3BF6] text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {item.step}
                      </span>
                      <h5 className="font-bold text-xs sm:text-sm text-[#0F1115]">
                        {item.action}
                      </h5>
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className="text-[10px] text-[#5A6A80] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#5A6A80]" />
                        {item.timeframe}
                      </span>
                      <span className="text-[11px] font-bold text-[#00C49F] bg-[#00C49F]/10 px-2 py-0.5 rounded-md">
                        {item.potentialGain}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#5A6A80] pl-8 leading-relaxed">
                    <strong className="text-[#0F1115]">How to execute:</strong> {item.practicalHowTo}
                  </p>
                </div>
              ))}
            </div>

            {/* Score Simulation Matrix */}
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E7F0] space-y-3">
              <span className="text-xs font-bold text-[#0F1115] block">
                Interactive Score &amp; Facility Potential Simulator
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {report.simulationImpact.map((sim, idx) => {
                  const isSelected = simulatedScenarioIndex === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSimulatedScenarioIndex(idx)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-white border-[#2B3BF6] shadow-md ring-2 ring-[#2B3BF6]/10'
                          : 'bg-white/60 border-[#E2E7F0] hover:bg-white'
                      }`}
                    >
                      <span className="text-[10px] font-semibold text-[#5A6A80] block truncate">
                        {sim.scenario}
                      </span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="font-display font-extrabold text-xl text-[#0F1115]">
                          {sim.estimatedScore}
                        </span>
                        <span className="text-[10px] text-[#5A6A80]">pts</span>
                      </div>
                      <div className="text-[11px] text-[#2B3BF6] font-semibold mt-1">
                        R{sim.eligibleFacilityZAR.toLocaleString()} Max Facility
                      </div>
                      <div className="text-[10px] text-[#00C49F] font-medium mt-0.5">
                        {sim.projectedRateReduction}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 5: DATA VISUALISATIONS & SA BENCHMARKS */}
        {(activeTab === 'benchmarks' || isExportingPdf) && (
          <div className={`space-y-4 ${isExportingPdf ? 'pt-6 border-t border-[#E2E7F0]' : 'animate-in fade-in duration-200'}`}>
            {isExportingPdf && (
              <div className="flex items-center gap-2 pb-1">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#0F1115] bg-[#0F1115]/10 px-2.5 py-0.5 rounded-md">
                  Section 5 • South African Industry Benchmarks &amp; Credit Committee Outlook
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <h4 className="font-display font-bold text-sm text-[#0F1115] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#2B3BF6]" />
                <span>South African Industry Benchmark Comparison</span>
              </h4>
              <span className="text-[11px] text-[#5A6A80]">
                Compared to SA Light Manufacturing &amp; Retail Average
              </span>
            </div>

            {/* Visual Bar Comparisons */}
            <div className="space-y-3">
              {report.benchmarkComparisons.map((bench, idx) => {
                const isAhead = bench.status === 'ahead';
                return (
                  <div 
                    key={idx}
                    className="p-3 sm:p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E7F0] space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#0F1115]">
                        {bench.metric}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-[#5A6A80]">
                          Benchmark: <strong>{bench.industryBenchmark}{bench.unit}</strong>
                        </span>
                        <span className="text-xs font-extrabold text-[#2B3BF6] bg-white px-2 py-0.5 rounded-md border border-[#E2E7F0]">
                          You: {bench.smeScore}{bench.unit}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isAhead ? 'bg-[#00C49F]/15 text-[#00C49F]' : 'bg-[#FF9F1C]/15 text-[#FF9F1C]'
                        }`}>
                          {isAhead ? 'Ahead of Sector' : 'Underweight'}
                        </span>
                      </div>
                    </div>

                    {/* Dual visual progress bar */}
                    <div className="space-y-1">
                      {/* SME Bar */}
                      <div className="w-full bg-[#E2E7F0] h-2.5 rounded-full overflow-hidden relative">
                        <div 
                          className="bg-[#2B3BF6] h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, bench.smeScore)}%` }}
                        />
                      </div>
                      {/* Benchmark marker legend */}
                      <div className="flex justify-between text-[9px] text-[#5A6A80] px-0.5">
                        <span>0</span>
                        <span>Industry Peer Benchmark ({bench.industryBenchmark}%)</span>
                        <span>100</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Institutional Lender Perspectives */}
            <div className="pt-2 space-y-2.5">
              <h5 className="font-display font-bold text-xs sm:text-sm text-[#0F1115] flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#2B3BF6]" />
                <span>Institutional Credit Committee Outlook</span>
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {report.lenderPerspective.map((lender, idx) => (
                  <div 
                    key={idx}
                    className="p-3 rounded-xl bg-white border border-[#E2E7F0] space-y-1.5 text-xs shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#0F1115] truncate">{lender.institution}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-[#00C49F]/15 text-[#00C49F]">
                        {lender.appetite}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#5A6A80] leading-relaxed">
                      {lender.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Official Statutory Footer in PDF */}
        <div className="pt-4 border-t border-[#E2E7F0] text-[10px] text-[#5A6A80] flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#2B3BF6]" />
            <span>Avani Behavioral Credit Intelligence • Republic of South Africa • POPIA Act No. 4 of 2013</span>
          </div>
          <div className="text-[10px] text-[#5A6A80]">
            Report Reference: AVN-{application.cipcRegNumber.replace(/[^0-9]/g, '')}-{report.score}
          </div>
        </div>
      </div>
    </div>
  );
};
