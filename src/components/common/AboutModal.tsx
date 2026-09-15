import React from 'react';
import { Logo } from './Logo';
import { 
  X, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  Lock, 
  CheckCircle2,
  Building2
} from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0F1115]/50 backdrop-blur-sm transition-all">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-white/80 shadow-2xl p-4 sm:p-7 space-y-4 sm:space-y-5 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
        <div className="flex items-start justify-between border-b border-[#E2E7F0] pb-4">
          <Logo size="md" showSubtitle={true} />
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F4F6FA] text-[#5A6A80] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs text-[#0F1115] leading-relaxed">
          <div>
            <h3 className="font-display font-bold text-base text-[#0F1115] mb-1">
              Behavioural Credit-Intelligence for South African SMEs
            </h3>
            <p className="text-[#5A6A80]">
              Avani (by <strong>Aeonium Technologies</strong>) replaces backwards-looking credit bureau reports with live, explainable behavioural telemetry from point-of-sale platforms (Yoco) and banking cash velocity (FNB).
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F4F6FA] border border-[#E2E7F0] space-y-2">
            <h4 className="font-semibold text-xs text-[#0F1115] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#2B3BF6]" />
              <span>Liquid Glass Design Language (ClearScore-inspired)</span>
            </h4>
            <p className="text-[#5A6A80]">
              Liquid Glass is applied deliberately to <strong>floating controls, bottom tab navigation, the hero score/status card, and modal sheets</strong>. All dense reading materials (lists, ledger tables, forms, underwriter rationale) sit on solid opaque surfaces to guarantee WCAG AA legibility.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-xs text-[#0F1115] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#00C49F]" />
              <span>Two Distinct Portals</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl border border-[#E2E7F0]">
                <strong className="block text-[#2B3BF6]">SME Perspective</strong>
                <span>Track single application, log simple bookkeeping, connect accounts, audit consent.</span>
              </div>
              <div className="p-2.5 rounded-xl border border-[#E2E7F0]">
                <strong className="block text-[#0F1115]">Lender Perspective</strong>
                <span>Review queue, inspect behavioural metrics, configure rules engine, make decisions.</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#E2E7F0] text-[11px] text-[#5A6A80] flex items-center justify-between">
            <span>Pre-pilot Stage • Q4 2026</span>
            <span className="font-semibold text-[#0F1115]">POPIA Section 18 Compliant</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[#0F1115] text-white text-xs font-semibold hover:bg-black transition-all"
        >
          Close Overview
        </button>
      </div>
    </div>
  );
};
