import React, { useState } from 'react';
import { SmeApplication } from '../../types';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  Building2, 
  ShieldCheck, 
  UploadCloud, 
  ExternalLink, 
  Lock, 
  AlertCircle,
  FileCheck,
  Calendar,
  Layers
} from 'lucide-react';

interface SmeApplicationProps {
  application: SmeApplication;
  onUploadMockDoc: (docName: string) => void;
}

export const SmeApplicationView: React.FC<SmeApplicationProps> = ({
  application,
  onUploadMockDoc
}) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);

  const formatZAR = (val: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileName = e.target.files[0].name;
      setIsUploading(true);
      setTimeout(() => {
        onUploadMockDoc(fileName);
        setIsUploading(false);
        setUploadSuccessMsg(`Uploaded and encrypted: ${fileName}`);
        setTimeout(() => setUploadSuccessMsg(null), 4000);
      }, 700);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6 pb-36 sm:pb-28">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#2B3BF6] mb-1">
          <FileText className="w-4 h-4" />
          <span>Single Verified Application</span>
        </div>
        <h1 className="font-display font-bold text-2xl text-[#0F1115] tracking-tight">
          Credit Facility <span className="font-accent">Application</span>
        </h1>
        <p className="text-xs text-[#5A6A80] mt-0.5">
          Submission reference #{application.id} • Assigned to {application.assignedLender}
        </p>
      </div>

      {/* STATUS TIMELINE BANNER (Solid white card with clear chronological nodes) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E2E7F0] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF9F1C] animate-pulse shrink-0" />
            <span className="font-display font-bold text-sm text-[#0F1115]">
              Current Status: {application.status}
            </span>
          </div>
          <span className="text-xs text-[#5A6A80]">
            Submitted {application.submissionDate} ({application.daysInQueue} days ago)
          </span>
        </div>

        {/* Milestone Steps */}
        <div className="grid grid-cols-4 gap-1 sm:gap-2 pt-1">
          <div className="flex flex-col items-center text-center">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#00C49F] text-white flex items-center justify-center text-xs font-bold shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-semibold text-[#0F1115] mt-1.5 leading-tight">Submitted</span>
            <span className="text-[9px] sm:text-[10px] text-[#5A6A80]">18 Aug</span>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#00C49F] text-white flex items-center justify-center text-xs font-bold shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-semibold text-[#0F1115] mt-1.5 leading-tight">Data Synced</span>
            <span className="text-[9px] sm:text-[10px] text-[#5A6A80]">Yoco &amp; FNB</span>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#2B3BF6] text-white flex items-center justify-center text-xs font-bold shadow-xs ring-2 sm:ring-4 ring-[#2B3BF6]/15">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-[#2B3BF6] mt-1.5 leading-tight">In Review</span>
            <span className="text-[9px] sm:text-[10px] text-[#2B3BF6]">Risk Officer</span>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#E2E7F0] text-[#5A6A80] flex items-center justify-center text-xs font-bold">
              <span>4</span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-medium text-[#5A6A80] mt-1.5 leading-tight">Decision</span>
            <span className="text-[9px] sm:text-[10px] text-[#5A6A80]">Pending</span>
          </div>
        </div>
      </div>

      {/* FACILITY & BUSINESS DETAILS (Solid cards for legibility) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Loan Request Card */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E7F0] shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#E2E7F0] pb-2.5">
            <span className="text-xs font-semibold text-[#5A6A80] uppercase tracking-wider">
              Requested Facility
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#2B3BF6]/10 text-[#2B3BF6] font-semibold">
              Working Capital
            </span>
          </div>

          <div>
            <div className="font-display font-extrabold text-2xl sm:text-3xl text-[#0F1115] tracking-tight">
              {formatZAR(application.requestedAmount)}
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#5A6A80] mt-1">
              <span>Term: <strong className="text-[#0F1115]">{application.requestedTermMonths} Months</strong></span>
              <span>•</span>
              <span>Repayment: <strong className="text-[#0F1115]">Yoco POS Sweep + EFT</strong></span>
            </div>
          </div>

          <div className="pt-1">
            <span className="text-xs font-medium text-[#5A6A80] block mb-0.5">Stated Purpose:</span>
            <p className="text-xs text-[#0F1115] bg-[#F4F6FA] p-2.5 rounded-xl border border-[#E2E7F0] leading-relaxed">
              {application.purpose}
            </p>
          </div>
        </div>

        {/* Business Info Card */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E7F0] shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#E2E7F0] pb-2.5">
            <span className="text-xs font-semibold text-[#5A6A80] uppercase tracking-wider">
              Entity Information
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#00C49F]/10 text-[#00C49F] font-semibold">
              CIPC Verified
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <span className="text-[#5A6A80] block">Registered Legal Name:</span>
              <span className="font-semibold text-[#0F1115]">{application.businessName}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[#5A6A80] block">CIPC Registration:</span>
                <span className="font-mono font-medium text-[#0F1115]">{application.cipcRegNumber}</span>
              </div>
              <div>
                <span className="text-[#5A6A80] block">Industry:</span>
                <span className="font-medium text-[#0F1115]">{application.industry}</span>
              </div>
            </div>
            <div>
              <span className="text-[#5A6A80] block">Key Principal / Director:</span>
              <span className="font-medium text-[#0F1115]">{application.directorName} ({application.directorPhone})</span>
            </div>
            <div>
              <span className="text-[#5A6A80] block">Trading Premises:</span>
              <span className="font-medium text-[#0F1115]">{application.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* UPLOADED COMPLIANCE DOCUMENTS */}
      <div className="bg-white rounded-2xl p-5 border border-[#E2E7F0] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-base text-[#0F1115]">
              Uploaded Verified Documents
            </h3>
            <p className="text-xs text-[#5A6A80]">
              Stored with 256-bit AES encryption in South African cloud jurisdiction
            </p>
          </div>

          {/* Upload Document Trigger */}
          <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-[#F4F6FA] hover:bg-[#E2E7F0] text-xs font-semibold text-[#0F1115] border border-[#CBD5E1] transition-all flex items-center gap-1.5">
            <UploadCloud className="w-4 h-4 text-[#2B3BF6]" />
            <span>{isUploading ? "Encrypting..." : "Add Document"}</span>
            <input
              type="file"
              onChange={handleSimulateUpload}
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg"
            />
          </label>
        </div>

        {uploadSuccessMsg && (
          <div className="p-2.5 rounded-xl bg-[#00C49F]/10 border border-[#00C49F]/30 text-xs text-[#00C49F] font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{uploadSuccessMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {application.documents.map((doc) => (
            <div
              key={doc.id}
              className="p-3 rounded-xl bg-[#F4F6FA] border border-[#E2E7F0] flex items-start justify-between gap-2"
            >
              <div className="flex items-start gap-2.5">
                <FileCheck className="w-4 h-4 text-[#2B3BF6] shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-xs text-[#0F1115] truncate max-w-[200px]">
                    {doc.name}
                  </h5>
                  <div className="flex items-center gap-2 text-[10px] text-[#5A6A80] mt-0.5">
                    <span>{doc.type}</span>
                    {doc.fileSize && <span>• {doc.fileSize}</span>}
                  </div>
                </div>
              </div>

              <span className="px-1.5 py-0.5 rounded-md bg-[#00C49F]/15 text-[#00C49F] text-[10px] font-bold shrink-0">
                {doc.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* EXPLICIT POPIA CONSENT BANNER (Transparency Promise) */}
      <div className="bg-[#0F1115] text-white rounded-2xl p-5 border border-white/10 shadow-lg space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#00D8FF]" />
            <h4 className="font-display font-bold text-sm text-white">
              POPIA Consent Granted to {application.assignedLender}
            </h4>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-[#00D8FF]/20 text-[#00D8FF] text-[10px] font-bold">
            Explicit &amp; Active
          </span>
        </div>

        <p className="text-xs text-white/80 leading-relaxed">
          Granted on <strong>{application.consentGrantedDate}</strong> by Thabo Mokoena. Valid for 90 days or until facility evaluation closes. You retain the statutory right under South African POPIA to revoke telemetry access at any moment.
        </p>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/10 text-[11px] text-white/60">
          <span>Scope: Read-only daily POS cash flow &amp; bank statement indices</span>
          <span className="text-[#00D8FF] font-medium">Expires {application.consentExpiresDate}</span>
        </div>
      </div>
    </div>
  );
};
