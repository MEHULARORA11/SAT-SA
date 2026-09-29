'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { ENTITIES, DOMAIN_NAMES } from '@/lib/mockData';
import { TrendingUp, TrendingDown, Minus, Filter } from 'lucide-react';

const METRICS = [
  { key: 'sai', label: 'SAI Score', unit: '', description: 'Supervisory Attention Index (0–100)' },
  { key: 'drs', label: 'Data Reliability', unit: '', description: 'Data Reliability Score (0–1)' },
  {
    key: 'alertCount',
    label: 'Alert Volume',
    unit: '',
    description: 'Total alerts in submission period',
  },
  {
    key: 'caseCount',
    label: 'Case Count',
    unit: '',
    description: 'Total cases in submission period',
  },
  {
    key: 'analystCount',
    label: 'Analyst Count',
    unit: '',
    description: 'Number of analysts in SOC',
  },
];

function FunnelPlot({ entities, metric }: { entities: typeof ENTITIES; metric: string }) {
  const active = entities.filter((e) => e.status !== 'Abstained');
  const values = active.map((e) => {
    const v = e[metric as keyof typeof e];
    return typeof v === 'number' ? v : 0;
  });
  const sorted = [...values].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)] ?? 0;
  const max = Math.max(...values, 1);

  return (
    <div className="space-y-1">
      {active.map((e) => {
        const v = e[metric as keyof typeof e];
        const val = typeof v === 'number' ? v : 0;
        const pct = (val / max) * 100;
        const isAbove = val > median * 1.2;
        const isBelow = val < median * 0.8;
        const color =
          metric === 'sai'
            ? val >= 75
              ? 'var(--danger)'
              : val >= 60
                ? 'var(--warning)'
                : val >= 40
                  ? 'var(--accent)'
                  : 'var(--success)'
            : isAbove
              ? 'var(--warning)'
              : isBelow
                ? 'var(--info)'
                : 'var(--text-dim)';

        return (
          <div key={`funnel-${e.id}`} className="flex items-center gap-2">
            <span className="text-11 text-text-dimmer w-36 truncate shrink-0">{e.name}</span>
            <div className="flex-1 h-3 bg-surface-3 rounded-full overflow-hidden relative">
              {/* Median line */}
              <div
                className="absolute top-0 bottom-0 w-px bg-border z-10"
                style={{ left: `${(median / max) * 100}%` }}
              />
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${pct}%`, backgroundColor: color }}
              />
            </div>
            <span className="font-mono text-11 tabular-nums w-14 text-right" style={{ color }}>
              {metric === 'drs' ? val.toFixed(2) : val.toLocaleString('en-IN')}
            </span>
          </div>
        );
      })}
      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border">
        <span className="text-11 text-text-dimmer w-36 shrink-0">Sector median</span>
        <div className="flex-1 h-px bg-border relative">
          <div
            className="absolute top-1/2 -translate-y-1/2 w-px h-4 bg-accent"
            style={{ left: `${(median / max) * 100}%` }}
          />
        </div>
        <span className="font-mono text-11 text-accent tabular-nums w-14 text-right">
          {metric === 'drs' ? median.toFixed(2) : median.toLocaleString('en-IN')}
        </span>
      </div>
    </div>
  );
}

function BoxplotRow({ label, values, max }: { label: string; values: number[]; max: number }) {
  const sorted = [...values].sort((a, b) => a - b);
  const q1 = sorted[Math.floor(sorted.length * 0.25)] ?? 0;
  const median = sorted[Math.floor(sorted.length * 0.5)] ?? 0;
  const q3 = sorted[Math.floor(sorted.length * 0.75)] ?? 0;
  const min = sorted[0] ?? 0;
  const maxVal = sorted[sorted.length - 1] ?? 0;

  const pct = (v: number) => `${(v / max) * 100}%`;

  return (
    <div className="flex items-center gap-3">
      <span className="text-11 text-text-dimmer w-28 shrink-0 truncate">{label}</span>
      <div className="flex-1 h-6 relative">
        {/* Whisker line */}
        <div
          className="absolute top-1/2 -translate-y-px h-px bg-border"
          style={{ left: pct(min), right: `${100 - (maxVal / max) * 100}%` }}
        />
        {/* Box */}
        <div
          className="absolute top-1 bottom-1 bg-accent-bg border border-accent-dim rounded"
          style={{ left: pct(q1), width: `${((q3 - q1) / max) * 100}%` }}
        />
        {/* Median line */}
        <div className="absolute top-0 bottom-0 w-0.5 bg-accent" style={{ left: pct(median) }} />
        {/* Min/Max ticks */}
        <div className="absolute top-1 bottom-1 w-px bg-border" style={{ left: pct(min) }} />
        <div className="absolute top-1 bottom-1 w-px bg-border" style={{ left: pct(maxVal) }} />
      </div>
      <div className="flex gap-2 text-10 font-mono text-text-dimmer w-40 shrink-0">
        <span>Q1:{q1}</span>
        <span className="text-accent">M:{median}</span>
        <span>Q3:{q3}</span>
      </div>
    </div>
  );
}

export default function PeersPage() {
  const [sectorFilter, setSectorFilter] = useState('All');
  const [selectedMetric, setSelectedMetric] = useState('sai');

  const sectors = ['All', ...Array.from(new Set(ENTITIES.map((e) => e.sector)))];
  const filteredEntities = ENTITIES.filter(
    (e) => (sectorFilter === 'All' || e.sector === sectorFilter) && e.status !== 'Abstained'
  );

  const metricInfo = METRICS.find((m) => m.key === selectedMetric) ?? METRICS[0];

  // Domain comparison table
  const domainRows = DOMAIN_NAMES.map((domain) => {
    const scores = filteredEntities.map((e) => e.domainScores[domain] ?? 0);
    const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const min = Math.min(...scores);
    const max = Math.max(...scores);
    return { domain, avg, min, max, scores };
  });

  return (
    <AppLayout title="Peer Benchmark" subtitle="Cross-entity comparison by sector and domain">
      <div className="px-6 py-5 space-y-5 max-w-screen-2xl mx-auto">
        {/* Controls */}
        <div className="surface-card px-4 py-3 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Filter size={12} className="text-text-dimmer" />
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="bg-surface-2 border border-border text-text-dim text-12 rounded px-2 py-1 focus:outline-none focus:border-accent"
            >
              {sectors.map((s) => (
                <option key={`sec-${s}`} value={s}>
                  {s === 'All' ? 'All Sectors' : s}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1 bg-surface-2 border border-border rounded p-0.5">
            {METRICS.map((m) => (
              <button
                key={`metric-tab-${m.key}`}
                onClick={() => setSelectedMetric(m.key)}
                className={`text-12 px-2.5 py-1 rounded transition-all duration-120 ${selectedMetric === m.key ? 'bg-accent-bg text-accent border border-accent-dim' : 'text-text-dimmer hover:text-text'}`}
              >
                {m.label}
              </button>
            ))}
          </div>
          <span className="text-11 text-text-dimmer ml-auto">
            {filteredEntities.length} entities · {metricInfo.description}
          </span>
        </div>

        {/* Funnel plot */}
        <div className="surface-card">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="text-13 font-600 text-text">Funnel Plot — {metricInfo.label}</h2>
            <p className="text-11 text-text-dimmer mt-0.5">
              Vertical line = sector median. Entities outside ±20% of median are highlighted.
            </p>
          </div>
          <div className="p-4">
            <FunnelPlot entities={filteredEntities} metric={selectedMetric} />
          </div>
        </div>

        {/* Domain scores comparison */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {/* Domain boxplots */}
          <div className="surface-card">
            <div className="px-4 py-3 border-b border-border">
              <h2 className="text-13 font-600 text-text">Domain Score Distribution</h2>
              <p className="text-11 text-text-dimmer mt-0.5">
                Box = Q1–Q3, line = median, whiskers = min/max
              </p>
            </div>
            <div className="p-4 space-y-2">
              {domainRows.map((row) => (
                <BoxplotRow
                  key={`boxplot-${row.domain}`}
                  label={row.domain}
                  values={row.scores}
                  max={100}
                />
              ))}
            </div>
          </div>

          {/* Domain averages table */}
          <div className="surface-card">
            <div className="px-4 py-3 border-b border-border">
              <h2 className="text-13 font-600 text-text">Domain Averages by Sector</h2>
              <p className="text-11 text-text-dimmer mt-0.5">
                Average domain score across entities in cohort
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-12 border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-2.5 text-text-dimmer text-11 font-500 uppercase tracking-wider">
                      Domain
                    </th>
                    <th className="text-right px-4 py-2.5 text-text-dimmer text-11 font-500 uppercase tracking-wider">
                      Avg
                    </th>
                    <th className="text-right px-4 py-2.5 text-text-dimmer text-11 font-500 uppercase tracking-wider">
                      Min
                    </th>
                    <th className="text-right px-4 py-2.5 text-text-dimmer text-11 font-500 uppercase tracking-wider">
                      Max
                    </th>
                    <th className="text-right px-4 py-2.5 text-text-dimmer text-11 font-500 uppercase tracking-wider">
                      Range
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {domainRows.map((row) => {
                    const color =
                      row.avg >= 75
                        ? 'var(--danger)'
                        : row.avg >= 60
                          ? 'var(--warning)'
                          : row.avg >= 40
                            ? 'var(--accent)'
                            : 'var(--success)';
                    return (
                      <tr
                        key={`domain-row-${row.domain}`}
                        className="border-b border-border hover:bg-surface-2 transition-colors duration-120"
                      >
                        <td className="px-4 py-2.5 text-12 text-text">{row.domain}</td>
                        <td className="px-4 py-2.5 text-right">
                          <span
                            className="font-mono text-12 tabular-nums font-600"
                            style={{ color }}
                          >
                            {row.avg}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono text-12 tabular-nums text-success">
                          {row.min}
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono text-12 tabular-nums text-danger">
                          {row.max}
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {row.max - row.min > 40 ? (
                              <TrendingUp size={11} className="text-warning" />
                            ) : row.max - row.min < 20 ? (
                              <Minus size={11} className="text-success" />
                            ) : (
                              <TrendingDown size={11} className="text-text-dimmer" />
                            )}
                            <span className="font-mono text-11 text-text-dim tabular-nums">
                              {row.max - row.min}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Entity comparison table */}
        <div className="surface-card">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="text-13 font-600 text-text">Entity Comparison Matrix</h2>
            <p className="text-11 text-text-dimmer mt-0.5">
              All 8 domain scores per entity · Colour = score level
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-12 border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-2.5 text-text-dimmer text-11 font-500 uppercase tracking-wider sticky left-0 bg-surface z-10">
                    Entity
                  </th>
                  <th className="text-right px-3 py-2.5 text-text-dimmer text-11 font-500 uppercase tracking-wider">
                    SAI
                  </th>
                  {DOMAIN_NAMES.map((d) => (
                    <th
                      key={`th-${d}`}
                      className="text-right px-3 py-2.5 text-text-dimmer text-10 font-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      {d
                        .split(' ')
                        .map((w) => w[0])
                        .join('')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredEntities.map((e) => (
                  <tr
                    key={`cmp-${e.id}`}
                    className="border-b border-border hover:bg-surface-2 transition-colors duration-120"
                  >
                    <td className="px-4 py-2 text-12 text-text font-500 sticky left-0 bg-surface z-10 max-w-[160px] truncate">
                      {e.name}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <span
                        className={`font-mono text-12 tabular-nums font-600 ${e.sai >= 75 ? 'text-danger' : e.sai >= 60 ? 'text-warning' : e.sai >= 40 ? 'text-accent' : 'text-success'}`}
                      >
                        {e.sai}
                      </span>
                    </td>
                    {DOMAIN_NAMES.map((d) => {
                      const score = e.domainScores[d] ?? 0;
                      const color =
                        score >= 75
                          ? 'var(--danger)'
                          : score >= 60
                            ? 'var(--warning)'
                            : score >= 40
                              ? 'var(--accent)'
                              : 'var(--success)';
                      return (
                        <td key={`cell-${e.id}-${d}`} className="px-3 py-2 text-right">
                          <span className="font-mono text-11 tabular-nums" style={{ color }}>
                            {score}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2 border-t border-border text-10 text-text-dimmer font-mono">
            Domain abbreviations: TD=Threat Detection · IN=Investigation · ES=Escalation ·
            IR=Incident Response · SO=Security Operations · GO=Governance &amp; Oversight ·
            OD=Operational Discipline · CR=Cyber Resilience
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
