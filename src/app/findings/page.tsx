'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import Link from 'next/link';
import { FINDINGS, ENTITIES, type Finding } from '@/lib/mockData';
import {
  ChevronDown,
  ChevronUp,
  Filter,
  Download,
  ExternalLink,
  CheckCircle,
  Shield,
} from 'lucide-react';

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

function CategoryBadge({ c }: { c: string }) {
  const labels: Record<string, string> = {
    execution_gap: 'Execution Gap',
    negative_space: 'Negative Space',
    anomaly: 'Anomaly',
    integrity: 'Integrity',
  };
  return <span className="badge-neutral">{labels[c] ?? c}</span>;
}

function StatusBadge({ s }: { s: string }) {
  const cls =
    s === 'New'
      ? 'badge-danger'
      : s === 'Chronic'
        ? 'badge-warning'
        : s === 'Persisting'
          ? 'badge-warning'
          : 'badge-success';
  return <span className={cls}>{s}</span>;
}

function StrengthBar({ v }: { v: number }) {
  const color = v >= 0.8 ? 'var(--danger)' : v >= 0.6 ? 'var(--warning)' : 'var(--accent)';
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-16 h-1.5 bg-surface-3 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${v * 100}%`, backgroundColor: color }}
        />
      </div>
      <span className="font-mono text-11 tabular-nums" style={{ color }}>
        {v.toFixed(2)}
      </span>
    </div>
  );
}

const SEVERITIES = ['All', 'Critical', 'High', 'Medium', 'Low'];
const CATEGORIES = ['All', 'execution_gap', 'negative_space', 'anomaly', 'integrity'];
const STATUSES = ['All', 'New', 'Persisting', 'Chronic', 'Resolved'];

export default function FindingsPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [severityFilter, setSeverityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortKey, setSortKey] = useState<keyof Finding>('strength');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const pageSize = 15;

  const entityMap = Object.fromEntries(ENTITIES.map((e) => [e.id, e.name]));

  const filtered = FINDINGS.filter((f) => severityFilter === 'All' || f.severity === severityFilter)
    .filter((f) => categoryFilter === 'All' || f.category === categoryFilter)
    .filter((f) => statusFilter === 'All' || f.status === statusFilter)
    .sort((a, b) => {
      const av = a[sortKey],
        bv = b[sortKey];
      const cmp =
        typeof av === 'string'
          ? (av as string).localeCompare(bv as string)
          : (av as number) - (bv as number);
      return sortDir === 'asc' ? cmp : -cmp;
    });

  const total = filtered.length;
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(total / pageSize);

  const handleSort = (key: keyof Finding) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const SortIcon = ({ k }: { k: keyof Finding }) => {
    if (sortKey !== k) return <ChevronUp size={11} className="text-text-dimmer opacity-30" />;
    return sortDir === 'asc' ? (
      <ChevronUp size={11} className="text-accent" />
    ) : (
      <ChevronDown size={11} className="text-accent" />
    );
  };

  const ThBtn = ({ label, k }: { label: string; k: keyof Finding }) => (
    <button
      onClick={() => handleSort(k)}
      className="flex items-center gap-1 text-text-dimmer hover:text-text transition-colors duration-120 text-11 font-500 uppercase tracking-wider whitespace-nowrap"
    >
      {label} <SortIcon k={k} />
    </button>
  );

  const counts = {
    Critical: FINDINGS.filter((f) => f.severity === 'Critical').length,
    High: FINDINGS.filter((f) => f.severity === 'High').length,
    New: FINDINGS.filter((f) => f.status === 'New').length,
    Chronic: FINDINGS.filter((f) => f.status === 'Chronic').length,
  };

  return (
    <AppLayout title="Findings" subtitle={`${FINDINGS.length} findings · Cycle 8`}>
      <div className="px-6 py-5 space-y-5 max-w-screen-2xl mx-auto">
        {/* Summary KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              label: 'Critical',
              value: counts.Critical,
              color: 'var(--danger)',
              bg: 'var(--danger-bg)',
            },
            { label: 'High', value: counts.High, color: 'var(--warning)', bg: 'var(--warning-bg)' },
            {
              label: 'New This Cycle',
              value: counts.New,
              color: 'var(--accent)',
              bg: 'var(--accent-bg)',
            },
            {
              label: 'Chronic',
              value: counts.Chronic,
              color: 'var(--text-dim)',
              bg: 'var(--surface-2)',
            },
          ].map((kpi) => (
            <div
              key={`kpi-${kpi.label}`}
              className="surface-card p-4"
              style={{ borderColor: kpi.color }}
            >
              <p className="text-11 font-500 uppercase tracking-widest text-text-dim mb-1">
                {kpi.label}
              </p>
              <p className="font-mono text-2xl font-700 tabular-nums" style={{ color: kpi.color }}>
                {kpi.value}
              </p>
            </div>
          ))}
        </div>

        {/* Filters + Table */}
        <div className="surface-card">
          <div className="px-4 py-3 border-b border-border flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-13 font-600 text-text">All Findings</h2>
              <p className="text-11 text-text-dimmer mt-0.5">
                Showing {total} of {FINDINGS.length} findings
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5">
                <Filter size={12} className="text-text-dimmer" />
                <select
                  value={severityFilter}
                  onChange={(e) => {
                    setSeverityFilter(e.target.value);
                    setPage(1);
                  }}
                  className="bg-surface-2 border border-border text-text-dim text-12 rounded px-2 py-1 focus:outline-none focus:border-accent"
                >
                  {SEVERITIES.map((s) => (
                    <option key={`sev-${s}`} value={s}>
                      {s === 'All' ? 'All Severities' : s}
                    </option>
                  ))}
                </select>
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setPage(1);
                }}
                className="bg-surface-2 border border-border text-text-dim text-12 rounded px-2 py-1 focus:outline-none focus:border-accent"
              >
                {CATEGORIES.map((c) => (
                  <option key={`cat-${c}`} value={c}>
                    {c === 'All'
                      ? 'All Categories'
                      : c === 'execution_gap'
                        ? 'Execution Gap'
                        : c === 'negative_space'
                          ? 'Negative Space'
                          : c === 'anomaly'
                            ? 'Anomaly'
                            : 'Integrity'}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="bg-surface-2 border border-border text-text-dim text-12 rounded px-2 py-1 focus:outline-none focus:border-accent"
              >
                {STATUSES.map((s) => (
                  <option key={`stat-${s}`} value={s}>
                    {s === 'All' ? 'All Statuses' : s}
                  </option>
                ))}
              </select>
              <button
                className="btn-secondary text-12 py-1"
                onClick={() => {
                  const csv = [
                    [
                      'ID',
                      'Entity',
                      'Detector',
                      'Category',
                      'Severity',
                      'Strength',
                      'Confidence',
                      'Status',
                      'Evidence',
                      'Date',
                    ].join(','),
                    ...filtered.map((f) =>
                      [
                        f.id,
                        entityMap[f.entityId] ?? f.entityId,
                        f.detectorId,
                        f.category,
                        f.severity,
                        f.strength,
                        f.confidence,
                        f.status,
                        f.evidenceCount,
                        f.createdAt,
                      ].join(',')
                    ),
                  ].join('\n');
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'findings-export.csv';
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
            <table className="w-full text-13 border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-2.5">
                    <ThBtn label="Detector" k="detectorId" />
                  </th>
                  <th className="text-left px-4 py-2.5 text-text-dimmer text-11 font-500 uppercase tracking-wider">
                    Entity
                  </th>
                  <th className="text-left px-4 py-2.5 text-text-dimmer text-11 font-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="text-left px-4 py-2.5">
                    <ThBtn label="Severity" k="severity" />
                  </th>
                  <th className="text-left px-4 py-2.5">
                    <ThBtn label="Strength" k="strength" />
                  </th>
                  <th className="text-left px-4 py-2.5">
                    <ThBtn label="Confidence" k="confidence" />
                  </th>
                  <th className="text-left px-4 py-2.5">
                    <ThBtn label="Status" k="status" />
                  </th>
                  <th className="text-left px-4 py-2.5 text-text-dimmer text-11 font-500 uppercase tracking-wider">
                    Evidence
                  </th>
                  <th className="text-left px-4 py-2.5">
                    <ThBtn label="Date" k="createdAt" />
                  </th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {paged.map((f) => (
                  <React.Fragment key={`finding-row-${f.id}`}>
                    <tr
                      className="border-b border-border hover:bg-surface-2 transition-colors duration-120 cursor-pointer"
                      onClick={() => setExpanded(expanded === f.id ? null : f.id)}
                    >
                      <td className="px-4 py-2.5">
                        <div className="font-mono text-12 text-accent">{f.detectorId}</div>
                        <div className="text-11 text-text-dim mt-0.5 max-w-[160px] truncate">
                          {f.detectorName}
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <Link
                          href="/entity-dossier"
                          className="text-12 text-text hover:text-accent transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {entityMap[f.entityId] ?? f.entityId}
                        </Link>
                      </td>
                      <td className="px-4 py-2.5">
                        <CategoryBadge c={f.category} />
                      </td>
                      <td className="px-4 py-2.5">
                        <SeverityBadge s={f.severity} />
                      </td>
                      <td className="px-4 py-2.5">
                        <StrengthBar v={f.strength} />
                      </td>
                      <td className="px-4 py-2.5">
                        <StrengthBar v={f.confidence} />
                      </td>
                      <td className="px-4 py-2.5">
                        <StatusBadge s={f.status} />
                      </td>
                      <td className="px-4 py-2.5 font-mono text-12 tabular-nums text-text-dim">
                        {f.evidenceCount}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-11 text-text-dimmer">
                        {f.createdAt}
                      </td>
                      <td className="px-4 py-2.5">
                        <button className="btn-ghost text-12 py-1" aria-label="Expand finding">
                          {expanded === f.id ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                        </button>
                      </td>
                    </tr>
                    {expanded === f.id && (
                      <tr
                        key={`finding-expanded-${f.id}`}
                        className="border-b border-border bg-surface-2"
                      >
                        <td colSpan={10} className="px-6 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-11 font-600 text-text-dimmer uppercase tracking-wider mb-2">
                                What
                              </p>
                              <p className="text-13 text-text">{f.summary}</p>
                            </div>
                            <div>
                              <p className="text-11 font-600 text-text-dimmer uppercase tracking-wider mb-2">
                                Domains
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {f.domains.map((d) => (
                                  <span key={`domain-${f.id}-${d}`} className="badge-neutral">
                                    {d}
                                  </span>
                                ))}
                              </div>
                              <p className="text-11 font-600 text-text-dimmer uppercase tracking-wider mt-3 mb-2">
                                Confidence &amp; Limitations
                              </p>
                              <p className="text-12 text-text-dim">
                                Confidence:{' '}
                                <span className="font-mono text-accent">
                                  {f.confidence.toFixed(2)}
                                </span>{' '}
                                · Wilson CI applied · Sample size: {f.evidenceCount} records
                              </p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-11 font-600 text-text-dimmer uppercase tracking-wider">
                                Suggested Action
                              </p>
                              <p className="text-12 text-text-dim">
                                Review {f.evidenceCount} evidence records. Verify against ledger
                                seal. Record verdict in Review Workbench.
                              </p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <Link
                                  href="/evidence"
                                  className="btn-secondary text-12 py-1 flex items-center gap-1"
                                >
                                  <ExternalLink size={11} />
                                  View Evidence
                                </Link>
                                <Link
                                  href="/ledger"
                                  className="btn-secondary text-12 py-1 flex items-center gap-1"
                                >
                                  <Shield size={11} />
                                  Verify Merkle
                                </Link>
                                <Link
                                  href="/review"
                                  className="btn-primary text-12 py-1 flex items-center gap-1"
                                >
                                  <CheckCircle size={11} />
                                  Record Verdict
                                </Link>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-border">
            <span className="text-11 text-text-dimmer">
              Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="btn-ghost text-12 disabled:opacity-30 py-1 px-2"
              >
                ‹ Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={`page-${p}`}
                  onClick={() => setPage(p)}
                  className={`btn-ghost text-12 py-1 px-2 ${p === page ? 'text-accent bg-accent-bg border border-accent-dim' : ''}`}
                >
                  {p}
                </button>
              ))}
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
    </AppLayout>
  );
}
