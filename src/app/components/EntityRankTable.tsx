'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ENTITIES, type CSEntity } from '@/lib/mockData';
import { ChevronUp, ChevronDown, ArrowUpRight, Filter, Download } from 'lucide-react';

type SortKey = keyof Pick<CSEntity, 'sai' | 'drs' | 'name' | 'sector' | 'alertCount' | 'caseCount'>;

function SaiBar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = (value / max) * 100;
  const color =
    value >= 75
      ? 'var(--danger)'
      : value >= 60
        ? 'var(--warning)'
        : value >= 40
          ? '#A8943A'
          : 'var(--success)';
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-1.5 bg-surface-3 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="font-mono text-12 tabular-nums w-8 text-right" style={{ color }}>
        {value}
      </span>
    </div>
  );
}

function ConfidenceBadge({ level }: { level: string }) {
  const cls =
    level === 'High'
      ? 'badge-success'
      : level === 'Medium'
        ? 'badge-warning'
        : level === 'Abstained'
          ? 'badge-neutral'
          : 'badge-info';
  return <span className={cls}>{level}</span>;
}

function DeltaChip({ delta }: { delta: number }) {
  if (delta === 0) return <span className="text-text-dimmer font-mono text-11">—</span>;
  const up = delta > 0;
  return (
    <span
      className={`flex items-center gap-0.5 font-mono text-11 tabular-nums ${up ? 'text-danger' : 'text-success'}`}
    >
      {up ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
      {Math.abs(delta)}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'Abstained') return <span className="badge-neutral">Abstained</span>;
  if (status === 'Pending') return <span className="badge-info">Pending</span>;
  return <span className="badge-success">Active</span>;
}

const SECTORS = [
  'All',
  'Power & Energy',
  'BFSI',
  'Telecom',
  'Transport',
  'Government',
  'Health',
  'Strategic',
];

export default function EntityRankTable() {
  const [sortKey, setSortKey] = useState<SortKey>('sai');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [sectorFilter, setSectorFilter] = useState('All');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const filtered = ENTITIES.filter((e) => sectorFilter === 'All' || e.sector === sectorFilter).sort(
    (a, b) => {
      const av = a[sortKey],
        bv = b[sortKey];
      const cmp =
        typeof av === 'string' ? av.localeCompare(bv as string) : (av as number) - (bv as number);
      return sortDir === 'asc' ? cmp : -cmp;
    }
  );

  const total = filtered.length;
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(total / pageSize);

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (sortKey !== k)
      return (
        <span className="text-text-dimmer opacity-30">
          <ChevronUp size={11} />
        </span>
      );
    return sortDir === 'asc' ? (
      <ChevronUp size={11} className="text-accent" />
    ) : (
      <ChevronDown size={11} className="text-accent" />
    );
  };

  const ThBtn = ({ label, k }: { label: string; k: SortKey }) => (
    <button
      onClick={() => handleSort(k)}
      className="flex items-center gap-1 text-text-dimmer hover:text-text transition-colors duration-120 text-11 font-500 uppercase tracking-wider whitespace-nowrap"
    >
      {label} <SortIcon k={k} />
    </button>
  );

  return (
    <div className="surface-card flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div>
          <h2 className="text-13 font-600 text-text">Entity Risk Ranking</h2>
          <p className="text-11 text-text-dimmer mt-0.5">
            Ranked by Supervisory Attention Index · Cycle 8
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Filter size={12} className="text-text-dimmer" />
            <select
              value={sectorFilter}
              onChange={(e) => {
                setSectorFilter(e.target.value);
                setPage(1);
              }}
              className="bg-surface-2 border border-border text-text-dim text-12 rounded px-2 py-1 focus:outline-none focus:border-accent"
            >
              {SECTORS.map((s) => (
                <option key={`sector-opt-${s}`} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <button className="btn-secondary text-12 py-1" aria-label="Export CSV">
            <Download size={12} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-13 border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-2.5 text-text-dimmer text-11 font-500 uppercase tracking-wider w-8">
                #
              </th>
              <th className="text-left px-4 py-2.5">
                <ThBtn label="Entity" k="name" />
              </th>
              <th className="text-left px-4 py-2.5">
                <ThBtn label="Sector" k="sector" />
              </th>
              <th className="text-left px-4 py-2.5 min-w-[140px]">
                <ThBtn label="SAI" k="sai" />
              </th>
              <th className="text-left px-4 py-2.5">
                <span className="text-text-dimmer text-11 font-500 uppercase tracking-wider">
                  Δ
                </span>
              </th>
              <th className="text-left px-4 py-2.5">
                <span className="text-text-dimmer text-11 font-500 uppercase tracking-wider">
                  Confidence
                </span>
              </th>
              <th className="text-left px-4 py-2.5">
                <ThBtn label="DRS" k="drs" />
              </th>
              <th className="text-left px-4 py-2.5">
                <span className="text-text-dimmer text-11 font-500 uppercase tracking-wider">
                  Findings
                </span>
              </th>
              <th className="text-left px-4 py-2.5">
                <ThBtn label="Alerts" k="alertCount" />
              </th>
              <th className="text-left px-4 py-2.5">
                <span className="text-text-dimmer text-11 font-500 uppercase tracking-wider">
                  Status
                </span>
              </th>
              <th className="text-right px-4 py-2.5">
                <span className="text-text-dimmer text-11 font-500 uppercase tracking-wider">
                  Action
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {paged.map((entity, idx) => {
              const rank = (page - 1) * pageSize + idx + 1;
              const isAbstained = entity.status === 'Abstained';
              return (
                <tr
                  key={`entity-row-${entity.id}`}
                  className={`border-b border-border transition-colors duration-120 ${isAbstained ? 'opacity-50' : 'hover:bg-surface-2'}`}
                >
                  <td className="px-4 py-2.5 font-mono text-12 text-text-dimmer tabular-nums">
                    {rank}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="font-500 text-13 text-text">{entity.name}</div>
                    <div className="text-11 text-text-dimmer font-mono mt-0.5 truncate max-w-[200px]">
                      {entity.topFinding}
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="badge-neutral">{entity.sector}</span>
                  </td>
                  <td className="px-4 py-2.5 min-w-[140px]">
                    {isAbstained ? (
                      <span className="text-text-dimmer text-12 font-mono">—</span>
                    ) : (
                      <SaiBar value={entity.sai} />
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    <DeltaChip delta={entity.saiDelta} />
                  </td>
                  <td className="px-4 py-2.5">
                    <ConfidenceBadge level={entity.confidence} />
                  </td>
                  <td className="px-4 py-2.5 font-mono text-12 tabular-nums">
                    <span
                      className={
                        entity.drs < 0.6
                          ? 'text-danger'
                          : entity.drs < 0.75
                            ? 'text-warning'
                            : 'text-success'
                      }
                    >
                      {entity.drs.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1">
                      <span className="badge-danger">{entity.findings.new}N</span>
                      <span className="badge-warning">{entity.findings.persisting}P</span>
                      <span className="badge-success">{entity.findings.resolved}R</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-12 tabular-nums text-text-dim">
                    {entity.alertCount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-2.5">
                    <StatusBadge status={entity.status} />
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <Link
                      href={`/entity-dossier?id=${entity.id}`}
                      className="btn-ghost text-12 text-accent hover:text-accent py-1 px-2"
                      aria-label={`Open dossier for ${entity.name}`}
                    >
                      <ArrowUpRight size={13} />
                      <span>Dossier</span>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-border">
        <span className="text-11 text-text-dimmer">
          Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total} entities
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="btn-ghost text-12 disabled:opacity-30 py-1 px-2"
          >
            ‹ Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={`page-${p}`}
              onClick={() => setPage(p)}
              className={`btn-ghost text-12 py-1 px-2 ${p === page ? 'text-accent bg-accent-bg border border-accent-dim' : ''}`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="btn-ghost text-12 disabled:opacity-30 py-1 px-2"
          >
            Next ›
          </button>
        </div>
      </div>
    </div>
  );
}
