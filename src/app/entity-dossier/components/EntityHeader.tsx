import { type CSEntity } from '@/lib/mockData';
import { Building2, Calendar, Users, AlertTriangle, Shield, ChevronRight } from 'lucide-react';

interface Props {
  entity: CSEntity;
}

function SaiPill({ sai }: { sai: number }) {
  const color =
    sai >= 75
      ? 'var(--danger)'
      : sai >= 60
        ? 'var(--warning)'
        : sai >= 40
          ? 'var(--accent)'
          : 'var(--success)';
  const bg =
    sai >= 75
      ? 'var(--danger-bg)'
      : sai >= 60
        ? 'var(--warning-bg)'
        : sai >= 40
          ? 'var(--accent-bg)'
          : 'var(--success-bg)';
  const label = sai >= 75 ? 'CRITICAL' : sai >= 60 ? 'HIGH' : sai >= 40 ? 'ELEVATED' : 'LOW';
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded border"
      style={{ backgroundColor: bg, borderColor: color }}
    >
      <div>
        <p className="text-11 font-500 uppercase tracking-widest" style={{ color }}>
          SAI Score
        </p>
        <p className="font-mono text-2xl font-700 tabular-nums" style={{ color }}>
          {sai}
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <span
          className="text-11 font-700 uppercase tracking-widest px-2 py-0.5 rounded"
          style={{ backgroundColor: color, color: 'var(--bg)' }}
        >
          {label}
        </span>
        <span className="text-11 text-text-dimmer">of 100</span>
      </div>
    </div>
  );
}

export default function EntityHeader({ entity }: Props) {
  const totalFindings = entity.findings.new + entity.findings.persisting + entity.findings.resolved;
  return (
    <div className="surface-card p-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-11 text-text-dimmer mb-3">
        <span>Command Center</span>
        <ChevronRight size={11} />
        <span>Entities</span>
        <ChevronRight size={11} />
        <span className="text-text">{entity.name}</span>
      </div>

      <div className="flex flex-wrap items-start gap-4">
        {/* Name + metadata */}
        <div className="flex items-start gap-3 flex-1 min-w-[280px]">
          <div className="w-10 h-10 rounded border border-border bg-surface-2 flex items-center justify-center shrink-0">
            <Building2 size={18} className="text-text-dim" />
          </div>
          <div>
            <h1 className="text-lg font-600 text-text">{entity.name}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="badge-neutral">{entity.sector}</span>
              <span
                className={
                  entity.status === 'Active'
                    ? 'badge-success'
                    : entity.status === 'Abstained'
                      ? 'badge-neutral'
                      : 'badge-info'
                }
              >
                {entity.status}
              </span>
              <span className="badge-neutral font-mono">{entity.id}</span>
            </div>
            <div className="flex flex-wrap gap-4 mt-2 text-12 text-text-dimmer">
              <span className="flex items-center gap-1">
                <Users size={11} /> {entity.analystCount} analysts
              </span>
              <span className="flex items-center gap-1">
                <AlertTriangle size={11} /> {entity.alertCount.toLocaleString('en-IN')} alerts
              </span>
              <span className="flex items-center gap-1">
                <Shield size={11} /> {entity.caseCount} cases
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={11} /> Submitted {entity.lastSubmission}
              </span>
            </div>
          </div>
        </div>

        {/* SAI pill */}
        <SaiPill sai={entity.sai} />

        {/* Evidence confidence + DRS */}
        <div className="flex flex-col gap-2">
          <div className="bg-surface-2 border border-border rounded px-4 py-3">
            <p className="text-11 text-text-dimmer uppercase tracking-wider mb-1">
              Evidence Confidence
            </p>
            <span
              className={
                entity.confidence === 'High'
                  ? 'badge-success'
                  : entity.confidence === 'Medium'
                    ? 'badge-warning'
                    : 'badge-neutral'
              }
            >
              {entity.confidence}
            </span>
          </div>
          <div className="bg-surface-2 border border-border rounded px-4 py-3">
            <p className="text-11 text-text-dimmer uppercase tracking-wider mb-1">
              Data Reliability Score
            </p>
            <span
              className={`font-mono text-lg font-700 tabular-nums ${entity.drs >= 0.85 ? 'text-success' : entity.drs >= 0.7 ? 'text-warning' : 'text-danger'}`}
            >
              {entity.drs.toFixed(2)}
            </span>
            <span className="text-11 text-text-dimmer ml-1">/ 1.00</span>
          </div>
        </div>

        {/* Findings summary */}
        <div className="bg-surface-2 border border-border rounded px-4 py-3">
          <p className="text-11 text-text-dimmer uppercase tracking-wider mb-2">
            Findings ({totalFindings})
          </p>
          <div className="flex gap-3">
            <div className="text-center">
              <p className="font-mono text-lg font-700 text-danger tabular-nums">
                {entity.findings.new}
              </p>
              <p className="text-11 text-text-dimmer">New</p>
            </div>
            <div className="text-center">
              <p className="font-mono text-lg font-700 text-warning tabular-nums">
                {entity.findings.persisting}
              </p>
              <p className="text-11 text-text-dimmer">Persisting</p>
            </div>
            <div className="text-center">
              <p className="font-mono text-lg font-700 text-success tabular-nums">
                {entity.findings.resolved}
              </p>
              <p className="text-11 text-text-dimmer">Resolved</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top finding highlight */}
      <div className="mt-3 px-3 py-2 bg-danger-bg border border-danger-dim rounded flex items-start gap-2">
        <AlertTriangle size={13} className="text-danger shrink-0 mt-0.5" />
        <div>
          <span className="text-11 font-600 text-danger uppercase tracking-wider mr-2">
            Top Finding:
          </span>
          <span className="text-12 text-text">{entity.topFinding}</span>
        </div>
      </div>
    </div>
  );
}
