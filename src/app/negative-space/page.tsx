'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { ENTITIES, FINDINGS } from '@/lib/mockData';
import { TrendingDown, AlertTriangle, Eye, BarChart3, Filter } from 'lucide-react';

// Negative space findings derived from findings data
const NS_FINDINGS = FINDINGS.filter((f) => f.category === 'negative_space');

function DarkHoursGrid() {
  // 24h x 7 day grid showing coverage gaps
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Simulate dark hours for demo entity
  const isDark = (h: number, d: number) => {
    if (h >= 2 && h <= 5) return true; // 02:00-06:00 dark window
    if (d >= 5 && h >= 22) return true; // Weekend late night
    return false;
  };

  const isLow = (h: number, d: number) => {
    if (h >= 0 && h <= 1) return true;
    if (h >= 6 && h <= 7) return true;
    if (d >= 5 && h >= 18) return true;
    return false;
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[600px]">
        <div className="flex items-center gap-1 mb-2">
          <div className="w-8 shrink-0" />
          {hours.map((h) => (
            <div
              key={`hour-${h}`}
              className="flex-1 text-center text-10 font-mono text-text-dimmer"
            >
              {h % 4 === 0 ? `${h.toString().padStart(2, '0')}` : ''}
            </div>
          ))}
        </div>
        {days.map((day, d) => (
          <div key={`day-${day}`} className="flex items-center gap-1 mb-1">
            <div className="w-8 shrink-0 text-11 text-text-dimmer font-mono">{day}</div>
            {hours.map((h) => {
              const dark = isDark(h, d);
              const low = isLow(h, d);
              return (
                <div
                  key={`cell-${d}-${h}`}
                  className="flex-1 h-5 rounded-sm transition-colors duration-120"
                  style={{
                    backgroundColor: dark
                      ? 'var(--danger)'
                      : low
                        ? 'rgba(var(--warning-rgb, 180,120,0), 0.3)'
                        : 'var(--surface-3)',
                    opacity: dark ? 0.8 : low ? 0.6 : 0.4,
                  }}
                  title={`${day} ${h.toString().padStart(2, '0')}:00 — ${dark ? 'DARK HOUR' : low ? 'Low activity' : 'Normal'}`}
                />
              );
            })}
          </div>
        ))}
        <div className="flex items-center gap-4 mt-3 text-11 text-text-dimmer">
          <div className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: 'var(--danger)', opacity: 0.8 }}
            />
            <span>Dark hour (≥4h contiguous gap)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: 'var(--surface-3)', opacity: 0.4 }}
            />
            <span>Normal activity</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SilentAssetsList() {
  const silentAssets = [
    {
      id: 'asset-ot-001',
      name: 'OT-CTRL-001',
      class: 'OT Controller',
      criticality: 5,
      zone: 'OT',
      lastAlert: 'Never',
      peerAvg: '23 alerts/90d',
    },
    {
      id: 'asset-ot-002',
      name: 'OT-SCADA-003',
      class: 'SCADA Server',
      criticality: 5,
      zone: 'OT',
      lastAlert: 'Never',
      peerAvg: '31 alerts/90d',
    },
    {
      id: 'asset-ot-003',
      name: 'OT-HMI-007',
      class: 'HMI Terminal',
      criticality: 4,
      zone: 'OT',
      lastAlert: 'Never',
      peerAvg: '18 alerts/90d',
    },
    {
      id: 'asset-ot-004',
      name: 'OT-RTU-012',
      class: 'RTU',
      criticality: 4,
      zone: 'OT',
      lastAlert: 'Never',
      peerAvg: '12 alerts/90d',
    },
    {
      id: 'asset-ot-005',
      name: 'OT-PLC-019',
      class: 'PLC',
      criticality: 5,
      zone: 'OT',
      lastAlert: 'Never',
      peerAvg: '27 alerts/90d',
    },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-12 border-collapse">
        <thead>
          <tr className="border-b border-border">
            {['Asset ID', 'Class', 'Criticality', 'Zone', 'Last Alert', 'Peer Avg'].map((h) => (
              <th
                key={`sa-th-${h}`}
                className="text-left px-4 py-2.5 text-text-dimmer text-11 font-500 uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {silentAssets.map((a) => (
            <tr
              key={`sa-${a.id}`}
              className="border-b border-border hover:bg-surface-2 transition-colors duration-120"
            >
              <td className="px-4 py-2.5 font-mono text-11 text-accent">{a.name}</td>
              <td className="px-4 py-2.5 text-12 text-text-dim">{a.class}</td>
              <td className="px-4 py-2.5">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div
                      key={`crit-${i}`}
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: i < a.criticality ? 'var(--danger)' : 'var(--surface-3)',
                      }}
                    />
                  ))}
                  <span className="font-mono text-11 text-danger ml-1">{a.criticality}/5</span>
                </div>
              </td>
              <td className="px-4 py-2.5">
                <span className="badge-warning">{a.zone}</span>
              </td>
              <td className="px-4 py-2.5">
                <span className="badge-danger">Never</span>
              </td>
              <td className="px-4 py-2.5 font-mono text-11 text-text-dim">{a.peerAvg}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function NegativeSpacePage() {
  const [entityFilter, setEntityFilter] = useState('All');
  const [activeTab, setActiveTab] = useState<
    'dark-hours' | 'silent-assets' | 'missing-categories' | 'volume-collapse'
  >('dark-hours');

  const filteredEntities = ENTITIES.filter((e) => e.status !== 'Abstained');

  const tabs = [
    { id: 'dark-hours', label: 'Dark Hours', icon: <Eye size={13} />, count: 4 },
    { id: 'silent-assets', label: 'Silent Assets', icon: <AlertTriangle size={13} />, count: 14 },
    {
      id: 'missing-categories',
      label: 'Missing Categories',
      icon: <BarChart3 size={13} />,
      count: 6,
    },
    { id: 'volume-collapse', label: 'Volume Collapse', icon: <TrendingDown size={13} />, count: 2 },
  ] as const;

  return (
    <AppLayout title="Negative Space Lab" subtitle="Evidence that should exist but does not">
      <div className="px-6 py-5 space-y-5 max-w-screen-2xl mx-auto">
        {/* Explanation */}
        <div className="flex items-start gap-3 px-4 py-3 bg-surface-2 border border-border rounded">
          <TrendingDown size={16} className="text-warning shrink-0 mt-0.5" />
          <div>
            <p className="text-13 font-600 text-text mb-1">Negative Space Detection</p>
            <p className="text-12 text-text-dim">
              Negative space findings identify evidence that <em>should</em> exist but does not —
              silent critical assets, missing alert categories, dark monitoring hours, and volume
              collapses. These are detected using Gamma-Poisson empirical-Bayes rate models fitted
              from peer cohorts. Submission incompleteness is ruled out before any negative-space
              claim is made (DRS ≥ 0.60 required).
            </p>
          </div>
        </div>

        {/* Summary KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {tabs.map((tab) => (
            <div key={`ns-kpi-${tab.id}`} className="surface-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-warning">{tab.icon}</span>
                <p className="text-11 font-500 uppercase tracking-widest text-text-dim">
                  {tab.label}
                </p>
              </div>
              <p className="font-mono text-2xl font-700 text-warning tabular-nums">{tab.count}</p>
              <p className="text-11 text-text-dimmer mt-1">findings this cycle</p>
            </div>
          ))}
        </div>

        {/* Entity filter */}
        <div className="surface-card px-4 py-3 flex items-center gap-3">
          <Filter size={12} className="text-text-dimmer" />
          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="bg-surface-2 border border-border text-text-dim text-12 rounded px-2 py-1 focus:outline-none focus:border-accent"
          >
            <option value="All">All Entities</option>
            {filteredEntities.map((e) => (
              <option key={`ns-ent-${e.id}`} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
          <span className="text-11 text-text-dimmer ml-auto">
            Showing:{' '}
            {entityFilter === 'All'
              ? 'All entities'
              : filteredEntities.find((e) => e.id === entityFilter)?.name}
          </span>
        </div>

        {/* Tabs */}
        <div className="surface-card">
          <div className="flex border-b border-border">
            {tabs.map((tab) => (
              <button
                key={`ns-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-12 font-500 border-b-2 transition-all duration-120 ${
                  activeTab === tab.id
                    ? 'border-accent text-accent'
                    : 'border-transparent text-text-dimmer hover:text-text'
                }`}
              >
                {tab.icon}
                {tab.label}
                <span
                  className={`font-mono text-11 px-1.5 py-0.5 rounded ${activeTab === tab.id ? 'bg-accent-bg text-accent' : 'bg-surface-2 text-text-dimmer'}`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="p-4">
            {activeTab === 'dark-hours' && (
              <div>
                <div className="mb-4">
                  <h3 className="text-13 font-600 text-text mb-1">
                    Dark Hours — Alert Coverage Heatmap
                  </h3>
                  <p className="text-11 text-text-dimmer">
                    NS-03: Contiguous ≥4h windows with alert counts far below entity own and peer
                    expectation. Red cells = dark hours. Entity: Northern Grid Operations (demo).
                  </p>
                </div>
                <DarkHoursGrid />
                <div className="mt-4 px-3 py-2.5 bg-danger-bg border border-danger-dim rounded">
                  <p className="text-12 text-danger font-600 mb-1">
                    Finding NS-03 — Dark Hours Detected
                  </p>
                  <p className="text-12 text-text-dim">
                    4-hour contiguous window 02:00–06:00 IST shows alert rate 97% below entity
                    expectation and 94% below sector peers. No analyst shift change logged.
                    Posterior predictive P(zero | expected) &lt; 0.01.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'silent-assets' && (
              <div>
                <div className="mb-4">
                  <h3 className="text-13 font-600 text-text mb-1">Silent Critical Assets</h3>
                  <p className="text-11 text-text-dimmer">
                    NS-01: Criticality ≥4 assets with zero alerts while comparable peer assets are
                    active. 14 OT assets identified for Western Railway Cyber Cell.
                  </p>
                </div>
                <SilentAssetsList />
                <div className="mt-4 px-3 py-2.5 bg-danger-bg border border-danger-dim rounded">
                  <p className="text-12 text-danger font-600 mb-1">
                    Finding NS-01 — Silent Critical Assets
                  </p>
                  <p className="text-12 text-text-dim">
                    14 OT assets with criticality ≥4 produced zero alerts over 90 days. Peer
                    comparable assets averaged 23 alerts/asset. Gamma-Poisson posterior P(zero |
                    expected) &lt; 0.001.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'missing-categories' && (
              <div>
                <div className="mb-4">
                  <h3 className="text-13 font-600 text-text mb-1">
                    Missing Expected Alert Categories
                  </h3>
                  <p className="text-11 text-text-dimmer">
                    NS-02: Categories from the sector profile with P(zero | expected) &lt; 0.01.
                    Ministry of Finance CISO — 6 of 12 expected ATT&CK tactics absent.
                  </p>
                </div>
                <div className="space-y-2">
                  {[
                    {
                      tactic: 'T1078 — Valid Accounts',
                      expected: '8.2/month',
                      observed: 0,
                      status: 'Absent',
                    },
                    {
                      tactic: 'T1566 — Phishing',
                      expected: '12.4/month',
                      observed: 0,
                      status: 'Absent',
                    },
                    {
                      tactic: 'T1190 — Exploit Public-Facing App',
                      expected: '5.1/month',
                      observed: 0,
                      status: 'Absent',
                    },
                    {
                      tactic: 'T1486 — Data Encrypted for Impact',
                      expected: '2.3/month',
                      observed: 0,
                      status: 'Absent',
                    },
                    {
                      tactic: 'T1059 — Command and Scripting',
                      expected: '15.7/month',
                      observed: 2,
                      status: 'Low',
                    },
                    {
                      tactic: 'T1055 — Process Injection',
                      expected: '6.8/month',
                      observed: 1,
                      status: 'Low',
                    },
                    {
                      tactic: 'T1021 — Remote Services',
                      expected: '9.3/month',
                      observed: 11,
                      status: 'Normal',
                    },
                    {
                      tactic: 'T1110 — Brute Force',
                      expected: '18.2/month',
                      observed: 22,
                      status: 'Normal',
                    },
                  ].map((row) => (
                    <div
                      key={`cat-${row.tactic}`}
                      className="flex items-center gap-3 px-3 py-2 rounded border border-border hover:bg-surface-2 transition-colors duration-120"
                    >
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${row.status === 'Absent' ? 'bg-danger' : row.status === 'Low' ? 'bg-warning' : 'bg-success'}`}
                      />
                      <span className="font-mono text-11 text-text flex-1">{row.tactic}</span>
                      <span className="text-11 text-text-dimmer w-28 text-right">
                        Expected: {row.expected}
                      </span>
                      <span
                        className={`font-mono text-11 tabular-nums w-20 text-right ${row.status === 'Absent' ? 'text-danger' : row.status === 'Low' ? 'text-warning' : 'text-success'}`}
                      >
                        Observed: {row.observed}
                      </span>
                      <span
                        className={`badge-${row.status === 'Absent' ? 'danger' : row.status === 'Low' ? 'warning' : 'success'} w-16 text-center`}
                      >
                        {row.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'volume-collapse' && (
              <div>
                <div className="mb-4">
                  <h3 className="text-13 font-600 text-text mb-1">Volume Collapse Detection</h3>
                  <p className="text-11 text-text-dimmer">
                    NS-04: CUSUM and EWMA on weekly volume; drops &gt;50% with no asset
                    decommissioning. NTPC Central SOC — 68% drop in week 38.
                  </p>
                </div>
                <div className="space-y-2">
                  {[
                    { week: 'Week 34', volume: 2840, cusum: 0.2, ewma: 2840, flag: false },
                    { week: 'Week 35', volume: 2910, cusum: 0.1, ewma: 2862, flag: false },
                    { week: 'Week 36', volume: 2780, cusum: 0.3, ewma: 2848, flag: false },
                    { week: 'Week 37', volume: 2950, cusum: 0.1, ewma: 2868, flag: false },
                    { week: 'Week 38', volume: 940, cusum: 5.8, ewma: 2624, flag: true },
                    { week: 'Week 39', volume: 880, cusum: 9.2, ewma: 2390, flag: true },
                  ].map((row) => (
                    <div
                      key={`vol-${row.week}`}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded border transition-colors duration-120 ${row.flag ? 'border-danger-dim bg-danger-bg' : 'border-border hover:bg-surface-2'}`}
                    >
                      <span className="font-mono text-12 text-text-dim w-16 shrink-0">
                        {row.week}
                      </span>
                      <div className="flex-1 h-3 bg-surface-3 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${(row.volume / 3000) * 100}%`,
                            backgroundColor: row.flag ? 'var(--danger)' : 'var(--accent)',
                          }}
                        />
                      </div>
                      <span
                        className={`font-mono text-12 tabular-nums w-16 text-right ${row.flag ? 'text-danger' : 'text-text-dim'}`}
                      >
                        {row.volume.toLocaleString('en-IN')}
                      </span>
                      <span
                        className={`font-mono text-11 tabular-nums w-20 text-right ${row.cusum > 5 ? 'text-danger' : 'text-text-dimmer'}`}
                      >
                        CUSUM: {row.cusum.toFixed(1)}σ
                      </span>
                      {row.flag && <span className="badge-danger shrink-0">FLAGGED</span>}
                    </div>
                  ))}
                </div>
                <div className="mt-4 px-3 py-2.5 bg-danger-bg border border-danger-dim rounded">
                  <p className="text-12 text-danger font-600 mb-1">
                    Finding NS-04 — Volume Collapse
                  </p>
                  <p className="text-12 text-text-dim">
                    CUSUM (k=0.5σ, h=5σ) and EWMA (λ=0.2, L=3) both flag 68% drop in weekly alert
                    volume starting week 38 (2026-09-14). No asset decommissioning recorded.
                    Possible disabled rule or dead log pipeline.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* NS Findings list */}
        <div className="surface-card">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="text-13 font-600 text-text">All Negative Space Findings</h2>
            <p className="text-11 text-text-dimmer mt-0.5">
              {NS_FINDINGS.length} findings across all entities
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-12 border-collapse">
              <thead>
                <tr className="border-b border-border">
                  {['Detector', 'Entity', 'Severity', 'Strength', 'Status', 'Summary'].map((h) => (
                    <th
                      key={`ns-th-${h}`}
                      className="text-left px-4 py-2.5 text-text-dimmer text-11 font-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {NS_FINDINGS.map((f) => {
                  const entity = ENTITIES.find((e) => e.id === f.entityId);
                  return (
                    <tr
                      key={`ns-finding-${f.id}`}
                      className="border-b border-border hover:bg-surface-2 transition-colors duration-120"
                    >
                      <td className="px-4 py-2.5 font-mono text-11 text-accent">{f.detectorId}</td>
                      <td className="px-4 py-2.5 text-12 text-text-dim">
                        {entity?.name ?? f.entityId}
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className={
                            f.severity === 'Critical'
                              ? 'badge-danger'
                              : f.severity === 'High'
                                ? 'badge-warning'
                                : 'badge-info'
                          }
                        >
                          {f.severity}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 font-mono text-11 text-accent tabular-nums">
                        {f.strength.toFixed(2)}
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className={
                            f.status === 'New'
                              ? 'badge-danger'
                              : f.status === 'Persisting'
                                ? 'badge-warning'
                                : 'badge-success'
                          }
                        >
                          {f.status}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-12 text-text-dim max-w-[300px] truncate">
                        {f.summary}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
