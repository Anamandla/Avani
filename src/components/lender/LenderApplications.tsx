import React, { useState } from 'react';
import { SmeApplication, ApplicationStatus } from '../../types';
import { 
  Search, 
  Layers, 
  Building2, 
  ChevronRight, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight,
  Filter,
  Sparkles
} from 'lucide-react';

interface LenderApplicationsProps {
  applications: SmeApplication[];
  onSelectApplication: (app: SmeApplication) => void;
  onOpenCaseDetail: () => void;
}

export const LenderApplications: React.FC<LenderApplicationsProps> = ({
  applications,
  onSelectApplication,
  onOpenCaseDetail
}) => {
  const [activeFilter, setActiveFilter] = useState<'All' | ApplicationStatus>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filterTabs: ('All' | ApplicationStatus)[] = ['All', 'New', 'In Review', 'Scored', 'Decided'];

  const filteredApps = applications.filter((app) => {
    const matchesFilter = activeFilter === 'All' || app.status === activeFilter;
    const matchesSearch = 
      app.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.tradingName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.cipcRegNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.directorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatZAR = (val: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'New':
        return 'bg-[#E2E7F0] text-[#0F1115] border-[#CBD5E1]';
      case 'In Review':
        return 'bg-[#FF9F1C]/15 text-[#FF9F1C] border-[#FF9F1C]/30';
      case 'Scored':
        return 'bg-[#2B3BF6]/15 text-[#2B3BF6] border-[#2B3BF6]/30';
      case 'Decided':
        return 'bg-[#00C49F]/15 text-[#00C49F] border-[#00C49F]/30';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5 pb-36 sm:pb-28">
      {/* Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0F1115] mb-1">
          <Layers className="w-4 h-4 text-[#2B3BF6]" />
          <span>Underwriting Inbox</span>
        </div>
        <h1 className="font-display font-bold text-2xl text-[#0F1115] tracking-tight">
          Applicant <span className="font-accent">Queue</span>
        </h1>
        <p className="text-xs text-[#5A6A80] mt-0.5">
          SME credit submissions pending behavioural scoring, committee review, and facility execution
        </p>
      </div>

      {/* SEARCH AND STATUS FILTER CONTROLS (Solid white card) */}
      <div className="bg-white rounded-2xl p-4 border border-[#E2E7F0] shadow-xs space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#5A6A80] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by business name, CIPC number, or director..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F4F6FA] border border-[#E2E7F0] text-xs text-[#0F1115] placeholder:text-[#5A6A80] outline-none focus:border-[#2B3BF6] focus:bg-white transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {filterTabs.map((tab) => {
            const count = tab === 'All' 
              ? applications.length 
              : applications.filter(a => a.status === tab).length;

            return (
              <button
                key={tab}
                id={`filter-tab-${tab.toLowerCase().replace(' ', '-')}`}
                onClick={() => setActiveFilter(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                  activeFilter === tab
                    ? 'bg-[#0F1115] text-white shadow-xs'
                    : 'bg-[#F4F6FA] text-[#5A6A80] hover:text-[#0F1115] hover:bg-[#E2E7F0]'
                }`}
              >
                <span>{tab}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeFilter === tab ? 'bg-white/25 text-white' : 'bg-[#E2E7F0] text-[#5A6A80]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* APPLICATIONS LIST (Solid white opaque surfaces for legibility) */}
      <div className="space-y-3">
        {filteredApps.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-[#E2E7F0] text-center space-y-2">
            <Layers className="w-8 h-8 text-[#CBD5E1] mx-auto" />
            <h4 className="font-display font-semibold text-sm text-[#0F1115]">
              No applications match this filter
            </h4>
            <p className="text-xs text-[#5A6A80]">
              Try clearing your search query or switching status filters.
            </p>
          </div>
        ) : (
          filteredApps.map((app) => (
            <div
              key={app.id}
              id={`queue-app-${app.id}`}
              onClick={() => {
                onSelectApplication(app);
                onOpenCaseDetail();
              }}
              className="bg-white rounded-2xl p-5 border border-[#E2E7F0] hover:border-[#2B3BF6]/50 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3 group"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 sm:gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display font-bold text-sm sm:text-base text-[#0F1115] group-hover:text-[#2B3BF6] transition-colors truncate">
                      {app.businessName}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${getStatusBadge(app.status)}`}>
                      {app.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-xs text-[#5A6A80] mt-1">
                    <span>CIPC: <strong className="text-[#0F1115] font-mono">{app.cipcRegNumber}</strong></span>
                    <span>•</span>
                    <span>Director: {app.directorName}</span>
                    <span>•</span>
                    <span>{app.location.split(',')[0]}</span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-start shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E2E7F0]/60">
                  <div className="font-display font-bold text-base sm:text-lg text-[#0F1115]">
                    {formatZAR(app.requestedAmount)}
                  </div>
                  <span className="text-[10px] text-[#5A6A80] block">
                    {app.requestedTermMonths} Months Facility
                  </span>
                </div>
              </div>

              {/* Behavioral Indicators Bar */}
              <div className="pt-2 border-t border-[#E2E7F0] flex flex-wrap items-center justify-between gap-2 sm:gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-[#5A6A80]">Avani Score:</span>
                    <span className="font-display font-bold text-sm text-[#2B3BF6]">
                      {app.metrics.overallScore} <span className="text-[10px] font-normal text-[#5A6A80]">/ 850</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-[#5A6A80]">Cash Consistency:</span>
                    <span className="font-semibold text-[#00C49F]">
                      {app.metrics.cashFlowConsistency}%
                    </span>
                  </div>

                  <div className="hidden xs:flex items-center gap-1.5">
                    <span className="text-[11px] text-[#5A6A80]">Dishonoured:</span>
                    <span className={`font-semibold ${app.metrics.dishonouredDebits180d === 0 ? 'text-[#00C49F]' : 'text-[#FF9F1C]'}`}>
                      {app.metrics.dishonouredDebits180d} in 180d
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold text-[#2B3BF6] group-hover:translate-x-0.5 transition-transform shrink-0">
                  <span className="hidden sm:inline">Inspect Case</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
