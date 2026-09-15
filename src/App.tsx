import React, { useState } from 'react';
import { 
  UserRole, 
  SmeTab, 
  LenderTab, 
  SmeApplication, 
  BookkeepingEntry, 
  DataSourceItem, 
  CreditPolicyRule,
  DecisionOutcome
} from './types';
import { 
  initialSmeApplication, 
  mockQueueApplications, 
  initialBookkeepingEntries, 
  initialDataSources, 
  initialCreditPolicyRules 
} from './data/mockData';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { AboutModal } from './components/common/AboutModal';
import { LanguageProvider } from './i18n/LanguageContext';
import { LanguageModal } from './components/common/LanguageModal';

// SME screens
import { SmeHome } from './components/sme/SmeHome';
import { SmeBookkeeping } from './components/sme/SmeBookkeeping';
import { SmeApplicationView } from './components/sme/SmeApplication';
import { SmeDataSources } from './components/sme/SmeDataSources';
import { SmeProfile } from './components/sme/SmeProfile';

// Lender screens
import { LenderOverview } from './components/lender/LenderOverview';
import { LenderApplications } from './components/lender/LenderApplications';
import { LenderCaseDetail } from './components/lender/LenderCaseDetail';
import { LenderRulesEngine } from './components/lender/LenderRulesEngine';
import { LenderReports } from './components/lender/LenderReports';

