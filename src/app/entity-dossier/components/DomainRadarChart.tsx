'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ENTITY_RADAR_DATA } from '@/lib/mockData';

const RadarChartInner = dynamic(() => import('./DomainRadarChartInner'), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-surface-2 rounded h-72 w-full" />,
});

export default function DomainRadarChart() {
  return (
    <div className="surface-card">
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-13 font-600 text-text">Domain Scores — 8-Axis Radar</h2>
        <p className="text-11 text-text-dimmer mt-0.5">Entity vs sector peer median · Cycle 8</p>
      </div>
      <div className="p-4 flex items-center justify-center">
        <div style={{ width: '100%', height: 300 }}>
          <RadarChartInner data={ENTITY_RADAR_DATA} />
        </div>
      </div>
      <div className="px-4 pb-3 flex items-center gap-4 text-11 text-text-dimmer">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 rounded" style={{ backgroundColor: 'var(--danger)' }} />
          This entity
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 rounded border-dashed border border-text-dimmer" />
          Sector peer median
        </span>
      </div>
    </div>
  );
}
