import { SmeApplication, BookkeepingEntry, DataSourceItem, CreditPolicyRule } from '../types';

export const initialSmeApplication: SmeApplication = {
  id: 'APP-ZA-2026-0891',
  businessName: 'Khotso Crafts & Supplies (Pty) Ltd',
  tradingName: 'Khotso Crafts',
  cipcRegNumber: '2021/498210/07',
  industry: 'Specialty Retail & Interior Crafts',
  directorName: 'Thabo Mokoena',
  directorEmail: 'thabo@khotsocrafts.co.za',
  directorPhone: '+27 82 555 1928',
  location: 'Rosebank, Johannesburg, Gauteng',
  requestedAmount: 250000,
  requestedTermMonths: 6,
  purpose: 'Bulk raw timber & brass inventory acquisition ahead of peak spring tourism season',
  status: 'In Review',
  submissionDate: '18 Aug 2026',
  daysInQueue: 4,
  assignedLender: 'Vula Capital SME Debt Fund',
  consentGrantedDate: '18 Aug 2026, 09:15 SAST',
  consentExpiresDate: '18 Nov 2026, 23:59 SAST',
  metrics: {
    overallScore: 742,
    maxScore: 850,
    cashFlowConsistency: 88,
    revenueVolatility: 'Low',
    dishonouredDebits180d: 0,
    customerConcentration: 22,
    supplierReliability: 94,
    averageMonthlyRevenue: 142000,
    projectedRunwayMonths: 4.8,
    summaryExplanation: [
      'Consistent weekday Yoco point-of-sale card volume with predictable 48-hour settlement rhythm.',
      '0 dishonoured debit orders across 180 consecutive bank statement days.',
      'Customer revenue base diversified across retail walk-ins (62%) and hospitality trade orders (38%).',
      'Winter seasonal dip in June was managed proactively with reduced inventory buffers without overdraft breaches.'
    ],
    aiDraftedMemo: {
      recommendation: 'Approve',
      suggestedFacility: 250000,
      suggestedRate: 'Prime + 3.25%',
      rationale: 'Strong behavioural cash discipline. POS transaction frequency shows consistent daily trading velocity (R4,200 - R6,800/day). Zero bounced debit orders in 6 months. High supplier repeat order completion.',
      riskMitigants: [
        'Yoco split-settlement mechanism allows daily repayment sweep (10% of card turnover).',
        'Director personal surety provided with clear clean credit bureau record.',
        'Existing forward purchase orders from 2 boutique hotels in Sandton and Rosebank.'
      ],
      requiredCovenants: [
        'Maintain continuous Yoco POS sync throughout loan facility tenure.',
        'Quarterly management accounts submitted via Sage connector.'
      ]
    }
  },
  documents: [
    {
      id: 'doc-1',
      name: 'CIPC_Registration_COR14.3.pdf',
      type: 'Company Registration',
      status: 'Verified',
      uploadedDate: '18 Aug 2026',
      fileSize: '420 KB'
    },
    {
      id: 'doc-2',
      name: 'FNB_Business_Statements_Feb-Jul2026.pdf',
      type: 'Bank Statements (6 Months)',
      status: 'Verified',
      uploadedDate: '18 Aug 2026',
      fileSize: '2.4 MB'
    },
    {
      id: 'doc-3',
      name: 'SARS_Tax_Clearance_PIN_2026.pdf',
      type: 'Tax Good Standing',
      status: 'Verified',
      uploadedDate: '18 Aug 2026',
      fileSize: '310 KB'
    },
    {
      id: 'doc-4',
      name: 'Director_ID_Thabo_Mokoena.pdf',
      type: 'FICA Identity Verification',
      status: 'Verified',
      uploadedDate: '18 Aug 2026',
      fileSize: '1.1 MB'
    }
  ],
  auditLogs: [
    {
      id: 'log-1',
      timestamp: '20 Aug 2026, 14:15 SAST',
      action: 'Risk Officer Profile Review',
      actor: 'Naledi Khumalo (Vula Capital)',
      recipient: 'Credit Committee',
      dataShared: 'Aggregated 180-day cash velocity & volatility indices',
      status: 'active'
    },
    {
      id: 'log-2',
      timestamp: '18 Aug 2026, 09:20 SAST',
      action: 'Data Source Verification',
      actor: 'Avani Engine',
      recipient: 'Vula Capital SME Debt Fund',
      dataShared: 'Yoco POS settlement verification hash & revenue summary',
      status: 'verified'
    },
    {
      id: 'log-3',
      timestamp: '18 Aug 2026, 09:15 SAST',
      action: 'Explicit POPIA Consent Signed',
      actor: 'Thabo Mokoena (SME)',
      recipient: 'Vula Capital SME Debt Fund',
      dataShared: 'Permission to inspect behavioural banking & point-of-sale telemetry',
      status: 'active'
    }
  ]
};

