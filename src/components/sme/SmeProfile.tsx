import React, { useState } from 'react';
import { SmeApplication, AuditLogItem } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { 
  User, 
  ShieldCheck, 
  Lock, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  History, 
  AlertTriangle,
  FileCheck,
  CheckCircle,
  ExternalLink,
  Ban,
  Globe,
  Check
} from 'lucide-react';

interface SmeProfileProps {
  application: SmeApplication;
  onRevokeConsent?: () => void;
}

export const SmeProfile: React.FC<SmeProfileProps> = ({
  application,
  onRevokeConsent
}) => {
  const { 
    currentLanguage, 
    setLanguage, 
    languages, 
    openLanguageModal,
    t 
  } = useLanguage();

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(application.auditLogs);
  const [isConsentRevoked, setIsConsentRevoked] = useState<boolean>(false);
  const [showRevokeConfirm, setShowRevokeConfirm] = useState<boolean>(false);

  const handleRevoke = () => {
    setIsConsentRevoked(true);
    setShowRevokeConfirm(false);
    // Add revocation log entry
    const newLog: AuditLogItem = {
      id: `log-revoke-${Date.now()}`,
      timestamp: 'Just now',
      action: 'Consent Revoked by Principal',
      actor: `${application.directorName} (SME)`,
      recipient: 'All Lenders (Vula Capital)',
      dataShared: 'All active telemetry feeds paused and locked',
      status: 'revoked'
    };
    setAuditLogs([newLog, ...auditLogs]);
    if (onRevokeConsent) onRevokeConsent();
  };

  return (
    <div className="space-y-5 sm:space-y-6 pb-36 sm:pb-28">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2B3BF6] mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>Radical Data Transparency</span>
        </div>
        <h1 className="font-display font-bold text-2xl text-[#0F1115] tracking-tight">
          {t('profile.title', 'Business Profile &')} <span className="font-accent">{t('profile.titleAccent', 'Compliance')}</span>
        </h1>
        <p className="text-xs text-[#5A6A80] mt-0.5">
          {t('profile.subtitle', 'CIPC verified details, director credentials, and POPIA privacy controls')}
        </p>
      </div>

      {/* LANGUAGE PREFERENCE CARD (All 11 Official South African Languages) */}
      <div className="bg-white rounded-2xl p-5 border border-[#E2E7F0] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#2B3BF6]/10 text-[#2B3BF6] flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-[#0F1115]">
                {t('profile.languagePref', 'Official Language Preference')}
              </h3>
              <p className="text-[11px] text-[#5A6A80]">
                {t('profile.languageDesc', "Select which of South Africa's 11 official languages to display across Avani")}
              </p>
            </div>
          </div>
          <button
            onClick={openLanguageModal}
            className="text-xs font-semibold text-[#2B3BF6] hover:underline"
          >
            View All (11)
          </button>
        </div>

        {/* 11 Languages Interactive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 pt-1">
          {languages.map((lang) => {
            const isSelected = currentLanguage === lang.code;
            return (
              <button
                key={lang.code}
                id={`profile-select-lang-${lang.code}`}
                onClick={() => setLanguage(lang.code)}
                className={`flex items-center justify-between p-2 rounded-xl text-xs font-medium border transition-all ${
                  isSelected
                    ? 'bg-[#2B3BF6] text-white border-[#2B3BF6] shadow-xs'
                    : 'bg-[#F4F6FA] text-[#0F1115] border-[#E2E7F0] hover:border-[#CBD5E1] hover:bg-white'
                }`}
              >
                <div className="text-left min-w-0 pr-1">
                  <span className="block truncate font-semibold">{lang.nativeName}</span>
                  <span className={`text-[10px] block truncate ${isSelected ? 'text-white/80' : 'text-[#5A6A80]'}`}>
                    {lang.greeting}!
                  </span>
                </div>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 shrink-0 text-white stroke-[3]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* SME ACCOUNT DETAILS (Solid white card) */}
      <div className="bg-white rounded-2xl p-5 border border-[#E2E7F0] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E7F0] pb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#2B3BF6] text-white flex items-center justify-center font-bold text-base sm:text-lg font-display shrink-0">
              TM
            </div>
            <div className="min-w-0">
              <h2 className="font-display font-bold text-base text-[#0F1115] truncate">
                {application.directorName}
              </h2>
              <span className="text-xs text-[#5A6A80] block truncate">
                Managing Director &amp; Majority Shareholder
              </span>
            </div>
          </div>

          <span className="self-start sm:self-auto px-2.5 py-1 rounded-full bg-[#00C49F]/15 text-[#00C49F] text-xs font-semibold shrink-0">
            Verified Identity
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#5A6A80]">
            <Building2 className="w-4 h-4 text-[#2B3BF6]" />
            <span>Entity: <strong className="text-[#0F1115]">{application.businessName}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-[#5A6A80]">
            <Mail className="w-4 h-4 text-[#2B3BF6]" />
            <span>Email: <strong className="text-[#0F1115]">{application.directorEmail}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-[#5A6A80]">
            <Phone className="w-4 h-4 text-[#2B3BF6]" />
            <span>Mobile: <strong className="text-[#0F1115]">{application.directorPhone}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-[#5A6A80]">
            <MapPin className="w-4 h-4 text-[#2B3BF6]" />
            <span>Operating In: <strong className="text-[#0F1115]">{application.location}</strong></span>
          </div>
        </div>
      </div>

      {/* VISIBLE DATA SHARING & AUDIT LOG (Core Brand Promise) */}
      <div className="bg-white rounded-2xl p-5 border border-[#E2E7F0] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[#2B3BF6]" />
              <h3 className="font-display font-bold text-base text-[#0F1115]">
                Consent &amp; Data Disclosure Ledger
              </h3>
            </div>
            <p className="text-xs text-[#5A6A80] mt-0.5">
              An unalterable, POPIA Section 18 compliant access log of all lender inspections
            </p>
          </div>

          {!isConsentRevoked ? (
            <button
              onClick={() => setShowRevokeConfirm(true)}
              className="self-start sm:self-auto px-3 py-1.5 rounded-xl border border-[#FF9F1C] text-[#FF9F1C] hover:bg-[#FF9F1C]/10 text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Revoke Lender Access</span>
            </button>
          ) : (
            <span className="px-3 py-1 rounded-xl bg-[#FF9F1C]/15 text-[#FF9F1C] text-xs font-bold">
              Data Sharing Paused
            </span>
          )}
        </div>

        {/* Revoke confirmation prompt */}
        {showRevokeConfirm && (
          <div className="p-4 rounded-xl bg-[#FF9F1C]/10 border border-[#FF9F1C]/30 space-y-2">
            <h4 className="font-semibold text-xs text-[#0F1115] flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-[#FF9F1C]" />
              <span>Confirm POPIA Consent Revocation?</span>
            </h4>
            <p className="text-xs text-[#5A6A80]">
              This will immediately cut off telemetry access for Vula Capital. Your active application review will be paused until consent is restored.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleRevoke}
                className="px-3 py-1.5 rounded-lg bg-[#FF9F1C] text-white text-xs font-semibold hover:bg-[#e08915]"
              >
                Yes, Revoke Access
              </button>
              <button
                onClick={() => setShowRevokeConfirm(false)}
                className="px-3 py-1.5 rounded-lg bg-white border border-[#E2E7F0] text-xs font-medium text-[#5A6A80]"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Audit Log Entries */}
        <div className="space-y-3 pt-1">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="p-3.5 rounded-xl bg-[#F4F6FA] border border-[#E2E7F0] text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#0F1115]">
                  {log.action}
                </span>
                <span className="text-[11px] text-[#5A6A80] font-mono">
                  {log.timestamp}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[#5A6A80]">
                <span>By: <strong className="text-[#0F1115]">{log.actor}</strong></span>
                <span>To: <strong className="text-[#0F1115]">{log.recipient}</strong></span>
              </div>

              <div className="pt-1 border-t border-[#E2E7F0] text-[11px] text-[#5A6A80] flex flex-wrap items-center justify-between gap-1.5">
                <span className="truncate max-w-[240px] sm:max-w-none">Transmitted: {log.dataShared}</span>
                <span className={`font-medium capitalize shrink-0 ${
                  log.status === 'revoked' ? 'text-[#FF9F1C]' : 'text-[#00C49F]'
                }`}>
                  • {log.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* POPIA Statutory Notice */}
      <div className="p-4 rounded-2xl bg-white border border-[#E2E7F0] text-xs text-[#5A6A80] space-y-1">
        <span className="font-semibold text-[#0F1115] block">
          Statutory Compliance Notice (Republic of South Africa)
        </span>
        <p className="leading-relaxed">
          Avani operates under the Protection of Personal Information Act (POPIA No. 4 of 2013). Data is never sold, packaged for advertising, or shared with third-party aggregators. Information Officer: Aeonium Technologies Compliance (za-compliance@aeonium.tech).
        </p>
      </div>
    </div>
  );
};
