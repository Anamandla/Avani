import React, { useState } from 'react';
import { BookkeepingEntry } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Calendar, 
  Tag, 
  FileEdit, 
  Check, 
  X,
  Wallet,
  TrendingUp,
  Receipt
} from 'lucide-react';

interface SmeBookkeepingProps {
  entries: BookkeepingEntry[];
  onAddEntry: (entry: Omit<BookkeepingEntry, 'id'>) => void;
  isQuickModalOpen?: boolean;
  onCloseQuickModal?: () => void;
}

export const SmeBookkeeping: React.FC<SmeBookkeepingProps> = ({
  entries,
  onAddEntry,
  isQuickModalOpen = false,
  onCloseQuickModal
}) => {
  const { t } = useLanguage();
  const [showAddModal, setShowAddModal] = useState<boolean>(isQuickModalOpen);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  // Form state
  const [amount, setAmount] = useState<string>('');
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [category, setCategory] = useState<string>('Retail POS Sales');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState<string>('');
  const [source, setSource] = useState<string>('Manual Entry');

  const incomeCategories = [
    'Retail POS Sales',
    'Trade Order',
    'Wholesale Contract',
    'Custom Commission',
    'Consulting / Service'
  ];

  const expenseCategories = [
    'Raw Materials',
    'Workshop Lease',
    'Staff Wages',
    'Logistics & Couriers',
    'Utilities & Electricity',
    'Equipment & Maintenance'
  ];

  // Calculations for running cash-flow
  const totalInflow = entries
    .filter((e) => e.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalOutflow = entries
    .filter((e) => e.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netCashFlow = totalInflow - totalOutflow;

  const filteredEntries = entries.filter((e) => {
    if (filterType === 'all') return true;
    return e.type === filterType;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    onAddEntry({
      date,
      amount: numAmount,
      type,
      category,
      note: note.trim() || undefined,
      source
    });

    // Reset
    setAmount('');
    setNote('');
    setShowAddModal(false);
    if (onCloseQuickModal) onCloseQuickModal();
  };

  const formatZAR = (val: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-4 sm:space-y-5 pb-36 sm:pb-28">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="font-display font-bold text-xl sm:text-2xl text-[#0F1115] tracking-tight">
            {t('bookkeeping.title', 'Bookkeeping &')} <span className="font-accent">{t('bookkeeping.titleAccent', 'Cash Flow')}</span>
          </h1>
          <p className="text-xs text-[#5A6A80] mt-0.5">
            {t('bookkeeping.subtitle', 'Simple ledger logging to keep your real cash position up-to-date')}
          </p>
        </div>

        <button
          id="open-add-bookkeeping-btn"
          onClick={() => setShowAddModal(true)}
          className="px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-[#2B3BF6] text-white text-xs font-semibold hover:bg-[#1f2fd4] transition-all shadow-xs flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{t('bookkeeping.logEntry', 'Log Entry')}</span>
        </button>
      </div>

      {/* RUNNING CASH-FLOW SUMMARY CARDS (Solid opaque surfaces for legibility) */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
        <div className="bg-white rounded-2xl p-2 xs:p-2.5 sm:p-3.5 border border-[#E2E7F0] shadow-xs min-w-0">
          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-[#5A6A80] mb-1 min-w-0">
            <ArrowDownLeft className="w-3.5 h-3.5 text-[#00C49F] shrink-0" />
            <span className="truncate">{t('bookkeeping.inflow', 'Inflow')}</span>
          </div>
          <div className="font-display font-bold text-[11px] xs:text-xs sm:text-base md:text-lg text-[#0F1115] tracking-tight truncate">
            {formatZAR(totalInflow)}
          </div>
          <span className="text-[9px] sm:text-[10px] text-[#00C49F] font-medium block mt-0.5 truncate">
            POS + deposits
          </span>
        </div>

        <div className="bg-white rounded-2xl p-2 xs:p-2.5 sm:p-3.5 border border-[#E2E7F0] shadow-xs min-w-0">
          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-[#5A6A80] mb-1 min-w-0">
            <ArrowUpRight className="w-3.5 h-3.5 text-[#FF9F1C] shrink-0" />
            <span className="truncate">{t('bookkeeping.outflow', 'Outflow')}</span>
          </div>
          <div className="font-display font-bold text-[11px] xs:text-xs sm:text-base md:text-lg text-[#0F1115] tracking-tight truncate">
            {formatZAR(totalOutflow)}
          </div>
          <span className="text-[9px] sm:text-[10px] text-[#5A6A80] font-medium block mt-0.5 truncate">
            Expenses
          </span>
        </div>

        <div className="bg-white rounded-2xl p-2 xs:p-2.5 sm:p-3.5 border border-[#E2E7F0] shadow-xs min-w-0">
          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-[#5A6A80] mb-1 min-w-0">
            <Wallet className="w-3.5 h-3.5 text-[#2B3BF6] shrink-0" />
            <span className="truncate">{t('bookkeeping.net', 'Net')}</span>
          </div>
          <div className={`font-display font-bold text-[11px] xs:text-xs sm:text-base md:text-lg tracking-tight truncate ${netCashFlow >= 0 ? 'text-[#00C49F]' : 'text-[#FF9F1C]'}`}>
            {formatZAR(netCashFlow)}
          </div>
          <span className="text-[9px] sm:text-[10px] text-[#5A6A80] font-medium block mt-0.5 truncate">
            Surplus
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center bg-[#E2E7F0]/60 p-1 rounded-xl border border-[#E2E7F0]">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              filterType === 'all' ? 'bg-white text-[#0F1115] shadow-xs' : 'text-[#5A6A80]'
            }`}
          >
            {t('bookkeeping.all', 'All')} ({entries.length})
          </button>
          <button
            onClick={() => setFilterType('income')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              filterType === 'income' ? 'bg-white text-[#00C49F] shadow-xs' : 'text-[#5A6A80]'
            }`}
          >
            {t('bookkeeping.income', 'Income')}
          </button>
          <button
            onClick={() => setFilterType('expense')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              filterType === 'expense' ? 'bg-white text-[#FF9F1C] shadow-xs' : 'text-[#5A6A80]'
            }`}
          >
            {t('bookkeeping.expense', 'Expense')}
          </button>
        </div>

        <span className="text-[11px] text-[#5A6A80]">
          Showing {filteredEntries.length} entries
        </span>
      </div>

      {/* LEDGER LIST (Dense, solid white opaque cards) */}
      <div className="space-y-2.5">
        {filteredEntries.map((entry) => {
          const isIncome = entry.type === 'income';

          return (
            <div
              key={entry.id}
              id={`bookkeeping-entry-${entry.id}`}
              className="bg-white rounded-2xl p-3 sm:p-4 border border-[#E2E7F0] hover:border-[#CBD5E1] shadow-xs transition-all flex items-center justify-between gap-2.5 sm:gap-4 min-w-0"
            >
              {/* Left Details: Icon + Category + Date & Note */}
              <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isIncome ? 'bg-[#00C49F]/15 text-[#00C49F]' : 'bg-[#FF9F1C]/15 text-[#FF9F1C]'
                  }`}
                >
                  {isIncome ? <ArrowDownLeft className="w-4 h-4 sm:w-5 sm:h-5" /> : <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="font-semibold text-xs sm:text-sm text-[#0F1115] truncate max-w-[110px] xs:max-w-[150px] sm:max-w-none">
                      {entry.category}
                    </h4>
                    {entry.source && (
                      <span className="text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded-md bg-[#F4F6FA] text-[#5A6A80] border border-[#E2E7F0] shrink-0 font-medium">
                        {entry.source}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5 text-[10px] sm:text-xs text-[#5A6A80] min-w-0">
                    <span className="shrink-0">{entry.date}</span>
                    {entry.note && (
                      <>
                        <span className="shrink-0 text-[#CBD5E1]">•</span>
                        <span className="truncate text-[#5A6A80]">{entry.note}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side: Cashflow Value */}
              <div className="text-right shrink-0 min-w-0 pl-1">
                <span
                  className={`font-display font-bold text-xs xs:text-sm sm:text-base tracking-tight block whitespace-nowrap ${
                    isIncome ? 'text-[#00C49F]' : 'text-[#0F1115]'
                  }`}
                >
                  {isIncome ? '+' : '-'}{formatZAR(entry.amount)}
                </span>
                <span className="text-[9px] sm:text-[10px] text-[#5A6A80] block whitespace-nowrap">
                  {isIncome ? 'Cash in' : 'Cash out'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD ENTRY MODAL SHEET (Liquid glass modal frame with solid form content) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0F1115]/40 backdrop-blur-sm transition-opacity">
          <div 
            id="add-entry-modal"
            className="w-full max-w-md bg-white rounded-3xl border border-white/80 shadow-2xl p-4 sm:p-6 space-y-4 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between border-b border-[#E2E7F0] pb-3">
              <div>
                <h3 className="font-display font-bold text-lg text-[#0F1115]">
                  Log Cash Flow Entry
                </h3>
                <p className="text-xs text-[#5A6A80]">
                  Record revenue or operating spend
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  if (onCloseQuickModal) onCloseQuickModal();
                }}
                className="p-1.5 rounded-full hover:bg-[#F4F6FA] text-[#5A6A80]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 bg-[#F4F6FA] p-1 rounded-xl border border-[#E2E7F0]">
                <button
                  type="button"
                  onClick={() => {
                    setType('income');
                    setCategory(incomeCategories[0]);
                  }}
                  className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                    type === 'income'
                      ? 'bg-[#00C49F] text-white shadow-xs'
                      : 'text-[#5A6A80] hover:text-[#0F1115]'
                  }`}
                >
                  + Income (Cash In)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setType('expense');
                    setCategory(expenseCategories[0]);
                  }}
                  className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                    type === 'expense'
                      ? 'bg-[#FF9F1C] text-white shadow-xs'
                      : 'text-[#5A6A80] hover:text-[#0F1115]'
                  }`}
                >
                  - Expense (Cash Out)
                </button>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-xs font-semibold text-[#0F1115] mb-1">
                  Amount (ZAR R)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#5A6A80]">
                    R
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    required
                    placeholder="e.g. 12500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#E2E7F0] focus:border-[#2B3BF6] focus:ring-1 focus:ring-[#2B3BF6] text-base font-bold text-[#0F1115] outline-none"
                  />
                </div>
              </div>

              {/* Category Select */}
              <div>
                <label className="block text-xs font-semibold text-[#0F1115] mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E7F0] focus:border-[#2B3BF6] text-xs font-medium text-[#0F1115] bg-white outline-none"
                >
                  {(type === 'income' ? incomeCategories : expenseCategories).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Source */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0F1115] mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E7F0] text-xs text-[#0F1115] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F1115] mb-1">
                    Source
                  </label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E7F0] text-xs text-[#0F1115] outline-none bg-white"
                  >
                    <option value="Manual Entry">Manual Entry</option>
                    <option value="Yoco POS">Yoco POS</option>
                    <option value="EFT / Bank">EFT / Bank</option>
                    <option value="Cash Drawer">Cash Drawer</option>
                  </select>
                </div>
              </div>

              {/* Optional Note */}
              <div>
                <label className="block text-xs font-semibold text-[#0F1115] mb-1">
                  Optional Note / Reference
                </label>
                <input
                  type="text"
                  placeholder="e.g. Salvaged timber stock from supplier"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E7F0] text-xs text-[#0F1115] outline-none focus:border-[#2B3BF6]"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    if (onCloseQuickModal) onCloseQuickModal();
                  }}
                  className="px-4 py-2 rounded-xl border border-[#E2E7F0] text-xs font-medium text-[#5A6A80] hover:bg-[#F4F6FA]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2B3BF6] text-white text-xs font-semibold hover:bg-[#1f2fd4] shadow-xs"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
