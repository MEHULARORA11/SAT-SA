'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { BookOpen, ChevronDown, ChevronUp, Filter } from 'lucide-react';

interface Detector {
  id: string;
  name: string;
  category: 'execution_gap' | 'negative_space' | 'anomaly' | 'integrity';
  domains: string[];
  formula: string;
  threshold: string;
  rationale: string;
  requires: string[];
  precision: number | null;
  recall: number | null;
  version: string;
}

const DETECTORS: Detector[] = [
  {
    id: 'EG-01',
    name: 'Fast Closure',
    category: 'execution_gap',
    domains: ['Investigation', 'Operational Discipline'],
    formula: 'severity ≥ High AND close_time < max(5 min, sector_p5) AND investigation_steps ≤ 1',
    threshold: 'sector p5 for severity tier',
    rationale:
      'Legitimate fast closures exist (scanner noise, known-benign auto-close). Hard negatives included in validation.',
    requires: ['alerts', 'case_events'],
    precision: 0.84,
    recall: 0.91,
    version: 'v2.4.1',
  },
  {
    id: 'EG-02',
    name: 'Acknowledged Not Investigated',
    category: 'execution_gap',
    domains: ['Investigation'],
    formula:
      'ack_event=true AND investigation_step_count=0 AND evidence_attached_count=0 AND status=closed',
    threshold: 'Any occurrence flagged; rate vs peer p90',
    rationale: 'Acknowledgement without investigation is a direct execution gap.',
    requires: ['alerts', 'case_events'],
    precision: 0.91,
    recall: 0.88,
    version: 'v2.4.1',
  },
  {
    id: 'EG-03',
    name: 'Critical Without Escalation',
    category: 'execution_gap',
    domains: ['Escalation', 'Governance & Oversight'],
    formula: 'severity=Critical AND policy_requires_escalation=true AND escalation_records=0',
    threshold: 'Policy matrix from config/policy/default.yaml',
    rationale: 'Policy-mandated escalation paths must be followed for Critical severity.',
    requires: ['alerts', 'escalations'],
    precision: 0.96,
    recall: 0.94,
    version: 'v2.4.1',
  },
  {
    id: 'EG-04',
    name: 'Template Investigations',
    category: 'execution_gap',
    domains: ['Investigation', 'Operational Discipline'],
    formula:
      'MinHash(128 perm, 3-word shingles) + LSH; Jaccard ≥ 0.85 across ≥ 20 alerts; template_share > peer_p90',
    threshold: 'Jaccard ≥ 0.85, cluster size ≥ 20, share > peer p90',
    rationale: 'Template notes indicate copy-paste investigations without genuine analysis.',
    requires: ['case_events'],
    precision: 0.79,
    recall: 0.82,
    version: 'v2.4.1',
  },
  {
    id: 'EG-05',
    name: 'Recurring Alerts No Root Cause',
    category: 'execution_gap',
    domains: ['Incident Response', 'Cyber Resilience'],
    formula:
      'same (asset, rule) ≥ 5 times in 30d AND disposition ∈ {benign, resolved, FP} AND root_cause="" AND remediation_ref=""',
    threshold: '≥5 recurrences in 30-day window',
    rationale: 'Recurring alerts without root cause indicate systemic unresolved issues.',
    requires: ['alerts', 'cases'],
    precision: 0.88,
    recall: 0.76,
    version: 'v2.4.1',
  },
  {
    id: 'EG-06',
    name: 'SLA-Threshold Bunching',
    category: 'execution_gap',
    domains: ['Operational Discipline', 'Governance & Oversight'],
    formula:
      'Polynomial fit (order 5) on time-to-close histogram; excess mass b = (observed - fitted) / fitted in [0.9T, T]; bootstrap 95% CI excludes 0',
    threshold: 'b ≥ 0.5 AND bootstrap CI excludes 0',
    rationale:
      'Metric gaming: closures bunched just before SLA deadline indicate artificial compliance.',
    requires: ['alerts', 'cases'],
    precision: 0.82,
    recall: 0.71,
    version: 'v2.4.1',
  },
  {
    id: 'EG-07',
    name: 'Bulk Sweep Closures',
    category: 'execution_gap',
    domains: ['Operational Discipline'],
    formula: '≥30 closures by one actor in 10 min OR ≥10 in 60s AND median_note_length < peer_p25',
    threshold: '30/10min or 10/60s with short notes',
    rationale: 'Bulk closures with minimal notes indicate superficial processing.',
    requires: ['alerts', 'case_events'],
    precision: 0.93,
    recall: 0.87,
    version: 'v2.4.1',
  },
  {
    id: 'EG-08',
    name: 'Impossible Throughput',
    category: 'execution_gap',
    domains: ['Security Operations', 'Investigation'],
    formula: 'sum(min_plausible_effort[case]) / shift_minutes > 1.25 per analyst per shift',
    threshold: 'Effort ratio > 1.25 (configurable)',
    rationale: 'Physical impossibility of closing cases within minimum plausible effort time.',
    requires: ['cases', 'analysts'],
    precision: 0.97,
    recall: 0.95,
    version: 'v2.4.1',
  },
  {
    id: 'EG-13',
    name: 'Late CERT-In Notification',
    category: 'execution_gap',
    domains: ['Incident Response', 'Governance & Oversight'],
    formula:
      'reportable=true AND (external_notified_at - detected_at) > 6h OR external_notified_at IS NULL',
    threshold: '6 hours (CERT-In Directions 28 Apr 2022, configurable)',
    rationale: 'Mandatory regulatory notification window per CERT-In Directions.',
    requires: ['cases'],
    precision: 1.0,
    recall: 1.0,
    version: 'v2.4.1',
  },
  {
    id: 'NS-01',
    name: 'Silent Critical Assets',
    category: 'negative_space',
    domains: ['Threat Detection', 'Cyber Resilience'],
    formula:
      'Gamma-Poisson empirical-Bayes: fit prior from peer rates (alerts/asset-day); P(zero | posterior) < 0.01 for criticality ≥ 4 assets',
    threshold: 'P(zero | expected) < 0.01',
    rationale: 'Critical assets should generate telemetry. Silence indicates monitoring gap.',
    requires: ['alerts', 'assets'],
    precision: 0.78,
    recall: 0.89,
    version: 'v2.4.1',
  },
  {
    id: 'NS-02',
    name: 'Missing Expected Categories',
    category: 'negative_space',
    domains: ['Threat Detection'],
    formula: 'Gamma-Poisson rate model per sector-profile category; P(zero | expected) < 0.01',
    threshold: 'P(zero | expected) < 0.01 per category',
    rationale: 'Sector profiles define expected alert categories. Absence indicates coverage gap.',
    requires: ['alerts'],
    precision: 0.71,
    recall: 0.83,
    version: 'v2.4.1',
  },
  {
    id: 'NS-03',
    name: 'Dark Hours',
    category: 'negative_space',
    domains: ['Security Operations', 'Threat Detection'],
    formula:
      'Contiguous ≥4h hour-of-week windows with alert_count << entity_expectation AND peer_expectation',
    threshold: '≥4h contiguous, P(count | expected) < 0.01',
    rationale: 'Monitoring gaps during specific hours indicate coverage failures.',
    requires: ['alerts'],
    precision: 0.85,
    recall: 0.79,
    version: 'v2.4.1',
  },
  {
    id: 'NS-04',
    name: 'Volume Collapse',
    category: 'negative_space',
    domains: ['Threat Detection', 'Cyber Resilience'],
    formula:
      'CUSUM (k=0.5σ, h=5σ) AND EWMA (λ=0.2, L=3) on weekly volume; drop > 50% with no decommissioning',
    threshold: 'CUSUM h=5σ AND EWMA L=3, drop > 50%',
    rationale:
      'Sudden volume drops without decommissioning indicate disabled rules or dead pipelines.',
    requires: ['alerts', 'assets'],
    precision: 0.88,
    recall: 0.84,
    version: 'v2.4.1',
  },
  {
    id: 'AN-01',
    name: 'Signal Discovery',
    category: 'anomaly',
    domains: ['Threat Detection', 'Investigation', 'Security Operations'],
    formula:
      '~200 metrics per entity; modified z-score = 0.6745 × (x − median) / MAD; BH-FDR q=0.05; minimum effect size required',
    threshold: '|z| > 3.5 AND BH-FDR q=0.05 survivor',
    rationale:
      'Finds indicators no rule covers by testing all computable metrics against peer cohort.',
    requires: ['alerts', 'cases', 'case_events'],
    precision: null,
    recall: null,
    version: 'v2.4.1',
  },
  {
    id: 'AN-02',
    name: 'Isolation Forest',
    category: 'anomaly',
    domains: ['Threat Detection', 'Security Operations'],
    formula:
      '200 trees, subsample 256, fixed seed; feature ablation for explanation (replace feature with cohort median, recompute score delta)',
    threshold: 'Score > cohort p95',
    rationale: 'Entity-level anomaly detection across all feature vectors simultaneously.',
    requires: ['alerts', 'cases'],
    precision: null,
    recall: null,
    version: 'v2.4.1',
  },
  {
    id: 'NS-12',
    name: 'Retroactive Modification',
    category: 'integrity',
    domains: ['Governance & Oversight'],
    formula:
      'Compare per-record HMAC hashes between successive sealed submissions; flag records where historical fields changed after sealing',
    threshold: 'Any hash mismatch on sealed historical fields',
    rationale:
      'Post-sealing modification of historical records indicates data integrity violation.',
    requires: ['alerts', 'cases'],
    precision: 1.0,
    recall: 1.0,
    version: 'v2.4.1',
  },
];

