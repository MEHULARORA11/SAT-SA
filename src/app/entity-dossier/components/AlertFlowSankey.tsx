'use client';

import React from 'react';

// Simplified Sankey-style flow using proportional bars
// BACKEND INTEGRATION: compute flow values from DuckDB alert/case/escalation tables

interface FlowNode {
  id: string;
  label: string;
  value: number;
  color: string;
}

interface FlowLink {
  id: string;
  from: string;
  to: string;
  value: number;
  label: string;
}

const NODES: FlowNode[] = [
  { id: 'node-alerts', label: 'Alerts', value: 14820, color: 'var(--text-dim)' },
  { id: 'node-acked', label: 'Acknowledged', value: 13240, color: 'var(--info)' },
  { id: 'node-investigated', label: 'Investigated', value: 9870, color: 'var(--accent)' },
  { id: 'node-cases', label: 'Cases', value: 412, color: 'var(--warning)' },
  { id: 'node-escalated', label: 'Escalated', value: 87, color: 'var(--danger)' },
  { id: 'node-closed', label: 'Closed', value: 9120, color: 'var(--success)' },
];

const PEER_NODES: FlowNode[] = [
  { id: 'peer-alerts', label: 'Alerts', value: 10400, color: 'var(--text-dim)' },
  { id: 'peer-acked', label: 'Acknowledged', value: 10100, color: 'var(--info)' },
  { id: 'peer-investigated', label: 'Investigated', value: 8800, color: 'var(--accent)' },
  { id: 'peer-cases', label: 'Cases', value: 520, color: 'var(--warning)' },
  { id: 'peer-escalated', label: 'Escalated', value: 210, color: 'var(--danger)' },
  { id: 'peer-closed', label: 'Closed', value: 8600, color: 'var(--success)' },
];

function FlowBar({ nodes, label }: { nodes: FlowNode[]; label: string }) {
  const max = Math.max(...nodes.map((n) => n.value));
  return (
    <div className="flex-1">
      <p className="text-11 font-500 text-text-dimmer uppercase tracking-wider mb-3">{label}</p>
      <div className="space-y-2">
        {nodes.map((node) => {
          const pct = (node.value / max) * 100;
          return (
            <div key={node.id} className="flex items-center gap-2">
              <div className="w-24 text-12 text-text-dim text-right shrink-0">{node.label}</div>
              <div className="flex-1 h-5 bg-surface-3 rounded-sm overflow-hidden">
                <div
                  className="h-full rounded-sm transition-all duration-300"
                  style={{ width: `${pct}%`, backgroundColor: node.color, opacity: 0.75 }}
                />
              </div>
              <div className="w-16 font-mono text-11 tabular-nums text-text-dim text-right">
                {node.value.toLocaleString('en-IN')}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AlertFlowSankey() {
  return (
    <div className="surface-card">
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-13 font-600 text-text">Alert → Case → Escalation → Closure Flow</h2>
        <p className="text-11 text-text-dimmer mt-0.5">
          Funnel comparison: this entity vs sector peer median
        </p>
      </div>
      <div className="p-4">
        <div className="flex gap-8">
          <FlowBar nodes={NODES} label="Northern Grid Operations" />
          <div className="w-px bg-border shrink-0" />
          <FlowBar nodes={PEER_NODES} label="Sector peer median" />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="bg-danger-bg border border-danger-dim rounded p-3">
            <p className="text-11 text-danger font-500 mb-1">Ack → Investigated gap</p>
            <p className="font-mono text-13 text-danger tabular-nums">25.4% not investigated</p>
            <p className="text-11 text-text-dimmer">vs peer 13.1%</p>
          </div>
          <div className="bg-danger-bg border border-danger-dim rounded p-3">
            <p className="text-11 text-danger font-500 mb-1">Escalation rate (Critical)</p>
            <p className="font-mono text-13 text-danger tabular-nums">61.4% escalated</p>
            <p className="text-11 text-text-dimmer">vs policy ≥95%</p>
          </div>
          <div className="bg-warning-bg border border-border rounded p-3">
            <p className="text-11 text-warning font-500 mb-1">Cases per alert</p>
            <p className="font-mono text-13 text-warning tabular-nums">2.78%</p>
            <p className="text-11 text-text-dimmer">vs peer 5.00%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
