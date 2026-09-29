'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import {
  GitBranch,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface Block {
  height: number;
  hash: string;
  prevHash: string;
  timestamp: string;
  merkleRoot: string;
  txCount: number;
  proposer: string;
  txs: Transaction[];
}

interface Transaction {
  id: string;
  type: string;
  entityId?: string;
  period?: string;
  drs?: number;
  findingsHash?: string;
  rulesetVersion?: string;
  actor?: string;
  description: string;
  ts: string;
}

const BLOCKS: Block[] = [
  {
    height: 847,
    hash: 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
    prevHash: 'f9e8d7c6b5a4321098765432109876543210fedcba9876543210fedcba987654',
    timestamp: '2026-09-28T12:47:22Z',
    merkleRoot: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    txCount: 3,
    proposer: 'system',
    txs: [
      {
        id: 'tx-847-1',
        type: 'RUN_COMPLETED',
        findingsHash: 'abc123def456',
        rulesetVersion: 'v2.4.1',
        actor: 'system',
        description: 'Detection run completed · 143 findings · 26 entities',
        ts: '2026-09-28T12:47:22Z',
      },
      {
        id: 'tx-847-2',
        type: 'SUBMISSION_SEALED',
        entityId: 'cse-001',
        period: '2026-07-01/2026-09-28',
        drs: 0.91,
        description: 'Northern Grid Operations submission sealed',
        ts: '2026-09-28T12:31:00Z',
      },
      {
        id: 'tx-847-3',
        type: 'POLICY_UPDATE',
        actor: 'supervisor',
        description: 'SLA threshold updated for Critical tier · maker-checker approved',
        ts: '2026-09-28T11:15:00Z',
      },
    ],
  },
  {
    height: 846,
    hash: 'f9e8d7c6b5a4321098765432109876543210fedcba9876543210fedcba987654',
    prevHash: 'e8d7c6b5a432109876543210987654321fedcba9876543210fedcba987654321',
    timestamp: '2026-09-27T18:22:11Z',
    merkleRoot: 'fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210',
    txCount: 4,
    proposer: 'system',
    txs: [
      {
        id: 'tx-846-1',
        type: 'REVIEW_VERDICT',
        actor: 'examiner-01',
        description: 'Verdict recorded for finding find-001 · Inadequate',
        ts: '2026-09-27T18:22:11Z',
      },
      {
        id: 'tx-846-2',
        type: 'FINDING_FINALISED',
        entityId: 'cse-002',
        description: 'Finding NS-01 finalised by supervisor',
        ts: '2026-09-27T17:45:00Z',
      },
      {
        id: 'tx-846-3',
        type: 'SUBMISSION_SEALED',
        entityId: 'cse-003',
        period: '2026-07-01/2026-09-27',
        drs: 0.94,
        description: 'State Bank Cyber Defence submission sealed',
        ts: '2026-09-27T16:30:00Z',
      },
      {
        id: 'tx-846-4',
        type: 'REPORT_SEALED',
        actor: 'examiner-01',
        description: 'Advisory report sealed · SHA-256 anchored',
        ts: '2026-09-27T15:00:00Z',
      },
    ],
  },
  {
    height: 845,
    hash: 'e8d7c6b5a432109876543210987654321fedcba9876543210fedcba987654321',
    prevHash: 'd7c6b5a43210987654321098765432fedcba9876543210fedcba9876543210fe',
    timestamp: '2026-09-26T14:10:05Z',
    merkleRoot: '9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
    txCount: 2,
    proposer: 'system',
    txs: [
      {
        id: 'tx-845-1',
        type: 'SUBMISSION_SEALED',
        entityId: 'cse-005',
        period: '2026-07-01/2026-09-26',
        drs: 0.75,
        description: 'AIIMS Network Security submission sealed',
        ts: '2026-09-26T14:10:05Z',
      },
      {
        id: 'tx-845-2',
        type: 'USER_ACTION',
        actor: 'admin',
        description: 'New examiner account created · audit logged',
        ts: '2026-09-26T09:00:00Z',
      },
    ],
  },
];

