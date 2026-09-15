import React from 'react';
import { SmeApplication, LenderTab } from '../../types';
import { LiquidGlassCard } from '../common/LiquidGlassCard';
import { 
  TrendingUp, 
  Users, 
  Layers, 
  Clock, 
  ArrowUpRight, 
  ShieldCheck, 
  ChevronRight,
  Activity,
  Sliders,
  Filter,
  CheckCircle2,
  Building2
} from 'lucide-react';

interface LenderOverviewProps {
  applications: SmeApplication[];
  onNavigateTab: (tab: LenderTab) => void;
  onSelectApplication: (app: SmeApplication) => void;
}

export const LenderOverview: React.FC<LenderOverviewProps> = ({
  applications,
  onNavigateTab,
  onSelectApplication
}) => {
  const activeCount = applications.length;
  const inReviewCount = applications.filter(a => a.status === 'In Review').length;
  const scoredCount = applications.filter(a => a.status === 'Scored' || a.status === 'In Review').length;
  
  const totalPipelineValue = applications.reduce((acc, a) => acc + a.requestedAmount, 0);
  const avgScore = Math.round(
    applications.reduce((acc, a) => acc + a.metrics.overallScore, 0) / (applications.length || 1)
  );

  const formatZAR = (val: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-5 sm:space-y-6 pb-36 sm:pb-28">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#5A6A80] mb-0.5">
            <span className="w-2 h-2 rounded-full bg-[#00D8FF]" />
            <span>Vula Capital SME Debt Fund</span>
          </div>
          <h1 className="font-display font-bold text-2xl text-[#0F1115] tracking-tight">
            Underwriting <span className="font-accent">Pipeline</span>
          </h1>
          <p className="text-xs text-[#5A6A80] mt-0.5">
            Behavioural credit evaluation &amp; verified cash flow telemetry
          </p>
        </div>

        <button
          id="lender-view-queue-btn"
          onClick={() => onNavigateTab('applications')}
          className="px-3 py-1.5 rounded-xl bg-[#0F1115] text-white text-xs font-semibold hover:bg-black transition-all flex items-center gap-1.5 shadow-xs shrink-0"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Queue ({activeCount})</span>
        </button>
      </div>

      {/* HERO LIQUID GLASS CARD (Lender Pipeline Summary) */}
      <LiquidGlassCard variant="hero" id="lender-hero-glass-card" className="p-4 sm:p-6">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#2B3BF6]/15 text-[#2B3BF6] text-xs font-bold shrink-0">
                Active Underwriting Book
              </span>
              <span className="text-xs text-[#5A6A80]">
                Pre-pilot Cohort
              </span>
            </div>
            <span className="text-xs font-medium text-[#0F1115] flex items-center gap-1 shrink-0">
              <Activity className="w-3.5 h-3.5 text-[#00C49F]" />
              48h Review SLA
            </span>
          </div>

          {/* Key Pipeline Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-1">
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-medium text-[#5A6A80] block truncate">
                Total Pipeline Demand
              </span>
              <span className="font-display font-bold text-lg sm:text-xl md:text-2xl text-[#0F1115] tracking-tight block truncate">
                {formatZAR(totalPipelineValue)}
              </span>
              <span className="text-[10px] text-[#00C49F] font-medium block mt-0.5">
                5 submissions
              </span>
            </div>

            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-medium text-[#5A6A80] block truncate">
                In Active Review
              </span>
              <span className="font-display font-bold text-lg sm:text-xl md:text-2xl text-[#2B3BF6] tracking-tight block truncate">
                {inReviewCount} Cases
              </span>
              <span className="text-[10px] text-[#5A6A80] font-medium block mt-0.5">
                Telemetry synced
              </span>
            </div>

            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-medium text-[#5A6A80] block truncate">
                Avg Behavioural Score
              </span>
              <span className="font-display font-bold text-lg sm:text-xl md:text-2xl text-[#0F1115] tracking-tight block truncate">
                {avgScore} <span className="text-xs text-[#5A6A80]">/ 850</span>
              </span>
              <span className="text-[10px] text-[#00C49F] font-medium block mt-0.5">
                Prime quartile
              </span>
            </div>

            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-medium text-[#5A6A80] block truncate">
                Zero-Bounce Rate
              </span>
              <span className="font-display font-bold text-lg sm:text-xl md:text-2xl text-[#00C49F] tracking-tight block truncate">
                100%
              </span>
              <span className="text-[10px] text-[#5A6A80] font-medium block mt-0.5">
                0 debits bounced 90d
              </span>
            </div>
          </div>
        </div>
      </LiquidGlassCard>

      {/* RECENT SUBMISSIONS FEED (Dense content on solid opaque surfaces) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-display font-semibold text-sm text-[#0F1115] tracking-tight">
            Prioritized Applicant Queue
          </h3>
          <button
            onClick={() => onNavigateTab('applications')}
            className="text-xs font-semibold text-[#2B3BF6] hover:underline flex items-center gap-1 shrink-0"
          >
            <span>View all in Queue</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {applications.slice(0, 3).map((app) => (
            <div
              key={app.id}
              id={`lender-overview-card-${app.id}`}
              onClick={() => {
                onSelectApplication(app);
                onNavigateTab('casedetail');
              }}
              className="bg-white rounded-2xl p-3.5 sm:p-4 border border-[#E2E7F0] hover:border-[#2B3BF6]/40 shadow-xs transition-all cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-xl bg-[#F4F6FA] text-[#0F1115] font-display font-bold text-xs flex items-center justify-center shrink-0 border border-[#E2E7F0] group-hover:border-[#2B3BF6]">
                  {app.metrics.overallScore}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-xs sm:text-sm text-[#0F1115] group-hover:text-[#2B3BF6] transition-colors truncate">
                      {app.businessName}
                    </h4>
                    <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold shrink-0 ${
                      app.status === 'In Review' ? 'bg-[#FF9F1C]/15 text-[#FF9F1C]' :
                      app.status === 'Scored' ? 'bg-[#2B3BF6]/15 text-[#2B3BF6]' :
                      app.status === 'Decided' ? 'bg-[#00C49F]/15 text-[#00C49F]' :
                      'bg-[#E2E7F0] text-[#5A6A80]'
                    }`}>
                      {app.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-xs text-[#5A6A80] mt-0.5">
                    <span>{app.industry}</span>
                    <span>•</span>
                    <span>{app.location.split(',')[0]}</span>
                    <span>•</span>
                    <span>Req: <strong className="text-[#0F1115]">{formatZAR(app.requestedAmount)}</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="text-right hidden sm:block">
                  <span className="text-xs font-semibold text-[#00C49F] block">
                    Verified Yoco Telemetry
                  </span>
                  <span className="text-[10px] text-[#5A6A80]">
                    In queue {app.daysInQueue} days
                  </span>
                </div>
                <div className="p-1 rounded-full bg-[#F4F6FA] text-[#5A6A80] group-hover:bg-[#2B3BF6] group-hover:text-white transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QUICK RULES ENGINE GLIMPSE */}
      <div 
        onClick={() => onNavigateTab('rules')}
        className="bg-white rounded-2xl p-4 border border-[#E2E7F0] hover:border-[#CBD5E1] shadow-xs cursor-pointer flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0F1115] text-white flex items-center justify-center">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-xs text-[#0F1115]">
              Credit Policy Rules Active
            </h4>
            <p className="text-[11px] text-[#5A6A80]">
              Min Score: 650 • Min DSCR: 1.25x • Max DTI: 35% • Zero Dishonoured Debits
            </p>
          </div>
        </div>

        <button className="text-xs font-semibold text-[#2B3BF6] hover:underline flex items-center gap-1">
          <span>Configure</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
