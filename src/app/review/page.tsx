'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { ENTITIES, FINDINGS } from '@/lib/mockData';
import { CheckCircle, Filter, Eye } from 'lucide-react';

type Verdict = 'Adequate' | 'Inadequate' | 'Needs follow-up' | 'Unable to assess';

interface ReviewItem {
  id: string;
  findingId: string;
  alertId: string;
  entityId: string;
  detectorId: string;
  severity: string;
  summary: string;
  sampleReason: string;
  verdict: Verdict | null;
  reasonCode: string;
  notes: string;
  sampledAt: string;
}

const REASON_CODES: Record<Verdict, string[]> = {
  Adequate: [
    'Properly investigated',
    'Escalation followed policy',
    'Documentation complete',
    'Timeline acceptable',
  ],
  Inadequate: [
    'No investigation steps',
    'Missing escalation',
    'Template note used',
    'SLA violated',
    'Insufficient evidence',
  ],
  'Needs follow-up': [
    'Requires additional context',
    'Pending external confirmation',
    'Escalation path unclear',
  ],
  'Unable to assess': ['Evidence missing', 'Record not found', 'Insufficient data quality'],
};

function generateReviewItems(): ReviewItem[] {
  const items: ReviewItem[] = [];
  const reasons = [
    'Risk-weighted (finding score)',
    'Coverage quota (detector minimum)',
    'Random calibration sample',
  ];
  FINDINGS.slice(0, 6).forEach((f, fi) => {
    const count = Math.min(f.evidenceCount, 5);
    for (let i = 0; i < count; i++) {
      items.push({
        id: `review-${f.id}-${i}`,
        findingId: f.id,
        alertId: `ALT-${(10000 + fi * 100 + i).toString()}`,
        entityId: f.entityId,
        detectorId: f.detectorId,
        severity: f.severity,
        summary: f.summary,
        sampleReason: reasons[(fi + i) % 3],
        verdict: null,
        reasonCode: '',
        notes: '',
        sampledAt: f.createdAt,
      });
    }
  });
  return items;
}

const INITIAL_ITEMS = generateReviewItems();

