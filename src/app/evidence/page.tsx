'use client';

import React, { useState, useMemo } from 'react';
import AppLayout from '@/components/AppLayout';
import { ENTITIES, FINDINGS } from '@/lib/mockData';
import {
  Search,
  Filter,
  Shield,
  CheckCircle,
  Download,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface EvidenceRow {
  id: string;
  entityId: string;
  alertId: string;
  ruleId: string;
  ruleName: string;
  severity: string;
  status: string;
  createdAt: string;
  closedAt: string | null;
  disposition: string;
  caseId: string | null;
  detectorId: string;
  leafHash: string;
  merkleVerified: boolean | null;
}

// Generate synthetic evidence rows from findings
function generateEvidenceRows(): EvidenceRow[] {
  const rows: EvidenceRow[] = [];
  const severities = ['Critical', 'High', 'Medium', 'Low'];
  const dispositions = ['true_positive', 'false_positive', 'benign', 'duplicate', 'auto_closed'];
  const statuses = ['closed', 'open', 'acknowledged'];
  const ruleNames = [
    'Lateral Movement Detected',
    'Privilege Escalation Attempt',
    'Suspicious PowerShell Execution',
    'Brute Force Login Attempt',
    'Data Exfiltration Pattern',
    'Malware Signature Match',
    'Anomalous Network Traffic',
    'Unauthorized Access Attempt',
    'Ransomware Indicator',
    'Command & Control Beacon',
    'SQL Injection Attempt',
    'Phishing Email Detected',
  ];

  let rowIdx = 0;
  FINDINGS.forEach((finding) => {
    const count = Math.min(finding.evidenceCount, 20);
    for (let i = 0; i < count; i++) {
      rowIdx++;
      const sev =
        finding.severity === 'Critical'
          ? 'Critical'
          : finding.severity === 'High'
            ? i % 3 === 0
              ? 'Critical'
              : 'High'
            : severities[i % 4];
      const hash = `sha256:${Array.from({ length: 16 }, (_, k) => ((rowIdx * 7 + k * 13 + i * 3) % 256).toString(16).padStart(2, '0')).join('')}`;
      rows.push({
        id: `alert-${finding.entityId}-${rowIdx.toString().padStart(5, '0')}`,
        entityId: finding.entityId,
        alertId: `ALT-${(10000 + rowIdx).toString()}`,
        ruleId: `RULE-${((rowIdx % 12) + 1).toString().padStart(3, '0')}`,
        ruleName: ruleNames[rowIdx % ruleNames.length],
        severity: sev,
        status: statuses[rowIdx % 3],
        createdAt: `2026-09-${String(Math.max(1, 28 - (rowIdx % 27))).padStart(2, '0')}T${String(rowIdx % 24).padStart(2, '0')}:${String(rowIdx % 60).padStart(2, '0')}:00Z`,
        closedAt:
          rowIdx % 3 !== 1
            ? `2026-09-${String(Math.max(1, 28 - (rowIdx % 25))).padStart(2, '0')}T${String((rowIdx + 2) % 24).padStart(2, '0')}:${String((rowIdx + 30) % 60).padStart(2, '0')}:00Z`
            : null,
        disposition: dispositions[rowIdx % 5],
        caseId: rowIdx % 4 === 0 ? `CASE-${(1000 + Math.floor(rowIdx / 4)).toString()}` : null,
        detectorId: finding.detectorId,
        leafHash: hash,
        merkleVerified: null,
      });
    }
  });
  return rows;
}

const ALL_EVIDENCE = generateEvidenceRows();

function SeverityBadge({ s }: { s: string }) {
  const cls =
    s === 'Critical'
      ? 'badge-danger'
      : s === 'High'
        ? 'badge-warning'
        : s === 'Medium'
          ? 'badge-info'
          : 'badge-neutral';
  return <span className={cls}>{s}</span>;
}

function MerkleProofModal({ row, onClose }: { row: EvidenceRow; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const steps = [
    { label: 'Leaf Hash', desc: 'SHA-256(0x00 || record_data)', value: row.leafHash, ok: true },
    {
      label: 'Merkle Path Node 1',
      desc: 'SHA-256(0x01 || leaf || sibling_1)',
      value: `sha256:${row.leafHash.slice(7, 23)}a4f2b8c1d9e3f7a2`,
      ok: true,
    },
    {
      label: 'Merkle Path Node 2',
      desc: 'SHA-256(0x01 || node_1 || sibling_2)',
      value: `sha256:9f3e2a1b4c8d7e6f${row.leafHash.slice(7, 23)}`,
      ok: true,
    },
    {
      label: 'Submission Root',
      desc: 'Merkle root sealed in block #847',
      value: 'sha256:a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
      ok: true,
    },
    {
      label: 'Block Signature',
      desc: 'Ed25519 + ML-DSA-65 hybrid signature verified',
      value: 'Block #847 · 2026-09-28T12:47:22Z · Proposer: system',
      ok: true,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
      onClick={onClose}
    >
      <div
        className="bg-surface border border-border rounded-lg w-full max-w-xl mx-4 p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-13 font-600 text-text">Merkle Inclusion Proof</h3>
            <p className="text-11 text-text-dimmer mt-0.5 font-mono">{row.alertId}</p>
          </div>
          <button onClick={onClose} className="btn-ghost text-12 py-1 px-2">
            ✕
          </button>
        </div>
        <div className="space-y-2">
          {steps.map((s, i) => (
            <div
              key={`proof-step-${i}`}
              className={`p-3 rounded border transition-all duration-120 ${i <= step ? 'border-success bg-success-bg' : 'border-border bg-surface-2'}`}
            >
              <div className="flex items-center gap-2 mb-1">
                {i <= step ? (
                  <CheckCircle size={12} className="text-success shrink-0" />
                ) : (
                  <div className="w-3 h-3 rounded-full border border-border" />
                )}
                <span className="text-12 font-600 text-text">{s.label}</span>
              </div>
              <p className="text-11 text-text-dimmer mb-1">{s.desc}</p>
              {i <= step && <p className="font-mono text-10 text-text-dim break-all">{s.value}</p>}
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          {step < steps.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="btn-primary text-12 flex-1 justify-center"
            >
              Verify Next Step →
            </button>
          ) : (
            <div className="flex-1 px-3 py-2 bg-success-bg border border-success rounded text-12 text-success font-600 text-center">
              ✓ Inclusion proof verified — record is authentic
            </div>
          )}
          <button onClick={onClose} className="btn-secondary text-12 px-4">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EvidencePage() {
  const [search, setSearch] = useState('');
  const [entityFilter, setEntityFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [detectorFilter, setDetectorFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<keyof EvidenceRow>('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [proofRow, setProofRow] = useState<EvidenceRow | null>(null);
  const pageSize = 25;

  const entityMap = Object.fromEntries(ENTITIES.map((e) => [e.id, e.name]));
  const detectors = ['All', ...Array.from(new Set(ALL_EVIDENCE.map((r) => r.detectorId)))];

  const filtered = useMemo(() => {
    return ALL_EVIDENCE.filter((r) => entityFilter === 'All' || r.entityId === entityFilter)
      .filter((r) => severityFilter === 'All' || r.severity === severityFilter)
      .filter((r) => detectorFilter === 'All' || r.detectorId === detectorFilter)
      .filter(
        (r) =>
          !search ||
          r.alertId.toLowerCase().includes(search.toLowerCase()) ||
          r.ruleName.toLowerCase().includes(search.toLowerCase()) ||
          (r.caseId ?? '').toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        const av = a[sortKey] ?? '',
          bv = b[sortKey] ?? '';
        const cmp = String(av).localeCompare(String(bv));
        return sortDir === 'asc' ? cmp : -cmp;
      });
  }, [search, entityFilter, severityFilter, detectorFilter, sortKey, sortDir]);

  const total = filtered.length;
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(total / pageSize);

  const handleSort = (key: keyof EvidenceRow) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const SortIcon = ({ k }: { k: keyof EvidenceRow }) => {
    if (sortKey !== k) return <ChevronUp size={11} className="text-text-dimmer opacity-30" />;
    return sortDir === 'asc' ? (
      <ChevronUp size={11} className="text-accent" />
    ) : (
      <ChevronDown size={11} className="text-accent" />
    );
  };

  const ThBtn = ({ label, k }: { label: string; k: keyof EvidenceRow }) => (
    <button
      onClick={() => handleSort(k)}
      className="flex items-center gap-1 text-text-dimmer hover:text-text transition-colors duration-120 text-11 font-500 uppercase tracking-wider whitespace-nowrap"
    >
      {label} <SortIcon k={k} />
    </button>
  );

  return (
    <AppLayout
      title="Evidence Explorer"
      subtitle={`${ALL_EVIDENCE.length} records across all entities`}
    >
      <div className="px-6 py-5 space-y-5 max-w-screen-2xl mx-auto">
        {/* Info bar */}
        <div className="flex items-center gap-2 px-3 py-2 bg-surface-2 border border-border rounded text-11 text-text-dimmer font-mono">
          <Shield size={12} className="text-accent shrink-0" />
          <span>
            All records are cryptographically sealed. Each row carries a SHA-256 leaf hash anchored
            to the submission Merkle root in Block #847.
          </span>
        </div>

        {/* Filters */}
        <div className="surface-card">
          <div className="px-4 py-3 border-b border-border flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-13 font-600 text-text">Evidence Records</h2>
              <p className="text-11 text-text-dimmer mt-0.5">
                Showing {total} of {ALL_EVIDENCE.length} records
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search
                  size={12}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-dimmer"
                />
                <input
                  type="text"
                  placeholder="Search alert ID, rule, case…"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="input-field pl-7 text-12 py-1 w-52"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <Filter size={12} className="text-text-dimmer" />
                <select
                  value={entityFilter}
                  onChange={(e) => {
                    setEntityFilter(e.target.value);
                    setPage(1);
                  }}
                  className="bg-surface-2 border border-border text-text-dim text-12 rounded px-2 py-1 focus:outline-none focus:border-accent"
                >
                  <option value="All">All Entities</option>
                  {ENTITIES.filter((e) => e.status !== 'Abstained').map((e) => (
                    <option key={`ent-opt-${e.id}`} value={e.id}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>
              <select
                value={severityFilter}
                onChange={(e) => {
                  setSeverityFilter(e.target.value);
                  setPage(1);
                }}
                className="bg-surface-2 border border-border text-text-dim text-12 rounded px-2 py-1 focus:outline-none focus:border-accent"
              >
                {['All', 'Critical', 'High', 'Medium', 'Low'].map((s) => (
                  <option key={`sev-opt-${s}`} value={s}>
                    {s === 'All' ? 'All Severities' : s}
                  </option>
                ))}
              </select>
              <select
                value={detectorFilter}
                onChange={(e) => {
                  setDetectorFilter(e.target.value);
                  setPage(1);
                }}
                className="bg-surface-2 border border-border text-text-dim text-12 rounded px-2 py-1 focus:outline-none focus:border-accent"
              >
                {detectors.map((d) => (
                  <option key={`det-opt-${d}`} value={d}>
                    {d === 'All' ? 'All Detectors' : d}
                  </option>
                ))}
              </select>
              <button
                className="btn-secondary text-12 py-1"
                onClick={() => {
                  const csv = [
                    'Alert ID,Entity,Rule,Severity,Status,Disposition,Created,Case ID,Detector,Leaf Hash',
                  ]
                    .concat(
                      filtered.map((r) =>
                        [
                          r.alertId,
                          entityMap[r.entityId] ?? r.entityId,
                          r.ruleName,
                          r.severity,
                          r.status,
                          r.disposition,
                          r.createdAt,
                          r.caseId ?? '',
                          r.detectorId,
                          r.leafHash,
                        ].join(',')
                      )
                    )
                    .join('\n');
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'evidence-export.csv';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                <Download size={12} />
                Export CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-12 border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-2.5">
                    <ThBtn label="Alert ID" k="alertId" />
                  </th>
                  <th className="text-left px-4 py-2.5 text-text-dimmer text-11 font-500 uppercase tracking-wider">
                    Entity
                  </th>
                  <th className="text-left px-4 py-2.5 text-text-dimmer text-11 font-500 uppercase tracking-wider">
                    Rule
                  </th>
                  <th className="text-left px-4 py-2.5">
                    <ThBtn label="Severity" k="severity" />
                  </th>
                  <th className="text-left px-4 py-2.5">
                    <ThBtn label="Status" k="status" />
                  </th>
                  <th className="text-left px-4 py-2.5 text-text-dimmer text-11 font-500 uppercase tracking-wider">
                    Disposition
                  </th>
                  <th className="text-left px-4 py-2.5">
                    <ThBtn label="Created" k="createdAt" />
                  </th>
                  <th className="text-left px-4 py-2.5 text-text-dimmer text-11 font-500 uppercase tracking-wider">
                    Case
                  </th>
                  <th className="text-left px-4 py-2.5 text-text-dimmer text-11 font-500 uppercase tracking-wider">
                    Detector
                  </th>
                  <th className="text-left px-4 py-2.5 text-text-dimmer text-11 font-500 uppercase tracking-wider">
                    Leaf Hash
                  </th>
                  <th className="text-left px-4 py-2.5 text-text-dimmer text-11 font-500 uppercase tracking-wider">
                    Proof
                  </th>
                </tr>
              </thead>
              <tbody>
                {paged.map((row) => (
                  <tr
                    key={`ev-row-${row.id}`}
                    className="border-b border-border hover:bg-surface-2 transition-colors duration-120"
                  >
                    <td className="px-4 py-2 font-mono text-11 text-accent">{row.alertId}</td>
                    <td className="px-4 py-2 text-12 text-text-dim max-w-[140px] truncate">
                      {entityMap[row.entityId] ?? row.entityId}
                    </td>
                    <td className="px-4 py-2 text-12 text-text max-w-[160px] truncate">
                      {row.ruleName}
                    </td>
                    <td className="px-4 py-2">
                      <SeverityBadge s={row.severity} />
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={
                          row.status === 'closed'
                            ? 'badge-neutral'
                            : row.status === 'open'
                              ? 'badge-warning'
                              : 'badge-info'
                        }
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={
                          row.disposition === 'true_positive'
                            ? 'badge-danger'
                            : row.disposition === 'false_positive'
                              ? 'badge-success'
                              : 'badge-neutral'
                        }
                      >
                        {row.disposition.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-2 font-mono text-11 text-text-dimmer whitespace-nowrap">
                      {row.createdAt.slice(0, 16).replace('T', ' ')}
                    </td>
                    <td className="px-4 py-2 font-mono text-11 text-text-dim">
                      {row.caseId ?? '—'}
                    </td>
                    <td className="px-4 py-2 font-mono text-11 text-accent">{row.detectorId}</td>
                    <td
                      className="px-4 py-2 font-mono text-10 text-text-dimmer max-w-[120px] truncate"
                      title={row.leafHash}
                    >
                      {row.leafHash.slice(0, 18)}…
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => setProofRow(row)}
                        className="btn-ghost text-11 py-0.5 px-2 flex items-center gap-1 text-accent hover:text-text"
                        aria-label={`Verify Merkle proof for ${row.alertId}`}
                      >
                        <Shield size={11} />
                        Verify
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-border">
            <span className="text-11 text-text-dimmer">
              Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}{' '}
              records
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="btn-ghost text-12 disabled:opacity-30 py-1 px-2"
              >
                ‹ Prev
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                return (
                  <button
                    key={`page-${p}`}
                    onClick={() => setPage(p)}
                    className={`btn-ghost text-12 py-1 px-2 ${p === page ? 'text-accent bg-accent-bg border border-accent-dim' : ''}`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="btn-ghost text-12 disabled:opacity-30 py-1 px-2"
              >
                Next ›
              </button>
            </div>
          </div>
        </div>
      </div>

      {proofRow && <MerkleProofModal row={proofRow} onClose={() => setProofRow(null)} />}
    </AppLayout>
  );
}
