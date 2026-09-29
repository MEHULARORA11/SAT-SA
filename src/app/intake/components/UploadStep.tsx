'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileText, Database, Archive, AlertTriangle, X, CheckCircle } from 'lucide-react';
import { type UploadedFile } from './IntakeWizard';

interface Props {
  onNext: (file: UploadedFile) => void;
}

const ACCEPTED_TYPES = ['.csv', '.json', '.jsonl', '.sqlite', '.zip'];

const MAPPING_PROFILES = [
  {
    id: 'profile-splunk',
    label: 'Splunk ES Export',
    description: 'Splunk Enterprise Security alert export format',
  },
  {
    id: 'profile-sentinel',
    label: 'Microsoft Sentinel',
    description: 'Azure Sentinel incident/alert export',
  },
  {
    id: 'profile-thehive',
    label: 'TheHive / ServiceNow',
    description: 'TheHive case export or ServiceNow security incidents',
  },
  { id: 'profile-custom', label: 'Custom / New', description: 'Define a new mapping profile' },
];

function FileIcon({ type }: { type: string }) {
  if (type.includes('sqlite') || type.includes('db'))
    return <Database size={20} className="text-accent" />;
  if (type.includes('zip')) return <Archive size={20} className="text-info" />;
  return <FileText size={20} className="text-text-dim" />;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function UploadStep({ onNext }: Props) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [selectedProfile, setSelectedProfile] = useState('profile-splunk');
  const [entityId, setEntityId] = useState('');
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) validateAndSetFile(dropped);
  };

  const validateAndSetFile = (f: File) => {
    const errs: string[] = [];
    const ext = '.' + f.name.split('.').pop()?.toLowerCase();
    if (!ACCEPTED_TYPES.includes(ext)) {
      errs.push(`File type "${ext}" not accepted. Allowed: ${ACCEPTED_TYPES.join(', ')}`);
    }
    if (f.size > 500 * 1024 * 1024) {
      errs.push('File exceeds 500 MB upload limit.');
    }
    setErrors(errs);
    if (errs.length === 0) setFile(f);
  };

  const handleSubmit = async () => {
    const errs: string[] = [];
    if (!file) errs.push('No file selected.');
    if (!entityId.trim()) errs.push('Entity ID is required.');
    if (!periodStart) errs.push('Period start date is required.');
    if (!periodEnd) errs.push('Period end date is required.');
    if (periodStart && periodEnd && periodStart >= periodEnd)
      errs.push('Period end must be after period start.');
    setErrors(errs);
    if (errs.length > 0 || !file) return;

    setLoading(true);
    // BACKEND INTEGRATION: stream file to /api/intake/upload, get row count, validate structure
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    onNext({
      name: file!.name,
      size: file!.size,
      type: file!.type || 'text/csv',
      rowCount: 14820,
    });
  };

  return (
    <div className="space-y-4">
      {/* Upload zone */}
      <div className="surface-card">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-13 font-600 text-text">Upload Submission</h2>
          <p className="text-11 text-text-dimmer mt-0.5">
            Accepted: CSV, JSON, JSONL, SQLite, ZIP · Max 500 MB · Zip-bomb and depth checks applied
          </p>
        </div>
        <div className="p-4 space-y-4">
          {/* Pseudonymisation notice */}
          <div className="flex items-start gap-2 px-3 py-2.5 bg-info-bg border border-info rounded text-12 text-info">
            <AlertTriangle size={13} className="shrink-0 mt-0.5" />
            <div>
              <span className="font-600">Pseudonymisation active.</span> Hostnames, IPs, and
              usernames will be HMAC-SHA256 pseudonymised with a per-entity salt at ingest.
              Free-text notes will be scrubbed of IPs, emails, and long tokens before storage. Raw
              payload, pcap, message_body, email, phone and Aadhaar columns are rejected.
            </div>
          </div>

          {/* Drop zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-10 text-center transition-all duration-120 cursor-pointer ${
              dragging
                ? 'border-accent bg-accent-bg'
                : file
                  ? 'border-success bg-success-bg'
                  : 'border-border hover:border-border-2 hover:bg-surface-2'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => !file && inputRef.current?.click()}
            role="button"
            tabIndex={0}
            aria-label="Drop zone for file upload"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
            }}
          >
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED_TYPES.join(',')}
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) validateAndSetFile(f);
              }}
            />
            {file ? (
              <div className="flex flex-col items-center gap-2">
                <FileIcon type={file.type} />
                <div>
                  <p className="text-13 font-600 text-success">{file.name}</p>
                  <p className="text-11 text-text-dimmer">{formatBytes(file.size)}</p>
                </div>
                <button
                  className="btn-ghost text-12 text-danger mt-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setErrors([]);
                  }}
                  aria-label="Remove selected file"
                >
                  <X size={12} /> Remove
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <Upload size={28} className={dragging ? 'text-accent' : 'text-text-dimmer'} />
                <div>
                  <p className="text-13 font-500 text-text">Drop file here or click to browse</p>
                  <p className="text-11 text-text-dimmer mt-1">CSV · JSON · JSONL · SQLite · ZIP</p>
                </div>
              </div>
            )}
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="px-3 py-2.5 bg-danger-bg border border-danger-dim rounded space-y-1">
              {errors.map((err, i) => (
                <div
                  key={`upload-err-${i}`}
                  className="flex items-center gap-2 text-12 text-danger"
                >
                  <AlertTriangle size={11} />
                  {err}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Submission metadata */}
      <div className="surface-card">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-13 font-600 text-text">Submission Metadata</h2>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <div>
            <label className="block text-12 font-500 text-text-dim mb-1.5" htmlFor="entity-id">
              Entity ID <span className="text-danger">*</span>
            </label>
            <p className="text-11 text-text-dimmer mb-1.5">
              Canonical CSE identifier from NCIIPC registry
            </p>
            <input
              id="entity-id"
              type="text"
              className="input-field font-mono"
              placeholder="e.g. cse-001"
              value={entityId}
              onChange={(e) => setEntityId(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-12 font-500 text-text-dim mb-1.5" htmlFor="period-start">
              Period Start <span className="text-danger">*</span>
            </label>
            <p className="text-11 text-text-dimmer mb-1.5">
              UTC date of first record in submission
            </p>
            <input
              id="period-start"
              type="date"
              className="input-field font-mono"
              value={periodStart}
              onChange={(e) => setPeriodStart(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-12 font-500 text-text-dim mb-1.5" htmlFor="period-end">
              Period End <span className="text-danger">*</span>
            </label>
            <p className="text-11 text-text-dimmer mb-1.5">UTC date of last record in submission</p>
            <input
              id="period-end"
              type="date"
              className="input-field font-mono"
              value={periodEnd}
              onChange={(e) => setPeriodEnd(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Mapping profile */}
      <div className="surface-card">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-13 font-600 text-text">Mapping Profile</h2>
          <p className="text-11 text-text-dimmer mt-0.5">
            Select a saved profile or define a new one in the next step
          </p>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {MAPPING_PROFILES.map((profile) => (
            <button
              key={profile.id}
              onClick={() => setSelectedProfile(profile.id)}
              className={`text-left p-3 rounded border transition-all duration-120 ${
                selectedProfile === profile.id
                  ? 'bg-accent-bg border-accent text-text'
                  : 'bg-surface-2 border-border text-text-dim hover:border-border-2 hover:text-text'
              }`}
            >
              <p className="text-12 font-600">{profile.label}</p>
              <p className="text-11 text-text-dimmer mt-1">{profile.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <button
          onClick={handleSubmit}
          disabled={loading || !file}
          className="btn-primary disabled:opacity-40"
        >
          {loading ? (
            <>
              <span className="w-3.5 h-3.5 border border-bg border-t-transparent rounded-full animate-spin" />
              Uploading…
            </>
          ) : (
            <>
              <CheckCircle size={14} />
              Continue to Mapping
            </>
          )}
        </button>
      </div>
    </div>
  );
}