export default function ReviewPage() {
  const [items, setItems] = useState<ReviewItem[]>(INITIAL_ITEMS);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [entityFilter, setEntityFilter] = useState('All');
  const [verdictFilter, setVerdictFilter] = useState<'All' | 'Pending' | Verdict>('All');
  const [showPlan, setShowPlan] = useState(false);

  const entityMap = Object.fromEntries(ENTITIES.map((e) => [e.id, e.name]));
  const activeEntities = ENTITIES.filter((e) => e.status !== 'Abstained');

  const filtered = items
    .filter((i) => entityFilter === 'All' || i.entityId === entityFilter)
    .filter(
      (i) =>
        verdictFilter === 'All' ||
        (verdictFilter === 'Pending' ? i.verdict === null : i.verdict === verdictFilter)
    );

  const current = filtered[currentIdx] ?? null;
  const verdictCounts = {
    Adequate: items.filter((i) => i.verdict === 'Adequate').length,
    Inadequate: items.filter((i) => i.verdict === 'Inadequate').length,
    'Needs follow-up': items.filter((i) => i.verdict === 'Needs follow-up').length,
    'Unable to assess': items.filter((i) => i.verdict === 'Unable to assess').length,
    Pending: items.filter((i) => i.verdict === null).length,
  };

  const setVerdict = (verdict: Verdict, reasonCode: string, notes: string) => {
    if (!current) return;
    setItems((prev) =>
      prev.map((item) => (item.id === current.id ? { ...item, verdict, reasonCode, notes } : item))
    );
    if (currentIdx < filtered.length - 1) setCurrentIdx(currentIdx + 1);
  };

  return (
    <AppLayout title="Review Workbench" subtitle={`${verdictCounts.Pending} items pending review`}>
      <div className="px-6 py-5 space-y-5 max-w-screen-2xl mx-auto">
        {/* Progress bar */}
        <div className="surface-card px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-12 font-600 text-text">Review Progress</span>
            <span className="font-mono text-12 text-text-dim tabular-nums">
              {items.length - verdictCounts.Pending} / {items.length} reviewed
            </span>
          </div>
          <div className="h-2 bg-surface-3 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-300"
              style={{ width: `${((items.length - verdictCounts.Pending) / items.length) * 100}%` }}
            />
          </div>
          <div className="flex items-center gap-4 mt-2 text-11 text-text-dimmer">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-success" />
              {verdictCounts.Adequate} Adequate
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-danger" />
              {verdictCounts.Inadequate} Inadequate
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-warning" />
              {verdictCounts['Needs follow-up']} Follow-up
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-text-dimmer" />
              {verdictCounts['Unable to assess']} Unable
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-accent" />
              {verdictCounts.Pending} Pending
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Item list */}
          <div className="surface-card xl:col-span-1">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-2">
              <h2 className="text-13 font-600 text-text">Sample Items</h2>
              <div className="flex items-center gap-1.5">
                <Filter size={12} className="text-text-dimmer" />
                <select
                  value={entityFilter}
                  onChange={(e) => {
                    setEntityFilter(e.target.value);
                    setCurrentIdx(0);
                  }}
                  className="bg-surface-2 border border-border text-text-dim text-11 rounded px-1.5 py-0.5 focus:outline-none focus:border-accent"
                >
                  <option value="All">All</option>
                  {activeEntities.map((e) => (
                    <option key={`rev-ent-${e.id}`} value={e.id}>
                      {e.name.split(' ').slice(0, 2).join(' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="overflow-y-auto max-h-[600px]">
              {filtered.map((item, idx) => (
                <button
                  key={`rev-item-${item.id}`}
                  onClick={() => setCurrentIdx(idx)}
                  className={`w-full text-left px-4 py-3 border-b border-border transition-colors duration-120 ${idx === currentIdx ? 'bg-accent-bg border-l-2 border-l-accent' : 'hover:bg-surface-2'}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-11 text-accent">{item.alertId}</span>
                    {item.verdict ? (
                      <span
                        className={`badge-${item.verdict === 'Adequate' ? 'success' : item.verdict === 'Inadequate' ? 'danger' : item.verdict === 'Needs follow-up' ? 'warning' : 'neutral'} text-10`}
                      >
                        {item.verdict === 'Needs follow-up'
                          ? 'Follow-up'
                          : item.verdict === 'Unable to assess'
                            ? 'Unable'
                            : item.verdict}
                      </span>
                    ) : (
                      <span className="badge-info text-10">Pending</span>
                    )}
                  </div>
                  <div className="text-11 text-text-dim truncate">
                    {item.detectorId} · {entityMap[item.entityId]?.split(' ').slice(0, 2).join(' ')}
                  </div>
                  <div className="text-10 text-text-dimmer mt-0.5 truncate">
                    {item.sampleReason}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Review panel */}
          <div className="xl:col-span-2 space-y-4">
            {current ? (
              <>
                {/* Item detail */}
                <div className="surface-card">
                  <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                    <div>
                      <h2 className="text-13 font-600 text-text">{current.alertId}</h2>
                      <p className="text-11 text-text-dimmer mt-0.5 font-mono">
                        {current.detectorId} · {entityMap[current.entityId]}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`badge-${current.severity === 'Critical' ? 'danger' : current.severity === 'High' ? 'warning' : 'info'}`}
                      >
                        {current.severity}
                      </span>
                      <span className="text-11 text-text-dimmer">
                        {currentIdx + 1} of {filtered.length}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <p className="text-11 font-600 text-text-dimmer uppercase tracking-wider mb-1">
                        Finding Summary
                      </p>
                      <p className="text-13 text-text">{current.summary}</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-surface-2 border border-border rounded">
                      <Eye size={12} className="text-accent shrink-0" />
                      <span className="text-11 text-text-dim">Sample reason: </span>
                      <span className="text-11 text-accent font-500">{current.sampleReason}</span>
                    </div>
                    {current.verdict && (
                      <div
                        className={`px-3 py-2.5 rounded border ${current.verdict === 'Adequate' ? 'bg-success-bg border-success' : current.verdict === 'Inadequate' ? 'bg-danger-bg border-danger-dim' : 'bg-warning-bg border-warning-dim'}`}
                      >
                        <p className="text-12 font-600 text-text mb-1">
                          Recorded Verdict: {current.verdict}
                        </p>
                        {current.reasonCode && (
                          <p className="text-11 text-text-dim">Reason: {current.reasonCode}</p>
                        )}
                        {current.notes && (
                          <p className="text-11 text-text-dim mt-1">Notes: {current.notes}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Verdict panel */}
                <VerdictPanel
                  item={current}
                  onVerdict={setVerdict}
                  onPrev={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
                  onNext={() => setCurrentIdx(Math.min(filtered.length - 1, currentIdx + 1))}
                  hasPrev={currentIdx > 0}
                  hasNext={currentIdx < filtered.length - 1}
                />
              </>
            ) : (
              <div className="surface-card p-12 text-center">
                <CheckCircle size={32} className="text-success mx-auto mb-3" />
                <p className="text-13 font-600 text-text mb-1">All items reviewed</p>
                <p className="text-12 text-text-dimmer">
                  All {items.length} sample items have been assessed.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function VerdictPanel({
  item,
  onVerdict,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: {
  item: ReviewItem;
  onVerdict: (v: Verdict, r: string, n: string) => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}) {
  const [selectedVerdict, setSelectedVerdict] = useState<Verdict | null>(item.verdict);
  const [reasonCode, setReasonCode] = useState(item.reasonCode);
  const [notes, setNotes] = useState(item.notes);

  const verdicts: { v: Verdict; label: string; cls: string; key: string }[] = [
    {
      v: 'Adequate',
      label: '1 — Adequate',
      cls: 'border-success text-success hover:bg-success-bg',
      key: '1',
    },
    {
      v: 'Inadequate',
      label: '2 — Inadequate',
      cls: 'border-danger text-danger hover:bg-danger-bg',
      key: '2',
    },
    {
      v: 'Needs follow-up',
      label: '3 — Needs Follow-up',
      cls: 'border-warning text-warning hover:bg-warning-bg',
      key: '3',
    },
    {
      v: 'Unable to assess',
      label: '4 — Unable to Assess',
      cls: 'border-border text-text-dim hover:bg-surface-2',
      key: '4',
    },
  ];

  return (
    <div className="surface-card">
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-13 font-600 text-text">Record Verdict</h2>
        <p className="text-11 text-text-dimmer mt-0.5">
          Use keys 1–4 to select verdict · J/K to navigate
        </p>
      </div>
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {verdicts.map(({ v, label, cls, key }) => (
            <button
              key={`verdict-${v}`}
              onClick={() => {
                setSelectedVerdict(v);
                setReasonCode('');
              }}
              className={`text-left px-3 py-2.5 rounded border transition-all duration-120 text-12 font-500 ${selectedVerdict === v ? cls + ' bg-opacity-20' : 'border-border text-text-dim hover:bg-surface-2'}`}
            >
              <span className="font-mono text-11 mr-1 opacity-60">[{key}]</span>
              {label}
            </button>
          ))}
        </div>

        {selectedVerdict && (
          <div>
            <label className="block text-12 font-500 text-text-dim mb-1.5">Reason Code</label>
            <select
              value={reasonCode}
              onChange={(e) => setReasonCode(e.target.value)}
              className="input-field text-12"
            >
              <option value="">Select reason…</option>
              {REASON_CODES[selectedVerdict].map((r) => (
                <option key={`rc-${r}`} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-12 font-500 text-text-dim mb-1.5">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="input-field text-12 h-20 resize-none"
            placeholder="Free-text examiner notes…"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onPrev}
            disabled={!hasPrev}
            className="btn-secondary text-12 py-1.5 disabled:opacity-30"
          >
            ‹ Prev
          </button>
          <button
            onClick={() => {
              if (selectedVerdict) onVerdict(selectedVerdict, reasonCode, notes);
            }}
            disabled={!selectedVerdict}
            className="btn-primary text-12 flex-1 justify-center disabled:opacity-40"
          >
            <CheckCircle size={13} />
            Record Verdict &amp; Continue
          </button>
          <button
            onClick={onNext}
            disabled={!hasNext}
            className="btn-secondary text-12 py-1.5 disabled:opacity-30"
          >
            Next ›
          </button>
        </div>
      </div>
    </div>
  );
}
