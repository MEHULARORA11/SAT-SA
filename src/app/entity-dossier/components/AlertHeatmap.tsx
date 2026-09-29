'use client';

import React from 'react';
import { HEATMAP_DATA } from '@/lib/mockData';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

function cellBg(value: number, max: number): string {
  if (value === 0) return 'rgba(192,57,43,0.15)';
  const ratio = value / max;
  if (ratio > 0.8) return 'rgba(200,151,58,0.9)';
  if (ratio > 0.6) return 'rgba(200,151,58,0.65)';
  if (ratio > 0.4) return 'rgba(200,151,58,0.40)';
  if (ratio > 0.2) return 'rgba(200,151,58,0.20)';
  return 'rgba(200,151,58,0.08)';
}

export default function AlertHeatmap() {
  const maxVal = Math.max(...HEATMAP_DATA.map((d) => d.value));

  const getValue = (hour: number, day: number) =>
    HEATMAP_DATA.find((d) => d.hour === hour && d.day === day)?.value ?? 0;

  return (
    <div className="surface-card">
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-13 font-600 text-text">Alert Volume — Hour × Weekday</h2>
        <p className="text-11 text-text-dimmer mt-0.5">
          <span className="text-danger font-500">Dark region 02:00–06:00 IST</span> — anomalous gap
          flagged by NS-03
        </p>
      </div>
      <div className="p-4 overflow-x-auto">
        <div style={{ minWidth: 520 }}>
          {/* Day labels */}
          <div className="flex gap-px mb-1 ml-8">
            {DAYS.map((d) => (
              <div key={`day-label-${d}`} className="flex-1 text-center text-11 text-text-dimmer">
                {d}
              </div>
            ))}
          </div>
          {/* Grid */}
          {HOURS.map((hour) => (
            <div key={`hour-row-${hour}`} className="flex items-center gap-px mb-px">
              <div className="w-7 text-right pr-1.5 text-11 font-mono text-text-dimmer tabular-nums shrink-0">
                {String(hour).padStart(2, '0')}
              </div>
              {DAYS.map((_, dayIdx) => {
                const val = getValue(hour, dayIdx);
                const isDark = hour >= 2 && hour <= 5;
                return (
                  <div
                    key={`cell-${hour}-${dayIdx}`}
                    className="flex-1 h-5 rounded-sm cursor-default transition-opacity duration-120 hover:opacity-70"
                    style={{
                      backgroundColor: cellBg(val, maxVal),
                      outline: isDark && val === 0 ? '1px solid var(--danger-dim)' : 'none',
                    }}
                    title={`${DAYS[dayIdx]} ${String(hour).padStart(2, '0')}:00 — ${val} alerts`}
                  />
                );
              })}
            </div>
          ))}
          {/* Legend */}
          <div className="flex items-center gap-4 mt-3 text-11 text-text-dimmer">
            <span>Low</span>
            <div className="flex gap-px flex-1">
              {[0.05, 0.15, 0.3, 0.5, 0.7, 0.9].map((r, i) => (
                <div
                  key={`legend-${i}`}
                  className="flex-1 h-2 rounded-sm"
                  style={{ backgroundColor: `rgba(200,151,58,${r})` }}
                />
              ))}
            </div>
            <span>High</span>
            <span className="flex items-center gap-1 ml-3">
              <span
                className="w-3 h-2 rounded-sm"
                style={{
                  backgroundColor: 'rgba(192,57,43,0.15)',
                  outline: '1px solid var(--danger-dim)',
                }}
              />
              Dark hour
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
