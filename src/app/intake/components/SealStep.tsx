'use client';

import React, { useState } from 'react';
import { Shield, GitBranch, CheckCircle, Lock, Copy, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { type UploadedFile, type MappingRow } from './IntakeWizard';

interface Props {
  file: UploadedFile;
  mappings: MappingRow[];
  onBack: () => void;
}

type SealStatus = 'idle' | 'hashing' | 'merkle' | 'signing' | 'sealing' | 'done' | 'error';

const SEAL_STEPS = [
  {
    id: 'seal-hash',
    key: 'hashing',
    label: 'Computing SHA-256 leaf hashes',
    detail: 'One hash per record using canonical field values',
  },
  {
    id: 'seal-merkle',
    key: 'merkle',
    label: 'Building Merkle tree',
    detail: 'RFC 6962/9162 — leaf = SHA-256(0x00 || data), node = SHA-256(0x01 || left || right)',
  },
  {
    id: 'seal-sign',
    key: 'signing',
    label: 'Signing — Ed25519 + ML-DSA-65',
    detail: 'Hybrid signature from system + supervisor + auditor-witness keystores',
  },
  {
    id: 'seal-block',
    key: 'sealing',
    label: 'Appending block to ledger',
    detail: 'SUBMISSION_SEALED transaction with entity, period, Merkle root, manifest hash, DRS',
  },
];

export default function SealStep({ file, mappings, onBack }: Props) {
  const [status, setStatus] = useState<SealStatus>('idle');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [merkleRoot, setMerkleRoot] = useState('');
  const [blockHeight, setBlockHeight] = useState<number | null>(null);
  const [submissionId, setSubmissionId] = useState('');
  const [copied, setCopied] = useState(false);

  const runSeal = async () => {
    setStatus('hashing');
    // BACKEND INTEGRATION: POST to /api/intake/seal to trigger ledger sealing job
    await new Promise((r) => setTimeout(r, 900));
    setCompletedSteps(['hashing']);
    setStatus('merkle');

    await new Promise((r) => setTimeout(r, 700));
    setMerkleRoot('a3f8c2d1e9b74056af2c8e3d1b9f4702e8c3a1d5f6b7e2c9d4a8f3b1e7c2d6a9');
    setCompletedSteps(['hashing', 'merkle']);
    setStatus('signing');

    await new Promise((r) => setTimeout(r, 1100));
    setCompletedSteps(['hashing', 'merkle', 'signing']);
    setStatus('sealing');

    await new Promise((r) => setTimeout(r, 600));
    setBlockHeight(848);
    setSubmissionId('sub-2026-09-28-cse001-cycle8');
    setCompletedSteps(['hashing', 'merkle', 'signing', 'sealing']);
    setStatus('done');
  };

  const copyMerkle = () => {
    navigator.clipboard.writeText(merkleRoot).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const isStepActive = (key: string) => {
    const order = ['hashing', 'merkle', 'signing', 'sealing'];
    return status === key;
  };

  const isStepDone = (key: string) => completedSteps.includes(key);

  return (
    <div className="space-y-4">
      {/* Summary before sealing */}
      <div className="surface-card">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-13 font-600 text-text">Submission Summary</h2>
          <p className="text-11 text-text-dimmer mt-0.5">Review before sealing to ledger</p>
        </div>
        <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-11 text-text-dimmer uppercase tracking-wider mb-1">File</p>
            <p className="font-mono text-12 text-text">{file.name}</p>
          </div>
          <div>
            <p className="text-11 text-text-dimmer uppercase tracking-wider mb-1">Records</p>
            <p className="font-mono text-13 font-700 text-text tabular-nums">
              {file.rowCount.toLocaleString('en-IN')}
            </p>
          </div>
          <div>
            <p className="text-11 text-text-dimmer uppercase tracking-wider mb-1">Mapped Columns</p>
            <p className="font-mono text-13 font-700 text-text tabular-nums">
              {mappings.filter((m) => m.status === 'mapped').length}
            </p>
          </div>
          <div>
            <p className="text-11 text-text-dimmer uppercase tracking-wider mb-1">DRS</p>
            <p className="font-mono text-13 font-700 text-success tabular-nums">0.91</p>
          </div>
        </div>
        <div className="mx-4 mb-4 px-3 py-2.5 bg-accent-bg border border-accent-dim rounded text-12 text-accent">
          <span className="font-600">Sealing is permanent.</span> Once sealed, this submission is
          cryptographically bound to the ledger. Any subsequent modification to sealed records will
          be detected by NS-12 retroactive edit detection.
        </div>
      </div>

      {/* Sealing process */}
      <div className="surface-card">
        <div className="px-4 py-3 border-b border-border flex items-center gap-2">
          <Shield size={14} className="text-accent" />
          <h2 className="text-13 font-600 text-text">Ledger Sealing</h2>
        </div>
        <div className="p-4 space-y-3">
          {SEAL_STEPS.map((step) => (
            <div
              key={step.id}
              className={`flex items-start gap-3 p-3 rounded border transition-all duration-120 ${
                isStepDone(step.key)
                  ? 'bg-success-bg border-success'
                  : isStepActive(step.key)
                    ? 'bg-accent-bg border-accent'
                    : 'bg-surface-2 border-border'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {isStepDone(step.key) ? (
                  <CheckCircle size={14} className="text-success" />
                ) : isStepActive(step.key) ? (
                  <span className="w-3.5 h-3.5 border border-accent border-t-transparent rounded-full animate-spin block" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-border" />
                )}
              </div>
              <div className="flex-1">
                <p
                  className={`text-13 font-500 ${isStepDone(step.key) ? 'text-success' : isStepActive(step.key) ? 'text-accent' : 'text-text-dimmer'}`}
                >
                  {step.label}
                </p>
                <p className="text-11 text-text-dimmer mt-0.5">{step.detail}</p>
              </div>
            </div>
          ))}

          {status === 'idle' && (
            <button onClick={runSeal} className="btn-primary w-full justify-center mt-2">
              <Lock size={14} />
              Seal Submission to Ledger
            </button>
          )}
        </div>
      </div>

      {/* Success panel */}
      {status === 'done' && (
        <div className="surface-card border-success">
          <div className="px-4 py-3 border-b border-success flex items-center gap-2 bg-success-bg">
            <CheckCircle size={14} className="text-success" />
            <h2 className="text-13 font-600 text-success">Submission Sealed Successfully</h2>
          </div>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-11 text-text-dimmer uppercase tracking-wider mb-1">
                  Block Height
                </p>
                <p className="font-mono text-2xl font-700 text-text tabular-nums">#{blockHeight}</p>
              </div>
              <div>
                <p className="text-11 text-text-dimmer uppercase tracking-wider mb-1">
                  Submission ID
                </p>
                <p className="font-mono text-12 text-text">{submissionId}</p>
              </div>
            </div>
            <div>
              <p className="text-11 text-text-dimmer uppercase tracking-wider mb-1">Merkle Root</p>
              <div className="flex items-center gap-2">
                <p className="font-mono text-11 text-text-dim break-all flex-1">{merkleRoot}</p>
                <button
                  onClick={copyMerkle}
                  className="btn-ghost text-12 shrink-0"
                  aria-label="Copy Merkle root"
                >
                  <Copy size={12} />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
            <div>
              <p className="text-11 text-text-dimmer uppercase tracking-wider mb-1">Signatures</p>
              <div className="flex flex-wrap gap-2">
                {[
                  'system (Ed25519 + ML-DSA-65)',
                  'supervisor (Ed25519 + ML-DSA-65)',
                  'auditor-witness (Ed25519 + ML-DSA-65)',
                ].map((sig) => (
                  <span key={`seal-sig-${sig}`} className="badge-success">
                    {sig}
                  </span>
                ))}
              </div>
            </div>
            <div className="border-t border-border pt-3 flex flex-wrap gap-2">
              <Link href="/" className="btn-primary">
                <ArrowRight size={14} />
                Go to Command Center
              </Link>
              <Link href="/entity-dossier" className="btn-secondary">
                <GitBranch size={14} />
                View Entity Dossier
              </Link>
              <button className="btn-secondary">
                <Copy size={14} />
                Download Seal Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {status !== 'done' && (
        <div className="flex justify-start">
          <button
            onClick={onBack}
            disabled={status !== 'idle'}
            className="btn-secondary disabled:opacity-40"
          >
            ← Back
          </button>
        </div>
      )}
    </div>
  );
}