const CATEGORY_LABELS: Record<string, string> = {
  execution_gap: 'Execution Gap',
  negative_space: 'Negative Space',
  anomaly: 'Anomaly',
  integrity: 'Integrity',
};

export default function MethodologyPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = ['All', 'execution_gap', 'negative_space', 'anomaly', 'integrity'];
  const filtered = DETECTORS.filter(
    (d) => categoryFilter === 'All' || d.category === categoryFilter
  );

  return (
    <AppLayout title="Methodology" subtitle={`${DETECTORS.length} detectors · v2.4.1`}>
      <div className="px-6 py-5 space-y-5 max-w-screen-2xl mx-auto">
        {/* Overview */}
        <div className="surface-card p-4">
          <div className="flex items-start gap-3">
            <BookOpen size={16} className="text-accent shrink-0 mt-0.5" />
            <div>
              <h2 className="text-13 font-600 text-text mb-2">Detector Registry</h2>
              <p className="text-12 text-text-dim mb-3">
                All detectors are deterministic and reproducible. Every finding carries: severity,
                strength (0–1 effect size), confidence (data quality × sample-size sufficiency using
                Wilson intervals and shrinkage), the statistic and threshold used, peer context,
                evidence record IDs, limitations, and a suggested review action.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  {
                    label: 'Execution Gap',
                    count: DETECTORS.filter((d) => d.category === 'execution_gap').length,
                    cls: 'badge-warning',
                  },
                  {
                    label: 'Negative Space',
                    count: DETECTORS.filter((d) => d.category === 'negative_space').length,
                    cls: 'badge-info',
                  },
                  {
                    label: 'Anomaly',
                    count: DETECTORS.filter((d) => d.category === 'anomaly').length,
                    cls: 'badge-neutral',
                  },
                  {
                    label: 'Integrity',
                    count: DETECTORS.filter((d) => d.category === 'integrity').length,
                    cls: 'badge-danger',
                  },
                ].map((cat) => (
                  <div key={`meth-cat-${cat.label}`} className="flex items-center gap-2">
                    <span className={cat.cls}>{cat.count}</span>
                    <span className="text-12 text-text-dim">{cat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter size={12} className="text-text-dimmer" />
          <div className="flex items-center gap-1 bg-surface-2 border border-border rounded p-0.5">
            {categories.map((c) => (
              <button
                key={`meth-cat-btn-${c}`}
                onClick={() => setCategoryFilter(c)}
                className={`text-12 px-2.5 py-1 rounded transition-all duration-120 ${categoryFilter === c ? 'bg-accent-bg text-accent border border-accent-dim' : 'text-text-dimmer hover:text-text'}`}
              >
                {c === 'All' ? 'All' : CATEGORY_LABELS[c]}
              </button>
            ))}
          </div>
          <span className="text-11 text-text-dimmer ml-2">Showing {filtered.length} detectors</span>
        </div>

        {/* Detector list */}
        <div className="space-y-2">
          {filtered.map((det) => (
            <div key={`det-${det.id}`} className="surface-card">
              <button
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-surface-2 transition-colors duration-120 text-left"
                onClick={() => setExpanded(expanded === det.id ? null : det.id)}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-12 text-accent font-700 w-12 shrink-0">
                    {det.id}
                  </span>
                  <div>
                    <p className="text-13 font-600 text-text">{det.name}</p>
                    <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                      <span
                        className={`${det.category === 'execution_gap' ? 'badge-warning' : det.category === 'negative_space' ? 'badge-info' : det.category === 'anomaly' ? 'badge-neutral' : 'badge-danger'}`}
                      >
                        {CATEGORY_LABELS[det.category]}
                      </span>
                      {det.domains.map((d) => (
                        <span key={`det-dom-${det.id}-${d}`} className="badge-neutral">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  {det.precision !== null && (
                    <div className="text-right">
                      <p className="text-10 text-text-dimmer">Precision / Recall</p>
                      <p className="font-mono text-11 text-text-dim tabular-nums">
                        {(det.precision * 100).toFixed(0)}% /{' '}
                        {det.recall !== null ? (det.recall * 100).toFixed(0) : '—'}%
                      </p>
                    </div>
                  )}
                  <span className="font-mono text-10 text-text-dimmer">{det.version}</span>
                  {expanded === det.id ? (
                    <ChevronUp size={14} className="text-text-dimmer" />
                  ) : (
                    <ChevronDown size={14} className="text-text-dimmer" />
                  )}
                </div>
              </button>

              {expanded === det.id && (
                <div className="border-t border-border px-4 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-11 font-600 text-text-dimmer uppercase tracking-wider mb-1.5">
                      Formula / Logic
                    </p>
                    <p className="font-mono text-11 text-text-dim bg-surface-2 rounded p-2.5 border border-border">
                      {det.formula}
                    </p>
                  </div>
                  <div>
                    <p className="text-11 font-600 text-text-dimmer uppercase tracking-wider mb-1.5">
                      Threshold
                    </p>
                    <p className="text-12 text-text-dim">{det.threshold}</p>
                    <p className="text-11 font-600 text-text-dimmer uppercase tracking-wider mt-3 mb-1.5">
                      Rationale
                    </p>
                    <p className="text-12 text-text-dim">{det.rationale}</p>
                  </div>
                  <div>
                    <p className="text-11 font-600 text-text-dimmer uppercase tracking-wider mb-1.5">
                      Required Tables / Fields
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {det.requires.map((r) => (
                        <span
                          key={`req-${det.id}-${r}`}
                          className="font-mono text-11 px-2 py-0.5 bg-surface-2 border border-border rounded text-text-dim"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-11 font-600 text-text-dimmer uppercase tracking-wider mb-1.5">
                      Validation (Synthetic Ground Truth)
                    </p>
                    {det.precision !== null ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-11 text-text-dimmer w-16">Precision:</span>
                          <div className="flex-1 h-1.5 bg-surface-3 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-success rounded-full"
                              style={{ width: `${det.precision * 100}%` }}
                            />
                          </div>
                          <span className="font-mono text-11 text-success tabular-nums">
                            {(det.precision * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-11 text-text-dimmer w-16">Recall:</span>
                          <div className="flex-1 h-1.5 bg-surface-3 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-accent rounded-full"
                              style={{ width: `${(det.recall ?? 0) * 100}%` }}
                            />
                          </div>
                          <span className="font-mono text-11 text-accent tabular-nums">
                            {det.recall !== null ? (det.recall * 100).toFixed(0) : '—'}%
                          </span>
                        </div>
                        <p className="text-10 text-text-dimmer mt-1">
                          Computed from synthetic ground truth. Hard negatives included. No real
                          NCIIPC data used.
                        </p>
                      </div>
                    ) : (
                      <p className="text-12 text-text-dimmer italic">
                        Precision/recall not applicable for exploratory detectors (AN-01, AN-02).
                        Validated by expert review of flagged deviations.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
