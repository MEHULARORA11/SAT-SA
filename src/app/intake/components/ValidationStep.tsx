'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { type UploadedFile, type MappingRow } from './IntakeWizard';

interface Props {
  file: UploadedFile;
  mappings: MappingRow[];
  onNext: () => void;
  onBack: () => void;
}

interface ValidationCheck {
  id: string;
  label: string;
  status: 'pass' | 'fail' | 'warn' | 'running';
  detail: string;
  count?: number;
  examples?: string[];
}

interface NullRateRow {
  id: string;
  field: string;
  nullRate: number;
  peerMedian: number;
  flagged: boolean;
}

const NULL_RATES: NullRateRow[] = [
  { id: 'nr-001', field: 'root_cause', nullRate: 0.94, peerMedian: 0.28, flagged: true },
  { id: 'nr-002', field: 'remediation_ref', nullRate: 0.91, peerMedian: 0.31, flagged: true },
  { id: 'nr-003', field: 'external_notified_at', nullRate: 0.87, peerMedian: 0.72, flagged: false },
  { id: 'nr-004', field: 'acknowledged_at', nullRate: 0.04, peerMedian: 0.06, flagged: false },
  { id: 'nr-005', field: 'closed_at', nullRate: 0.12, peerMedian: 0.14, flagged: false },
  { id: 'nr-006', field: 'disposition', nullRate: 0.18, peerMedian: 0.15, flagged: false },
  { id: 'nr-007', field: 'case_id', nullRate: 0.62, peerMedian: 0.58, flagged: false },
  { id: 'nr-008', field: 'attack_tactic', nullRate: 0.43, peerMedian: 0.41, flagged: false },
];

