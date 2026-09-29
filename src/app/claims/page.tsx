'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { ENTITIES, CLAIMS } from '@/lib/mockData';
import { CheckCircle, XCircle, HelpCircle, Plus, Filter, Download } from 'lucide-react';

type ClaimStatus = 'Supported' | 'Contradicted' | 'Unverifiable';

interface ClaimEntry {
  id: string;
  entityId: string;
  metric: string;
  declared: string;
  recomputed: string | null;
  status: ClaimStatus;
  delta?: string;
  evidenceCount?: number;
}

// Extend CLAIMS with more entities
const ALL_CLAIMS: ClaimEntry[] = [
  ...CLAIMS,
  {
    id: 'claim-009',
    entityId: 'cse-002',
    metric: 'OT asset monitoring coverage',
    declared: '100% of OT assets',
    recomputed: '71.4% (14 silent assets)',
    status: 'Contradicted',
    delta: '-28.6 pp',
    evidenceCount: 14,
  },
  {
    id: 'claim-010',
    entityId: 'cse-002',
    metric: 'MTTA for Critical alerts',
    declared: '< 3 minutes',
    recomputed: '4m 12s (median)',
    status: 'Contradicted',
    delta: '+1m 12s',
    evidenceCount: 89,
  },
  {
    id: 'claim-011',
    entityId: 'cse-002',
    metric: 'Incident escalation rate',
    declared: '≥90% of High+',
    recomputed: null,
    status: 'Unverifiable',
  },
  {
    id: 'claim-012',
    entityId: 'cse-003',
    metric: 'Investigation note quality',
    declared: 'All cases documented',
    recomputed: '34% use template notes',
    status: 'Contradicted',
    delta: 'Template rate 4× peer p90',
    evidenceCount: 47,
  },
  {
    id: 'claim-013',
    entityId: 'cse-003',
    metric: 'MTTA for High alerts',
    declared: '< 10 minutes',
    recomputed: '8m 44s (median)',
    status: 'Supported',
    evidenceCount: 634,
  },
  {
    id: 'claim-014',
    entityId: 'cse-005',
    metric: 'CERT-In notification compliance',
    declared: '100% within 6 hours',
    recomputed: '3 incidents exceeded window',
    status: 'Contradicted',
    delta: '3 violations',
    evidenceCount: 3,
  },
  {
    id: 'claim-015',
    entityId: 'cse-005',
    metric: 'SOC staffing',
    declared: '24×7 coverage',
    recomputed: null,
    status: 'Unverifiable',
  },
];

function StatusIcon({ status }: { status: ClaimStatus }) {
  if (status === 'Supported') return <CheckCircle size={13} className="text-success shrink-0" />;
  if (status === 'Contradicted') return <XCircle size={13} className="text-danger shrink-0" />;
  return <HelpCircle size={13} className="text-text-dimmer shrink-0" />;
}

function StatusBadge({ status }: { status: ClaimStatus }) {
  if (status === 'Supported') return <span className="badge-success">Supported</span>;
  if (status === 'Contradicted') return <span className="badge-danger">Contradicted</span>;
  return <span className="badge-neutral">Unverifiable</span>;
}

