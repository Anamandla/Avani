import React, { useState } from 'react';
import { SmeApplication, SmeTab } from '../../types';
import { LiquidGlassCard } from '../common/LiquidGlassCard';
import { AICreditReportView } from './AICreditReportView';
import { useLanguage } from '../../i18n/LanguageContext';
import { 
  ArrowUpRight, 
  CheckCircle2, 
  PlusCircle, 
  FileText, 
  Link2, 
  Sparkles, 
  ShieldAlert, 
  TrendingUp, 
  Clock, 
  ChevronRight,
  HelpCircle,
  Building2,
  Download
} from 'lucide-react';

interface SmeHomeProps {
  application: SmeApplication;
  onNavigateTab: (tab: SmeTab) => void;
  onOpenQuickBookkeeping: () => void;
}

export const SmeHome: React.FC<SmeHomeProps> = ({
  application,
  onNavigateTab,
  onOpenQuickBookkeeping
}) => {
  const { currentLanguageInfo, t } = useLanguage();

  // Default to showing score gauge & AI credit report view so users see their score & report immediately
  const [showScoreGaugePreview, setShowScoreGaugePreview] = useState<boolean>(true);

  // Status ring metrics: 3 of 4 steps completed
  // Step 1: Business Profile (done)
  // Step 2: Data Sources Connected (done)
  // Step 3: FICA & POPIA Consent (done)
  // Step 4: Underwriting Decision (in review)
  const stepsCompleted = 3;
  const totalSteps = 4;
  const percentComplete = (stepsCompleted / totalSteps) * 100;

  // ClearScore gauge calculations (scale 300 to 850)
  const score = application.metrics.overallScore; // 742
  const scoreMin = 300;
  const scoreMax = 850;
  const scorePercent = Math.min(100, Math.max(0, ((score - scoreMin) / (scoreMax - scoreMin)) * 100));

  return (
    <div className="space-y-5 sm:space-y-6 pb-36 sm:pb-28">
      {/* Top Greeting & Business Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#5A6A80] mb-0.5">
            <Building2 className="w-3.5 h-3.5 text-[#2B3BF6] shrink-0" />
            <span className="truncate">{application.businessName}</span>
          </div>
          <h1 className="font-display font-bold text-xl sm:text-2xl text-[#0F1115] tracking-tight truncate">
            {currentLanguageInfo.greeting}, {application.directorName.split(' ')[0]}
          </h1>
          <p className="text-xs text-[#5A6A80] mt-0.5">
            {t('smeHome.subtitle', 'Your single Avani credit profile & cash-flow monitor')}
          </p>
        </div>

        {/* Mode switcher segment */}
        <div className="flex items-center bg-[#E2E7F0]/60 p-1 rounded-xl border border-[#E2E7F0] self-start sm:self-auto shrink-0">
          <button
            id="sme-view-score-ai-btn"
            onClick={() => setShowScoreGaugePreview(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              showScoreGaugePreview 
                ? 'bg-white text-[#2B3BF6] shadow-xs' 
                : 'text-[#5A6A80] hover:text-[#0F1115]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Score &amp; AI Report</span>
          </button>
          <button
            id="sme-view-onboarding-btn"
            onClick={() => setShowScoreGaugePreview(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              !showScoreGaugePreview 
                ? 'bg-white text-[#0F1115] shadow-xs' 
                : 'text-[#5A6A80] hover:text-[#0F1115]'
            }`}
          >
            Status Ring
          </button>
        </div>
      </div>

      {/* HERO LIQUID GLASS CARD */}
      <LiquidGlassCard variant="hero" id="sme-hero-glass-card" className="p-4 sm:p-6">
        {!showScoreGaugePreview ? (
          /* PRE-PILOT HERO STATE: Honest Status Ring */
          <div className="flex flex-col lg:flex-row items-center justify-between gap-5 sm:gap-6">
            <div className="flex-1 space-y-2.5 sm:space-y-3 text-center lg:text-left min-w-0">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2B3BF6]/10 border border-[#2B3BF6]/20 text-[#2B3BF6] text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#2B3BF6] animate-ping" />
                <span>Application In Review</span>
              </div>

              <div>
                <h2 className="font-display text-lg sm:text-xl font-bold text-[#0F1115] tracking-tight">
                  3 of 4 steps completed
                </h2>
                <p className="text-xs sm:text-sm text-[#5A6A80] mt-1 max-w-md mx-auto lg:mx-0 leading-relaxed">
                  Vula Capital is reviewing your verified Yoco transaction telemetry and FNB banking cash velocity.
                </p>
              </div>

              <div className="pt-1 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 text-xs text-[#0F1115]">
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#00C49F] shrink-0" />
                  <span>Yoco POS Verified</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#00C49F] shrink-0" />
                  <span>POPIA Consent Active</span>
                </div>
              </div>
            </div>

            {/* Circular Progress Ring */}
            <div className="relative shrink-0 flex items-center justify-center w-32 h-32 sm:w-36 sm:h-36">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 120 120">
                {/* Background Track */}
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  stroke="#E2E7F0"
                  strokeWidth="9"
                  fill="transparent"
                />
                {/* Progress Circle */}
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  stroke="#2B3BF6"
                  strokeWidth="9"
                  strokeDasharray={2 * Math.PI * 48}
                  strokeDashoffset={2 * Math.PI * 48 * (1 - percentComplete / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-display text-2xl font-bold text-[#0F1115]">75%</span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-[#5A6A80]">
                  Stage 3/4
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* CONCEPT PREVIEW: CLEARSCORE-STYLE SCORE GAUGE */
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-[#00D8FF]/15 text-[#0F1115] text-[11px] font-semibold tracking-wide border border-[#00D8FF]/30">
                  Concept Preview
                </span>
                <span className="text-xs text-[#5A6A80]">
                  Avani Behavioural Score
                </span>
              </div>
              <span className="text-xs font-medium text-[#2B3BF6] flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                Strong Category
              </span>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-between gap-5 pt-1">
              {/* Circular Gauge */}
              <div className="relative w-36 h-36 sm:w-40 sm:h-40 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 140 140">
                  {/* Outer glow ring */}
                  <circle
                    cx="70"
                    cy="70"
                    r="58"
                    stroke="#E2E7F0"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  {/* Gauge colored arc */}
                  <circle
                    cx="70"
                    cy="70"
                    r="58"
                    stroke="#2B3BF6"
                    strokeWidth="10"
                    strokeDasharray={2 * Math.PI * 58}
                    strokeDashoffset={2 * Math.PI * 58 * (1 - (scorePercent * 0.8) / 100)}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="font-display text-3xl sm:text-4xl font-extrabold text-[#0F1115] tracking-tight">
                    {score}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-medium text-[#5A6A80] mt-0.5">
                    out of 850
                  </span>
                  <span className="mt-1 px-2 py-0.5 rounded-full bg-[#00C49F]/15 text-[#00C49F] text-[9px] sm:text-[10px] font-bold">
                    Prime Grade
                  </span>
                </div>
              </div>

              {/* Score breakdown metrics */}
              <div className="flex-1 grid grid-cols-2 gap-2 sm:gap-2.5 w-full min-w-0">
                <div className="p-2.5 sm:p-3 rounded-xl bg-white/70 border border-white/80 shadow-xs min-w-0">
                  <span className="text-[10px] sm:text-[11px] text-[#5A6A80] block truncate">Cash Flow Velocity</span>
                  <span className="text-xs sm:text-sm font-bold text-[#0F1115] block">88 / 100</span>
                  <span className="text-[9px] sm:text-[10px] text-[#00C49F] block font-medium truncate">Daily POS inflow</span>
                </div>
                <div className="p-2.5 sm:p-3 rounded-xl bg-white/70 border border-white/80 shadow-xs min-w-0">
                  <span className="text-[10px] sm:text-[11px] text-[#5A6A80] block truncate">Revenue Volatility</span>
                  <span className="text-xs sm:text-sm font-bold text-[#0F1115] block">Low (14%)</span>
                  <span className="text-[9px] sm:text-[10px] text-[#00C49F] block font-medium truncate">Predictable cycles</span>
                </div>
                <div className="p-2.5 sm:p-3 rounded-xl bg-white/70 border border-white/80 shadow-xs min-w-0">
                  <span className="text-[10px] sm:text-[11px] text-[#5A6A80] block truncate">Debit Dishonours</span>
                  <span className="text-xs sm:text-sm font-bold text-[#0F1115] block">0 in 180 days</span>
                  <span className="text-[9px] sm:text-[10px] text-[#00C49F] block font-medium truncate">Clean banking history</span>
                </div>
                <div className="p-2.5 sm:p-3 rounded-xl bg-white/70 border border-white/80 shadow-xs min-w-0">
                  <span className="text-[10px] sm:text-[11px] text-[#5A6A80] block truncate">Supplier Repeat</span>
                  <span className="text-xs sm:text-sm font-bold text-[#0F1115] block">94% On-time</span>
                  <span className="text-[9px] sm:text-[10px] text-[#2B3BF6] block font-medium truncate">High vendor trust</span>
                </div>
              </div>
            </div>

            <p className="text-[10px] sm:text-[11px] text-[#5A6A80] italic text-center sm:text-left pt-1">
              *Concept preview of Avani algorithmic score model, currently undergoing pilot validation with select South African institutional lenders.
            </p>
          </div>
        )}
      </LiquidGlassCard>

      {/* AI-POWERED CREDIT REPORT (RENDERED DIRECTLY BENEATH SCORE) */}
      {showScoreGaugePreview && (
        <AICreditReportView application={application} />
      )}

      {/* CALM CARD FEED BELOW (Dense content on solid opaque surfaces for legibility) */}
      <div className="space-y-3">
        <h3 className="font-display font-semibold text-sm text-[#0F1115] tracking-tight px-1">
          Quick Actions &amp; Monitoring
        </h3>

        {/* AI Report Quick Access Banner (When on Status Ring mode) */}
        {!showScoreGaugePreview && (
          <div
            id="sme-quick-ai-report-banner"
            onClick={() => setShowScoreGaugePreview(true)}
            className="bg-gradient-to-r from-[#2B3BF6]/10 via-[#00D8FF]/10 to-[#00C49F]/10 rounded-2xl p-4 border border-[#2B3BF6]/25 hover:border-[#2B3BF6]/50 shadow-xs transition-all cursor-pointer flex items-center justify-between gap-3 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2B3BF6] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-bold text-xs sm:text-sm text-[#0F1115] group-hover:text-[#2B3BF6] transition-colors">
                    View AI Credit Report &amp; Score Diagnosis
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00C49F]/15 text-[#00C49F]">
                    742 Prime Grade
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-[#5A6A80]">
                  Detailed breakdown of why you were scored, what you're doing right, improvement roadmap, and downloadable PDF.
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#2B3BF6] shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </div>
        )}

        {/* Card 1: Log Bookkeeping Entry */}
        <div 
          id="sme-action-log-bookkeeping"
          onClick={onOpenQuickBookkeeping}
          className="bg-white rounded-2xl p-3.5 sm:p-4 border border-[#E2E7F0] hover:border-[#2B3BF6]/40 shadow-xs transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 group"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-xl bg-[#2B3BF6]/10 flex items-center justify-center text-[#2B3BF6] shrink-0 group-hover:scale-105 transition-transform">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-xs sm:text-sm text-[#0F1115] group-hover:text-[#2B3BF6] transition-colors truncate">
                Log a bookkeeping entry
              </h4>
              <p className="text-[11px] sm:text-xs text-[#5A6A80] line-clamp-2">
                Record today's cash sales or workshop expenses to maintain verified cash-flow
              </p>
            </div>
          </div>
          <div className="p-1 rounded-full bg-[#F4F6FA] text-[#5A6A80] shrink-0 group-hover:bg-[#2B3BF6] group-hover:text-white transition-colors">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Card 2: View Single Application */}
        <div 
          id="sme-action-view-application"
          onClick={() => onNavigateTab('application')}
          className="bg-white rounded-2xl p-3.5 sm:p-4 border border-[#E2E7F0] hover:border-[#2B3BF6]/40 shadow-xs transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 group"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-xl bg-[#00D8FF]/15 flex items-center justify-center text-[#0F1115] shrink-0 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold text-xs sm:text-sm text-[#0F1115] group-hover:text-[#2B3BF6] transition-colors">
                  View your application
                </h4>
                <span className="px-2 py-0.2 rounded-full bg-[#FF9F1C]/15 text-[#FF9F1C] text-[10px] font-bold shrink-0">
                  In Review
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#5A6A80] line-clamp-2">
                R250,000 Working Capital Facility with Vula Capital SME Debt Fund
              </p>
            </div>
          </div>
          <div className="p-1 rounded-full bg-[#F4F6FA] text-[#5A6A80] shrink-0 group-hover:bg-[#2B3BF6] group-hover:text-white transition-colors">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Card 3: Connect Accounts */}
        <div 
          id="sme-action-connect-accounts"
          onClick={() => onNavigateTab('datasources')}
          className="bg-white rounded-2xl p-3.5 sm:p-4 border border-[#E2E7F0] hover:border-[#2B3BF6]/40 shadow-xs transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 group"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-xl bg-[#00C49F]/15 flex items-center justify-center text-[#00C49F] shrink-0 group-hover:scale-105 transition-transform">
              <Link2 className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-xs sm:text-sm text-[#0F1115] group-hover:text-[#2B3BF6] transition-colors truncate">
                Connected data accounts
              </h4>
              <p className="text-[11px] sm:text-xs text-[#5A6A80] line-clamp-2">
                2 of 4 accounts connected (Yoco &amp; FNB live). Connect Sage for faster reviews.
              </p>
            </div>
          </div>
          <div className="p-1 rounded-full bg-[#F4F6FA] text-[#5A6A80] shrink-0 group-hover:bg-[#2B3BF6] group-hover:text-white transition-colors">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Transparent Brand & POPIA Promise Card */}
      <div className="bg-white rounded-2xl p-4 border border-[#E2E7F0] space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#0F1115]">
          <CheckCircle2 className="w-4 h-4 text-[#00C49F]" />
          <span>The Avani Transparency Guarantee</span>
        </div>
        <p className="text-xs text-[#5A6A80] leading-relaxed">
          You own your data. Lenders only see aggregated behavioural indices that you explicitly approve. No automated decline algorithms — decisions are human-led, backed by <span className="font-accent">explainable</span> cash flow evidence.
        </p>
        <button 
          onClick={() => onNavigateTab('profile')}
          className="text-xs font-semibold text-[#2B3BF6] hover:underline flex items-center gap-1 pt-1"
        >
          <span>View what data is currently shared with whom</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
