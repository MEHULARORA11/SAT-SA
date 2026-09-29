'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';

import {
  Settings,
  Users,
  Shield,
  Key,
  Activity,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

const USERS = [
  {
    id: 'user-001',
    username: 'admin',
    role: 'admin',
    lastLogin: '2026-09-28T12:30:00Z',
    totp: true,
    status: 'Active',
  },
  {
    id: 'user-002',
    username: 'supervisor-01',
    role: 'supervisor',
    lastLogin: '2026-09-28T11:15:00Z',
    totp: true,
    status: 'Active',
  },
  {
    id: 'user-003',
    username: 'examiner-01',
    role: 'examiner',
    lastLogin: '2026-09-28T09:45:00Z',
    totp: true,
    status: 'Active',
  },
  {
    id: 'user-004',
    username: 'examiner-02',
    role: 'examiner',
    lastLogin: '2026-09-27T16:20:00Z',
    totp: false,
    status: 'Active',
  },
  {
    id: 'user-005',
    username: 'auditor-01',
    role: 'auditor',
    lastLogin: '2026-09-26T14:00:00Z',
    totp: true,
    status: 'Active',
  },
];

const AUDIT_LOG = [
  {
    id: 'log-001',
    ts: '2026-09-28T12:47:22Z',
    actor: 'system',
    action: 'RUN_COMPLETED',
    detail: 'Detection run completed · 143 findings · Block #847',
  },
  {
    id: 'log-002',
    ts: '2026-09-28T12:31:00Z',
    actor: 'system',
    action: 'SUBMISSION_SEALED',
    detail: 'cse-001 submission sealed · DRS 0.91',
  },
  {
    id: 'log-003',
    ts: '2026-09-28T11:15:00Z',
    actor: 'supervisor-01',
    action: 'POLICY_UPDATE',
    detail: 'SLA threshold updated for Critical tier · maker-checker approved',
  },
  {
    id: 'log-004',
    ts: '2026-09-28T09:45:00Z',
    actor: 'examiner-01',
    action: 'REVIEW_VERDICT',
    detail: 'Verdict recorded for finding find-001 · Inadequate',
  },
  {
    id: 'log-005',
    ts: '2026-09-27T18:22:11Z',
    actor: 'examiner-01',
    action: 'FINDING_FINALISED',
    detail: 'Finding NS-01 finalised',
  },
  {
    id: 'log-006',
    ts: '2026-09-27T16:30:00Z',
    actor: 'system',
    action: 'SUBMISSION_SEALED',
    detail: 'cse-003 submission sealed · DRS 0.94',
  },
  {
    id: 'log-007',
    ts: '2026-09-27T15:00:00Z',
    actor: 'examiner-01',
    action: 'REPORT_SEALED',
    detail: 'Advisory report sealed · SHA-256 anchored to Block #846',
  },
  {
    id: 'log-008',
    ts: '2026-09-26T09:00:00Z',
    actor: 'admin',
    action: 'USER_ACTION',
    detail: 'New examiner account created · examiner-02',
  },
];

type AdminTab = 'users' | 'audit' | 'health' | 'policy' | 'airgap';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const [showPassword, setShowPassword] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', role: 'examiner', password: '' });
  const [showAddUser, setShowAddUser] = useState(false);

  const tabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'users', label: 'Users & Roles', icon: <Users size={13} /> },
    { id: 'audit', label: 'Audit Log', icon: <Activity size={13} /> },
    { id: 'health', label: 'System Health', icon: <Shield size={13} /> },
    { id: 'policy', label: 'Policy Editor', icon: <Settings size={13} /> },
    { id: 'airgap', label: 'Air-Gap Attestation', icon: <Key size={13} /> },
  ];

  return (
    <AppLayout title="Admin" subtitle="System administration and configuration">
      <div className="px-6 py-5 space-y-5 max-w-screen-2xl mx-auto">
        {/* Tab nav */}
        <div className="surface-card">
          <div className="flex border-b border-border overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={`admin-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-12 font-500 border-b-2 transition-all duration-120 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-accent text-accent'
                    : 'border-transparent text-text-dimmer hover:text-text'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-4">
            {/* Users & Roles */}
            {activeTab === 'users' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-13 font-600 text-text">User Accounts</h2>
                  <button
                    onClick={() => setShowAddUser(!showAddUser)}
                    className="btn-primary text-12 py-1"
                  >
                    + Add User
                  </button>
                </div>

                {showAddUser && (
                  <div className="p-4 bg-surface-2 border border-border rounded space-y-3">
                    <h3 className="text-12 font-600 text-text">New User</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-11 text-text-dim mb-1">Username</label>
                        <input
                          type="text"
                          className="input-field text-12"
                          value={newUser.username}
                          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                          placeholder="username"
                        />
                      </div>
                      <div>
                        <label className="block text-11 text-text-dim mb-1">Role</label>
                        <select
                          className="input-field text-12"
                          value={newUser.role}
                          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        >
                          <option value="examiner">Examiner</option>
                          <option value="supervisor">Supervisor</option>
                          <option value="auditor">Auditor</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-11 text-text-dim mb-1">
                          Temporary Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            className="input-field text-12 pr-8"
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            placeholder="••••••••"
                          />
                          <button
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-text-dimmer"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="btn-primary text-12 py-1"
                        onClick={() => setShowAddUser(false)}
                      >
                        Create User
                      </button>
                      <button
                        className="btn-secondary text-12 py-1"
                        onClick={() => setShowAddUser(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <table className="w-full text-12 border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      {['Username', 'Role', 'Last Login', 'TOTP', 'Status', 'Actions'].map((h) => (
                        <th
                          key={`user-th-${h}`}
                          className="text-left px-4 py-2.5 text-text-dimmer text-11 font-500 uppercase tracking-wider"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {USERS.map((u) => (
                      <tr
                        key={`user-${u.id}`}
                        className="border-b border-border hover:bg-surface-2 transition-colors duration-120"
                      >
                        <td className="px-4 py-2.5 font-mono text-12 text-text">{u.username}</td>
                        <td className="px-4 py-2.5">
                          <span
                            className={`badge-${u.role === 'admin' ? 'danger' : u.role === 'supervisor' ? 'warning' : u.role === 'examiner' ? 'info' : 'neutral'}`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 font-mono text-11 text-text-dimmer">
                          {u.lastLogin.slice(0, 16).replace('T', ' ')}
                        </td>
                        <td className="px-4 py-2.5">
                          {u.totp ? (
                            <CheckCircle size={13} className="text-success" />
                          ) : (
                            <AlertTriangle size={13} className="text-warning" />
                          )}
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="badge-success">{u.status}</span>
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex gap-1">
                            <button className="btn-ghost text-11 py-0.5 px-2">Reset PW</button>
                            <button className="btn-ghost text-11 py-0.5 px-2 text-danger">
                              Disable
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Audit Log */}
            {activeTab === 'audit' && (
              <div className="space-y-3">
                <h2 className="text-13 font-600 text-text">Audit Log</h2>
                <div className="space-y-1.5">
                  {AUDIT_LOG.map((entry) => (
                    <div
                      key={`log-${entry.id}`}
                      className="flex items-start gap-3 px-3 py-2.5 bg-surface-2 border border-border rounded hover:bg-surface-3 transition-colors duration-120"
                    >
                      <span className="font-mono text-10 text-text-dimmer shrink-0 mt-0.5">
                        {entry.ts.slice(0, 16).replace('T', ' ')}
                      </span>
                      <span className="font-mono text-11 text-accent shrink-0">{entry.actor}</span>
                      <span
                        className={`badge-${entry.action.includes('SEALED') ? 'success' : entry.action.includes('UPDATE') ? 'warning' : entry.action.includes('COMPLETED') ? 'info' : 'neutral'} shrink-0`}
                      >
                        {entry.action}
                      </span>
                      <span className="text-12 text-text-dim">{entry.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* System Health */}
            {activeTab === 'health' && (
              <div className="space-y-4">
                <h2 className="text-13 font-600 text-text">System Health</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    {
                      label: 'Application',
                      status: 'Healthy',
                      detail: 'Next.js 15 · Node 22 LTS · Uptime 99.9%',
                    },
                    {
                      label: 'SQLite (Drizzle)',
                      status: 'Healthy',
                      detail: 'WAL mode · 847 blocks · 14.2 MB',
                    },
                    {
                      label: 'DuckDB Analytics',
                      status: 'Healthy',
                      detail: 'Parquet partitions loaded · 28 entities',
                    },
                    {
                      label: 'Inngest Jobs',
                      status: 'Healthy',
                      detail: 'SQLite mode · Port 8288 (internal only)',
                    },
                    {
                      label: 'Ledger',
                      status: 'Healthy',
                      detail: 'Block #847 · Chain verified · Ed25519+ML-DSA-65',
                    },
                    {
                      label: 'Session Store',
                      status: 'Healthy',
                      detail: 'httpOnly SameSite=Strict · CSRF active',
                    },
                  ].map((item) => (
                    <div
                      key={`health-${item.label}`}
                      className="flex items-start gap-3 px-3 py-3 bg-surface-2 border border-border rounded"
                    >
                      <CheckCircle size={14} className="text-success shrink-0 mt-0.5" />
                      <div>
                        <p className="text-12 font-600 text-text">{item.label}</p>
                        <p className="text-11 text-text-dimmer">{item.detail}</p>
                      </div>
                      <span className="badge-success ml-auto shrink-0">{item.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Policy Editor */}
            {activeTab === 'policy' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-13 font-600 text-text">Policy Configuration</h2>
                  <span className="badge-info">Maker-checker required for changes</span>
                </div>
                <div className="space-y-3">
                  {[
                    {
                      key: 'sla.critical.ack_minutes',
                      label: 'Critical Alert Ack SLA (minutes)',
                      value: '5',
                      editable: true,
                    },
                    {
                      key: 'sla.high.ack_minutes',
                      label: 'High Alert Ack SLA (minutes)',
                      value: '15',
                      editable: true,
                    },
                    {
                      key: 'sla.critical.close_hours',
                      label: 'Critical Case Close SLA (hours)',
                      value: '4',
                      editable: true,
                    },
                    {
                      key: 'sla.high.close_hours',
                      label: 'High Case Close SLA (hours)',
                      value: '24',
                      editable: true,
                    },
                    {
                      key: 'cert_in.notification_hours',
                      label: 'CERT-In Notification Window (hours)',
                      value: '6',
                      editable: false,
                    },
                    {
                      key: 'drs.floor',
                      label: 'DRS Abstention Floor',
                      value: '0.60',
                      editable: true,
                    },
                    {
                      key: 'effort.critical_minutes',
                      label: 'Min Plausible Effort — Critical (min)',
                      value: '30',
                      editable: true,
                    },
                    {
                      key: 'effort.high_minutes',
                      label: 'Min Plausible Effort — High (min)',
                      value: '20',
                      editable: true,
                    },
                  ].map((param) => (
                    <div
                      key={`policy-${param.key}`}
                      className="flex items-center gap-3 px-3 py-2.5 bg-surface-2 border border-border rounded"
                    >
                      <div className="flex-1">
                        <p className="text-12 text-text">{param.label}</p>
                        <p className="font-mono text-10 text-text-dimmer">{param.key}</p>
                      </div>
                      <input
                        type="text"
                        defaultValue={param.value}
                        disabled={!param.editable}
                        className="input-field text-12 w-24 text-right font-mono disabled:opacity-50"
                      />
                      {!param.editable && (
                        <span className="badge-neutral text-10 shrink-0">Locked</span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button className="btn-primary text-12 py-1.5">Submit for Approval</button>
                  <button className="btn-secondary text-12 py-1.5">Reset to Defaults</button>
                </div>
                <p className="text-11 text-text-dimmer">
                  Policy changes require maker-checker approval and are sealed as POLICY_UPDATE
                  transactions on the ledger.
                </p>
              </div>
            )}

            {/* Air-Gap Attestation */}
            {activeTab === 'airgap' && (
              <div className="space-y-4">
                <h2 className="text-13 font-600 text-text">Air-Gap Attestation</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="px-4 py-3 bg-success-bg border border-success rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle size={14} className="text-success" />
                      <p className="text-12 font-600 text-success">Last verify-airgap: PASSED</p>
                    </div>
                    <p className="text-11 text-text-dim">
                      Run: 2026-09-28T12:00:00Z · No external URLs found in build output
                    </p>
                    <p className="text-11 text-text-dim mt-1">
                      Playwright smoke test: all non-localhost requests blocked · 0 attempted
                    </p>
                  </div>
                  <div className="px-4 py-3 bg-surface-2 border border-border rounded">
                    <p className="text-12 font-600 text-text mb-2">Build SBOM Hash</p>
                    <p className="font-mono text-10 text-text-dim break-all">
                      sha256:4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b
                    </p>
                    <p className="text-11 text-text-dimmer mt-2">
                      CycloneDX SBOM · Signed Ed25519+ML-DSA-65
                    </p>
                  </div>
                </div>
                <div className="px-4 py-3 bg-surface-2 border border-border rounded">
                  <p className="text-12 font-600 text-text mb-2">Allowlisted URLs (non-external)</p>
                  <div className="space-y-1">
                    {[
                      'localhost',
                      'http://localhost:*',
                      'http://127.0.0.1:*',
                      'http://inngest:8288',
                      'http://witness:8290',
                      'http://www.w3.org/2000/svg',
                      'http://www.w3.org/1999/xlink',
                    ].map((url) => (
                      <p key={`url-${url}`} className="font-mono text-11 text-text-dim">
                        {url}
                      </p>
                    ))}
                  </div>
                </div>
                <button className="btn-secondary text-12 py-1.5">
                  <Shield size={13} />
                  Run Air-Gap Check Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
