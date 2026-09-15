import React from 'react';
import { Logo } from './Logo';
import { UserRole } from '../../types';
import { Smartphone, Monitor, Info, Globe } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
  onOpenInfoModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  isMobileFrame,
  onToggleMobileFrame,
  onOpenInfoModal,
}) => {
  const { currentLanguageInfo, openLanguageModal, t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F4F6FA]/95 backdrop-blur-md border-b border-[#E2E7F0] px-3 sm:px-4 py-2 sm:py-2.5 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Logo size="md" showSubtitle={false} className="sm:hidden" />
          <Logo size="md" showSubtitle={true} className="hidden sm:flex" />
          
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E2E7F0]/60 border border-[#E2E7F0] text-[11px] font-medium text-[#5A6A80]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D8FF] animate-pulse" />
            <span>{t('header.sandbox', 'Pre-pilot Sandbox')}</span>
          </div>
        </div>

        {/* Center: Perspective Switcher (Mobile optimized with compact labels) */}
        <div className="flex items-center bg-[#E2E7F0]/80 p-0.5 sm:p-1 rounded-full border border-white/60 shadow-inner shrink-0">
          <button
            id="role-switch-sme-btn"
            onClick={() => onRoleChange('sme')}
            className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1 sm:gap-1.5 ${
              currentRole === 'sme'
                ? 'bg-[#2B3BF6] text-white shadow-sm'
                : 'text-[#5A6A80] hover:text-[#0F1115]'
            }`}
          >
            <span>{t('header.sme', 'SME')}</span>
            <span className={`text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded-full hidden sm:inline ${
              currentRole === 'sme' ? 'bg-white/25 text-white' : 'bg-white/60 text-[#5A6A80]'
            }`}>
              {t('header.borrower', 'Borrower')}
            </span>
          </button>

          <button
            id="role-switch-lender-btn"
            onClick={() => onRoleChange('lender')}
            className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1 sm:gap-1.5 ${
              currentRole === 'lender'
                ? 'bg-[#0F1115] text-white shadow-sm'
                : 'text-[#5A6A80] hover:text-[#0F1115]'
            }`}
          >
            <span>{t('header.lender', 'Lender')}</span>
            <span className={`text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded-full hidden sm:inline ${
              currentRole === 'lender' ? 'bg-white/20 text-white' : 'bg-white/60 text-[#5A6A80]'
            }`}>
              {t('header.credit', 'Credit')}
            </span>
          </button>
        </div>

        {/* Right Tools: Language Switcher, Viewport Toggle & Concept Info */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Language Switcher */}
          <button
            id="header-language-btn"
            onClick={openLanguageModal}
            title={t('header.selectLanguage', 'Select Language')}
            className="flex items-center gap-1.5 px-2 py-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-white border border-[#E2E7F0] text-[#0F1115] hover:border-[#2B3BF6]/50 hover:bg-[#F8FAFC] transition-all shadow-2xs text-xs font-medium"
          >
            <Globe className="w-3.5 h-3.5 text-[#2B3BF6] shrink-0" />
            <span className="hidden xs:inline font-semibold">{currentLanguageInfo.nativeName}</span>
            <span className="xs:hidden font-bold uppercase text-[11px]">{currentLanguageInfo.code}</span>
          </button>

          {/* Mobile frame simulator only relevant on desktop */}
          <button
            id="toggle-viewport-btn"
            onClick={onToggleMobileFrame}
            title={isMobileFrame ? t('header.fullWidth', 'Switch to Wide Responsive View') : t('header.mobileFrame', 'Switch to Mobile Device Frame')}
            className="hidden md:flex p-2 rounded-xl bg-white border border-[#E2E7F0] text-[#5A6A80] hover:text-[#0F1115] hover:border-[#CBD5E1] transition-all items-center gap-1.5 text-xs font-medium"
          >
            {isMobileFrame ? (
              <>
                <Monitor className="w-4 h-4 text-[#2B3BF6]" />
                <span>{t('header.fullWidth', 'Full Width')}</span>
              </>
            ) : (
              <>
                <Smartphone className="w-4 h-4 text-[#2B3BF6]" />
                <span>{t('header.mobileFrame', 'Mobile Frame')}</span>
              </>
            )}
          </button>

          <button
            id="open-concept-info-btn"
            onClick={onOpenInfoModal}
            title="About Avani"
            className="p-1.5 sm:p-2 rounded-xl bg-white border border-[#E2E7F0] text-[#5A6A80] hover:text-[#2B3BF6] hover:border-[#2B3BF6]/40 transition-all"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
