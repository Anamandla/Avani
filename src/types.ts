export type UserRole = 'sme' | 'lender';

export type SmeTab = 'home' | 'bookkeeping' | 'application' | 'datasources' | 'profile';

export type LenderTab = 'overview' | 'applications' | 'casedetail' | 'rules' | 'reports';

export type ApplicationStatus = 'New' | 'In Review' | 'Scored' | 'Decided';

export type DecisionOutcome = 'Approved' | 'Declined' | 'Info Requested';

export interface AuditLogItem {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  recipient: string;
  dataShared: string;
  status: 'active' | 'revoked' | 'verified';
}

export interface DocumentItem {
  id: string;
  name: string;
  type: string;
  status: 'Verified' | 'Pending Review' | 'Missing';
  uploadedDate: string;
  fileSize?: string;
}

export interface BookkeepingEntry {
  id: string;
  date: string;
  amount: number; // in South African Rand (ZAR)
  type: 'income' | 'expense';
  category: string;
  note?: string;
  source?: string;
}

export interface DataSourceItem {
  id: string;
  title: string;
  provider: 'yoco' | 'fnb' | 'sage' | 'xero';
  connected: boolean;
  statusText: string;
  description: string;
  lastSync?: string;
  dataPointsCount?: number;
}

export interface BehaviouralMetrics {
  overallScore: number; // e.g. 742 / 850
  maxScore: number;
  cashFlowConsistency: number; // 0-100
  revenueVolatility: 'Low' | 'Moderate' | 'Elevated';
  dishonouredDebits180d: number;
  customerConcentration: number; // e.g. 24%
  supplierReliability: number; // e.g. 94%
  averageMonthlyRevenue: number; // ZAR
  projectedRunwayMonths: number;
  summaryExplanation: string[];
  aiDraftedMemo: {
    recommendation: 'Approve' | 'Conditional Approve' | 'Decline';
    suggestedFacility: number;
    suggestedRate: string;
    rationale: string;
    riskMitigants: string[];
    requiredCovenants: string[];
  };
}

export interface SmeApplication {
  id: string;
  businessName: string;
  tradingName: string;
  cipcRegNumber: string;
  industry: string;
  directorName: string;
  directorEmail: string;
  directorPhone: string;
  location: string;
  requestedAmount: number;
  requestedTermMonths: number;
  purpose: string;
  status: ApplicationStatus;
  submissionDate: string;
  daysInQueue: number;
  assignedLender: string;
  consentGrantedDate: string;
  consentExpiresDate: string;
  metrics: BehaviouralMetrics;
  documents: DocumentItem[];
  auditLogs: AuditLogItem[];
  decision?: {
    outcome: DecisionOutcome;
    decidedBy: string;
    decidedAt: string;
    approvedAmount?: number;
    interestRate?: string;
    notes?: string;
  };
}

export interface CreditPolicyRule {
  id: string;
  title: string;
  description: string;
  type: 'min_score' | 'min_dscr' | 'max_dti' | 'max_loan_revenue' | 'custom';
  currentValue: number | string;
  unit: string;
  status: 'active' | 'warning' | 'paused';
}

export interface AICreditReport {
  generatedAt: string;
  isAiLive: boolean;
  modelUsed?: string;
  score: number;
  scoreTier: string;
  executiveSummary: string;
  scoreRationale: {
    title: string;
    points: string[];
  };
  strengths: {
    category: string;
    title: string;
    detail: string;
    impact: string;
  }[];
  weaknesses: {
    category: string;
    title: string;
    detail: string;
    riskLevel: 'High' | 'Medium' | 'Low';
    dragImpact: string;
  }[];
  improvementRoadmap: {
    step: number;
    action: string;
    timeframe: string;
    potentialGain: string;
    practicalHowTo: string;
  }[];
  benchmarkComparisons: {
    metric: string;
    smeScore: number;
    industryBenchmark: number;
    unit: string;
    status: 'ahead' | 'on-par' | 'behind';
  }[];
  simulationImpact: {
    scenario: string;
    estimatedScore: number;
    eligibleFacilityZAR: number;
    projectedRateReduction: string;
  }[];
  lenderPerspective: {
    institution: string;
    appetite: 'High' | 'Medium' | 'Selective';
    summary: string;
  }[];
}
