// BACKEND INTEGRATION: Replace all mock data exports with API calls to the analytics engine
// This file contains synthetic demo data only — label "synthetic" in all UI

export type Sector =
  'Power & Energy' | 'BFSI' | 'Telecom' | 'Transport' | 'Government' | 'Health' | 'Strategic';

export type ConfidenceLevel = 'High' | 'Medium' | 'Low' | 'Abstained';

export interface CSEntity {
  id: string;
  name: string;
  sector: Sector;
  sai: number;
  saiDelta: number;
  confidence: ConfidenceLevel;
  drs: number;
  findings: { new: number; persisting: number; resolved: number };
  domainScores: Record<string, number>;
  lastSubmission: string;
  analystCount: number;
  alertCount: number;
  caseCount: number;
  status: 'Active' | 'Abstained' | 'Pending';
  topFinding: string;
}

export const DOMAIN_NAMES = [
  'Threat Detection',
  'Investigation',
  'Escalation',
  'Incident Response',
  'Security Operations',
  'Governance & Oversight',
  'Operational Discipline',
  'Cyber Resilience',
] as const;

export const ENTITIES: CSEntity[] = [
  {
    id: 'cse-001',
    name: 'Northern Grid Operations',
    sector: 'Power & Energy',
    sai: 87,
    saiDelta: +12,
    confidence: 'High',
    drs: 0.91,
    findings: { new: 8, persisting: 5, resolved: 2 },
    domainScores: {
      'Threat Detection': 78,
      Investigation: 92,
      Escalation: 84,
      'Incident Response': 71,
      'Security Operations': 88,
      'Governance & Oversight': 76,
      'Operational Discipline': 95,
      'Cyber Resilience': 82,
    },
    lastSubmission: '2026-09-26',
    analystCount: 18,
    alertCount: 14820,
    caseCount: 412,
    status: 'Active',
    topFinding: 'EG-06 SLA-threshold bunching detected in Critical tier',
  },
  {
    id: 'cse-002',
    name: 'Western Railway Cyber Cell',
    sector: 'Transport',
    sai: 81,
    saiDelta: +4,
    confidence: 'High',
    drs: 0.88,
    findings: { new: 6, persisting: 7, resolved: 1 },
    domainScores: {
      'Threat Detection': 65,
      Investigation: 88,
      Escalation: 91,
      'Incident Response': 74,
      'Security Operations': 70,
      'Governance & Oversight': 83,
      'Operational Discipline': 79,
      'Cyber Resilience': 60,
    },
    lastSubmission: '2026-09-25',
    analystCount: 12,
    alertCount: 9340,
    caseCount: 287,
    status: 'Active',
    topFinding: 'NS-01 Silent critical assets — 14 OT assets with zero alerts',
  },
  {
    id: 'cse-003',
    name: 'State Bank Cyber Defence',
    sector: 'BFSI',
    sai: 76,
    saiDelta: -3,
    confidence: 'High',
    drs: 0.94,
    findings: { new: 4, persisting: 9, resolved: 3 },
    domainScores: {
      'Threat Detection': 82,
      Investigation: 71,
      Escalation: 68,
      'Incident Response': 88,
      'Security Operations': 77,
      'Governance & Oversight': 74,
      'Operational Discipline': 85,
      'Cyber Resilience': 79,
    },
    lastSubmission: '2026-09-27',
    analystCount: 28,
    alertCount: 22100,
    caseCount: 634,
    status: 'Active',
    topFinding: 'EG-04 Template investigations — 34% of High alerts use identical notes',
  },
  {
    id: 'cse-004',
    name: 'ONGC IT Security Ops',
    sector: 'Strategic',
    sai: 73,
    saiDelta: +8,
    confidence: 'Medium',
    drs: 0.79,
    findings: { new: 5, persisting: 4, resolved: 0 },
    domainScores: {
      'Threat Detection': 60,
      Investigation: 74,
      Escalation: 79,
      'Incident Response': 65,
      'Security Operations': 71,
      'Governance & Oversight': 68,
      'Operational Discipline': 72,
      'Cyber Resilience': 55,
    },
    lastSubmission: '2026-09-24',
    analystCount: 22,
    alertCount: 11200,
    caseCount: 318,
    status: 'Active',
    topFinding: 'NS-03 Dark hours — 4h window 02:00–06:00 IST with near-zero activity',
  },
  {
    id: 'cse-005',
    name: 'AIIMS Network Security',
    sector: 'Health',
    sai: 68,
    saiDelta: +2,
    confidence: 'Medium',
    drs: 0.75,
    findings: { new: 3, persisting: 6, resolved: 4 },
    domainScores: {
      'Threat Detection': 72,
      Investigation: 65,
      Escalation: 58,
      'Incident Response': 79,
      'Security Operations': 63,
      'Governance & Oversight': 70,
      'Operational Discipline': 66,
      'Cyber Resilience': 74,
    },
    lastSubmission: '2026-09-26',
    analystCount: 9,
    alertCount: 6780,
    caseCount: 198,
    status: 'Active',
    topFinding: 'EG-13 Late CERT-In notification — 3 reportable incidents exceeded 6h window',
  },
  {
    id: 'cse-006',
    name: 'Bharti Telecom SOC',
    sector: 'Telecom',
    sai: 64,
    saiDelta: -6,
    confidence: 'High',
    drs: 0.92,
    findings: { new: 2, persisting: 8, resolved: 5 },
    domainScores: {
      'Threat Detection': 88,
      Investigation: 60,
      Escalation: 72,
      'Incident Response': 67,
      'Security Operations': 82,
      'Governance & Oversight': 58,
      'Operational Discipline': 61,
      'Cyber Resilience': 77,
    },
    lastSubmission: '2026-09-27',
    analystCount: 35,
    alertCount: 31400,
    caseCount: 820,
    status: 'Active',
    topFinding:
      'EG-02 Acknowledged-not-investigated — 127 alerts closed without investigation step',
  },
  {
    id: 'cse-007',
    name: 'Ministry of Finance CISO',
    sector: 'Government',
    sai: 58,
    saiDelta: +1,
    confidence: 'Medium',
    drs: 0.82,
    findings: { new: 2, persisting: 5, resolved: 2 },
    domainScores: {
      'Threat Detection': 55,
      Investigation: 62,
      Escalation: 70,
      'Incident Response': 75,
      'Security Operations': 60,
      'Governance & Oversight': 80,
      'Operational Discipline': 58,
      'Cyber Resilience': 65,
    },
    lastSubmission: '2026-09-25',
    analystCount: 14,
    alertCount: 5420,
    caseCount: 167,
    status: 'Active',
    topFinding: 'NS-08 Tactic coverage — 6 of 12 expected ATT&CK tactics absent',
  },
  {
    id: 'cse-008',
    name: 'Adani Ports Cyber Ops',
    sector: 'Transport',
    sai: 54,
    saiDelta: -9,
    confidence: 'High',
    drs: 0.89,
    findings: { new: 1, persisting: 6, resolved: 3 },
    domainScores: {
      'Threat Detection': 62,
      Investigation: 58,
      Escalation: 65,
      'Incident Response': 71,
      'Security Operations': 55,
      'Governance & Oversight': 60,
      'Operational Discipline': 68,
      'Cyber Resilience': 58,
    },
    lastSubmission: '2026-09-26',
    analystCount: 16,
    alertCount: 8900,
    caseCount: 241,
    status: 'Active',
    topFinding: 'EG-08 Impossible throughput — analyst id-a047 closed 94 cases in 6h shift',
  },
  {
    id: 'cse-009',
    name: 'NTPC Central SOC',
    sector: 'Power & Energy',
    sai: 51,
    saiDelta: +3,
    confidence: 'Medium',
    drs: 0.77,
    findings: { new: 2, persisting: 3, resolved: 1 },
    domainScores: {
      'Threat Detection': 58,
      Investigation: 55,
      Escalation: 62,
      'Incident Response': 60,
      'Security Operations': 65,
      'Governance & Oversight': 52,
      'Operational Discipline': 59,
      'Cyber Resilience': 56,
    },
    lastSubmission: '2026-09-23',
    analystCount: 20,
    alertCount: 12400,
    caseCount: 356,
    status: 'Active',
    topFinding: 'NS-04 Volume collapse — weekly alert volume dropped 68% in week 38',
  },
  {
    id: 'cse-010',
    name: 'IndusInd Bank ISOC',
    sector: 'BFSI',
    sai: 47,
    saiDelta: -2,
    confidence: 'High',
    drs: 0.96,
    findings: { new: 1, persisting: 4, resolved: 6 },
    domainScores: {
      'Threat Detection': 78,
      Investigation: 70,
      Escalation: 74,
      'Incident Response': 82,
      'Security Operations': 75,
      'Governance & Oversight': 71,
      'Operational Discipline': 73,
      'Cyber Resilience': 80,
    },
    lastSubmission: '2026-09-27',
    analystCount: 24,
    alertCount: 18600,
    caseCount: 489,
    status: 'Active',
    topFinding: 'EG-10 Zero reopen rate — 0.0% vs peer median 2.1%',
  },
  {
    id: 'cse-011',
    name: 'BSNL Network Security',
    sector: 'Telecom',
    sai: 44,
    saiDelta: 0,
    confidence: 'Medium',
    drs: 0.71,
    findings: { new: 1, persisting: 3, resolved: 2 },
    domainScores: {
      'Threat Detection': 65,
      Investigation: 60,
      Escalation: 58,
      'Incident Response': 62,
      'Security Operations': 70,
      'Governance & Oversight': 55,
      'Operational Discipline': 64,
      'Cyber Resilience': 60,
    },
    lastSubmission: '2026-09-22',
    analystCount: 11,
    alertCount: 7200,
    caseCount: 209,
    status: 'Active',
    topFinding: 'AN-01 Unexpected deviation — note entropy 2.1 bits vs peer median 4.8',
  },
  {
    id: 'cse-012',
    name: 'Eastern Railway Cyber',
    sector: 'Transport',
    sai: 38,
    saiDelta: +5,
    confidence: 'Medium',
    drs: 0.74,
    findings: { new: 2, persisting: 2, resolved: 3 },
    domainScores: {
      'Threat Detection': 55,
      Investigation: 50,
      Escalation: 60,
      'Incident Response': 58,
      'Security Operations': 62,
      'Governance & Oversight': 65,
      'Operational Discipline': 55,
      'Cyber Resilience': 52,
    },
    lastSubmission: '2026-09-24',
    analystCount: 8,
    alertCount: 4100,
    caseCount: 124,
    status: 'Active',
    topFinding: 'NS-05 Missing workflow records — 47 High cases with no case_events',
  },
  {
    id: 'cse-013',
    name: 'DRDO Cyber Intelligence',
    sector: 'Strategic',
    sai: 0,
    saiDelta: 0,
    confidence: 'Abstained',
    drs: 0.43,
    findings: { new: 0, persisting: 0, resolved: 0 },
    domainScores: {
      'Threat Detection': 0,
      Investigation: 0,
      Escalation: 0,
      'Incident Response': 0,
      'Security Operations': 0,
      'Governance & Oversight': 0,
      'Operational Discipline': 0,
      'Cyber Resilience': 0,
    },
    lastSubmission: '2026-09-20',
    analystCount: 7,
    alertCount: 2100,
    caseCount: 61,
    status: 'Abstained',
    topFinding: 'Insufficient evidence — DRS 0.43 below threshold 0.60',
  },
  {
    id: 'cse-014',
    name: 'HAL Security Operations',
    sector: 'Strategic',
    sai: 0,
    saiDelta: 0,
    confidence: 'Abstained',
    drs: 0.38,
    findings: { new: 0, persisting: 0, resolved: 0 },
    domainScores: {
      'Threat Detection': 0,
      Investigation: 0,
      Escalation: 0,
      'Incident Response': 0,
      'Security Operations': 0,
      'Governance & Oversight': 0,
      'Operational Discipline': 0,
      'Cyber Resilience': 0,
    },
    lastSubmission: '2026-09-18',
    analystCount: 5,
    alertCount: 890,
    caseCount: 28,
    status: 'Abstained',
    topFinding: 'Insufficient evidence — DRS 0.38 below threshold 0.60',
  },
];

