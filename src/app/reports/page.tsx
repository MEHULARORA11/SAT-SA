'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { ENTITIES } from '@/lib/mockData';
import { FileText, Download, Shield, QrCode, BookOpen } from 'lucide-react';

interface ReportEntry {
  id: string;
  entityId: string;
  type: 'entity_dossier' | 'advisory_letter';
  title: string;
  generatedAt: string;
  sealedAt: string | null;
  blockHeight: number | null;
  sha256: string | null;
  status: 'Draft' | 'Sealed' | 'Generating';
}

const REPORTS: ReportEntry[] = [
  {
    id: 'rpt-001',
    entityId: 'cse-001',
    type: 'entity_dossier',
    title: 'Northern Grid Operations — Entity Dossier',
    generatedAt: '2026-09-28T13:00:00Z',
    sealedAt: '2026-09-28T13:02:00Z',
    blockHeight: 847,
    sha256: 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
    status: 'Sealed',
  },
  {
    id: 'rpt-002',
    entityId: 'cse-002',
    type: 'advisory_letter',
    title: 'Western Railway Cyber Cell — Advisory Letter',
    generatedAt: '2026-09-27T18:30:00Z',
    sealedAt: '2026-09-27T18:32:00Z',
    blockHeight: 846,
    sha256: 'f9e8d7c6b5a4321098765432109876543210fedcba9876543210fedcba987654',
    status: 'Sealed',
  },
  {
    id: 'rpt-003',
    entityId: 'cse-003',
    type: 'entity_dossier',
    title: 'State Bank Cyber Defence — Entity Dossier',
    generatedAt: '2026-09-27T16:45:00Z',
    sealedAt: null,
    blockHeight: null,
    sha256: null,
    status: 'Draft',
  },
  {
    id: 'rpt-004',
    entityId: 'cse-005',
    type: 'advisory_letter',
    title: 'AIIMS Network Security — Advisory Letter',
    generatedAt: '2026-09-26T15:00:00Z',
    sealedAt: '2026-09-26T15:03:00Z',
    blockHeight: 845,
    sha256: 'e8d7c6b5a432109876543210987654321fedcba9876543210fedcba987654321',
    status: 'Sealed',
  },
];