export const mockQueueApplications: SmeApplication[] = [
  initialSmeApplication,
  {
    id: 'APP-ZA-2026-0892',
    businessName: 'Lekker Roastery (Pty) Ltd',
    tradingName: 'Lekker Coffee',
    cipcRegNumber: '2020/311902/07',
    industry: 'Food & Beverage / Specialty Roasting',
    directorName: 'Annelize Van Der Merwe',
    directorEmail: 'annelize@lekkerroastery.co.za',
    directorPhone: '+27 83 241 8890',
    location: 'Kloof Street, Cape Town, Western Cape',
    requestedAmount: 380000,
    requestedTermMonths: 12,
    purpose: 'Commercial high-capacity Italian coffee roaster import',
    status: 'In Review',
    submissionDate: '16 Aug 2026',
    daysInQueue: 6,
    assignedLender: 'Vula Capital SME Debt Fund',
    consentGrantedDate: '16 Aug 2026, 11:00 SAST',
    consentExpiresDate: '16 Nov 2026, 23:59 SAST',
    metrics: {
      overallScore: 715,
      maxScore: 850,
      cashFlowConsistency: 84,
      revenueVolatility: 'Moderate',
      dishonouredDebits180d: 0,
      customerConcentration: 18,
      supplierReliability: 91,
      averageMonthlyRevenue: 195000,
      projectedRunwayMonths: 3.9,
      summaryExplanation: [
        'Robust weekend and morning peak turnover across two retail venues.',
        'Supplier green coffee bean payments maintained at 100% on-time fulfillment.',
        'Moderate winter seasonality offset by growing wholesale subscription deliveries.'
      ],
      aiDraftedMemo: {
        recommendation: 'Conditional Approve',
        suggestedFacility: 350000,
        suggestedRate: 'Prime + 3.75%',
        rationale: 'Demonstrated cash generation with strong brand equity. Capex investment directly increases production capacity and gross margin by 14%.',
        riskMitigants: [
          'Roasting machine equipment chattel mortgage as security.',
          'Direct debit linked to primary trading account.'
        ],
        requiredCovenants: [
          'Monthly minimum cash balance of R40,000 maintained.'
        ]
      }
    },
    documents: [
      { id: 'doc-l1', name: 'CIPC_COR14.3.pdf', type: 'Company Registration', status: 'Verified', uploadedDate: '16 Aug 2026' },
      { id: 'doc-l2', name: 'Nedbank_Statements_6M.pdf', type: 'Bank Statements', status: 'Verified', uploadedDate: '16 Aug 2026' }
    ],
    auditLogs: []
  },
  {
    id: 'APP-ZA-2026-0893',
    businessName: 'Bafokeng Logistics & Cold Chain (Pty) Ltd',
    tradingName: 'Bafokeng Transit',
    cipcRegNumber: '2018/142981/07',
    industry: 'Freight & Cold Chain Transport',
    directorName: 'Kagiso Bafokeng',
    directorEmail: 'kagiso@bafokengtransit.co.za',
    directorPhone: '+27 71 890 2234',
    location: 'Polokwane, Limpopo',
    requestedAmount: 650000,
    requestedTermMonths: 18,
    purpose: 'Fleet refrigeration compressor upgrades for fresh produce routes',
    status: 'Scored',
    submissionDate: '14 Aug 2026',
    daysInQueue: 8,
    assignedLender: 'Vula Capital SME Debt Fund',
    consentGrantedDate: '14 Aug 2026, 14:30 SAST',
    consentExpiresDate: '14 Nov 2026, 23:59 SAST',
    metrics: {
      overallScore: 780,
      maxScore: 850,
      cashFlowConsistency: 92,
      revenueVolatility: 'Low',
      dishonouredDebits180d: 0,
      customerConcentration: 28,
      supplierReliability: 96,
      averageMonthlyRevenue: 480000,
      projectedRunwayMonths: 6.2,
      summaryExplanation: [
        'Top-quartile fleet utilization with multi-year contract renewals with Limpopo agricultural co-ops.',
        'Exceptional fuel card and fleet account settlement record.',
        'Zero unpaid debit orders since company inception.'
      ],
      aiDraftedMemo: {
        recommendation: 'Approve',
        suggestedFacility: 650000,
        suggestedRate: 'Prime + 2.50%',
        rationale: 'Superior operational stability and recurring contract cash flows. Low debt-service burden relative to monthly EBITDA.',
        riskMitigants: [
          'Fleet tracking integration and asset pledge.',
          'Direct debit on co-op monthly payment schedule.'
        ],
        requiredCovenants: [
          'Maintain comprehensive fleet commercial transit insurance.'
        ]
      }
    },
    documents: [
      { id: 'doc-b1', name: 'CIPC_Registration.pdf', type: 'Company Registration', status: 'Verified', uploadedDate: '14 Aug 2026' }
    ],
    auditLogs: []
  },
  {
    id: 'APP-ZA-2026-0894',
    businessName: 'Zola Green Tech Solutions (Pty) Ltd',
    tradingName: 'Zola Solar Care',
    cipcRegNumber: '2022/983411/07',
    industry: 'Renewable Energy Maintenance',
    directorName: 'Zola Dlamini',
    directorEmail: 'zola@zolagreentech.co.za',
    directorPhone: '+27 84 331 9081',
    location: 'Morningside, Durban, KwaZulu-Natal',
    requestedAmount: 180000,
    requestedTermMonths: 6,
    purpose: 'Working capital for inverter & battery warranty replacement stock',
    status: 'New',
    submissionDate: '20 Aug 2026',
    daysInQueue: 1,
    assignedLender: 'Vula Capital SME Debt Fund',
    consentGrantedDate: '20 Aug 2026, 08:45 SAST',
    consentExpiresDate: '20 Nov 2026, 23:59 SAST',
    metrics: {
      overallScore: 665,
      maxScore: 850,
      cashFlowConsistency: 72,
      revenueVolatility: 'Moderate',
      dishonouredDebits180d: 1,
      customerConcentration: 38,
      supplierReliability: 82,
      averageMonthlyRevenue: 92000,
      projectedRunwayMonths: 2.5,
      summaryExplanation: [
        'Single isolated debit order query resolved within 48 hours in April 2026.',
        'Higher concentration on two commercial estates in Umhlanga.',
        'Rapidly growing residential service contract pipeline.'
      ],
      aiDraftedMemo: {
        recommendation: 'Conditional Approve',
        suggestedFacility: 150000,
        suggestedRate: 'Prime + 4.25%',
        rationale: 'Viable operational profile but younger operating track record (18 months). Tranche-based disbursement recommended.',
        riskMitigants: ['Staged facility disbursement based on verified supplier invoices.'],
        requiredCovenants: ['Provide weekly bank statement feed synchronization.']
      }
    },
    documents: [],
    auditLogs: []
  },
  {
    id: 'APP-ZA-2026-0889',
    businessName: 'Soweto Stitch Apparel Co. (Pty) Ltd',
    tradingName: 'Soweto Stitch',
    cipcRegNumber: '2019/554109/07',
    industry: 'Textiles & Uniform Manufacturing',
    directorName: 'Lerato Sithole',
    directorEmail: 'lerato@sowetostitch.co.za',
    directorPhone: '+27 72 109 4322',
    location: 'Vilakazi Precinct, Soweto, Gauteng',
    requestedAmount: 120000,
    requestedTermMonths: 6,
    purpose: 'School winter jacket fabric order fulfilment',
    status: 'Decided',
    submissionDate: '08 Aug 2026',
    daysInQueue: 12,
    assignedLender: 'Vula Capital SME Debt Fund',
    consentGrantedDate: '08 Aug 2026, 10:00 SAST',
    consentExpiresDate: '08 Nov 2026, 23:59 SAST',
    metrics: {
      overallScore: 760,
      maxScore: 850,
      cashFlowConsistency: 89,
      revenueVolatility: 'Low',
      dishonouredDebits180d: 0,
      customerConcentration: 19,
      supplierReliability: 95,
      averageMonthlyRevenue: 110000,
      projectedRunwayMonths: 4.1,
      summaryExplanation: [
        'Repeat institutional clients (14 primary and high schools across Gauteng).',
        'Impeccable supplier repayment track record.',
        'Positive operating margin throughout the financial cycle.'
      ],
      aiDraftedMemo: {
        recommendation: 'Approve',
        suggestedFacility: 120000,
        suggestedRate: 'Prime + 3.0%',
        rationale: 'Low credit risk with confirmed procurement orders from established schools.',
        riskMitigants: ['Cession of invoice payments from school governing bodies.'],
        requiredCovenants: ['Notification upon completion of school delivery milestone.']
      }
    },
    documents: [],
    auditLogs: [],
    decision: {
      outcome: 'Approved',
      decidedBy: 'Naledi Khumalo (Senior Credit Lead)',
      decidedAt: '12 Aug 2026, 16:30 SAST',
      approvedAmount: 120000,
      interestRate: 'Prime + 3.0%',
      notes: 'Fully approved facility for 6-month term with weekly automated sweep.'
    }
  }
];

