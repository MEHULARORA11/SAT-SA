'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { ENTITIES, DOMAIN_NAMES } from '@/lib/mockData';
import { Zap, TrendingUp, Filter } from 'lucide-react';

interface SignalDeviation {
  id: string;
  entityId: string;
  metric: string;
  value: number;
  peerMedian: number;
  zScore: number;
  effectSize: number;
  domain: string;
  description: string;
  direction: 'above' | 'below';
}

// Generate ~200 metrics per entity, show survivors after BH-FDR
function generateDeviations(): SignalDeviation[] {
  const deviations: SignalDeviation[] = [];
  const metrics = [
    { name: 'Note entropy (bits)', domain: 'Investigation', unit: 'bits' },
    { name: 'Analyst Gini coefficient', domain: 'Security Operations', unit: '' },
    { name: 'Reassignment rate', domain: 'Security Operations', unit: '%' },
    { name: 'Reopen rate', domain: 'Incident Response', unit: '%' },
    { name: 'Auto-close rate (High+)', domain: 'Threat Detection', unit: '%' },
    { name: 'Median ack time (Critical)', domain: 'Threat Detection', unit: 'min' },
    { name: 'HHI analyst concentration', domain: 'Security Operations', unit: '' },
    { name: 'Note length (median chars)', domain: 'Investigation', unit: 'chars' },
    { name: 'Cases per alert ratio', domain: 'Investigation', unit: '' },
    { name: 'Escalations per critical', domain: 'Escalation', unit: '' },
    { name: 'Investigation steps per case', domain: 'Investigation', unit: '' },
    { name: 'Severity downgrade rate', domain: 'Governance & Oversight', unit: '%' },
  ];

  const entityDeviations: Record<
    string,
    { metric: string; value: number; peerMedian: number; z: number }[]
  > = {
    'cse-001': [
      { metric: 'Note entropy (bits)', value: 1.8, peerMedian: 4.6, z: -4.2 },
      { metric: 'Analyst Gini coefficient', value: 0.72, peerMedian: 0.41, z: 3.8 },
      { metric: 'Median ack time (Critical)', value: 2.1, peerMedian: 4.8, z: -3.6 },
    ],
    'cse-002': [
      { metric: 'Auto-close rate (High+)', value: 34.2, peerMedian: 8.1, z: 5.1 },
      { metric: 'Cases per alert ratio', value: 0.012, peerMedian: 0.031, z: -4.7 },
    ],
    'cse-003': [
      { metric: 'Note length (median chars)', value: 18, peerMedian: 142, z: -6.2 },
      { metric: 'Investigation steps per case', value: 0.8, peerMedian: 2.4, z: -4.1 },
    ],
    'cse-006': [
      { metric: 'Reopen rate', value: 0.0, peerMedian: 2.1, z: -3.9 },
      { metric: 'HHI analyst concentration', value: 0.68, peerMedian: 0.29, z: 4.3 },
    ],
    'cse-008': [
      { metric: 'Escalations per critical', value: 0.21, peerMedian: 0.87, z: -5.3 },
      { metric: 'Severity downgrade rate', value: 28.4, peerMedian: 6.2, z: 4.8 },
    ],
  };

  let idx = 0;
  Object.entries(entityDeviations).forEach(([entityId, devs]) => {
    devs.forEach((dev) => {
      const metricInfo = metrics.find((m) => m.name === dev.metric) ?? metrics[0];
      idx++;
      deviations.push({
        id: `dev-${idx}`,
        entityId,
        metric: dev.metric,
        value: dev.value,
        peerMedian: dev.peerMedian,
        zScore: dev.z,
        effectSize: Math.abs(dev.z) / 3.5,
        domain: metricInfo.domain,
        description: `Modified z-score ${dev.z.toFixed(1)} vs peer cohort (threshold ±3.5). BH-FDR q=0.05 survivor. Effect size: ${(Math.abs(dev.z) / 3.5).toFixed(2)}.`,
        direction: dev.z > 0 ? 'above' : 'below',
      });
    });
  });

  return deviations.sort((a, b) => Math.abs(b.zScore) - Math.abs(a.zScore));
}

const ALL_DEVIATIONS = generateDeviations();

function ZScoreBar({ z }: { z: number }) {
  const abs = Math.abs(z);
  const max = 7;
  const pct = Math.min((abs / max) * 100, 100);
  const color = abs >= 5 ? 'var(--danger)' : abs >= 4 ? 'var(--warning)' : 'var(--accent)';
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 bg-surface-3 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="font-mono text-11 tabular-nums" style={{ color }}>
        {z > 0 ? '+' : ''}
        {z.toFixed(1)}σ
      </span>
    </div>
  );
}

