import React, { useState } from 'react';
import { CreditPolicyRule } from '../../types';
import { 
  Sliders, 
  Plus, 
  Check, 
  ShieldCheck, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  Layers
} from 'lucide-react';

interface LenderRulesEngineProps {
  rules: CreditPolicyRule[];
  onUpdateRule: (ruleId: string, newValue: number | string) => void;
  onAddCustomRule: (rule: Omit<CreditPolicyRule, 'id'>) => void;
  onToggleRuleStatus: (ruleId: string) => void;
}

export const LenderRulesEngine: React.FC<LenderRulesEngineProps> = ({
  rules,
  onUpdateRule,
  onAddCustomRule,
  onToggleRuleStatus
}) => {
  const [showAddCustomModal, setShowAddCustomModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDescription, setNewDescription] = useState<string>('');
  const [newValue, setNewValue] = useState<string>('');
  const [newUnit, setNewUnit] = useState<string>('');
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const handleSliderChange = (id: string, val: number) => {
    onUpdateRule(id, val);
    setSavedNotice('Credit policy thresholds updated and synced across underwriting queue.');
    setTimeout(() => setSavedNotice(null), 3500);
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddCustomRule({
      title: newTitle.trim(),
      description: newDescription.trim() || 'Custom underwriter policy guideline',
      type: 'custom',
      currentValue: newValue.trim() || 'Active',
      unit: newUnit.trim() || 'rule',
      status: 'active'
    });

    setNewTitle('');
    setNewDescription('');
    setNewValue('');
    setNewUnit('');
    setShowAddCustomModal(false);
    setSavedNotice('New custom policy rule added to active underwriting guidelines.');
    setTimeout(() => setSavedNotice(null), 3500);
  };

  // Find standard rules
  const minScoreRule = rules.find(r => r.type === 'min_score');
  const minDscrRule = rules.find(r => r.type === 'min_dscr');
  const maxDtiRule = rules.find(r => r.type === 'max_dti');
  const maxLoanRevenueRule = rules.find(r => r.type === 'max_loan_revenue');
  const customRules = rules.filter(r => r.type === 'custom');

  return (
    <div className="space-y-5 sm:space-y-6 pb-36 sm:pb-28">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0F1115] mb-1">
            <Sliders className="w-4 h-4 text-[#2B3BF6] shrink-0" />
            <span>Underwriting Risk Parameters</span>
          </div>
          <h1 className="font-display font-bold text-xl sm:text-2xl text-[#0F1115] tracking-tight">
            Credit <span className="font-accent">Policy Rules</span>
          </h1>
          <p className="text-xs text-[#5A6A80] mt-0.5">
            Configure automated policy thresholds and custom constraints for incoming SME applications
          </p>
        </div>

        <button
          onClick={() => setShowAddCustomModal(true)}
          className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-[#0F1115] text-white text-xs font-semibold hover:bg-black transition-all shadow-xs flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Rule</span>
        </button>
      </div>

      {savedNotice && (
        <div className="p-3 rounded-xl bg-[#00C49F]/10 border border-[#00C49F]/30 text-xs text-[#00C49F] font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* 4 CORE EDITABLE STAT CARDS (Solid white backgrounds as mandated) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Min Credit Score Card */}
        {minScoreRule && (
          <div className="bg-white rounded-2xl p-5 border border-[#E2E7F0] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#5A6A80] uppercase tracking-wider">
                Threshold 1
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#2B3BF6]/10 text-[#2B3BF6] text-[10px] font-bold">
                Algorithmic Gate
              </span>
            </div>

            <div>
              <h3 className="font-display font-bold text-base text-[#0F1115]">
                {minScoreRule.title}
              </h3>
              <p className="text-xs text-[#5A6A80] mt-0.5">
                {minScoreRule.description}
              </p>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <span className="font-display font-extrabold text-3xl text-[#2B3BF6]">
                {minScoreRule.currentValue}
              </span>
              <span className="text-xs text-[#5A6A80]">
                Scale: 300 to 850
              </span>
            </div>

            {/* Range Slider */}
            <input
              type="range"
              min="500"
              max="780"
              step="5"
              value={Number(minScoreRule.currentValue)}
              onChange={(e) => handleSliderChange(minScoreRule.id, Number(e.target.value))}
              className="w-full h-2 bg-[#E2E7F0] rounded-lg appearance-none cursor-pointer accent-[#2B3BF6]"
            />
            <div className="flex justify-between text-[10px] text-[#5A6A80]">
              <span>Permissive (500)</span>
              <span>Default (650)</span>
              <span>Strict (780)</span>
            </div>
          </div>
        )}

        {/* Min DSCR Card */}
        {minDscrRule && (
          <div className="bg-white rounded-2xl p-5 border border-[#E2E7F0] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#5A6A80] uppercase tracking-wider">
                Threshold 2
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#00C49F]/10 text-[#00C49F] text-[10px] font-bold">
                Debt Coverage
              </span>
            </div>

            <div>
              <h3 className="font-display font-bold text-base text-[#0F1115]">
                {minDscrRule.title}
              </h3>
              <p className="text-xs text-[#5A6A80] mt-0.5">
                {minDscrRule.description}
              </p>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <span className="font-display font-extrabold text-3xl text-[#00C49F]">
                {minDscrRule.currentValue}x
              </span>
              <span className="text-xs text-[#5A6A80]">
                Cash coverage ratio
              </span>
            </div>

            <input
              type="range"
              min="1.0"
              max="2.0"
              step="0.05"
              value={Number(minDscrRule.currentValue)}
              onChange={(e) => handleSliderChange(minDscrRule.id, Number(e.target.value))}
              className="w-full h-2 bg-[#E2E7F0] rounded-lg appearance-none cursor-pointer accent-[#00C49F]"
            />
            <div className="flex justify-between text-[10px] text-[#5A6A80]">
              <span>1.0x</span>
              <span>Standard (1.25x)</span>
              <span>Conservative (2.0x)</span>
            </div>
          </div>
        )}

        {/* Max DTI Card */}
        {maxDtiRule && (
          <div className="bg-white rounded-2xl p-5 border border-[#E2E7F0] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#5A6A80] uppercase tracking-wider">
                Threshold 3
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#FF9F1C]/10 text-[#FF9F1C] text-[10px] font-bold">
                Capacity Limit
              </span>
            </div>

            <div>
              <h3 className="font-display font-bold text-base text-[#0F1115]">
                {maxDtiRule.title}
              </h3>
              <p className="text-xs text-[#5A6A80] mt-0.5">
                {maxDtiRule.description}
              </p>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <span className="font-display font-extrabold text-3xl text-[#0F1115]">
                {maxDtiRule.currentValue}%
              </span>
              <span className="text-xs text-[#5A6A80]">
                Max monthly turnover
              </span>
            </div>

            <input
              type="range"
              min="20"
              max="50"
              step="1"
              value={Number(maxDtiRule.currentValue)}
              onChange={(e) => handleSliderChange(maxDtiRule.id, Number(e.target.value))}
              className="w-full h-2 bg-[#E2E7F0] rounded-lg appearance-none cursor-pointer accent-[#0F1115]"
            />
            <div className="flex justify-between text-[10px] text-[#5A6A80]">
              <span>Low (20%)</span>
              <span>Standard (35%)</span>
              <span>High (50%)</span>
            </div>
          </div>
        )}

        {/* Max Loan-to-Revenue */}
        {maxLoanRevenueRule && (
          <div className="bg-white rounded-2xl p-5 border border-[#E2E7F0] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#5A6A80] uppercase tracking-wider">
                Threshold 4
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#2B3BF6]/10 text-[#2B3BF6] text-[10px] font-bold">
                Exposure Cap
              </span>
            </div>

            <div>
              <h3 className="font-display font-bold text-base text-[#0F1115]">
                {maxLoanRevenueRule.title}
              </h3>
              <p className="text-xs text-[#5A6A80] mt-0.5">
                {maxLoanRevenueRule.description}
              </p>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <span className="font-display font-extrabold text-3xl text-[#0F1115]">
                {maxLoanRevenueRule.currentValue}%
              </span>
              <span className="text-xs text-[#5A6A80]">
                Of trailing annual revenue
              </span>
            </div>

            <input
              type="range"
              min="10"
              max="40"
              step="1"
              value={Number(maxLoanRevenueRule.currentValue)}
              onChange={(e) => handleSliderChange(maxLoanRevenueRule.id, Number(e.target.value))}
              className="w-full h-2 bg-[#E2E7F0] rounded-lg appearance-none cursor-pointer accent-[#2B3BF6]"
            />
            <div className="flex justify-between text-[10px] text-[#5A6A80]">
              <span>10%</span>
              <span>Standard (25%)</span>
              <span>40%</span>
            </div>
          </div>
        )}
      </div>

      {/* CUSTOM RULES BUILDER & ACTIVE CONSTRAINTS */}
      <div className="bg-white rounded-2xl p-5 border border-[#E2E7F0] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-base text-[#0F1115]">
              Active Qualitative &amp; Custom Rules
            </h3>
            <p className="text-xs text-[#5A6A80]">
              Rules enforced automatically against verified banking and POS feeds
            </p>
          </div>

          <button
            onClick={() => setShowAddCustomModal(true)}
            className="text-xs font-semibold text-[#2B3BF6] hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Custom Rule</span>
          </button>
        </div>

        <div className="space-y-3">
          {customRules.map((rule) => (
            <div
              key={rule.id}
              className="p-4 rounded-xl bg-[#F4F6FA] border border-[#E2E7F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-semibold text-xs text-[#0F1115]">
                    {rule.title}
                  </h4>
                  <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold shrink-0 ${
                    rule.status === 'active' ? 'bg-[#00C49F]/15 text-[#00C49F]' : 'bg-[#E2E7F0] text-[#5A6A80]'
                  }`}>
                    {rule.status === 'active' ? 'Enforced' : 'Paused'}
                  </span>
                </div>
                <p className="text-xs text-[#5A6A80] mt-0.5">
                  {rule.description}
                </p>
                <span className="text-[11px] font-medium text-[#2B3BF6] block mt-1">
                  Threshold: {rule.currentValue} {rule.unit}
                </span>
              </div>

              <button
                onClick={() => onToggleRuleStatus(rule.id)}
                className={`self-end sm:self-auto px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  rule.status === 'active'
                    ? 'bg-white text-[#5A6A80] border border-[#E2E7F0] hover:bg-[#E2E7F0]'
                    : 'bg-[#2B3BF6] text-white shadow-xs'
                }`}
              >
                {rule.status === 'active' ? 'Pause Rule' : 'Activate'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ADD CUSTOM RULE MODAL */}
      {showAddCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F1115]/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl border border-white/80 shadow-2xl p-6 space-y-4">
            <h3 className="font-display font-bold text-lg text-[#0F1115]">
              Add Custom Policy Rule
            </h3>

            <form onSubmit={handleAddCustom} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#0F1115] mb-1">
                  Rule Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Require min 6 months active Yoco / POS transaction history"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E7F0] text-xs text-[#0F1115] outline-none focus:border-[#2B3BF6]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F1115] mb-1">
                  Description &amp; Rationale
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Flag for committee if fewer than 180 consecutive operating days"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E7F0] text-xs text-[#0F1115] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0F1115] mb-1">
                    Value / Requirement
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 6"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E7F0] text-xs text-[#0F1115] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F1115] mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. months"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E7F0] text-xs text-[#0F1115] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCustomModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#E2E7F0] text-xs font-medium text-[#5A6A80]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0F1115] text-white text-xs font-semibold hover:bg-black"
                >
                  Save Policy Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
