'use client';

import React, { useState } from 'react';
import { FINDINGS } from '@/lib/mockData';
import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

interface Props {
  entityId: string;
}

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

export default function FindingsTable({ entityId }: Props) {
  const findings = FINDINGS.filter((f) => f.entityId === entityId);
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="surface-card">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-13 font-600 text-text">Findings</h2>
          <p className="text-11 text-text-dimmer mt-0.5">{findings.length} findings · Cycle 8</p>
        </div>
        <button className="btn-secondary text-12 py-1">
          <ExternalLink size={12} />
          Export
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-13 border-collapse">
          <thead>
            <tr className="border-b border-border">
              {[
                'Detector',
                'Category',
                'Domains',
                'Severity',
                'Strength',
                'Confidence',
                'Status',
                'Evidence',
                'Date',
              ].map((h) => (
                <th
                  key={`finding-th-${h}`}
                  className="text-left px-4 py-2.5 text-text-dimmer text-11 font-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {findings.map((f) => (
              <React.Fragment key={`finding-${f.id}`}>
                <tr
                  className="border-b border-border hover:bg-surface-2 transition-colors duration-120 cursor-pointer"
                  onClick={() => setExpanded(expanded === f.id ? null : f.id)}
                >
                  <td className="px-4 py-2.5">
                    <div className="font-mono text-12 text-accent">{f.detectorId}</div>
                    <div className="text-12 text-text-dim mt-0.5">{f.detectorName}</div>
                  </td>
                  <td className="px-4 py-2.5">
                    <CategoryBadge c={f.category} />
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex flex-wrap gap-1">
                      {f.domains.map((d) => (
                        <span key={`domain-badge-${f.id}-${d}`} className="badge-neutral">
                          {d}
                        </span>
                      ))}
                    </div>
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
                  <td className="px-4 py-2.5 font-mono text-11 text-text-dimmer">{f.createdAt}</td>
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-11 font-600 text-text-dimmer uppercase tracking-wider mb-2">
                            What
                          </p>
                          <p className="text-13 text-text">{f.summary}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-11 font-600 text-text-dimmer uppercase tracking-wider">
                            Suggested Action
                          </p>
                          <p className="text-12 text-text-dim">
                            Review {f.evidenceCount} evidence records. Verify against ledger seal.
                            Record verdict in Review Workbench.
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Link
                              href="/evidence"
                              className="btn-secondary text-12 py-1 flex items-center gap-1"
                            >
                              View Evidence
                            </Link>
                            <Link
                              href="/ledger"
                              className="btn-secondary text-12 py-1 flex items-center gap-1"
                            >
                              Verify Merkle Proof
                            </Link>
                            <Link
                              href="/review"
                              className="btn-primary text-12 py-1 flex items-center gap-1"
                            >
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
      {findings.length === 0 && (
        <div className="px-4 py-12 text-center">
          <p className="text-text-dimmer text-13">
            No findings for this entity in the current cycle.
          </p>
        </div>
      )}
    </div>
  );
}
