import React, { useState } from 'react';
import { SmeApplication, DecisionOutcome } from '../../types';
import { AICreditReportView } from '../sme/AICreditReportView';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ShieldCheck, 
  TrendingUp, 
  AlertCircle, 
  Sparkles, 
  FileText, 
  Building2, 
  Calendar, 
  Check, 
  X,
  History,
  Lock,
  ChevronDown,
  Download
} from 'lucide-react';

interface LenderCaseDetailProps {
  application: SmeApplication;
  onBackToQueue: () => void;
  onRecordDecision: (appId: string, outcome: DecisionOutcome, notes: string, approvedAmount?: number, rate?: string) => void;
}

export const LenderCaseDetail: React.FC<LenderCaseDetailProps> = ({
  application,
  onBackToQueue,
  onRecordDecision
}) => {
  const [showDecisionModal, setShowDecisionModal] = useState<boolean>(false);
  const [showFullAiReport, setShowFullAiReport] = useState<boolean>(true);
  const [selectedOutcome, setSelectedOutcome] = useState<DecisionOutcome>('Approved');
  const [approvedAmount, setApprovedAmount] = useState<string>(application.requestedAmount.toString());
  const [rate, setRate] = useState<string>('Prime + 3.25%');
  const [notes, setNotes] = useState<string>(
    'Approved subject to automated Yoco daily repayment sweep and inventory pledge.'
  );

  const formatZAR = (val: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleOpenDecision = (outcome: DecisionOutcome) => {
    setSelectedOutcome(outcome);
    if (outcome === 'Approved') {
      setNotes('Approved based on strong daily POS cash velocity and zero 180-day dishonoured debits.');
    } else if (outcome === 'Declined') {
      setNotes('Declined due to high leverage or debt service limit.');
    } else {
      setNotes('Requested 3 additional months of Sage management accounts.');
    }
    setShowDecisionModal(true);
  };

  const handleConfirmDecision = (e: React.FormEvent) => {
    e.preventDefault();
    onRecordDecision(
      application.id,
      selectedOutcome,
      notes,
      selectedOutcome === 'Approved' ? parseFloat(approvedAmount) : undefined,
      selectedOutcome === 'Approved' ? rate : undefined
    );
    setShowDecisionModal(false);
  };

  return (
    <div className="space-y-5 sm:space-y-6 pb-36 sm:pb-28">
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          <button
            onClick={onBackToQueue}
            className="p-2 rounded-xl bg-white border border-[#E2E7F0] hover:bg-[#F4F6FA] text-[#5A6A80] hover:text-[#0F1115] transition-all shrink-0 mt-0.5 sm:mt-0"
            title="Back to queue"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display font-bold text-lg sm:text-2xl text-[#0F1115] tracking-tight truncate">
                {application.businessName}
              </h1>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold border shrink-0 ${
                application.status === 'In Review' ? 'bg-[#FF9F1C]/15 text-[#FF9F1C] border-[#FF9F1C]/30' :
                application.status === 'Decided' ? 'bg-[#00C49F]/15 text-[#00C49F] border-[#00C49F]/30' :
                'bg-[#2B3BF6]/15 text-[#2B3BF6] border-[#2B3BF6]/30'
              }`}>
                {application.status}
              </span>
            </div>
            <p className="text-xs text-[#5A6A80] mt-0.5 truncate">
              CIPC {application.cipcRegNumber} • Ref #{application.id} • {application.location}
            </p>
          </div>
        </div>

        {/* DECISION ACTION BUTTONS */}
        <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-0">
          <button
            id="action-request-info-btn"
            onClick={() => handleOpenDecision('Info Requested')}
            className="flex-1 sm:flex-initial px-3 py-2 rounded-xl border border-[#CBD5E1] bg-white hover:bg-[#F4F6FA] text-xs font-semibold text-[#0F1115] transition-all flex items-center justify-center gap-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#5A6A80]" />
            <span>Query Info</span>
          </button>
          <button
            id="action-decline-btn"
            onClick={() => handleOpenDecision('Declined')}
            className="flex-1 sm:flex-initial px-3 py-2 rounded-xl border border-[#FF9F1C]/40 bg-[#FF9F1C]/10 hover:bg-[#FF9F1C]/20 text-xs font-semibold text-[#FF9F1C] transition-all flex items-center justify-center gap-1.5"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Decline</span>
          </button>
          <button
            id="action-approve-btn"
            onClick={() => handleOpenDecision('Approved')}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#2B3BF6] hover:bg-[#1f2fd4] text-xs font-semibold text-white transition-all shadow-xs flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approve Facility</span>
          </button>
        </div>
      </div>

      {/* DECISION SUMMARY BANNER IF ALREADY DECIDED */}
      {application.decision && (
        <div className="bg-[#00C49F]/10 border border-[#00C49F]/30 rounded-2xl p-4 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#00C49F] shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="font-bold text-[#0F1115] flex items-center gap-2">
              <span>Decision Logged: {application.decision.outcome}</span>
              <span className="text-[10px] text-[#5A6A80] font-normal">({application.decision.decidedAt})</span>
            </div>
            {application.decision.approvedAmount && (
              <p className="text-[#0F1115]">
                Approved Amount: <strong>{formatZAR(application.decision.approvedAmount)}</strong> at <strong>{application.decision.interestRate}</strong>
              </p>
            )}
            <p className="text-[#5A6A80]">
              Notes: {application.decision.notes}
            </p>
          </div>
        </div>
      )}

      {/* BEHAVIOURAL SCORE & TELEMETRY BREAKDOWN (Solid white card) */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#E2E7F0] shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E7F0] pb-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#2B3BF6]/10 text-[#2B3BF6] font-display font-extrabold text-xl sm:text-2xl flex items-center justify-center shrink-0 border border-[#2B3BF6]/20">
              {application.metrics.overallScore}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-display font-bold text-base sm:text-lg text-[#0F1115]">
                  Avani Behavioural Index
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#00C49F]/15 text-[#00C49F] text-[10px] font-bold shrink-0">
                  Prime Category
                </span>
              </div>
              <p className="text-xs text-[#5A6A80] mt-0.5">
                850-point algorithmic behavioural scale based on Yoco POS + FNB cash telemetry
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E2E7F0]/60">
            <span className="text-xs text-[#5A6A80] block">Requested Credit:</span>
            <span className="font-display font-bold text-lg sm:text-xl text-[#0F1115]">
              {formatZAR(application.requestedAmount)}
            </span>
            <span className="text-[10px] text-[#5A6A80] block">
              {application.requestedTermMonths} Months • Working Capital
            </span>
          </div>
        </div>

        {/* 4 Quantitative Behavioral Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          <div className="p-3 sm:p-3.5 rounded-xl bg-[#F4F6FA] border border-[#E2E7F0] min-w-0">
            <span className="text-[10px] sm:text-[11px] text-[#5A6A80] block truncate">Cash Flow Consistency</span>
            <span className="font-display font-bold text-base sm:text-lg text-[#00C49F] block truncate">
              {application.metrics.cashFlowConsistency}%
            </span>
            <span className="text-[10px] text-[#5A6A80] block mt-0.5 truncate">
              Daily card swipes rhythm
            </span>
          </div>

          <div className="p-3 sm:p-3.5 rounded-xl bg-[#F4F6FA] border border-[#E2E7F0] min-w-0">
            <span className="text-[10px] sm:text-[11px] text-[#5A6A80] block truncate">Revenue Volatility</span>
            <span className="font-display font-bold text-base sm:text-lg text-[#0F1115] block truncate">
              {application.metrics.revenueVolatility}
            </span>
            <span className="text-[10px] text-[#00C49F] font-medium block mt-0.5 truncate">
              Consistent retail demand
            </span>
          </div>

          <div className="p-3 sm:p-3.5 rounded-xl bg-[#F4F6FA] border border-[#E2E7F0] min-w-0">
            <span className="text-[10px] sm:text-[11px] text-[#5A6A80] block truncate">Dishonoured Debits</span>
            <span className="font-display font-bold text-base sm:text-lg text-[#00C49F] block truncate">
              {application.metrics.dishonouredDebits180d} in 180d
            </span>
            <span className="text-[10px] text-[#00C49F] font-medium block mt-0.5 truncate">
              Zero bounced payments
            </span>
          </div>

          <div className="p-3 sm:p-3.5 rounded-xl bg-[#F4F6FA] border border-[#E2E7F0] min-w-0">
            <span className="text-[10px] sm:text-[11px] text-[#5A6A80] block truncate">Supplier Reliability</span>
            <span className="font-display font-bold text-base sm:text-lg text-[#2B3BF6] block truncate">
              {application.metrics.supplierReliability}%
            </span>
            <span className="text-[10px] text-[#5A6A80] block mt-0.5 truncate">
              Timber &amp; brass vendors
            </span>
          </div>
        </div>

        {/* Plain-Language Explanation (Explainable, Not a Black Box) */}
        <div className="space-y-2 pt-1">
          <h4 className="font-display font-bold text-sm text-[#0F1115] flex items-center gap-2">
            <span>Plain-Language Scoring Rationale</span>
            <span className="text-[10px] font-normal text-[#5A6A80]">(Explainable Credit Intelligence)</span>
          </h4>
          <div className="space-y-1.5">
            {application.metrics.summaryExplanation.map((bullet, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-[#0F1115]">
                <CheckCircle2 className="w-4 h-4 text-[#00C49F] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{bullet}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FULL AI CREDIT REPORT & PDF EXPORT */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#2B3BF6]" />
            <h3 className="font-display font-bold text-sm sm:text-base text-[#0F1115]">
              Full AI Credit Intelligence &amp; Score Diagnostics
            </h3>
          </div>
          <button
            id="toggle-lender-ai-report-btn"
            onClick={() => setShowFullAiReport(!showFullAiReport)}
            className="px-3 py-1.5 rounded-xl border border-[#E2E7F0] bg-white hover:bg-[#F4F6FA] text-xs font-semibold text-[#0F1115] transition-all flex items-center gap-1.5"
          >
            <span>{showFullAiReport ? 'Collapse Report' : 'Expand Full Report'}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFullAiReport ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {showFullAiReport && (
          <AICreditReportView application={application} />
        )}
      </div>

      {/* AI-DRAFTED DECISION MEMO (With mandatory underwriter disclaimer) */}
      <div className="bg-white rounded-2xl p-6 border border-[#E2E7F0] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E7F0] pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#2B3BF6] shrink-0" />
            <h3 className="font-display font-bold text-sm sm:text-base text-[#0F1115]">
              AI-Drafted Underwriting Decision Memo
            </h3>
          </div>
          <span className="self-start sm:self-auto px-2.5 py-0.5 rounded-full bg-[#2B3BF6]/10 text-[#2B3BF6] text-[10px] font-bold shrink-0">
            Recommendation: {application.metrics.aiDraftedMemo.recommendation}
          </span>
        </div>

        {/* Clear disclaimer */}
        <div className="p-3 rounded-xl bg-[#F4F6FA] border border-[#E2E7F0] text-xs text-[#5A6A80] flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-[#2B3BF6] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-[#0F1115]">Mandatory Underwriting Notice:</strong> This decision memo is AI-synthesized to speed up credit officer review. <span className="font-accent">The lender always makes the actual credit decision</span> — Avani never executes automated approvals or declines.
          </p>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <span className="font-semibold text-[#0F1115] block mb-1">Proposed Terms:</span>
            <div className="p-3 rounded-xl bg-[#F4F6FA] border border-[#E2E7F0] grid grid-cols-2 gap-2">
              <div>Facility: <strong className="text-[#0F1115]">{formatZAR(application.metrics.aiDraftedMemo.suggestedFacility)}</strong></div>
              <div>Indicative Rate: <strong className="text-[#0F1115]">{application.metrics.aiDraftedMemo.suggestedRate}</strong></div>
            </div>
          </div>

          <div>
            <span className="font-semibold text-[#0F1115] block mb-0.5">Credit Rationale:</span>
            <p className="text-[#5A6A80] leading-relaxed">
              {application.metrics.aiDraftedMemo.rationale}
            </p>
          </div>

          <div>
            <span className="font-semibold text-[#0F1115] block mb-1">Key Risk Mitigants:</span>
            <ul className="list-disc list-inside space-y-1 text-[#5A6A80]">
              {application.metrics.aiDraftedMemo.riskMitigants.map((mit, i) => (
                <li key={i}>{mit}</li>
              ))}
            </ul>
          </div>

          <div>
            <span className="font-semibold text-[#0F1115] block mb-1">Recommended Covenants:</span>
            <ul className="list-disc list-inside space-y-1 text-[#5A6A80]">
              {application.metrics.aiDraftedMemo.requiredCovenants.map((cov, i) => (
                <li key={i}>{cov}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* VERIFIED CONSENT & AUDIT LOG (Solid white card) */}
      <div className="bg-white rounded-2xl p-5 border border-[#E2E7F0] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00C49F]" />
            <h3 className="font-display font-bold text-sm text-[#0F1115]">
              Verified POPIA Consent Trail
            </h3>
          </div>
          <span className="text-xs text-[#00C49F] font-semibold">
            Active Authorization
          </span>
        </div>

        <div className="text-xs text-[#5A6A80] space-y-1">
          <p>
            Thabo Mokoena (Director) executed POPIA Section 18 electronic consent on <strong>{application.consentGrantedDate}</strong>.
          </p>
          <p>
            Audit Hash: <span className="font-mono text-[#0F1115]">SHA256: 7f8a9...b4e2</span> (Timestamp recorded on immutable ledger).
          </p>
        </div>
      </div>

      {/* DECISION ACTION MODAL (Liquid glass modal frame with solid form content) */}
      {showDecisionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F1115]/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl border border-white/80 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#E2E7F0] pb-3">
              <div>
                <h3 className="font-display font-bold text-lg text-[#0F1115]">
                  Record Credit Committee Decision
                </h3>
                <p className="text-xs text-[#5A6A80]">
                  Applicant: {application.businessName}
                </p>
              </div>
              <button
                onClick={() => setShowDecisionModal(false)}
                className="p-1 rounded-full hover:bg-[#F4F6FA] text-[#5A6A80]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmDecision} className="space-y-4">
              {/* Outcome selection */}
              <div className="grid grid-cols-3 gap-2">
                {(['Approved', 'Declined', 'Info Requested'] as DecisionOutcome[]).map((outcome) => (
                  <button
                    key={outcome}
                    type="button"
                    onClick={() => setSelectedOutcome(outcome)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      selectedOutcome === outcome
                        ? outcome === 'Approved' ? 'bg-[#00C49F] text-white border-[#00C49F]' :
                          outcome === 'Declined' ? 'bg-[#FF9F1C] text-white border-[#FF9F1C]' :
                          'bg-[#2B3BF6] text-white border-[#2B3BF6]'
                        : 'bg-[#F4F6FA] text-[#5A6A80] border-[#E2E7F0] hover:text-[#0F1115]'
                    }`}
                  >
                    {outcome}
                  </button>
                ))}
              </div>

              {selectedOutcome === 'Approved' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#0F1115] mb-1">
                      Approved Facility (ZAR R)
                    </label>
                    <input
                      type="number"
                      value={approvedAmount}
                      onChange={(e) => setApprovedAmount(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E2E7F0] text-sm font-bold text-[#0F1115] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#0F1115] mb-1">
                      Agreed Interest Rate
                    </label>
                    <input
                      type="text"
                      value={rate}
                      onChange={(e) => setRate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E2E7F0] text-xs text-[#0F1115] outline-none"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#0F1115] mb-1">
                  Committee Notes / Conditions
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E7F0] text-xs text-[#0F1115] outline-none focus:border-[#2B3BF6]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDecisionModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#E2E7F0] text-xs font-medium text-[#5A6A80]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0F1115] text-white text-xs font-semibold hover:bg-black"
                >
                  Record Official Decision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
