import React from 'react';
import { UserRole, SmeTab, LenderTab } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { 
  Home, 
  ReceiptText, 
  FileText, 
  Link2, 
  UserCheck, 
  LayoutDashboard, 
  Layers, 
  FileSearch, 
  Sliders, 
  BarChart3 
} from 'lucide-react';

interface BottomNavProps {
  role: UserRole;
  currentSmeTab: SmeTab;
  currentLenderTab: LenderTab;
  onSelectSmeTab: (tab: SmeTab) => void;
  onSelectLenderTab: (tab: LenderTab) => void;
  activeApplicationCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  role,
  currentSmeTab,
  currentLenderTab,
  onSelectSmeTab,
  onSelectLenderTab,
  activeApplicationCount = 4
}) => {
  const { t } = useLanguage();

  if (role === 'sme') {
    const smeTabs: { id: SmeTab; label: string; mobileLabel: string; icon: React.FC<{ className?: string }> }[] = [
      { id: 'home', label: t('nav.home', 'Home'), mobileLabel: t('nav.home', 'Home'), icon: Home },
      { id: 'bookkeeping', label: t('nav.cashflow', 'Cash Flow'), mobileLabel: t('nav.cashflow', 'Cash'), icon: ReceiptText },
      { id: 'application', label: t('nav.application', 'Application'), mobileLabel: t('nav.application', 'Apply'), icon: FileText },
      { id: 'datasources', label: t('nav.datasources', 'Accounts'), mobileLabel: t('nav.datasources', 'Data'), icon: Link2 },
      { id: 'profile', label: t('nav.profile', 'Consent'), mobileLabel: t('nav.profile', 'Consent'), icon: UserCheck }
    ];

    return (
      <nav
        id="sme-floating-bottom-nav"
        aria-label="SME primary navigation"
        className="fixed bottom-2.5 sm:bottom-3.5 left-1/2 -translate-x-1/2 z-30 w-[95%] max-w-md pb-[env(safe-area-inset-bottom)]"
      >
        <div className="liquid-glass-nav rounded-2xl p-1 sm:p-1.5 flex items-center justify-around">
          {smeTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentSmeTab === tab.id;

            return (
              <button
                key={tab.id}
                id={`sme-nav-tab-${tab.id}`}
                onClick={() => onSelectSmeTab(tab.id)}
                className={`relative flex-1 flex flex-col items-center justify-center py-1 sm:py-1.5 px-0.5 sm:px-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-[#2B3BF6] font-semibold'
                    : 'text-[#5A6A80] hover:text-[#0F1115]'
                }`}
              >
                {isActive && (
                  <span className="absolute -top-1 w-5 sm:w-6 h-1 rounded-full bg-[#2B3BF6] shadow-[0_2px_8px_#2B3BF6]" />
                )}
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-150 ${isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'}`} />
                <span className="text-[10px] sm:text-[11px] tracking-tight mt-0.5 sm:mt-1 select-none whitespace-nowrap">
                  <span className="sm:hidden">{tab.mobileLabel}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    );
  }

  // Lender navigation
  const lenderTabs: { id: LenderTab; label: string; mobileLabel: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'overview', label: t('nav.overview', 'Overview'), mobileLabel: t('nav.overview', 'Pipeline'), icon: LayoutDashboard },
    { id: 'applications', label: t('nav.queue', 'Queue'), mobileLabel: t('nav.queue', 'Queue'), icon: Layers, badge: activeApplicationCount },
    { id: 'casedetail', label: t('nav.casedetail', 'Case Detail'), mobileLabel: t('nav.casedetail', 'Case'), icon: FileSearch },
    { id: 'rules', label: t('nav.rules', 'Policy Rules'), mobileLabel: t('nav.rules', 'Rules'), icon: Sliders },
    { id: 'reports', label: t('nav.reports', 'Analytics'), mobileLabel: t('nav.reports', 'Reports'), icon: BarChart3 }
  ];

  return (
    <nav
      id="lender-floating-bottom-nav"
      aria-label="Lender underwriting navigation"
      className="fixed bottom-2.5 sm:bottom-3.5 left-1/2 -translate-x-1/2 z-30 w-[95%] max-w-lg pb-[env(safe-area-inset-bottom)]"
    >
      <div className="liquid-glass-nav rounded-2xl p-1 sm:p-1.5 flex items-center justify-around">
        {lenderTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentLenderTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`lender-nav-tab-${tab.id}`}
              onClick={() => onSelectLenderTab(tab.id)}
              className={`relative flex-1 flex flex-col items-center justify-center py-1 sm:py-1.5 px-0.5 sm:px-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-[#0F1115] font-semibold'
                  : 'text-[#5A6A80] hover:text-[#0F1115]'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1 w-5 sm:w-6 h-1 rounded-full bg-[#0F1115]" />
              )}
              <div className="relative">
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-150 ${isActive ? 'scale-110 text-[#0F1115] stroke-[2.4]' : 'stroke-[1.8]'}`} />
                {tab.badge && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 px-1 sm:px-1.5 py-0.2 rounded-full bg-[#2B3BF6] text-[9px] sm:text-[10px] font-bold text-white leading-tight shadow-sm">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] sm:text-[11px] tracking-tight mt-0.5 sm:mt-1 select-none whitespace-nowrap">
                <span className="sm:hidden">{tab.mobileLabel}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
