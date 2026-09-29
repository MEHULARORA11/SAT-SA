'use client';

import React from 'react';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface RadarDataPoint {
  domain: string;
  entity: number;
  peer: number;
}

interface Props {
  data: RadarDataPoint[];
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="surface-card-2 px-3 py-2 text-12 shadow-lg">
      <p className="text-text font-600 mb-1">{label}</p>
      {payload.map((p) => (
        <div key={`tooltip-${p.name}`} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-text-dim">{p.name}:</span>
          <span className="font-mono text-text tabular-nums">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function DomainRadarChartInner({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
        <PolarGrid stroke="var(--border)" />
        <PolarAngleAxis
          dataKey="domain"
          tick={{ fill: 'var(--text-dim)', fontSize: 11, fontFamily: 'var(--font-sans)' }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{ fill: 'var(--text-dimmer)', fontSize: 10 }}
          stroke="var(--border)"
        />
        <Radar
          name="This entity"
          dataKey="entity"
          stroke="var(--danger)"
          fill="var(--danger)"
          fillOpacity={0.15}
          strokeWidth={1.5}
        />
        <Radar
          name="Peer median"
          dataKey="peer"
          stroke="var(--text-dimmer)"
          fill="var(--text-dimmer)"
          fillOpacity={0.05}
          strokeWidth={1}
          strokeDasharray="4 4"
        />
        <Tooltip content={<CustomTooltip />} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