export interface Finding {
  id: string;
  entityId: string;
  detectorId: string;
  detectorName: string;
  category: 'execution_gap' | 'negative_space' | 'anomaly' | 'integrity';
  domains: string[];
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  strength: number;
  confidence: number;
  status: 'New' | 'Persisting' | 'Resolved' | 'Chronic';
  summary: string;
  evidenceCount: number;
  createdAt: string;
}

export const FINDINGS: Finding[] = [
  {
    id: 'find-001',
    entityId: 'cse-001',
    detectorId: 'EG-06',
    detectorName: 'SLA-threshold bunching',
    category: 'execution_gap',
    domains: ['Operational Discipline', 'Governance & Oversight'],
    severity: 'Critical',
    strength: 0.87,
    confidence: 0.92,
    status: 'New',
    summary:
      'Excess mass b=0.74 in [0.9T, T] window for Critical tier. Bootstrap 95% CI excludes 0. Indicates systematic gaming of SLA metrics.',
    evidenceCount: 342,
    createdAt: '2026-09-27',
  },
  {
    id: 'find-002',
    entityId: 'cse-002',
    detectorId: 'NS-01',
    detectorName: 'Silent critical assets',
    category: 'negative_space',
    domains: ['Threat Detection', 'Cyber Resilience'],
    severity: 'Critical',
    strength: 0.91,
    confidence: 0.88,
    status: 'Persisting',
    summary:
      '14 OT assets with criticality ≥4 produced zero alerts over 90 days. Peer comparable assets averaged 23 alerts/asset.',
    evidenceCount: 14,
    createdAt: '2026-09-25',
  },
  {
    id: 'find-003',
    entityId: 'cse-003',
    detectorId: 'EG-04',
    detectorName: 'Template investigations',
    category: 'execution_gap',
    domains: ['Investigation', 'Operational Discipline'],
    severity: 'High',
    strength: 0.79,
    confidence: 0.85,
    status: 'Chronic',
    summary:
      'MinHash LSH found 34% of High-severity case notes cluster at Jaccard ≥0.85. Peer p90 is 8%. 47 distinct case IDs affected.',
    evidenceCount: 47,
    createdAt: '2026-09-26',
  },
  {
    id: 'find-004',
    entityId: 'cse-004',
    detectorId: 'NS-03',
    detectorName: 'Dark hours',
    category: 'negative_space',
    domains: ['Security Operations', 'Threat Detection'],
    severity: 'High',
    strength: 0.82,
    confidence: 0.76,
    status: 'New',
    summary:
      '4-hour contiguous window 02:00–06:00 IST shows alert rate 97% below entity expectation and 94% below sector peers. No analyst shift change logged.',
    evidenceCount: 28,
    createdAt: '2026-09-24',
  },
  {
    id: 'find-005',
    entityId: 'cse-005',
    detectorId: 'EG-13',
    detectorName: 'Late CERT-In notification',
    category: 'execution_gap',
    domains: ['Incident Response', 'Governance & Oversight'],
    severity: 'Critical',
    strength: 0.94,
    confidence: 0.98,
    status: 'New',
    summary:
      '3 reportable incidents exceeded the 6-hour CERT-In notification window. Case IDs: case-1847, case-1901, case-2034. Max delay: 19h 22m.',
    evidenceCount: 3,
    createdAt: '2026-09-26',
  },
  {
    id: 'find-006',
    entityId: 'cse-006',
    detectorId: 'EG-02',
    detectorName: 'Acknowledged not investigated',
    category: 'execution_gap',
    domains: ['Investigation'],
    severity: 'High',
    strength: 0.76,
    confidence: 0.91,
    status: 'Persisting',
    summary:
      '127 alerts acknowledged then closed with zero investigation_step or evidence_attached events. 89 were severity High or above.',
    evidenceCount: 127,
    createdAt: '2026-09-27',
  },
  {
    id: 'find-007',
    entityId: 'cse-008',
    detectorId: 'EG-08',
    detectorName: 'Impossible throughput',
    category: 'execution_gap',
    domains: ['Security Operations', 'Investigation'],
    severity: 'High',
    strength: 0.88,
    confidence: 0.83,
    status: 'New',
    summary:
      'Analyst a-047 closed 94 cases in a 6-hour shift. Minimum plausible effort ratio: 3.12x. Shift minutes: 360, required effort: 1124 min.',
    evidenceCount: 94,
    createdAt: '2026-09-26',
  },
  {
    id: 'find-008',
    entityId: 'cse-009',
    detectorId: 'NS-04',
    detectorName: 'Volume collapse',
    category: 'negative_space',
    domains: ['Threat Detection', 'Cyber Resilience'],
    severity: 'High',
    strength: 0.85,
    confidence: 0.79,
    status: 'New',
    summary:
      'CUSUM and EWMA both flag 68% drop in weekly alert volume starting week 38 (2026-09-14). No asset decommissioning recorded. Possible disabled rule or dead log pipeline.',
    evidenceCount: 7,
    createdAt: '2026-09-23',
  },
];

