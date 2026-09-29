'use client';

import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, Save } from 'lucide-react';
import { type UploadedFile, type MappingRow } from './IntakeWizard';

interface Props {
  file: UploadedFile;
  onNext: (mappings: MappingRow[]) => void;
  onBack: () => void;
}

const CANONICAL_FIELDS = [
  'alert_id',
  'created_at',
  'source_system',
  'rule_id',
  'rule_name',
  'category',
  'attack_tactic',
  'severity_id',
  'asset_id',
  'status',
  'acknowledged_at',
  'acknowledged_by',
  'closed_at',
  'closed_by',
  'disposition',
  'auto_closed',
  'case_id',
  'note_text',
  'case_created_at',
  'case_severity_initial',
  'case_severity_final',
  'assigned_to',
  'case_status',
  'case_closed_at',
  'root_cause',
  'remediation_ref',
  'reportable',
  'detected_at',
  'external_notified_at',
  'reopen_count',
  'event_id',
  'event_ts',
  'actor',
  'event_type',
  'from_value',
  'to_value',
  'escalation_id',
  'from_tier',
  'to_tier',
  'target_role',
  'channel',
  '(ignore)',
];

// Mock auto-suggested mappings for Splunk ES layout
const INITIAL_MAPPINGS: MappingRow[] = [
  {
    id: 'map-001',
    sourceCol: 'alert_uid',
    canonicalField: 'alert_id',
    confidence: 0.97,
    sampleValues: ['ALT-20240901-001', 'ALT-20240901-002', 'ALT-20240901-003'],
    status: 'mapped',
  },
  {
    id: 'map-002',
    sourceCol: 'event_time',
    canonicalField: 'created_at',
    confidence: 0.95,
    sampleValues: ['2024-09-01T08:14:22Z', '2024-09-01T08:16:44Z', '2024-09-01T09:02:11Z'],
    status: 'mapped',
  },
  {
    id: 'map-003',
    sourceCol: 'source',
    canonicalField: 'source_system',
    confidence: 0.88,
    sampleValues: ['Splunk-ES', 'Splunk-ES', 'Splunk-ES'],
    status: 'mapped',
  },
  {
    id: 'map-004',
    sourceCol: 'correlation_search',
    canonicalField: 'rule_name',
    confidence: 0.91,
    sampleValues: ['Brute Force Auth', 'Lateral Movement', 'Data Exfil Detect'],
    status: 'mapped',
  },
  {
    id: 'map-005',
    sourceCol: 'rule_id',
    canonicalField: 'rule_id',
    confidence: 0.99,
    sampleValues: ['R-1042', 'R-1087', 'R-1091'],
    status: 'mapped',
  },
  {
    id: 'map-006',
    sourceCol: 'mitre_category',
    canonicalField: 'category',
    confidence: 0.84,
    sampleValues: ['Credential Access', 'Lateral Movement', 'Exfiltration'],
    status: 'mapped',
  },
  {
    id: 'map-007',
    sourceCol: 'mitre_tactic',
    canonicalField: 'attack_tactic',
    confidence: 0.86,
    sampleValues: ['TA0006', 'TA0008', 'TA0010'],
    status: 'mapped',
  },
  {
    id: 'map-008',
    sourceCol: 'urgency',
    canonicalField: 'severity_id',
    confidence: 0.72,
    sampleValues: ['critical', 'high', 'medium'],
    status: 'mapped',
  },
  {
    id: 'map-009',
    sourceCol: 'dest',
    canonicalField: 'asset_id',
    confidence: 0.79,
    sampleValues: ['host-a1b2c3', 'host-d4e5f6', 'host-g7h8i9'],
    status: 'mapped',
  },
  {
    id: 'map-010',
    sourceCol: 'alert_status',
    canonicalField: 'status',
    confidence: 0.93,
    sampleValues: ['closed', 'open', 'in_progress'],
    status: 'mapped',
  },
  {
    id: 'map-011',
    sourceCol: 'ack_time',
    canonicalField: 'acknowledged_at',
    confidence: 0.89,
    sampleValues: ['2024-09-01T08:20:00Z', 'null', '2024-09-01T09:15:00Z'],
    status: 'mapped',
  },
  {
    id: 'map-012',
    sourceCol: 'owner',
    canonicalField: 'acknowledged_by',
    confidence: 0.82,
    sampleValues: ['analyst_01', 'analyst_07', 'analyst_12'],
    status: 'mapped',
  },
  {
    id: 'map-013',
    sourceCol: 'close_time',
    canonicalField: 'closed_at',
    confidence: 0.91,
    sampleValues: ['2024-09-01T10:44:00Z', 'null', '2024-09-01T11:02:00Z'],
    status: 'mapped',
  },
  {
    id: 'map-014',
    sourceCol: 'closed_by_user',
    canonicalField: 'closed_by',
    confidence: 0.88,
    sampleValues: ['analyst_03', 'null', 'analyst_12'],
    status: 'mapped',
  },
  {
    id: 'map-015',
    sourceCol: 'resolution',
    canonicalField: 'disposition',
    confidence: 0.75,
    sampleValues: ['true_positive', 'benign', 'false_positive'],
    status: 'mapped',
  },
  {
    id: 'map-016',
    sourceCol: 'auto_resolved',
    canonicalField: 'auto_closed',
    confidence: 0.81,
    sampleValues: ['false', 'true', 'false'],
    status: 'mapped',
  },
  {
    id: 'map-017',
    sourceCol: 'incident_id',
    canonicalField: 'case_id',
    confidence: 0.77,
    sampleValues: ['INC-2024-0041', 'null', 'INC-2024-0042'],
    status: 'mapped',
  },
  {
    id: 'map-018',
    sourceCol: 'analyst_notes',
    canonicalField: 'note_text',
    confidence: 0.93,
    sampleValues: ['Investigated and closed', 'Auto-closed by rule', 'Escalated to T2'],
    status: 'mapped',
  },
  {
    id: 'map-019',
    sourceCol: 'raw_payload',
    canonicalField: '(ignore)',
    confidence: 1.0,
    sampleValues: ['<binary>', '<binary>', '<binary>'],
    status: 'ignored',
  },
  {
    id: 'map-020',
    sourceCol: 'src_ip',
    canonicalField: '(ignore)',
    confidence: 1.0,
    sampleValues: ['10.0.0.1', '192.168.1.4', '172.16.0.2'],
    status: 'ignored',
  },
];