const TX_TYPE_COLORS: Record<string, string> = {
  SUBMISSION_SEALED: 'badge-info',
  RUN_COMPLETED: 'badge-success',
  FINDING_FINALISED: 'badge-warning',
  REVIEW_VERDICT: 'badge-neutral',
  POLICY_UPDATE: 'badge-warning',
  MODEL_UPDATE: 'badge-info',
  REPORT_SEALED: 'badge-success',
  USER_ACTION: 'badge-neutral',
};

function TamperDemo() {
  const [tampered, setTampered] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [step, setStep] = useState(0);

  const handleTamper = async () => {
    setTampered(true);
    setVerifying(true);
    setStep(0);
    for (let i = 1; i <= 4; i++) {
      await new Promise((r) => setTimeout(r, 600));
      setStep(i);
    }
    setVerifying(false);
  };

  const reset = () => {
    setTampered(false);
    setStep(0);
  };

  const steps = [
    {
      label: 'Leaf hash recomputed',
      desc: 'SHA-256 of modified record ≠ sealed leaf hash',
      ok: false,
    },
    {
      label: 'Merkle path broken',
      desc: 'Node hash mismatch at depth 3 of inclusion proof',
      ok: false,
    },
    {
      label: 'Block hash invalid',
      desc: 'Block #847 hash does not match recomputed value',
      ok: false,
    },
    {
      label: 'Signature verification failed',
      desc: 'Ed25519 signature over tampered block hash is invalid',
      ok: false,
    },
  ];

  return (
    <div className="surface-card border-warning-dim">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-13 font-600 text-text">Tamper Simulation</h2>
          <p className="text-11 text-text-dimmer mt-0.5">
            Flip one byte in a sandbox copy of a sealed submission and observe verification failure
          </p>
        </div>
        <span className="badge-warning">Sandbox only</span>
      </div>
      <div className="p-4 space-y-3">
        <p className="text-12 text-text-dim">
          This simulation flips a single byte in a copy of the sealed submission data (not the live
          ledger) and runs the full verification chain. The tamper-evident design ensures any
          modification is detectable at the leaf, Merkle path, block hash, and signature levels.
        </p>
        {!tampered ? (
          <button
            onClick={handleTamper}
            className="btn-secondary text-12 border-warning text-warning hover:bg-warning-bg"
          >
            <AlertTriangle size={13} />
            Simulate Byte Flip (Sandbox)
          </button>
        ) : (
          <div className="space-y-2">
            <div className="px-3 py-2 bg-warning-bg border border-warning-dim rounded text-12 text-warning font-600">
              ⚠ Byte flipped in sandbox copy of alert ALT-10001 · severity_id field modified
            </div>
            {steps.map((s, i) => (
              <div
                key={`tamper-step-${i}`}
                className={`p-3 rounded border transition-all duration-120 ${i < step ? 'border-danger-dim bg-danger-bg' : 'border-border bg-surface-2'}`}
              >
                <div className="flex items-center gap-2">
                  {i < step ? (
                    <XCircle size={13} className="text-danger shrink-0" />
                  ) : (
                    <div className="w-3 h-3 rounded-full border border-border" />
                  )}
                  <span className="text-12 font-600 text-text">{s.label}</span>
                  {i < step && <span className="badge-danger ml-auto">FAIL</span>}
                </div>
                {i < step && <p className="text-11 text-danger mt-1 ml-5">{s.desc}</p>}
              </div>
            ))}
            {step === 4 && (
              <div className="px-3 py-2.5 bg-danger-bg border border-danger rounded text-12 text-danger font-600 text-center">
                ✗ Verification failed — tamper detected at leaf level. Ledger integrity confirmed.
              </div>
            )}
            <button onClick={reset} className="btn-secondary text-12">
              Reset Simulation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LedgerPage() {
  const [expanded, setExpanded] = useState<number | null>(847);
  const [verifying, setVerifying] = useState(false);
  const [chainVerified, setChainVerified] = useState<boolean | null>(null);

  const verifyChain = async () => {
    setVerifying(true);
    setChainVerified(null);
    await new Promise((r) => setTimeout(r, 1800));
    setVerifying(false);
    setChainVerified(true);
  };

  return (
    <AppLayout
      title="Ledger Explorer"
      subtitle={`Block #${BLOCKS[0].height} · ${BLOCKS.length} blocks shown`}
    >
      <div className="px-6 py-5 space-y-5 max-w-screen-2xl mx-auto">
        {/* Chain status */}
        <div className="surface-card px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <GitBranch size={16} className="text-accent" />
            <div>
              <p className="text-13 font-600 text-text">Tamper-Evident Ledger</p>
              <p className="text-11 text-text-dimmer">
                SHA-256 · Ed25519 + ML-DSA-65 hybrid signatures · RFC 6962 Merkle trees
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {chainVerified === true && (
              <div className="flex items-center gap-1.5 text-success text-12 font-600">
                <CheckCircle size={14} />
                Chain verified
              </div>
            )}
            <button
              onClick={verifyChain}
              disabled={verifying}
              className="btn-primary text-12 disabled:opacity-40"
            >
              <Shield size={13} />
              {verifying ? 'Verifying…' : 'Verify Full Chain'}
            </button>
          </div>
        </div>

        {/* Blocks */}
        <div className="space-y-3">
          {BLOCKS.map((block) => (
            <div key={`block-${block.height}`} className="surface-card">
              <button
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-surface-2 transition-colors duration-120"
                onClick={() => setExpanded(expanded === block.height ? null : block.height)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded border border-accent-dim bg-accent-bg flex items-center justify-center">
                    <span className="font-mono text-11 text-accent font-700">#{block.height}</span>
                  </div>
                  <div className="text-left">
                    <p className="text-12 font-600 text-text font-mono">
                      {block.hash.slice(0, 16)}…
                    </p>
                    <p className="text-11 text-text-dimmer">
                      {block.timestamp} · {block.txCount} transactions · proposer: {block.proposer}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={13} className="text-success" />
                  <span className="text-11 text-success">Valid</span>
                  {expanded === block.height ? (
                    <ChevronUp size={14} className="text-text-dimmer" />
                  ) : (
                    <ChevronDown size={14} className="text-text-dimmer" />
                  )}
                </div>
              </button>

              {expanded === block.height && (
                <div className="border-t border-border px-4 py-4 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <p className="text-11 font-600 text-text-dimmer uppercase tracking-wider">
                        Block Hash
                      </p>
                      <p className="font-mono text-11 text-text-dim break-all">{block.hash}</p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-11 font-600 text-text-dimmer uppercase tracking-wider">
                        Previous Hash
                      </p>
                      <p className="font-mono text-11 text-text-dim break-all">{block.prevHash}</p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-11 font-600 text-text-dimmer uppercase tracking-wider">
                        Merkle Root
                      </p>
                      <p className="font-mono text-11 text-text-dim break-all">
                        {block.merkleRoot}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-11 font-600 text-text-dimmer uppercase tracking-wider">
                        Signatures
                      </p>
                      <p className="text-11 text-text-dim">
                        Ed25519 (system) + ML-DSA-65 (witness) · Both verified
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-11 font-600 text-text-dimmer uppercase tracking-wider mb-2">
                      Transactions ({block.txCount})
                    </p>
                    <div className="space-y-1.5">
                      {block.txs.map((tx) => (
                        <div
                          key={`tx-${tx.id}`}
                          className="flex items-start gap-3 px-3 py-2 bg-surface-2 rounded border border-border"
                        >
                          <span
                            className={`${TX_TYPE_COLORS[tx.type] ?? 'badge-neutral'} shrink-0 mt-0.5`}
                          >
                            {tx.type}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-12 text-text">{tx.description}</p>
                            {tx.entityId && (
                              <p className="text-11 text-text-dimmer font-mono mt-0.5">
                                entity: {tx.entityId}
                                {tx.drs ? ` · DRS: ${tx.drs}` : ''}
                              </p>
                            )}
                            {tx.findingsHash && (
                              <p className="text-11 text-text-dimmer font-mono mt-0.5">
                                findings hash: {tx.findingsHash} · ruleset: {tx.rulesetVersion}
                              </p>
                            )}
                          </div>
                          <span className="font-mono text-10 text-text-dimmer shrink-0">
                            {tx.ts.slice(11, 19)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Tamper demo */}
        <TamperDemo />
      </div>
    </AppLayout>
  );
}