export interface SectorHeat {
  sector: Sector;
  entityCount: number;
  avgSai: number;
  criticalFindings: number;
  abstained: number;
  domainScores: Record<string, number>;
}

export const SECTOR_HEAT: SectorHeat[] = [
  {
    sector: 'Power & Energy',
    entityCount: 4,
    avgSai: 69,
    criticalFindings: 6,
    abstained: 0,
    domainScores: {
      'Threat Detection': 68,
      Investigation: 73,
      Escalation: 73,
      'Incident Response': 65,
      'Security Operations': 76,
      'Governance & Oversight': 64,
      'Operational Discipline': 77,
      'Cyber Resilience': 69,
    },
  },
  {
    sector: 'BFSI',
    entityCount: 4,
    avgSai: 61,
    criticalFindings: 4,
    abstained: 0,
    domainScores: {
      'Threat Detection': 80,
      Investigation: 70,
      Escalation: 71,
      'Incident Response': 85,
      'Security Operations': 76,
      'Governance & Oversight': 72,
      'Operational Discipline': 79,
      'Cyber Resilience': 79,
    },
  },
  {
    sector: 'Telecom',
    entityCount: 4,
    avgSai: 54,
    criticalFindings: 3,
    abstained: 0,
    domainScores: {
      'Threat Detection': 76,
      Investigation: 60,
      Escalation: 65,
      'Incident Response': 64,
      'Security Operations': 76,
      'Governance & Oversight': 56,
      'Operational Discipline': 62,
      'Cyber Resilience': 68,
    },
  },
  {
    sector: 'Transport',
    entityCount: 4,
    avgSai: 57,
    criticalFindings: 5,
    abstained: 0,
    domainScores: {
      'Threat Detection': 60,
      Investigation: 65,
      Escalation: 72,
      'Incident Response': 67,
      'Security Operations': 62,
      'Governance & Oversight': 69,
      'Operational Discipline': 67,
      'Cyber Resilience': 56,
    },
  },
  {
    sector: 'Government',
    entityCount: 4,
    avgSai: 45,
    criticalFindings: 2,
    abstained: 0,
    domainScores: {
      'Threat Detection': 52,
      Investigation: 58,
      Escalation: 65,
      'Incident Response': 70,
      'Security Operations': 57,
      'Governance & Oversight': 75,
      'Operational Discipline': 55,
      'Cyber Resilience': 60,
    },
  },
  {
    sector: 'Health',
    entityCount: 4,
    avgSai: 52,
    criticalFindings: 3,
    abstained: 0,
    domainScores: {
      'Threat Detection': 68,
      Investigation: 60,
      Escalation: 55,
      'Incident Response': 74,
      'Security Operations': 60,
      'Governance & Oversight': 66,
      'Operational Discipline': 62,
      'Cyber Resilience': 70,
    },
  },
  {
    sector: 'Strategic',
    entityCount: 4,
    avgSai: 36,
    criticalFindings: 1,
    abstained: 2,
    domainScores: {
      'Threat Detection': 30,
      Investigation: 37,
      Escalation: 39,
      'Incident Response': 32,
      'Security Operations': 35,
      'Governance & Oversight': 34,
      'Operational Discipline': 36,
      'Cyber Resilience': 27,
    },
  },
];

