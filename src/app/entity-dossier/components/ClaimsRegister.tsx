'use client';

import React, { useState } from 'react';
import { CLAIMS } from '@/lib/mockData';
import { CheckCircle, XCircle, HelpCircle, Plus } from 'lucide-react';

interface Props {
  entityId: string;
}

function StatusIcon({ status }: { status: string }) {
  if (status === 'Supported') return <CheckCircle size={13} className="text-success shrink-0" />;
  if (status === 'Contradicted') return <XCircle size={13} className="text-danger shrink-0" />;
  return <HelpCircle size={13} className="text-text-dimmer shrink-0" />;
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'Supported') return <span className="badge-success">Supported</span>;
  if (status === 'Contradicted') return <span className="badge-danger">Contradicted</span>;
  return <span className="badge-neutral">Unverifiable</span>;
}

export default function ClaimsRegister({ entityId }: Props) {
  const claims = CLAIMS.filter((c) => c.entityId === entityId);
  const [filter, setFilter] = useState<'All' | 'Supported' | 'Contradicted' | 'Unverifiable'>(
    'All'
  );

  const filtered = filter === 'All' ? claims : claims.filter((c) => c.status === filter);

  const counts = {
    Supported: claims.filter((c) => c.status === 'Supported').length,
    Contradicted: claims.filter((c) => c.status === 'Contradicted').length,
    Unverifiable: claims.filter((c) => c.status === 'Unverifiable').length,
  };

  return (
    <div className="surface-card">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-13 font-600 text-text">Claims vs Evidence Register</h2>
          <p className="text-11 text-text-dimmer mt-0.5">
            Declared metrics recomputed from raw submission data
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-surface-2 border border-border rounded p-0.5">
            {(['All', 'Supported', 'Contradicted', 'Unverifiable'] as const).map((f) => (
              <button
                key={`claim-filter-${f}`}
                onClick={() => setFilter(f)}
                className={`text-12 px-2.5 py-1 rounded transition-all duration-120 ${
                  filter === f
                    ? 'bg-accent-bg text-accent border border-accent-dim'
                    : 'text-text-dimmer hover:text-text'
                }`}
              >
                {f}
                {f !== 'All' && (
                  <span className="ml-1 font-mono text-11">
                    ({counts[f as keyof typeof counts]})
                  </span>
                )}
              </button>
            ))}
          </div>
          <button className="btn-secondary text-12 py-1">
            <Plus size={12} />
            Add Claim
          </button>
        </div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-3 border-b border-border">
        <div className="px-4 py-3 border-r border-border flex items-center gap-2">
          <CheckCircle size={14} className="text-success" />
          <div>
            <p className="font-mono text-lg font-700 text-success tabular-nums">
              {counts.Supported}
            </p>
            <p className="text-11 text-text-dimmer">Supported</p>
          </div>
        </div>
        <div className="px-4 py-3 border-r border-border flex items-center gap-2">
          <XCircle size={14} className="text-danger" />
          <div>
            <p className="font-mono text-lg font-700 text-danger tabular-nums">
              {counts.Contradicted}
            </p>
            <p className="text-11 text-text-dimmer">Contradicted</p>
          </div>
        </div>
        <div className="px-4 py-3 flex items-center gap-2">
          <HelpCircle size={14} className="text-text-dimmer" />
          <div>
            <p className="font-mono text-lg font-700 text-text-dim tabular-nums">
              {counts.Unverifiable}
            </p>
            <p className="text-11 text-text-dimmer">Unverifiable</p>
          </div>
        </div>
      </div>

      {/* Claims table */}
      <div className="overflow-x-auto">
        <table className="w-full text-13 border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-2.5 text-text-dimmer text-11 font-500 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-4 py-2.5 text-text-dimmer text-11 font-500 uppercase tracking-wider">
                Metric / Claim
              </th>
              <th className="text-left px-4 py-2.5 text-text-dimmer text-11 font-500 uppercase tracking-wider">
                Declared
              </th>
              <th className="text-left px-4 py-2.5 text-text-dimmer text-11 font-500 uppercase tracking-wider">
                Recomputed
              </th>
              <th className="text-left px-4 py-2.5 text-text-dimmer text-11 font-500 uppercase tracking-wider">
                Delta
              </th>
              <th className="text-left px-4 py-2.5 text-text-dimmer text-11 font-500 uppercase tracking-wider">
                Evidence
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((claim) => (
              <tr
                key={`claim-row-${claim.id}`}
                className={`border-b border-border transition-colors duration-120 hover:bg-surface-2 ${
                  claim.status === 'Contradicted' ? 'bg-danger-bg bg-opacity-30' : ''
                }`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <StatusIcon status={claim.status} />
                    <StatusBadge status={claim.status} />
                  </div>
                </td>
                <td className="px-4 py-3 text-13 text-text font-500 max-w-[200px]">
                  {claim.metric}
                </td>
                <td className="px-4 py-3 font-mono text-12 text-text-dim">{claim.declared}</td>
                <td className="px-4 py-3 font-mono text-12">
                  {claim.recomputed ? (
                    <span
                      className={claim.status === 'Contradicted' ? 'text-danger' : 'text-success'}
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
        <div className="px-4 py-8 text-center text-text-dimmer text-13">
          No claims matching filter &quot;{filter}&quot;.
        </div>
      )}
    </div>
  );
}
