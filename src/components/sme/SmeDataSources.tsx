import React, { useState } from 'react';
import { DataSourceItem } from '../../types';
import { 
  Link2, 
  CheckCircle2, 
  UploadCloud, 
  ShieldCheck, 
  RefreshCw, 
  ExternalLink, 
  Check, 
  Lock, 
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';

interface SmeDataSourcesProps {
  dataSources: DataSourceItem[];
  onToggleConnect: (sourceId: string) => void;
}

export const SmeDataSources: React.FC<SmeDataSourcesProps> = ({
  dataSources,
  onToggleConnect
}) => {
  const [activeSyncingId, setActiveSyncingId] = useState<string | null>(null);
  const [modalSource, setModalSource] = useState<DataSourceItem | null>(null);

  const handleSimulateSync = (id: string) => {
    setActiveSyncingId(id);
    setTimeout(() => {
      setActiveSyncingId(null);
    }, 1200);
  };

  return (
    <div className="space-y-5 sm:space-y-6 pb-36 sm:pb-28">
      {/* Top Header with First-Person Framing */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#00C49F] mb-1">
          <Link2 className="w-4 h-4" />
          <span>Automated Cash-Flow Verification</span>
        </div>
        <h1 className="font-display font-bold text-2xl text-[#0F1115] tracking-tight">
          Connect your <span className="font-accent">accounts</span>
        </h1>
        <p className="text-xs text-[#5A6A80] mt-0.5">
          Link your point-of-sale and accounting tools to prove real cash flow without paperwork
        </p>
      </div>

      {/* Security & Read-Only Promise */}
      <div className="bg-white rounded-2xl p-4 border border-[#E2E7F0] shadow-xs flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-[#2B3BF6]/10 flex items-center justify-center text-[#2B3BF6] shrink-0 mt-0.5">
          <Lock className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs">
          <h4 className="font-semibold text-[#0F1115] flex items-center gap-2">
            <span>Bank-Grade Read-Only Privacy</span>
            <span className="px-2 py-0.2 rounded-full bg-[#00D8FF]/15 text-[#0F1115] text-[10px] font-bold">
              POPIA Certified
            </span>
          </h4>
          <p className="text-[#5A6A80] leading-relaxed">
            Avani only analyzes aggregated behavioural metrics (daily settlement velocity, transaction consistency, and return rates). We never store your passwords or initiate payments.
          </p>
        </div>
      </div>

      {/* FIRST-PERSON DATA SOURCE CARDS (Solid opaque surfaces) */}
      <div className="space-y-3.5">
        {dataSources.map((source) => {
          const isSyncing = activeSyncingId === source.id;

          return (
            <div
              key={source.id}
              id={`data-source-${source.id}`}
              className="bg-white rounded-2xl p-5 border border-[#E2E7F0] shadow-xs hover:border-[#CBD5E1] transition-all space-y-3.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                    source.connected ? 'bg-[#00C49F]/15 text-[#00C49F]' : 'bg-[#F4F6FA] text-[#5A6A80] border border-[#E2E7F0]'
                  }`}>
                    {source.provider === 'yoco' && 'YC'}
                    {source.provider === 'fnb' && 'FNB'}
                    {source.provider === 'sage' && 'SG'}
                    {source.provider === 'xero' && 'XR'}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-display font-bold text-sm sm:text-base text-[#0F1115]">
                        {source.title}
                      </h3>
                      {source.connected && (
                        <span className="px-2 py-0.2 rounded-full bg-[#00C49F]/15 text-[#00C49F] text-[10px] font-bold flex items-center gap-1 shrink-0">
                          <Check className="w-3 h-3" />
                          <span>Connected</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#5A6A80] mt-0.5 leading-relaxed">
                      {source.description}
                    </p>
                  </div>
                </div>

                <div className="self-end sm:self-start shrink-0">
                  <button
                    id={`connect-toggle-${source.id}`}
                    onClick={() => onToggleConnect(source.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      source.connected
                        ? 'bg-[#F4F6FA] hover:bg-[#E2E7F0] text-[#5A6A80] border border-[#CBD5E1]'
                        : 'bg-[#2B3BF6] hover:bg-[#1f2fd4] text-white shadow-xs'
                    }`}
                  >
                    {source.connected ? 'Disconnect' : 'Connect Now'}
                  </button>
                </div>
              </div>

              {/* Status details when connected */}
              {source.connected && (
                <div className="pt-2 border-t border-[#E2E7F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#5A6A80]">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="text-[#00C49F] font-medium flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#00C49F]" />
                      {source.statusText}
                    </span>
                    {source.lastSync && (
                      <span>Last sync: {source.lastSync}</span>
                    )}
                    {source.dataPointsCount && (
                      <span className="hidden sm:inline">• {source.dataPointsCount.toLocaleString()} data points</span>
                    )}
                  </div>

                  <button
                    onClick={() => handleSimulateSync(source.id)}
                    disabled={isSyncing}
                    className="self-start sm:self-auto text-xs font-semibold text-[#2B3BF6] hover:underline flex items-center gap-1.5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Syncing feed...' : 'Refresh telemetry'}</span>
                  </button>
                </div>
              )}

              {/* Label for pre-pilot status */}
              <div className="text-[10px] text-[#5A6A80] italic">
                *Secure API connector (Concept preview pre-pilot bridge)
              </div>
            </div>
          );
        })}
      </div>

      {/* Request Custom Connector */}
      <div className="bg-[#F4F6FA] rounded-2xl p-4 border border-dashed border-[#CBD5E1] text-center space-y-1.5">
        <h4 className="font-semibold text-xs text-[#0F1115]">
          Use a different point-of-sale or accounting software?
        </h4>
        <p className="text-[11px] text-[#5A6A80]">
          We are adding support for Nedbank Avo, iKhokha, QuickBooks, and Shopify during the Q4 2026 pilot.
        </p>
      </div>
    </div>
  );
};
