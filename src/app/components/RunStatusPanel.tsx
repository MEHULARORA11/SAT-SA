import { CURRENT_RUN } from '@/lib/mockData';
import { CheckCircle, Clock, GitBranch } from 'lucide-react';
import Link from 'next/link';

export default function RunStatusPanel() {
  const run = CURRENT_RUN;

  return (
    <div className="surface-card">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <h2 className="text-13 font-600 text-text">Pipeline Run</h2>
        <span
          className={`badge-${run?.status === 'Completed' ? 'success' : run?.status === 'Running' ? 'info' : 'danger'}`}
        >
          {run?.status}
        </span>
      </div>
      <div className="px-4 py-3 space-y-3">
        <div className="flex items-center gap-2 text-success">
          <CheckCircle size={13} />
          <span className="text-12 font-500">{run?.entitiesProcessed} entities processed</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-surface-2 rounded p-2.5">
            <p className="text-11 text-text-dimmer uppercase tracking-wider mb-1">Findings</p>
            <p className="font-mono text-metric-sm text-accent tabular-nums">
              {run?.findingsGenerated}
            </p>
          </div>
          <div className="bg-surface-2 rounded p-2.5">
            <p className="text-11 text-text-dimmer uppercase tracking-wider mb-1">Block #</p>
            <p className="font-mono text-metric-sm text-text tabular-nums">{run?.blockHeight}</p>
          </div>
        </div>
        <div className="space-y-1.5 text-12 text-text-dim">
          <div className="flex items-center gap-2">
            <Clock size={11} className="text-text-dimmer shrink-0" />
            <span className="text-text-dimmer">Started:</span>
            <span className="font-mono text-11 tabular-nums">2026-09-28 12:31 UTC</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={11} className="text-text-dimmer shrink-0" />
            <span className="text-text-dimmer">Completed:</span>
            <span className="font-mono text-11 tabular-nums">2026-09-28 12:47 UTC</span>
          </div>
          <div className="flex items-center gap-2">
            <GitBranch size={11} className="text-text-dimmer shrink-0" />
            <span className="text-text-dimmer">Ruleset:</span>
            <span className="font-mono text-11">{run?.detectorVersion}</span>
          </div>
        </div>
        <div className="pt-1">
          <p className="text-11 text-text-dimmer mb-1">Run ID</p>
          <p className="font-mono text-11 text-text-dimmer break-all">{run?.id}</p>
        </div>
        <Link
          href="/validation"
          className="btn-secondary w-full text-12 justify-center flex items-center gap-1"
        >
          Re-run &amp; Verify
        </Link>
      </div>
    </div>
  );
}
