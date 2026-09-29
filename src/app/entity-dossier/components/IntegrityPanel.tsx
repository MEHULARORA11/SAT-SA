import { type CSEntity } from '@/lib/mockData';
import { Shield, GitBranch, Lock, CheckCircle } from 'lucide-react';

interface Props {
  entity: CSEntity;
}

export default function IntegrityPanel({ entity }: Props) {
  // BACKEND INTEGRATION: fetch ledger seal, Merkle root, and block info from ledger service
  const merkleRoot = 'a3f8c2d1e9b74056...f2a1';
  const blockHeight = 847;
  const submissionHash = 'sha256:4e2f9a8b...c3d7';
  const sealedAt = '2026-09-26T14:22:11Z';

  return (
    <div className="surface-card">
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <Shield size={14} className="text-accent" />
        <h2 className="text-13 font-600 text-text">Integrity &amp; Ledger Seal</h2>
      </div>
      <div className="px-4 py-3 space-y-4">
        {/* Seal status */}
        <div className="flex items-center gap-2 px-3 py-2 bg-success-bg border border-success rounded">
          <CheckCircle size={13} className="text-success" />
          <span className="text-12 text-success font-500">Submission sealed on ledger</span>
        </div>

        {/* Ledger details */}
        <div className="space-y-2.5">
          <div>
            <p className="text-11 text-text-dimmer uppercase tracking-wider mb-1">Block Height</p>
            <p className="font-mono text-13 text-text tabular-nums">#{blockHeight}</p>
          </div>
          <div>
            <p className="text-11 text-text-dimmer uppercase tracking-wider mb-1">Merkle Root</p>
            <p className="font-mono text-11 text-text-dim break-all">{merkleRoot}</p>
          </div>
          <div>
            <p className="text-11 text-text-dimmer uppercase tracking-wider mb-1">
              Submission Hash
            </p>
            <p className="font-mono text-11 text-text-dim break-all">{submissionHash}</p>
          </div>
          <div>
            <p className="text-11 text-text-dimmer uppercase tracking-wider mb-1">Sealed At</p>
            <p className="font-mono text-11 text-text-dim">{sealedAt}</p>
          </div>
          <div>
            <p className="text-11 text-text-dimmer uppercase tracking-wider mb-1">DRS at Seal</p>
            <p className="font-mono text-13 text-success tabular-nums">{entity.drs.toFixed(2)}</p>
          </div>
        </div>

        {/* NS-12 retroactive edit check */}
        <div className="border-t border-border pt-3">
          <p className="text-11 font-600 text-text-dimmer uppercase tracking-wider mb-2">
            NS-12 Retroactive Edit Check
          </p>
          <div className="flex items-center gap-2 text-12 text-success">
            <CheckCircle size={12} />
            <span>No field changes detected between submissions</span>
          </div>
        </div>

        {/* Signature status */}
        <div className="border-t border-border pt-3">
          <p className="text-11 font-600 text-text-dimmer uppercase tracking-wider mb-2">
            Signatures
          </p>
          <div className="space-y-1.5">
            {[
              { role: 'system', verified: true },
              { role: 'supervisor', verified: true },
              { role: 'auditor-witness', verified: true },
            ].map((sig) => (
              <div key={`sig-${sig.role}`} className="flex items-center gap-2 text-12">
                <CheckCircle size={11} className="text-success" />
                <span className="font-mono text-text-dim">{sig.role}</span>
                <span className="badge-success ml-auto">Ed25519 + ML-DSA-65</span>
              </div>
            ))}
          </div>
        </div>

        <button className="btn-secondary w-full text-12 justify-center">
          <GitBranch size={12} />
          Open in Ledger Explorer
        </button>
        <button className="btn-secondary w-full text-12 justify-center">
          <Lock size={12} />
          Verify Inclusion Proof
        </button>
      </div>
    </div>
  );
}