export default function ClaimsPage() {
  const [entityFilter, setEntityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'All' | ClaimStatus>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClaim, setNewClaim] = useState({ metric: '', declared: '', entityId: '' });

  const entityMap = Object.fromEntries(ENTITIES.map((e) => [e.id, e.name]));
  const activeEntities = ENTITIES.filter((e) => e.status !== 'Abstained');

  const filtered = ALL_CLAIMS.filter(
    (c) => entityFilter === 'All' || c.entityId === entityFilter
  ).filter((c) => statusFilter === 'All' || c.status === statusFilter);

  const counts = {
    Supported: ALL_CLAIMS.filter((c) => c.status === 'Supported').length,
    Contradicted: ALL_CLAIMS.filter((c) => c.status === 'Contradicted').length,
    Unverifiable: ALL_CLAIMS.filter((c) => c.status === 'Unverifiable').length,
  };

  return (
    <AppLayout
      title="Claims Register"
      subtitle="Declared metrics recomputed from raw submission data"
    >
      <div className="px-6 py-5 space-y-5 max-w-screen-2xl mx-auto">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: 'Supported',
              count: counts.Supported,
              icon: <CheckCircle size={16} className="text-success" />,
              color: 'var(--success)',
            },
            {
              label: 'Contradicted',
              count: counts.Contradicted,
              icon: <XCircle size={16} className="text-danger" />,
              color: 'var(--danger)',
            },
            {
              label: 'Unverifiable',
              count: counts.Unverifiable,
              icon: <HelpCircle size={16} className="text-text-dimmer" />,
              color: 'var(--text-dim)',
            },
          ].map((kpi) => (
            <div
              key={`claims-kpi-${kpi.label}`}
              className="surface-card p-4 flex items-center gap-3"
            >
              {kpi.icon}
              <div>
                <p
                  className="font-mono text-2xl font-700 tabular-nums"
                  style={{ color: kpi.color }}
                >
                  {kpi.count}
                </p>
                <p className="text-11 text-text-dimmer">{kpi.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Explanation */}
        <div className="px-4 py-3 bg-surface-2 border border-border rounded text-12 text-text-dim">
          <span className="font-600 text-text">How it works: </span>
          Each claim is a declared metric from the entity&apos;s self-assessment or policy document.
          SAT-SA recomputes each metric from the raw submission data and marks it Supported,
          Contradicted (with the delta and evidence records), or Unverifiable (required evidence is
          missing — which is itself negative space).
        </div>

        {/* Filters */}
        <div className="surface-card">
          <div className="px-4 py-3 border-b border-border flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-13 font-600 text-text">All Claims</h2>
              <p className="text-11 text-text-dimmer mt-0.5">
                Showing {filtered.length} of {ALL_CLAIMS.length} claims
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5">
                <Filter size={12} className="text-text-dimmer" />
                <select
                  value={entityFilter}
                  onChange={(e) => setEntityFilter(e.target.value)}
                  className="bg-surface-2 border border-border text-text-dim text-12 rounded px-2 py-1 focus:outline-none focus:border-accent"
                >
                  <option value="All">All Entities</option>
                  {activeEntities.map((e) => (
                    <option key={`ce-${e.id}`} value={e.id}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-1 bg-surface-2 border border-border rounded p-0.5">
                {(['All', 'Supported', 'Contradicted', 'Unverifiable'] as const).map((f) => (
                  <button
                    key={`cf-${f}`}
                    onClick={() => setStatusFilter(f)}
                    className={`text-12 px-2.5 py-1 rounded transition-all duration-120 ${statusFilter === f ? 'bg-accent-bg text-accent border border-accent-dim' : 'text-text-dimmer hover:text-text'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <button
                className="btn-secondary text-12 py-1"
                onClick={() => {
                  const csv = ['Entity,Metric,Declared,Recomputed,Status,Delta,Evidence']
                    .concat(
                      filtered.map((c) =>
                        [
                          entityMap[c.entityId] ?? c.entityId,
                          c.metric,
                          c.declared,
                          c.recomputed ?? '',
                          c.status,
                          c.delta ?? '',
                          c.evidenceCount ?? '',
                        ].join(',')
                      )
                    )
                    .join('\n');
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'claims-export.csv';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                <Download size={12} />
                Export
              </button>
              <button onClick={() => setShowAddModal(true)} className="btn-primary text-12 py-1">
                <Plus size={12} />
                Add Claim
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-13 border-collapse">
              <thead>
                <tr className="border-b border-border">
                  {[
                    'Status',
                    'Entity',
                    'Metric / Claim',
                    'Declared',
                    'Recomputed',
                    'Delta',
                    'Evidence',
                  ].map((h) => (
                    <th
                      key={`claims-th-${h}`}
                      className="text-left px-4 py-2.5 text-text-dimmer text-11 font-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((claim) => (
                  <tr
                    key={`claim-row-${claim.id}`}
                    className={`border-b border-border transition-colors duration-120 hover:bg-surface-2 ${claim.status === 'Contradicted' ? 'bg-danger-bg bg-opacity-20' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <StatusIcon status={claim.status} />
                        <StatusBadge status={claim.status} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-12 text-text-dim">
                      {entityMap[claim.entityId] ?? claim.entityId}
                    </td>
                    <td className="px-4 py-3 text-13 text-text font-500 max-w-[200px]">
                      {claim.metric}
                    </td>
                    <td className="px-4 py-3 font-mono text-12 text-text-dim">{claim.declared}</td>
                    <td className="px-4 py-3 font-mono text-12">
                      {claim.recomputed ? (
                        <span
                          className={
                            claim.status === 'Contradicted' ? 'text-danger' : 'text-success'
                          }
                        >
                          {claim.recomputed}
                        </span>
                      ) : (
                        <span className="text-text-dimmer italic">Missing evidence</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-12">
                      {claim.delta ? (
                        <span className="text-danger">{claim.delta}</span>
                      ) : (
                        <span className="text-text-dimmer">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-12 text-text-dim tabular-nums">
                      {claim.evidenceCount ? (
                        <button className="text-accent hover:underline">
                          {claim.evidenceCount.toLocaleString('en-IN')} records
                        </button>
                      ) : (
                        <span className="text-text-dimmer">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="px-4 py-12 text-center text-text-dimmer text-13">
              No claims matching current filters.
            </div>
          )}
        </div>
      </div>

      {/* Add Claim Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-surface border border-border rounded-lg w-full max-w-lg mx-4 p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-13 font-600 text-text mb-4">Add Claim</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-12 font-500 text-text-dim mb-1">Entity</label>
                <select
                  value={newClaim.entityId}
                  onChange={(e) => setNewClaim({ ...newClaim, entityId: e.target.value })}
                  className="input-field text-12"
                >
                  <option value="">Select entity…</option>
                  {activeEntities.map((e) => (
                    <option key={`modal-ent-${e.id}`} value={e.id}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-12 font-500 text-text-dim mb-1">Metric / Claim</label>
                <input
                  type="text"
                  className="input-field text-12"
                  placeholder="e.g. Critical alert escalation rate ≥95% within 15 min"
                  value={newClaim.metric}
                  onChange={(e) => setNewClaim({ ...newClaim, metric: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-12 font-500 text-text-dim mb-1">Declared Value</label>
                <input
                  type="text"
                  className="input-field text-12"
                  placeholder="e.g. ≥95% within 15 min"
                  value={newClaim.declared}
                  onChange={(e) => setNewClaim({ ...newClaim, declared: e.target.value })}
                />
              </div>
              <div className="px-3 py-2 bg-info-bg border border-info rounded text-11 text-info">
                The claim will be recomputed from the entity&apos;s sealed submission data. Status
                will be set automatically.
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                className="btn-primary text-12 flex-1 justify-center"
                onClick={() => {
                  // In production: POST to /api/claims
                  setShowAddModal(false);
                  setNewClaim({ metric: '', declared: '', entityId: '' });
                }}
              >
                Add &amp; Recompute
              </button>
              <button onClick={() => setShowAddModal(false)} className="btn-secondary text-12 px-4">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