export default function DiscoveryPage() {
  const [entityFilter, setEntityFilter] = useState('All');
  const [domainFilter, setDomainFilter] = useState('All');
  const [directionFilter, setDirectionFilter] = useState<'All' | 'above' | 'below'>('All');

  const entityMap = Object.fromEntries(ENTITIES.map((e) => [e.id, e.name]));
  const activeEntities = ENTITIES.filter((e) => e.status !== 'Abstained');

  const filtered = ALL_DEVIATIONS.filter(
    (d) => entityFilter === 'All' || d.entityId === entityFilter
  )
    .filter((d) => domainFilter === 'All' || d.domain === domainFilter)
    .filter((d) => directionFilter === 'All' || d.direction === directionFilter);

  return (
    <AppLayout
      title="Signal Discovery"
      subtitle="AN-01 unexpected deviations · BH-FDR q=0.05 survivors"
    >
      <div className="px-6 py-5 space-y-5 max-w-screen-2xl mx-auto">
        {/* Explanation */}
        <div className="flex items-start gap-3 px-4 py-3 bg-surface-2 border border-border rounded">
          <Zap size={16} className="text-accent shrink-0 mt-0.5" />
          <div>
            <p className="text-13 font-600 text-text mb-1">AN-01 Signal Discovery</p>
            <p className="text-12 text-text-dim">
              Auto-generates ~200 metrics per entity-period (counts, rates, duration quantiles,
              analyst concentration, note entropy, etc.). Computes modified z-score vs peer cohort
              (0.6745 × (x − median) / MAD, threshold 3.5). Applies Benjamini-Hochberg FDR at q=0.05
              and requires minimum effect size. Survivors are &quot;unexpected deviations&quot; —
              indicators no rule covers.
            </p>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-3">
          <div className="surface-card p-4">
            <p className="text-11 font-500 uppercase tracking-widest text-text-dim mb-1">
              Survivors (BH-FDR)
            </p>
            <p className="font-mono text-2xl font-700 text-accent tabular-nums">
              {ALL_DEVIATIONS.length}
            </p>
            <p className="text-11 text-text-dimmer mt-1">
              of ~{activeEntities.length * 200} metrics tested
            </p>
          </div>
          <div className="surface-card p-4">
            <p className="text-11 font-500 uppercase tracking-widest text-text-dim mb-1">
              Entities Flagged
            </p>
            <p className="font-mono text-2xl font-700 text-warning tabular-nums">
              {new Set(ALL_DEVIATIONS.map((d) => d.entityId)).size}
            </p>
            <p className="text-11 text-text-dimmer mt-1">of {activeEntities.length} active</p>
          </div>
          <div className="surface-card p-4">
            <p className="text-11 font-500 uppercase tracking-widest text-text-dim mb-1">
              Max |z-score|
            </p>
            <p className="font-mono text-2xl font-700 text-danger tabular-nums">
              {Math.max(...ALL_DEVIATIONS.map((d) => Math.abs(d.zScore))).toFixed(1)}σ
            </p>
            <p className="text-11 text-text-dimmer mt-1">threshold: ±3.5σ</p>
          </div>
        </div>

        {/* Filters + table */}
        <div className="surface-card">
          <div className="px-4 py-3 border-b border-border flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-13 font-600 text-text">Unexpected Deviations</h2>
              <p className="text-11 text-text-dimmer mt-0.5">
                Showing {filtered.length} of {ALL_DEVIATIONS.length} survivors
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
                    <option key={`disc-ent-${e.id}`} value={e.id}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>
              <select
                value={domainFilter}
                onChange={(e) => setDomainFilter(e.target.value)}
                className="bg-surface-2 border border-border text-text-dim text-12 rounded px-2 py-1 focus:outline-none focus:border-accent"
              >
                <option value="All">All Domains</option>
                {DOMAIN_NAMES.map((d) => (
                  <option key={`disc-dom-${d}`} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-1 bg-surface-2 border border-border rounded p-0.5">
                {(['All', 'above', 'below'] as const).map((dir) => (
                  <button
                    key={`dir-${dir}`}
                    onClick={() => setDirectionFilter(dir)}
                    className={`text-12 px-2.5 py-1 rounded transition-all duration-120 ${directionFilter === dir ? 'bg-accent-bg text-accent border border-accent-dim' : 'text-text-dimmer hover:text-text'}`}
                  >
                    {dir === 'All' ? 'All' : dir === 'above' ? '↑ Above' : '↓ Below'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-12 border-collapse">
              <thead>
                <tr className="border-b border-border">
                  {[
                    'Metric',
                    'Entity',
                    'Domain',
                    'Value',
                    'Peer Median',
                    'z-score',
                    'Effect Size',
                    'Direction',
                  ].map((h) => (
                    <th
                      key={`disc-th-${h}`}
                      className="text-left px-4 py-2.5 text-text-dimmer text-11 font-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((dev) => (
                  <tr
                    key={`dev-row-${dev.id}`}
                    className="border-b border-border hover:bg-surface-2 transition-colors duration-120"
                  >
                    <td className="px-4 py-2.5">
                      <div className="text-12 text-text font-500">{dev.metric}</div>
                      <div className="text-10 text-text-dimmer mt-0.5 max-w-[200px] truncate">
                        {dev.description}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-12 text-text-dim max-w-[140px] truncate">
                      {entityMap[dev.entityId] ?? dev.entityId}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="badge-neutral">{dev.domain}</span>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-12 tabular-nums text-text">
                      {typeof dev.value === 'number'
                        ? dev.value.toFixed(dev.value < 1 ? 3 : 1)
                        : dev.value}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-12 tabular-nums text-text-dim">
                      {typeof dev.peerMedian === 'number'
                        ? dev.peerMedian.toFixed(dev.peerMedian < 1 ? 3 : 1)
                        : dev.peerMedian}
                    </td>
                    <td className="px-4 py-2.5">
                      <ZScoreBar z={dev.zScore} />
                    </td>
                    <td className="px-4 py-2.5 font-mono text-11 tabular-nums text-text-dim">
                      {dev.effectSize.toFixed(2)}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1">
                        {dev.direction === 'above' ? (
                          <>
                            <TrendingUp size={11} className="text-warning" />
                            <span className="text-11 text-warning">Above</span>
                          </>
                        ) : (
                          <>
                            <TrendingUp size={11} className="text-info rotate-180" />
                            <span className="text-11 text-info">Below</span>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="px-4 py-12 text-center text-text-dimmer text-13">
              No deviations matching current filters.
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