export default function ValidationStep({ file, mappings, onNext, onBack }: Props) {
  const [checks, setChecks] = useState<ValidationCheck[]>([
    {
      id: 'check-types',
      label: 'Type validation',
      status: 'running',
      detail: 'Checking column types against canonical schema…',
    },
    {
      id: 'check-timestamps',
      label: 'Timestamp ordering',
      status: 'running',
      detail: 'Verifying ack_before_create, close_before_ack violations…',
    },
    {
      id: 'check-duplicates',
      label: 'Duplicate IDs',
      status: 'running',
      detail: 'Scanning for duplicate alert_id and case_id values…',
    },
    {
      id: 'check-future',
      label: 'Future dates',
      status: 'running',
      detail: 'Checking for timestamps beyond submission date…',
    },
    {
      id: 'check-manifest',
      label: 'Manifest agreement',
      status: 'running',
      detail: 'Comparing declared row counts with delivered counts…',
    },
    {
      id: 'check-timezone',
      label: 'Timezone normalisation',
      status: 'running',
      detail: 'Converting all timestamps to UTC…',
    },
    {
      id: 'check-nullrates',
      label: 'Null rate analysis',
      status: 'running',
      detail: 'Computing per-field null rates vs peer cohort…',
    },
  ]);

  const [drs, setDrs] = useState<number | null>(null);
  const [expandedCheck, setExpandedCheck] = useState<string | null>(null);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    // BACKEND INTEGRATION: stream validation results from /api/intake/validate via SSE
    const delays = [400, 700, 1000, 1300, 1600, 1900, 2400];
    const results: ValidationCheck[] = [
      {
        id: 'check-types',
        label: 'Type validation',
        status: 'warn',
        detail: '3 type coercion warnings: urgency values "info" mapped to severity_id 1 (info).',
        count: 3,
        examples: ['urgency="info" → severity_id=1', 'urgency="unknown" → severity_id=0'],
      },
      {
        id: 'check-timestamps',
        label: 'Timestamp ordering',
        status: 'fail',
        detail:
          '47 alerts have acknowledged_at before created_at. 12 cases have closed_at before any investigation event.',
        count: 47,
        examples: [
          'alert-ALT-001: ack 2024-09-01T07:58:00Z < created 2024-09-01T08:14:22Z',
          'alert-ALT-017: ack 2024-09-01T10:01:00Z < created 2024-09-01T10:03:44Z',
        ],
      },
      {
        id: 'check-duplicates',
        label: 'Duplicate IDs',
        status: 'pass',
        detail: 'No duplicate alert_id or case_id values found.',
        count: 0,
      },
      {
        id: 'check-future',
        label: 'Future dates',
        status: 'pass',
        detail: 'No timestamps beyond 2026-09-26 (submission date) found.',
        count: 0,
      },
      {
        id: 'check-manifest',
        label: 'Manifest agreement',
        status: 'warn',
        detail:
          'Manifest declared 15,000 alerts; delivered 14,820 (−180, 1.2% shortfall). Within tolerance.',
        count: 180,
      },
      {
        id: 'check-timezone',
        label: 'Timezone normalisation',
        status: 'pass',
        detail: 'All 14,820 timestamps normalised to UTC successfully.',
        count: 0,
      },
      {
        id: 'check-nullrates',
        label: 'Null rate analysis',
        status: 'warn',
        detail:
          '2 fields flagged: root_cause 94% null (peer median 28%), remediation_ref 91% null (peer median 31%).',
        count: 2,
      },
    ];

    delays.forEach((delay, idx) => {
      setTimeout(() => {
        setChecks((prev) => prev.map((c) => (c.id === results[idx].id ? results[idx] : c)));
        if (idx === delays.length - 1) {
          setRunning(false);
          // DRS = weighted: completeness 0.82 * 0.3 + validity 0.88 * 0.25 + timestamp 0.78 * 0.25 + manifest 0.94 * 0.2
          setDrs(0.91);
        }
      }, delay);
    });
  }, []);

  const failCount = checks.filter((c) => c.status === 'fail').length;
  const warnCount = checks.filter((c) => c.status === 'warn').length;
  const passCount = checks.filter((c) => c.status === 'pass').length;

  const canProceed = !running && drs !== null && drs >= 0.6;

  return (
    <div className="space-y-4">
      {/* Validation report */}
      <div className="surface-card">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-13 font-600 text-text">Validation Report</h2>
            <p className="text-11 text-text-dimmer mt-0.5">
              {file.name} · {file.rowCount.toLocaleString('en-IN')} rows
            </p>
          </div>
          {running && (
            <div className="flex items-center gap-2 text-12 text-info">
              <span className="w-3 h-3 border border-info border-t-transparent rounded-full animate-spin" />
              Running checks…
            </div>
          )}
          {!running && (
            <div className="flex items-center gap-3 text-12">
              <span className="flex items-center gap-1 text-danger">
                <XCircle size={12} /> {failCount} failed
              </span>
              <span className="flex items-center gap-1 text-warning">
                <AlertTriangle size={12} /> {warnCount} warnings
              </span>
              <span className="flex items-center gap-1 text-success">
                <CheckCircle size={12} /> {passCount} passed
              </span>
            </div>
          )}
        </div>

        <div className="divide-y divide-border">
          {checks.map((check) => (
            <div key={`check-${check.id}`}>
              <button
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-2 transition-colors duration-120 text-left"
                onClick={() => setExpandedCheck(expandedCheck === check.id ? null : check.id)}
                aria-expanded={expandedCheck === check.id}
              >
                <div className="shrink-0">
                  {check.status === 'running' && (
                    <span className="w-4 h-4 border border-text-dimmer border-t-transparent rounded-full animate-spin block" />
                  )}
                  {check.status === 'pass' && <CheckCircle size={14} className="text-success" />}
                  {check.status === 'fail' && <XCircle size={14} className="text-danger" />}
                  {check.status === 'warn' && <AlertTriangle size={14} className="text-warning" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-13 font-500 text-text">{check.label}</p>
                  <p className="text-11 text-text-dimmer truncate">{check.detail}</p>
                </div>
                {check.count !== undefined && check.count > 0 && (
                  <span
                    className={`font-mono text-11 tabular-nums shrink-0 ${check.status === 'fail' ? 'text-danger' : 'text-warning'}`}
                  >
                    {check.count} issues
                  </span>
                )}
                {check.status !== 'running' &&
                  (expandedCheck === check.id ? (
                    <ChevronUp size={12} className="text-text-dimmer shrink-0" />
                  ) : (
                    <ChevronDown size={12} className="text-text-dimmer shrink-0" />
                  ))}
              </button>
              {expandedCheck === check.id && check.examples && (
                <div className="px-12 pb-3">
                  <div className="bg-surface-3 rounded p-3 space-y-1">
                    {check.examples.map((ex, ei) => (
                      <p
                        key={`ex-${check.id}-${ei}`}
                        className="font-mono text-11 text-text-dimmer"
                      >
                        {ex}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* DRS meter */}
      {drs !== null && (
        <div className="surface-card">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="text-13 font-600 text-text">Data Reliability Score (DRS)</h2>
            <p className="text-11 text-text-dimmer mt-0.5">
              Weighted: completeness 30% · validity 25% · timestamp consistency 25% · manifest
              agreement 20%
            </p>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-6">
              <div>
                <p
                  className={`font-mono text-4xl font-700 tabular-nums ${drs >= 0.85 ? 'text-success' : drs >= 0.6 ? 'text-warning' : 'text-danger'}`}
                >
                  {drs.toFixed(2)}
                </p>
                <p className="text-11 text-text-dimmer mt-1">/ 1.00</p>
              </div>
              <div className="flex-1">
                <div className="h-3 bg-surface-3 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${drs * 100}%`,
                      backgroundColor:
                        drs >= 0.85
                          ? 'var(--success)'
                          : drs >= 0.6
                            ? 'var(--warning)'
                            : 'var(--danger)',
                    }}
                  />
                </div>
                <div className="flex justify-between text-11 text-text-dimmer mt-1">
                  <span>0.00</span>
                  <span className="text-danger">0.60 threshold</span>
                  <span>1.00</span>
                </div>
              </div>
              {drs >= 0.6 ? (
                <div className="flex items-center gap-2 text-success text-12">
                  <CheckCircle size={14} />
                  <span>Passes threshold — analysis will proceed</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-danger text-12">
                  <XCircle size={14} />
                  <span>Below threshold — tool will abstain from scoring</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Null rate table */}
      {!running && (
        <div className="surface-card">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="text-13 font-600 text-text">Field Null Rates vs Peer Cohort</h2>
            <p className="text-11 text-text-dimmer mt-0.5">
              Flagged when null rate significantly exceeds peer median (NS-10)
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-13 border-collapse">
              <thead>
                <tr className="border-b border-border">
                  {['Field', 'Null Rate', 'Peer Median', 'Δ', 'Flag'].map((h) => (
                    <th
                      key={`nr-th-${h}`}
                      className="text-left px-4 py-2.5 text-text-dimmer text-11 font-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {NULL_RATES.map((row) => (
                  <tr
                    key={`nr-row-${row.id}`}
                    className={`border-b border-border hover:bg-surface-2 transition-colors ${row.flagged ? 'bg-danger-bg bg-opacity-20' : ''}`}
                  >
                    <td className="px-4 py-2.5 font-mono text-12 text-text">{row.field}</td>
                    <td className="px-4 py-2.5 font-mono text-12 tabular-nums">
                      <span className={row.flagged ? 'text-danger' : 'text-text-dim'}>
                        {(row.nullRate * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-12 tabular-nums text-text-dim">
                      {(row.peerMedian * 100).toFixed(1)}%
                    </td>
                    <td className="px-4 py-2.5 font-mono text-12 tabular-nums">
                      <span
                        className={row.nullRate > row.peerMedian ? 'text-danger' : 'text-success'}
                      >
                        {row.nullRate > row.peerMedian ? '+' : ''}
                        {((row.nullRate - row.peerMedian) * 100).toFixed(1)} pp
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      {row.flagged ? (
                        <span className="badge-danger">Flagged</span>
                      ) : (
                        <span className="badge-neutral">OK</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Rejects preview */}
      {!running && failCount > 0 && (
        <div className="surface-card border-danger-dim">
          <div className="px-4 py-3 border-b border-border flex items-center gap-2">
            <XCircle size={14} className="text-danger" />
            <h2 className="text-13 font-600 text-danger">Rejects Table Preview</h2>
            <span className="text-11 text-text-dimmer ml-1">
              — failed rows are quarantined, not ingested
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-12 border-collapse">
              <thead>
                <tr className="border-b border-border">
                  {['Row #', 'alert_id', 'Field', 'Issue', 'Value'].map((h) => (
                    <th
                      key={`reject-th-${h}`}
                      className="text-left px-4 py-2 text-text-dimmer text-11 font-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    id: 'rej-001',
                    row: 1,
                    alertId: 'ALT-20240901-001',
                    field: 'acknowledged_at',
                    issue: 'ack before created_at',
                    value: '2024-09-01T07:58:00Z',
                  },
                  {
                    id: 'rej-002',
                    row: 17,
                    alertId: 'ALT-20240901-017',
                    field: 'acknowledged_at',
                    issue: 'ack before created_at',
                    value: '2024-09-01T10:01:00Z',
                  },
                  {
                    id: 'rej-003',
                    row: 44,
                    alertId: 'ALT-20240901-044',
                    field: 'acknowledged_at',
                    issue: 'ack before created_at',
                    value: '2024-09-01T14:22:00Z',
                  },
                ].map((r) => (
                  <tr key={`reject-row-${r.id}`} className="border-b border-border bg-danger-bg">
                    <td className="px-4 py-2 font-mono text-11 text-text-dimmer tabular-nums">
                      {r.row}
                    </td>
                    <td className="px-4 py-2 font-mono text-11 text-text">{r.alertId}</td>
                    <td className="px-4 py-2 font-mono text-11 text-text-dim">{r.field}</td>
                    <td className="px-4 py-2 text-11 text-danger">{r.issue}</td>
                    <td className="px-4 py-2 font-mono text-11 text-text-dimmer">{r.value}</td>
                  </tr>
                ))}
                <tr className="border-b border-border">
                  <td colSpan={5} className="px-4 py-2 text-11 text-text-dimmer text-center">
                    … and 44 more rows. Full rejects table available in export.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between gap-2">
        <button onClick={onBack} className="btn-secondary">
          ← Back
        </button>
        <div className="flex items-center gap-3">
          {!running && !canProceed && (
            <span className="text-12 text-danger flex items-center gap-1">
              <XCircle size={12} />
              DRS below threshold — cannot proceed to sealing
            </span>
          )}
          <button
            onClick={onNext}
            disabled={!canProceed}
            className="btn-primary disabled:opacity-40"
          >
            <CheckCircle size={14} />
            Continue to Seal
          </button>
        </div>
      </div>
    </div>
  );
}