export const initialBookkeepingEntries: BookkeepingEntry[] = [
  {
    id: 'bk-1',
    date: '2026-08-20',
    amount: 14500,
    type: 'income',
    category: 'Retail POS Sales',
    note: 'Weekend artisanal craft market sales',
    source: 'Yoco POS'
  },
  {
    id: 'bk-2',
    date: '2026-08-19',
    amount: 8200,
    type: 'expense',
    category: 'Raw Materials',
    note: 'Kiaat and Jacaranda salvaged timber blocks',
    source: 'EFT'
  },
  {
    id: 'bk-3',
    date: '2026-08-18',
    amount: 22800,
    type: 'income',
    category: 'Trade Order',
    note: 'Boutique hotel reception bespoke brass planters',
    source: 'Bank Transfer'
  },
  {
    id: 'bk-4',
    date: '2026-08-16',
    amount: 6500,
    type: 'expense',
    category: 'Workshop Lease',
    note: 'Rosebank Studio space monthly rental',
    source: 'Debit Order'
  },
  {
    id: 'bk-5',
    date: '2026-08-15',
    amount: 4900,
    type: 'income',
    category: 'Retail POS Sales',
    note: 'Direct gallery showroom purchases',
    source: 'Yoco POS'
  },
  {
    id: 'bk-6',
    date: '2026-08-12',
    amount: 3200,
    type: 'expense',
    category: 'Logistics & Couriers',
    note: 'The Courier Guy national deliveries to Durban & Cape Town',
    source: 'Card'
  },
  {
    id: 'bk-7',
    date: '2026-08-10',
    amount: 18400,
    type: 'income',
    category: 'Trade Order',
    note: 'Corporate corporate gift set 40 units',
    source: 'EFT'
  }
];