export interface RunStatus {
  id: string;
  startedAt: string;
  completedAt: string | null;
  status: 'Running' | 'Completed' | 'Failed';
  entitiesProcessed: number;
  findingsGenerated: number;
  detectorVersion: string;
  blockHeight: number | null;
  progressPercent: number;
}

export const CURRENT_RUN: RunStatus = {
  id: 'run-2026-09-28-001',
  startedAt: '2026-09-28T12:31:00Z',
  completedAt: '2026-09-28T12:47:22Z',
  status: 'Completed',
  entitiesProcessed: 26,
  findingsGenerated: 143,
  detectorVersion: 'v2.4.1',
  blockHeight: 847,
  progressPercent: 100,
};

// Claims vs Evidence data for Entity Dossier
export interface Claim {
  id: string;
  entityId: string;
  metric: string;
  declared: string;
  recomputed: string | null;
  status: 'Supported' | 'Contradicted' | 'Unverifiable';
  delta?: string;
  evidenceCount?: number;
}

export const CLAIMS: Claim[] = [
  {
    id: 'claim-001',
    entityId: 'cse-001',
    metric: 'Critical alert escalation rate',
    declared: '≥95% within 15 min',
    recomputed: '61.4% within 15 min',
    status: 'Contradicted',
    delta: '-33.6 pp',
    evidenceCount: 214,
  },
  {
    id: 'claim-002',
    entityId: 'cse-001',
    metric: '24×7 SOC coverage',
    declared: 'Continuous monitoring',
    recomputed: 'Gap detected 03:00–05:00 IST',
    status: 'Contradicted',
    delta: '2h gap/day avg',
    evidenceCount: 28,
  },
  {
    id: 'claim-003',
    entityId: 'cse-001',
    metric: 'MTTR for High severity',
    declared: '< 4 hours',
    recomputed: '6h 14m (median)',
    status: 'Contradicted',
    delta: '+2h 14m',
    evidenceCount: 187,
  },
  {
    id: 'claim-004',
    entityId: 'cse-001',
    metric: 'Root cause documented',
    declared: '100% of High cases',
    recomputed: '78.3% of High cases',
    status: 'Contradicted',
    delta: '-21.7 pp',
    evidenceCount: 143,
  },
  {
    id: 'claim-005',
    entityId: 'cse-001',
    metric: 'False positive rate',
    declared: '< 10%',
    recomputed: '8.7%',
    status: 'Supported',
    evidenceCount: 14820,
  },
  {
    id: 'claim-006',
    entityId: 'cse-001',
    metric: 'Crown jewel asset onboarding',
    declared: '100% onboarded',
    recomputed: null,
    status: 'Unverifiable',
  },
  {
    id: 'claim-007',
    entityId: 'cse-001',
    metric: 'MTTA for Critical',
    declared: '< 5 min',
    recomputed: '4m 32s (median)',
    status: 'Supported',
    evidenceCount: 412,
  },
  {
    id: 'claim-008',
    entityId: 'cse-001',
    metric: 'Analyst certification',
    declared: 'All analysts SANS-certified',
    recomputed: null,
    status: 'Unverifiable',
  },
];