export default function ReportsPage() {
  const [generating, setGenerating] = useState<string | null>(null);
  const [sealing, setSealing] = useState<string | null>(null);
  const [reports, setReports] = useState<ReportEntry[]>(REPORTS);
  const [selectedEntity, setSelectedEntity] = useState('cse-001');
  const [reportType, setReportType] = useState<'entity_dossier' | 'advisory_letter'>(
    'entity_dossier'
  );

  const entityMap = Object.fromEntries(ENTITIES.map((e) => [e.id, e.name]));
  const activeEntities = ENTITIES.filter((e) => e.status !== 'Abstained');

  const generateReport = async () => {
    const id = `rpt-${Date.now()}`;
    const entity = ENTITIES.find((e) => e.id === selectedEntity);
    setGenerating(id);
    const newReport: ReportEntry = {
      id,
      entityId: selectedEntity,
      type: reportType,
      title: `${entity?.name ?? selectedEntity} — ${reportType === 'entity_dossier' ? 'Entity Dossier' : 'Advisory Letter'}`,
      generatedAt: new Date().toISOString(),
      sealedAt: null,
      blockHeight: null,
      sha256: null,
      status: 'Generating',
    };
    setReports((prev) => [newReport, ...prev]);
    await new Promise((r) => setTimeout(r, 1500));
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'Draft' } : r)));
    setGenerating(null);
  };

  const sealReport = async (reportId: string) => {
    setSealing(reportId);
    await new Promise((r) => setTimeout(r, 1200));
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? {
              ...r,
              status: 'Sealed',
              sealedAt: new Date().toISOString(),
              blockHeight: 848,
              sha256: `${reportId.slice(-8)}abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234`,
            }
          : r
      )
    );
    setSealing(null);
  };

  return (
    <AppLayout
      title="Reports"
      subtitle="Entity dossiers and advisory letters · PDF + QR + verifier bundle"
    >
      <div className="px-6 py-5 space-y-5 max-w-screen-2xl mx-auto">
        {/* Generate new report */}
        <div className="surface-card">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="text-13 font-600 text-text">Generate Report</h2>
            <p className="text-11 text-text-dimmer mt-0.5">
              Reports are sealed with SHA-256, ledger height, and QR code. Bilingual headers
              (English/Hindi).
            </p>
          </div>
          <div className="p-4 flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-12 font-500 text-text-dim mb-1.5">Entity</label>
              <select
                value={selectedEntity}
                onChange={(e) => setSelectedEntity(e.target.value)}
                className="bg-surface-2 border border-border text-text-dim text-12 rounded px-2 py-1.5 focus:outline-none focus:border-accent"
              >
                {activeEntities.map((e) => (
                  <option key={`rpt-ent-${e.id}`} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-12 font-500 text-text-dim mb-1.5">Report Type</label>
              <div className="flex items-center gap-1 bg-surface-2 border border-border rounded p-0.5">
                {[
                  { v: 'entity_dossier', label: 'Entity Dossier' },
                  { v: 'advisory_letter', label: 'Advisory Letter' },
                ].map((opt) => (
                  <button
                    key={`rpt-type-${opt.v}`}
                    onClick={() => setReportType(opt.v as typeof reportType)}
                    className={`text-12 px-2.5 py-1 rounded transition-all duration-120 ${reportType === opt.v ? 'bg-accent-bg text-accent border border-accent-dim' : 'text-text-dimmer hover:text-text'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={generateReport}
              disabled={!!generating}
              className="btn-primary text-12 disabled:opacity-40"
            >
              <FileText size={13} />
              {generating ? 'Generating…' : 'Generate Report'}
            </button>
          </div>
        </div>

        {/* Reports list */}
        <div className="surface-card">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="text-13 font-600 text-text">All Reports</h2>
            <p className="text-11 text-text-dimmer mt-0.5">
              {reports.length} reports · Sealed reports include verifier bundle
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-12 border-collapse">
              <thead>
                <tr className="border-b border-border">
                  {['Title', 'Type', 'Generated', 'Status', 'Block', 'SHA-256', 'Actions'].map(
                    (h) => (
                      <th
                        key={`rpt-th-${h}`}
                        className="text-left px-4 py-2.5 text-text-dimmer text-11 font-500 uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {reports.map((rpt) => (
                  <tr
                    key={`rpt-row-${rpt.id}`}
                    className="border-b border-border hover:bg-surface-2 transition-colors duration-120"
                  >
                    <td className="px-4 py-2.5 text-12 text-text font-500 max-w-[200px] truncate">
                      {rpt.title}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={rpt.type === 'entity_dossier' ? 'badge-info' : 'badge-warning'}
                      >
                        {rpt.type === 'entity_dossier' ? 'Dossier' : 'Advisory'}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-11 text-text-dimmer">
                      {rpt.generatedAt.slice(0, 16).replace('T', ' ')}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={
                          rpt.status === 'Sealed'
                            ? 'badge-success'
                            : rpt.status === 'Draft'
                              ? 'badge-neutral'
                              : 'badge-info'
                        }
                      >
                        {rpt.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-11 text-text-dim">
                      {rpt.blockHeight ? `#${rpt.blockHeight}` : '—'}
                    </td>
                    <td
                      className="px-4 py-2.5 font-mono text-10 text-text-dimmer max-w-[100px] truncate"
                      title={rpt.sha256 ?? ''}
                    >
                      {rpt.sha256 ? `${rpt.sha256.slice(0, 12)}…` : '—'}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1">
                        {rpt.status === 'Draft' && (
                          <button
                            onClick={() => sealReport(rpt.id)}
                            disabled={sealing === rpt.id}
                            className="btn-primary text-11 py-0.5 px-2 disabled:opacity-40"
                          >
                            <Shield size={10} />
                            {sealing === rpt.id ? 'Sealing…' : 'Seal'}
                          </button>
                        )}
                        {rpt.status === 'Sealed' && (
                          <>
                            <button className="btn-secondary text-11 py-0.5 px-2 flex items-center gap-1">
                              <Download size={10} />
                              PDF
                            </button>
                            <button className="btn-secondary text-11 py-0.5 px-2 flex items-center gap-1">
                              <QrCode size={10} />
                              QR
                            </button>
                          </>
                        )}
                        {rpt.status === 'Generating' && (
                          <span className="text-11 text-text-dimmer">Generating…</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sealing info */}
        <div className="surface-card px-4 py-3 flex items-start gap-3">
          <BookOpen size={14} className="text-accent shrink-0 mt-0.5" />
          <div>
            <p className="text-12 font-600 text-text mb-1">Report Sealing</p>
            <p className="text-12 text-text-dim">
              Every sealed report carries its SHA-256 hash, the ledger block height, and a QR code
              linking to the verifier. A standalone{' '}
              <code className="font-mono text-11 bg-surface-2 px-1 rounded">
                verifier/verify.html
              </code>{' '}
              (WebCrypto + bundled noble code, zero network) is included in every exported report
              ZIP so an auditor can verify authenticity on any machine. Bilingual headers
              (English/Hindi) are included in the report chrome.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