export const initialDataSources: DataSourceItem[] = [
  {
    id: 'ds-yoco',
    title: 'Connect your Yoco account',
    provider: 'yoco',
    connected: true,
    statusText: 'Connected & syncing daily',
    description: 'Syncs daily point-of-sale card payments, customer transaction volume, and 48-hour settlement cycles.',
    lastSync: 'Today at 08:30 SAST',
    dataPointsCount: 1420
  },
  {
    id: 'ds-fnb',
    title: 'Upload a bank statement',
    provider: 'fnb',
    connected: true,
    statusText: 'Verified: 6 Months PDF Indexed',
    description: 'First National Bank (FNB) Commercial Current Account. Verifies debit dishonour count, average ledger balance, and cash velocity.',
    lastSync: '18 Aug 2026',
    dataPointsCount: 890
  },
  {
    id: 'ds-sage',
    title: 'Connect Sage Accounting',
    provider: 'sage',
    connected: false,
    statusText: 'Ready to connect',
    description: 'Direct integration with Sage Business Cloud to synchronize accounts payable, supplier ageing, and real-time VAT returns.'
  },
  {
    id: 'ds-xero',
    title: 'Connect Xero',
    provider: 'xero',
    connected: false,
    statusText: 'Available',
    description: 'Synchronize cloud balance sheets, profit & loss, and automated bank reconciliation feeds.'
  }
];

export const initialCreditPolicyRules: CreditPolicyRule[] = [
  {
    id: 'rule-1',
    title: 'Minimum Avani Behavioural Score',
    description: 'Submissions below this threshold require senior credit committee approval exception.',
    type: 'min_score',
    currentValue: 650,
    unit: 'points (out of 850)',
    status: 'active'
  },
  {
    id: 'rule-2',
    title: 'Minimum DSCR (Debt Service Coverage)',
    description: 'Verified monthly free cash flow divided by projected debt service schedule.',
    type: 'min_dscr',
    currentValue: 1.25,
    unit: 'x',
    status: 'active'
  },
  {
    id: 'rule-3',
    title: 'Maximum DTI (Debt-to-Income)',
    description: 'Total existing monthly debt servicing commitments relative to verified average monthly turnover.',
    type: 'max_dti',
    currentValue: 35,
    unit: '%',
    status: 'active'
  },
  {
    id: 'rule-4',
    title: 'Maximum Loan-to-Annual-Revenue',
    description: 'Maximum permitted total credit facility exposure as a fraction of trailing 12-month verified turnover.',
    type: 'max_loan_revenue',
    currentValue: 25,
    unit: '%',
    status: 'active'
  },
  {
    id: 'rule-5',
    title: 'Zero Dishonoured Debits (90 Days)',
    description: 'Auto-flag any applicant with more than 0 bounced debit orders in the preceding 90-day window.',
    type: 'custom',
    currentValue: 'Strict: 0 allowed',
    unit: 'count',
    status: 'active'
  },
  {
    id: 'rule-6',
    title: 'Minimum POS / Banking History',
    description: 'Applicant must provide at least 6 consecutive months of active trading history.',
    type: 'custom',
    currentValue: 6,
    unit: 'months',
    status: 'active'
  }
];
