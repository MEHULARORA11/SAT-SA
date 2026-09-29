'use client';

import React from 'react';
import { SECTOR_HEAT, DOMAIN_NAMES } from '@/lib/mockData';

const SECTORS_ORDER = [
  'Power & Energy',
  'BFSI',
  'Telecom',
  'Transport',
  'Government',
  'Health',
  'Strategic',
];

function cellColor(score: number): string {
  if (score === 0) return 'var(--surface-3)';
  if (score >= 85) return 'rgba(192,57,43,0.85)';
  if (score >= 75) return 'rgba(192,57,43,0.55)';
  if (score >= 65) return 'rgba(212,132,42,0.70)';
  if (score >= 55) return 'rgba(200,151,58,0.55)';
  if (score >= 45) return 'rgba(200,151,58,0.30)';
  return 'rgba(74,140,92,0.35)';
}

function cellTextColor(score: number): string {
  if (score === 0) return 'var(--text-dimmer)';
  if (score >= 65) return 'var(--text)';
  return 'var(--text-dim)';
}

export default function DomainHeatmapChart() {
  const scoreMap: Record<string, Record<string, number>> = {};
  SECTOR_HEAT.forEach((s) => {
    scoreMap[s.sector] = s.domainScores;
  });

  return (
    <div className="surface-card">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-13 font-600 text-text">Domain Risk Heatmap</h2>
          <p className="text-11 text-text-dimmer mt-0.5">
            Average domain score by sector — higher score = more examiner concern
          </p>
        </div>
        <div className="flex items-center gap-3 text-11 text-text-dimmer">
          <span className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: 'rgba(74,140,92,0.35)' }}
            />
            Low risk
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: 'rgba(200,151,58,0.55)' }}
            />
            Elevated
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: 'rgba(192,57,43,0.85)' }}
            />
            Critical
          </span>
        </div>
      </div>
      <div className="p-4 overflow-x-auto">
        <table className="w-full border-collapse" style={{ minWidth: 700 }}>
          <thead>
            <tr>
              <th className="text-left pb-2 pr-4 text-text-dimmer text-11 font-500 uppercase tracking-wider w-36">
                Sector
              </th>
              {DOMAIN_NAMES.map((d) => (
                <th
                  key={`domain-th-${d}`}
                  className="pb-2 px-1 text-center text-text-dimmer text-11 font-500"
                  style={{ minWidth: 80 }}
                >
                  <span
                    className="block"
                    style={{
                      writingMode: 'vertical-rl',
                      transform: 'rotate(180deg)',
                      maxHeight: 90,
                    }}
                  >
                    {d}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SECTORS_ORDER.map((sector) => (
              <tr key={`heat-row-${sector}`}>
                <td className="pr-4 py-1 text-12 font-500 text-text whitespace-nowrap">{sector}</td>
                {DOMAIN_NAMES.map((domain) => {
                  const score = scoreMap[sector]?.[domain] ?? 0;
                  return (
                    <td key={`heat-cell-${sector}-${domain}`} className="px-1 py-1">
                      <div
                        className="flex items-center justify-center h-8 w-full rounded font-mono text-11 tabular-nums transition-all duration-120 hover:opacity-80 cursor-default"
                        style={{ backgroundColor: cellColor(score), color: cellTextColor(score) }}
                        title={`${sector} · ${domain}: ${score}`}
                      >
                        {score > 0 ? score : '—'}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
