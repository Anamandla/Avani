import React, { useState } from 'react';
import { 
  BarChart3, 
  Sparkles, 
  Send, 
  PieChart, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const LenderReports: React.FC = () => {
  const [showConceptPreview, setShowConceptPreview] = useState<boolean>(false);
  const [inviteEmail, setInviteEmail] = useState<string>('');
  const [inviteSent, setInviteSent] = useState<boolean>(false);

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setInviteSent(true);
    setTimeout(() => {
      setInviteEmail('');
      setInviteSent(false);
    }, 3000);
  };

  return (
    <div className="space-y-5 sm:space-y-6 pb-36 sm:pb-28">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0F1115] mb-1">
            <BarChart3 className="w-4 h-4 text-[#2B3BF6]" />
            <span>Portfolio Intelligence</span>
          </div>
          <h1 className="font-display font-bold text-2xl text-[#0F1115] tracking-tight">
            Portfolio <span className="font-accent">Analytics</span>
          </h1>
          <p className="text-xs text-[#5A6A80] mt-0.5">
            Macro risk metrics, cohort default curves, and sectoral cash flow exposure
          </p>
        </div>

        {/* Toggle between Honest Empty State and Concept Preview */}
        <button
          onClick={() => setShowConceptPreview(!showConceptPreview)}
          className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-white border border-[#E2E7F0] hover:border-[#2B3BF6]/40 shadow-xs transition-all text-xs font-semibold text-[#0F1115] flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#2B3BF6]" />
          <span>{showConceptPreview ? "Show Honest Empty State" : "Toggle Concept Preview"}</span>
        </button>
      </div>

      {!showConceptPreview ? (
        /* MANDATED HONEST EMPTY STATE */
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E2E7F0] text-center max-w-xl mx-auto shadow-xs space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-[#F4F6FA] text-[#5A6A80] flex items-center justify-center mx-auto border border-[#E2E7F0]">
            <BarChart3 className="w-8 h-8 text-[#2B3BF6]" />
          </div>

          <div className="space-y-2">
            <h2 className="font-display font-bold text-xl text-[#0F1115]">
              No closed loan cohorts yet
            </h2>
            <p className="text-xs sm:text-sm text-[#5A6A80] max-w-md mx-auto leading-relaxed">
              Portfolio analytics accumulate once your first 10 SME applications reach Decided status and start repayments via automated daily POS sweeps.
            </p>
          </div>

          {/* Invite SME Form */}
          <div className="pt-2 border-t border-[#E2E7F0] max-w-md mx-auto text-left">
            <label className="block text-xs font-semibold text-[#0F1115] mb-1.5">
              Invite your first SME to apply:
            </label>
            <form onSubmit={handleSendInvite} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="sme.founder@company.co.za"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl bg-[#F4F6FA] border border-[#E2E7F0] text-xs text-[#0F1115] outline-none focus:border-[#2B3BF6] focus:bg-white"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#2B3BF6] text-white text-xs font-semibold hover:bg-[#1f2fd4] transition-all flex items-center gap-1.5 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Link</span>
              </button>
            </form>
            {inviteSent && (
              <span className="text-[11px] text-[#00C49F] font-semibold mt-1.5 block">
                ✓ Invite dispatched with Avani POPIA consent package.
              </span>
            )}
          </div>
        </div>
      ) : (
        /* CONCEPT PREVIEW: PROJECTED PORTFOLIO ANALYTICS (Clearly labelled) */
        <div className="space-y-4">
          <div className="p-3 rounded-2xl bg-[#00D8FF]/10 border border-[#00D8FF]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs text-[#0F1115]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#2B3BF6] shrink-0" />
              <span className="font-bold">Concept Preview (Pre-pilot Projected Model)</span>
            </div>
            <span className="text-[10px] text-[#5A6A80]">Simulated with 50 SA SME cohort data</span>
          </div>

          {/* Summary KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#E2E7F0] shadow-xs min-w-0">
              <span className="text-[10px] sm:text-[11px] text-[#5A6A80] block truncate">Projected Default Rate</span>
              <span className="font-display font-extrabold text-xl sm:text-2xl text-[#00C49F] block truncate">1.8%</span>
              <span className="text-[10px] text-[#5A6A80] block mt-0.5 truncate">vs 7.2% traditional bureau</span>
            </div>
            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#E2E7F0] shadow-xs min-w-0">
              <span className="text-[10px] sm:text-[11px] text-[#5A6A80] block truncate">Avg Decision Cycle</span>
              <span className="font-display font-extrabold text-xl sm:text-2xl text-[#2B3BF6] block truncate">1.4 Days</span>
              <span className="text-[10px] text-[#5A6A80] block mt-0.5 truncate">vs 21 days commercial bank</span>
            </div>
            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#E2E7F0] shadow-xs min-w-0">
              <span className="text-[10px] sm:text-[11px] text-[#5A6A80] block truncate">Repayment Capture</span>
              <span className="font-display font-extrabold text-xl sm:text-2xl text-[#0F1115] block truncate">98.6%</span>
              <span className="text-[10px] text-[#00C49F] block mt-0.5 truncate">Yoco POS automated sweep</span>
            </div>
            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#E2E7F0] shadow-xs min-w-0">
              <span className="text-[10px] sm:text-[11px] text-[#5A6A80] block truncate">Active Facility Book</span>
              <span className="font-display font-extrabold text-xl sm:text-2xl text-[#0F1115] block truncate">R 18.5M</span>
              <span className="text-[10px] text-[#5A6A80] block mt-0.5 truncate">Target Q4 2026 pilot cap</span>
            </div>
          </div>

          {/* Regional & Sectoral Exposure */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#E2E7F0] shadow-xs space-y-3">
              <h4 className="font-display font-bold text-sm text-[#0F1115]">
                Sector Exposure Distribution
              </h4>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between font-medium text-[#0F1115] mb-1">
                    <span>Specialty Retail &amp; Handcrafts</span>
                    <span>35%</span>
                  </div>
                  <div className="w-full h-2 bg-[#E2E7F0] rounded-full overflow-hidden">
                    <div className="h-full bg-[#2B3BF6] rounded-full" style={{ width: '35%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-medium text-[#0F1115] mb-1">
                    <span>Food &amp; Beverage / Roasters</span>
                    <span>28%</span>
                  </div>
                  <div className="w-full h-2 bg-[#E2E7F0] rounded-full overflow-hidden">
                    <div className="h-full bg-[#00C49F] rounded-full" style={{ width: '28%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-medium text-[#0F1115] mb-1">
                    <span>Cold Chain &amp; Agri Logistics</span>
                    <span>22%</span>
                  </div>
                  <div className="w-full h-2 bg-[#E2E7F0] rounded-full overflow-hidden">
                    <div className="h-full bg-[#FF9F1C] rounded-full" style={{ width: '22%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-medium text-[#0F1115] mb-1">
                    <span>Solar &amp; Renewable Maintenance</span>
                    <span>15%</span>
                  </div>
                  <div className="w-full h-2 bg-[#E2E7F0] rounded-full overflow-hidden">
                    <div className="h-full bg-[#00D8FF] rounded-full" style={{ width: '15%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E2E7F0] shadow-xs space-y-3">
              <h4 className="font-display font-bold text-sm text-[#0F1115]">
                Geographic Footprint (South Africa)
              </h4>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#F4F6FA] flex items-center justify-between">
                  <span className="font-medium text-[#0F1115]">Gauteng (JHB, Pretoria, Soweto)</span>
                  <span className="font-bold text-[#2B3BF6]">52% of Volume</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F4F6FA] flex items-center justify-between">
                  <span className="font-medium text-[#0F1115]">Western Cape (Cape Town Metro)</span>
                  <span className="font-bold text-[#00C49F]">31% of Volume</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F4F6FA] flex items-center justify-between">
                  <span className="font-medium text-[#0F1115]">Limpopo &amp; KwaZulu-Natal</span>
                  <span className="font-bold text-[#FF9F1C]">17% of Volume</span>
                </div>
              </div>
              <p className="text-[10px] text-[#5A6A80] italic">
                *Simulated projections for pre-pilot investor presentation.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