// Domain radar data for Entity Dossier
export const ENTITY_RADAR_DATA = [
  { domain: 'Threat\nDetect', entity: 78, peer: 70 },
  { domain: 'Investig-\nation', entity: 92, peer: 68 },
  { domain: 'Escalation', entity: 84, peer: 72 },
  { domain: 'Incident\nResponse', entity: 71, peer: 74 },
  { domain: 'Sec Ops', entity: 88, peer: 71 },
  { domain: 'Governance', entity: 76, peer: 69 },
  { domain: 'Op Discipline', entity: 95, peer: 65 },
  { domain: 'Resilience', entity: 82, peer: 73 },
];

// Heatmap data for Entity Dossier (hour x weekday alert counts)
export const HEATMAP_DATA: Array<{ hour: number; day: number; value: number }> = [];
const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const baseValues = [
  [12, 8, 6, 4, 2, 1, 2, 4, 18, 32, 45, 52, 48, 40, 38, 42, 50, 55, 48, 38, 28, 20, 16, 14],
  [10, 7, 5, 3, 2, 1, 2, 5, 20, 35, 48, 54, 50, 42, 40, 44, 52, 58, 50, 40, 30, 22, 17, 12],
  [11, 8, 6, 4, 2, 1, 2, 4, 19, 33, 46, 53, 49, 41, 39, 43, 51, 56, 49, 39, 29, 21, 16, 13],
  [13, 9, 7, 5, 3, 1, 2, 5, 21, 36, 49, 55, 51, 43, 41, 45, 53, 59, 51, 41, 31, 23, 18, 14],
  [14, 10, 8, 5, 3, 1, 2, 5, 22, 37, 50, 56, 52, 44, 42, 46, 54, 60, 52, 42, 32, 24, 19, 15],
  [6, 4, 3, 2, 1, 1, 1, 3, 12, 18, 24, 28, 26, 22, 20, 22, 26, 30, 26, 20, 14, 10, 8, 7],
  [5, 3, 2, 1, 1, 1, 1, 2, 10, 15, 20, 24, 22, 18, 16, 18, 22, 25, 22, 16, 12, 8, 6, 5],
];
// Inject dark hours (02:00-06:00)
for (let d = 0; d < 7; d++) {
  for (let h = 0; h < 24; h++) {
    let v = baseValues[d][h];
    if (h >= 2 && h <= 5) v = Math.max(0, Math.floor(v * 0.05));
    HEATMAP_DATA.push({ hour: h, day: d, value: v });
  }
}

// SAI trend data for Command Center
export const SAI_TREND = [
  { cycle: 'Cycle 1', avgSai: 42, criticalCount: 3 },
  { cycle: 'Cycle 2', avgSai: 47, criticalCount: 4 },
  { cycle: 'Cycle 3', avgSai: 51, criticalCount: 5 },
  { cycle: 'Cycle 4', avgSai: 55, criticalCount: 6 },
  { cycle: 'Cycle 5', avgSai: 52, criticalCount: 5 },
  { cycle: 'Cycle 6', avgSai: 58, criticalCount: 7 },
  { cycle: 'Cycle 7', avgSai: 63, criticalCount: 8 },
  { cycle: 'Cycle 8 (current)', avgSai: 61, criticalCount: 7 },
];

// Domain heatmap for Command Center (sector x domain)
export const DOMAIN_HEAT: Array<{ sector: string; domain: string; score: number }> = [];
SECTOR_HEAT.forEach((s) => {
  Object.entries(s.domainScores).forEach(([domain, score]) => {
    DOMAIN_HEAT.push({ sector: s.sector, domain, score });
  });
});