export default function App() {
  // Navigation & Role State
  const [role, setRole] = useState<UserRole>('sme');
  const [smeTab, setSmeTab] = useState<SmeTab>('home');
  const [lenderTab, setLenderTab] = useState<LenderTab>('overview');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);
  const [isQuickBookkeepingOpen, setIsQuickBookkeepingOpen] = useState<boolean>(false);

  // Application Data State
  const [smeApplication, setSmeApplication] = useState<SmeApplication>(initialSmeApplication);
  const [queueApplications, setQueueApplications] = useState<SmeApplication[]>(mockQueueApplications);
  const [selectedCaseApp, setSelectedCaseApp] = useState<SmeApplication>(initialSmeApplication);
  const [bookkeepingEntries, setBookkeepingEntries] = useState<BookkeepingEntry[]>(initialBookkeepingEntries);
  const [dataSources, setDataSources] = useState<DataSourceItem[]>(initialDataSources);
  const [creditRules, setCreditRules] = useState<CreditPolicyRule[]>(initialCreditPolicyRules);

  // Handlers for SME
  const handleAddBookkeepingEntry = (entry: Omit<BookkeepingEntry, 'id'>) => {
    const newEntry: BookkeepingEntry = {
      ...entry,
      id: `bk-${Date.now()}`
    };
    setBookkeepingEntries([newEntry, ...bookkeepingEntries]);
  };

  const handleToggleDataSource = (sourceId: string) => {
    setDataSources(prev => prev.map(s => {
      if (s.id === sourceId) {
        const nextConnected = !s.connected;
        return {
          ...s,
          connected: nextConnected,
          statusText: nextConnected ? 'Connected & syncing daily' : 'Disconnected by user'
        };
      }
      return s;
    }));
  };

  const handleUploadMockDoc = (docName: string) => {
    const newDoc = {
      id: `doc-${Date.now()}`,
      name: docName,
      type: 'Supplementary Financial Evidence',
      status: 'Verified' as const,
      uploadedDate: 'Just now',
      fileSize: '1.2 MB'
    };
    setSmeApplication(prev => ({
      ...prev,
      documents: [newDoc, ...prev.documents]
    }));
  };

  // Handlers for Lender
  const handleRecordDecision = (
    appId: string, 
    outcome: DecisionOutcome, 
    notes: string, 
    approvedAmount?: number, 
    rate?: string
  ) => {
    const decidedAt = new Date().toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }) + ', ' + new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' }) + ' SAST';

    const decisionRecord = {
      outcome,
      decidedBy: 'Naledi Khumalo (Credit Lead)',
      decidedAt,
      approvedAmount,
      interestRate: rate,
      notes
    };

    setQueueApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          status: 'Decided',
          decision: decisionRecord
        };
      }
      return app;
    }));

    if (selectedCaseApp.id === appId) {
      setSelectedCaseApp(prev => ({
        ...prev,
        status: 'Decided',
        decision: decisionRecord
      }));
    }

    if (smeApplication.id === appId) {
      setSmeApplication(prev => ({
        ...prev,
        status: 'Decided',
        decision: decisionRecord
      }));
    }
  };

  const handleUpdateRule = (ruleId: string, newValue: number | string) => {
    setCreditRules(prev => prev.map(r => {
      if (r.id === ruleId) {
        return { ...r, currentValue: newValue };
      }
      return r;
    }));
  };

  const handleAddCustomRule = (rule: Omit<CreditPolicyRule, 'id'>) => {
    const newRule: CreditPolicyRule = {
      ...rule,
      id: `rule-${Date.now()}`
    };
    setCreditRules(prev => [...prev, newRule]);
  };

  const handleToggleRuleStatus = (ruleId: string) => {
    setCreditRules(prev => prev.map(r => {
      if (r.id === ruleId) {
        return {
          ...r,
          status: r.status === 'active' ? 'paused' : 'active'
        };
      }
      return r;
    }));
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#F4F6FA] text-[#0F1115] font-body flex flex-col selection:bg-[#2B3BF6]/20 selection:text-[#2B3BF6]">
        {/* Top Universal Header */}
        <Header
          currentRole={role}
          onRoleChange={setRole}
          isMobileFrame={isMobileFrame}
          onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
          onOpenInfoModal={() => setIsInfoModalOpen(true)}
        />

      {/* Main Content Area */}
      <main className="flex-1 flex justify-center w-full px-2 sm:px-4 py-2 sm:py-6 overflow-x-hidden">
        <div
          className={`w-full transition-all duration-300 ${
            isMobileFrame
              ? 'md:max-w-[420px] md:bg-white md:rounded-[44px] md:shadow-[0_25px_60px_-15px_rgba(15,17,21,0.25)] md:border-[8px] md:border-[#0F1115] md:px-4 md:pt-6 md:pb-20 md:relative md:overflow-hidden md:min-h-[820px] max-w-full'
              : 'max-w-4xl'
          }`}
        >
          {/* Mobile phone notch pill only on desktop simulator mode */}
          {isMobileFrame && (
            <div className="hidden md:block w-28 h-4 bg-[#0F1115] rounded-full mx-auto mb-4" />
          )}

          {/* SME PERSPECTIVE */}
          {role === 'sme' && (
            <>
              {smeTab === 'home' && (
                <SmeHome
                  application={smeApplication}
                  onNavigateTab={setSmeTab}
                  onOpenQuickBookkeeping={() => {
                    setSmeTab('bookkeeping');
                    setIsQuickBookkeepingOpen(true);
                  }}
                />
              )}

              {smeTab === 'bookkeeping' && (
                <SmeBookkeeping
                  entries={bookkeepingEntries}
                  onAddEntry={handleAddBookkeepingEntry}
                  isQuickModalOpen={isQuickBookkeepingOpen}
                  onCloseQuickModal={() => setIsQuickBookkeepingOpen(false)}
                />
              )}

              {smeTab === 'application' && (
                <SmeApplicationView
                  application={smeApplication}
                  onUploadMockDoc={handleUploadMockDoc}
                />
              )}

              {smeTab === 'datasources' && (
                <SmeDataSources
                  dataSources={dataSources}
                  onToggleConnect={handleToggleDataSource}
                />
              )}

              {smeTab === 'profile' && (
                <SmeProfile
                  application={smeApplication}
                  onRevokeConsent={() => {
                    setSmeApplication(prev => ({
                      ...prev,
                      status: 'In Review'
                    }));
                  }}
                />
              )}
            </>
          )}

          {/* LENDER PERSPECTIVE */}
          {role === 'lender' && (
            <>
              {lenderTab === 'overview' && (
                <LenderOverview
                  applications={queueApplications}
                  onNavigateTab={setLenderTab}
                  onSelectApplication={(app) => {
                    setSelectedCaseApp(app);
                  }}
                />
              )}

              {lenderTab === 'applications' && (
                <LenderApplications
                  applications={queueApplications}
                  onSelectApplication={(app) => {
                    setSelectedCaseApp(app);
                  }}
                  onOpenCaseDetail={() => setLenderTab('casedetail')}
                />
              )}

              {lenderTab === 'casedetail' && (
                <LenderCaseDetail
                  application={selectedCaseApp}
                  onBackToQueue={() => setLenderTab('applications')}
                  onRecordDecision={handleRecordDecision}
                />
              )}

              {lenderTab === 'rules' && (
                <LenderRulesEngine
                  rules={creditRules}
                  onUpdateRule={handleUpdateRule}
                  onAddCustomRule={handleAddCustomRule}
                  onToggleRuleStatus={handleToggleRuleStatus}
                />
              )}

              {lenderTab === 'reports' && (
                <LenderReports />
              )}
            </>
          )}
        </div>
      </main>

      {/* Floating Liquid Glass Bottom Navigation */}
      <BottomNav
        role={role}
        currentSmeTab={smeTab}
        currentLenderTab={lenderTab}
        onSelectSmeTab={setSmeTab}
        onSelectLenderTab={setLenderTab}
        activeApplicationCount={queueApplications.filter(a => a.status === 'In Review' || a.status === 'New').length}
      />

      {/* About & Context Modal */}
      <AboutModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />

      {/* 11 Official South African Languages Modal */}
      <LanguageModal />
    </div>
  </LanguageProvider>
  );
}
