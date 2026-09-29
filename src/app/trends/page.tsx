'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { ENTITIES, SAI_TREND } from '@/lib/mockData';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const CYCLES = [
  'Cycle 1',
  'Cycle 2',
  'Cycle 3',
  'Cycle 4',
  'Cycle 5',
  'Cycle 6',
  'Cycle 7',
  'Cycle 8',
];

// Simulate per-entity trend data
function getEntityTrend(entityId: string) {
  const base = ENTITIES.find((e) => e.id === entityId)?.sai ?? 50;
  return CYCLES.map((c, i) => ({
    cycle: c,
    sai: Math.max(10, Math.min(100, base - 20 + i * 3 + (i % 3 === 0 ? -5 : 2))),
  }));
}

function Sparkline({ values, color = 'var(--accent)' }: { values: number[]; color?: string }) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values);
  const range = max - min || 1;
  const w = 80,
    h = 24;
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <circle
        cx={((values.length - 1) / (values.length - 1)) * w}
        cy={h - ((values[values.length - 1] - min) / range) * h}
        r="2.5"
        fill={color}
      />
    </svg>
  );
}

function TrendIcon({ delta }: { delta: number }) {
  if (delta > 3) return <TrendingUp size={13} className="text-danger" />;
  if (delta < -3) return <TrendingDown size={13} className="text-success" />;
  return <Minus size={13} className="text-text-dimmer" />;
}

export default function TrendsPage() {
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const activeEntities = ENTITIES.filter((e) => e.status !== 'Abstained');

  const entityTrends = activeEntities.map((e) => ({
    entity: e,
    trend: getEntityTrend(e.id),
  }));

  const selected = selectedEntity ? entityTrends.find((t) => t.entity.id === selectedEntity) : null;

  return (
    <AppLayout title="Trends" subtitle="Cycle-over-cycle supervisory attention analysis">
      <div className="px-6 py-5 space-y-5 max-w-screen-2xl mx-auto">
        {/* SAI trend chart */}
        <div className="surface-card">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="text-13 font-600 text-text">Average SAI Trend — All Entities</h2>
            <p className="text-11 text-text-dimmer mt-0.5">
              Cycle-over-cycle average Supervisory Attention Index
            </p>
          </div>
          <div className="p-4">
            <div className="flex items-end gap-2 h-32">
              {SAI_TREND.map((point, i) => {
                const maxSai = Math.max(...SAI_TREND.map((p) => p.avgSai));
                const pct = (point.avgSai / maxSai) * 100;
                const isCurrent = i === SAI_TREND.length - 1;
                return (
                  <div key={`trend-bar-${i}`} className="flex-1 flex flex-col items-center gap-1">
                    <span
                      className={`font-mono text-10 tabular-nums ${isCurrent ? 'text-accent' : 'text-text-dimmer'}`}
                    >
                      {point.avgSai}
                    </span>
                    <div
                      className="w-full rounded-t transition-all duration-300"
                      style={{
                        height: `${pct}%`,
                        backgroundColor: isCurrent ? 'var(--accent)' : 'var(--surface-3)',
                        minHeight: 4,
                      }}
                    />
                    <span className="text-10 text-text-dimmer text-center leading-tight">
                      {point.cycle.replace('Cycle ', 'C')}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-4 mt-3 text-11 text-text-dimmer border-t border-border pt-3">
              <span>
                Critical findings per cycle: {SAI_TREND.map((p) => p.criticalCount).join(' → ')}
              </span>
            </div>
          </div>
        </div>

        {/* Entity trend table */}
        <div className="surface-card">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="text-13 font-600 text-text">Entity SAI Trends</h2>
            <p className="text-11 text-text-dimmer mt-0.5">
              Click an entity to see detailed cycle breakdown
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-12 border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-2.5 text-text-dimmer text-11 font-500 uppercase tracking-wider">
                    Entity
                  </th>
                  <th className="text-left px-4 py-2.5 text-text-dimmer text-11 font-500 uppercase tracking-wider">
                    Sector
                  </th>
                  <th className="text-left px-4 py-2.5 text-text-dimmer text-11 font-500 uppercase tracking-wider">
                    Trend (8 cycles)
                  </th>
                  <th className="text-right px-4 py-2.5 text-text-dimmer text-11 font-500 uppercase tracking-wider">
                    Current SAI
                  </th>
                  <th className="text-right px-4 py-2.5 text-text-dimmer text-11 font-500 uppercase tracking-wider">
                    Δ vs prev
                  </th>
                  <th className="text-left px-4 py-2.5 text-text-dimmer text-11 font-500 uppercase tracking-wider">
                    Finding Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {entityTrends.map(({ entity, trend }) => {
                  const delta = entity.saiDelta;
                  const saiValues = trend.map((t) => t.sai);
                  const color =
                    entity.sai >= 75
                      ? 'var(--danger)'
                      : entity.sai >= 60
                        ? 'var(--warning)'
                        : entity.sai >= 40
                          ? 'var(--accent)'
                          : 'var(--success)';
                  return (
                    <tr
                      key={`trend-row-${entity.id}`}
                      className={`border-b border-border transition-colors duration-120 cursor-pointer ${selectedEntity === entity.id ? 'bg-accent-bg' : 'hover:bg-surface-2'}`}
                      onClick={() =>
                        setSelectedEntity(selectedEntity === entity.id ? null : entity.id)
                      }
                    >
                      <td className="px-4 py-2.5 text-12 text-text font-500">{entity.name}</td>
                      <td className="px-4 py-2.5">
                        <span className="badge-neutral">{entity.sector}</span>
                      </td>
                      <td className="px-4 py-2.5">
                        <Sparkline values={saiValues} color={color} />
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <span className="font-mono text-12 tabular-nums font-600" style={{ color }}>
                          {entity.sai}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <TrendIcon delta={delta} />
                          <span
                            className={`font-mono text-11 tabular-nums ${delta > 0 ? 'text-danger' : delta < 0 ? 'text-success' : 'text-text-dimmer'}`}
                          >
                            {delta > 0 ? '+' : ''}
                            {delta}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-1">
                          <span className="badge-danger">{entity.findings.new}N</span>
                          <span className="badge-warning">{entity.findings.persisting}P</span>
                          <span className="badge-success">{entity.findings.resolved}R</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected entity detail */}
        {selected && (
          <div className="surface-card">
            <div className="px-4 py-3 border-b border-border">
              <h2 className="text-13 font-600 text-text">{selected.entity.name} — Cycle Detail</h2>
              <p className="text-11 text-text-dimmer mt-0.5">
                SAI per cycle with finding classification
              </p>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {selected.trend.map((point, i) => {
                  const isCurrent = i === selected.trend.length - 1;
                  const color =
                    point.sai >= 75
                      ? 'var(--danger)'
                      : point.sai >= 60
                        ? 'var(--warning)'
                        : point.sai >= 40
                          ? 'var(--accent)'
                          : 'var(--success)';
                  return (
                    <div
                      key={`detail-${i}`}
                      className={`p-3 rounded border text-center ${isCurrent ? 'border-accent bg-accent-bg' : 'border-border bg-surface-2'}`}
                    >
                      <p className="text-10 text-text-dimmer mb-1">
                        {point.cycle.replace('Cycle ', 'C')}
                      </p>
                      <p className="font-mono text-lg font-700 tabular-nums" style={{ color }}>
                        {point.sai}
                      </p>
                      {isCurrent && <p className="text-10 text-accent mt-0.5">Current</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
