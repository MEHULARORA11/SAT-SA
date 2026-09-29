'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

// BACKEND INTEGRATION: compute waterfall contributions from scoring engine
const WATERFALL_DATA = [
  { name: 'EG-06\nSLA bunching', contribution: 18, cumulative: 18, color: 'var(--danger)' },
  { name: 'EG-04\nTemplates', contribution: 14, cumulative: 32, color: 'var(--danger)' },
  { name: 'NS-01\nSilent assets', contribution: 12, cumulative: 44, color: 'var(--warning)' },
  { name: 'EG-02\nAck not inv.', contribution: 11, cumulative: 55, color: 'var(--warning)' },
  { name: 'EG-13\nCERT-In late', contribution: 10, cumulative: 65, color: 'var(--danger)' },
  { name: 'NS-03\nDark hours', contribution: 9, cumulative: 74, color: 'var(--warning)' },
  { name: 'EG-08\nThroughput', contribution: 8, cumulative: 82, color: 'var(--accent)' },
  { name: 'AN-01\nDeviation', contribution: 5, cumulative: 87, color: 'var(--accent)' },
];

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="surface-card-2 px-3 py-2 text-12 shadow-lg border border-border">
      <p className="text-text font-600 mb-1">{label}</p>
      <p className="text-text-dim">
        Contribution:{' '}
        <span className="font-mono text-accent tabular-nums">+{payload[0]?.value}</span>
      </p>
    </div>
  );
}

export default function ScoreWaterfallInner() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={WATERFALL_DATA} margin={{ top: 5, right: 10, left: -10, bottom: 40 }}>
        <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fill: 'var(--text-dimmer)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
          interval={0}
          angle={-30}
          textAnchor="end"
          height={60}
        />
        <YAxis
          tick={{ fill: 'var(--text-dimmer)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
          domain={[0, 100]}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="contribution" radius={[2, 2, 0, 0]}>
          {WATERFALL_DATA.map((entry, index) => (
            <Cell key={`waterfall-cell-${index}`} fill={entry.color} opacity={0.8} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