function ConfidencePill({ v }: { v: number }) {
  const color = v >= 0.9 ? 'var(--success)' : v >= 0.75 ? 'var(--accent)' : 'var(--warning)';
  return (
    <span className="font-mono text-11 tabular-nums" style={{ color }}>
      {Math.round(v * 100)}%
    </span>
  );
}

export default function MappingStep({ file, onNext, onBack }: Props) {
  const [mappings, setMappings] = useState<MappingRow[]>(INITIAL_MAPPINGS);
  const [saving, setSaving] = useState(false);

  const updateMapping = (id: string, field: string) => {
    setMappings((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, canonicalField: field, status: field === '(ignore)' ? 'ignored' : 'mapped' }
          : m
      )
    );
  };

  const rejectedCols = mappings.filter((m) => m.status === 'ignored');
  const mappedCols = mappings.filter((m) => m.status === 'mapped');
  const unmappedCols = mappings.filter((m) => m.status === 'unmapped');

  const handleContinue = async () => {
    setSaving(true);
    // BACKEND INTEGRATION: POST mappings to /api/intake/mappings, save as reusable profile
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    onNext(mappings);
  };

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="surface-card">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-13 font-600 text-text">Column Mapping Wizard</h2>
          <p className="text-11 text-text-dimmer mt-0.5">
            Auto-suggested from column names and sample values · {file.name} ·{' '}
            {file.rowCount.toLocaleString('en-IN')} rows
          </p>
        </div>
        <div className="grid grid-cols-3 border-b border-border">
          <div className="px-4 py-3 border-r border-border text-center">
            <p className="font-mono text-lg font-700 text-success tabular-nums">
              {mappedCols.length}
            </p>
            <p className="text-11 text-text-dimmer">Mapped</p>
          </div>
          <div className="px-4 py-3 border-r border-border text-center">
            <p className="font-mono text-lg font-700 text-text-dimmer tabular-nums">
              {rejectedCols.length}
            </p>
            <p className="text-11 text-text-dimmer">Ignored / Rejected</p>
          </div>
          <div className="px-4 py-3 text-center">
            <p className="font-mono text-lg font-700 text-warning tabular-nums">
              {unmappedCols.length}
            </p>
            <p className="text-11 text-text-dimmer">Unmapped</p>
          </div>
        </div>

        {/* Rejected column notice */}
        {rejectedCols.some((m) =>
          ['raw_payload', 'src_ip', 'pcap', 'email', 'phone'].some((bad) =>
            m.sourceCol.toLowerCase().includes(bad)
          )
        ) && (
          <div className="mx-4 mt-3 flex items-start gap-2 px-3 py-2.5 bg-danger-bg border border-danger-dim rounded text-12 text-danger">
            <AlertTriangle size={13} className="shrink-0 mt-0.5" />
            <span>
              Sensitive columns detected and auto-set to &quot;(ignore)&quot;: raw_payload, src_ip.
              These will not be ingested per data minimisation policy.
            </span>
          </div>
        )}

        {/* Mapping table */}
        <div className="overflow-x-auto">
          <table className="w-full text-13 border-collapse">
            <thead>
              <tr className="border-b border-border">
                {[
                  'Source Column',
                  'Sample Values',
                  'Canonical Field',
                  'Auto-confidence',
                  'Status',
                ].map((h) => (
                  <th
                    key={`map-th-${h}`}
                    className="text-left px-4 py-2.5 text-text-dimmer text-11 font-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mappings.map((row) => (
                <tr
                  key={`mapping-row-${row.id}`}
                  className={`border-b border-border transition-colors duration-120 hover:bg-surface-2 ${
                    row.status === 'ignored' ? 'opacity-50' : ''
                  }`}
                >
                  <td className="px-4 py-2.5 font-mono text-12 text-text">{row.sourceCol}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex flex-wrap gap-1">
                      {row.sampleValues.slice(0, 2).map((sv, si) => (
                        <span
                          key={`sample-${row.id}-${si}`}
                          className="font-mono text-11 px-1.5 py-0.5 bg-surface-3 rounded text-text-dimmer truncate max-w-[120px]"
                          title={sv}
                        >
                          {sv}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <select
                      value={row.canonicalField}
                      onChange={(e) => updateMapping(row.id, e.target.value)}
                      className="bg-surface-2 border border-border text-text-dim text-12 rounded px-2 py-1 font-mono focus:outline-none focus:border-accent"
                      aria-label={`Map ${row.sourceCol} to canonical field`}
                    >
                      {CANONICAL_FIELDS.map((f) => (
                        <option key={`canonical-${row.id}-${f}`} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2.5">
                    <ConfidencePill v={row.confidence} />
                  </td>
                  <td className="px-4 py-2.5">
                    {row.status === 'mapped' && <span className="badge-success">Mapped</span>}
                    {row.status === 'ignored' && <span className="badge-neutral">Ignored</span>}
                    {row.status === 'unmapped' && <span className="badge-warning">Unmapped</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-2">
        <button onClick={onBack} className="btn-secondary">
          ← Back
        </button>
        <div className="flex gap-2">
          <button className="btn-secondary">
            <Save size={13} />
            Save as Profile
          </button>
          <button
            onClick={handleContinue}
            disabled={saving || unmappedCols.length > 0}
            className="btn-primary disabled:opacity-40"
          >
            {saving ? (
              <>
                <span className="w-3.5 h-3.5 border border-bg border-t-transparent rounded-full animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <CheckCircle size={14} />
                Continue to Validation
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
