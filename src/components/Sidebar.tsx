'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import {
  LayoutDashboard,
  Building2,
  FileSearch,
  Upload,
  GitBranch,
  FlaskConical,
  BookOpen,
  Shield,
  ChevronLeft,
  ChevronRight,
  Activity,
  AlertTriangle,
  BarChart3,
  ClipboardCheck,
  Settings,
  Eye,
  TrendingDown,
  Zap,
  Users,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  badgeVariant?: 'danger' | 'warning' | 'info' | 'neutral';
  group?: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'nav-command-center',
    label: 'Command Center',
    href: '/',
    icon: <LayoutDashboard size={16} />,
    badge: '7',
    badgeVariant: 'danger',
    group: 'Operations',
  },
  {
    id: 'nav-entities',
    label: 'Entity Dossier',
    href: '/entity-dossier',
    icon: <Building2 size={16} />,
    badge: '28',
    badgeVariant: 'neutral',
    group: 'Operations',
  },
  {
    id: 'nav-findings',
    label: 'Findings',
    href: '/findings',
    icon: <AlertTriangle size={16} />,
    badge: '143',
    badgeVariant: 'warning',
    group: 'Operations',
  },
  {
    id: 'nav-evidence',
    label: 'Evidence Explorer',
    href: '/evidence',
    icon: <FileSearch size={16} />,
    group: 'Operations',
  },
  {
    id: 'nav-peers',
    label: 'Peer Benchmark',
    href: '/peers',
    icon: <BarChart3 size={16} />,
    group: 'Analysis',
  },
  {
    id: 'nav-negative-space',
    label: 'Negative Space',
    href: '/negative-space',
    icon: <TrendingDown size={16} />,
    badge: '12',
    badgeVariant: 'warning',
    group: 'Analysis',
  },
  {
    id: 'nav-discovery',
    label: 'Signal Discovery',
    href: '/discovery',
    icon: <Zap size={16} />,
    group: 'Analysis',
  },
  {
    id: 'nav-claims',
    label: 'Claims Register',
    href: '/claims',
    icon: <ClipboardCheck size={16} />,
    badge: '9',
    badgeVariant: 'danger',
    group: 'Analysis',
  },
  {
    id: 'nav-review',
    label: 'Review Workbench',
    href: '/review',
    icon: <Eye size={16} />,
    badge: '34',
    badgeVariant: 'info',
    group: 'Review',
  },
  {
    id: 'nav-trends',
    label: 'Trends',
    href: '/trends',
    icon: <Activity size={16} />,
    group: 'Review',
  },
  {
    id: 'nav-reports',
    label: 'Reports',
    href: '/reports',
    icon: <BookOpen size={16} />,
    group: 'Review',
  },
  {
    id: 'nav-validation',
    label: 'Validation Lab',
    href: '/validation',
    icon: <FlaskConical size={16} />,
    group: 'System',
  },
  {
    id: 'nav-ledger',
    label: 'Ledger Explorer',
    href: '/ledger',
    icon: <GitBranch size={16} />,
    group: 'System',
  },
  {
    id: 'nav-methodology',
    label: 'Methodology',
    href: '/methodology',
    icon: <Shield size={16} />,
    group: 'System',
  },
  {
    id: 'nav-intake',
    label: 'Intake',
    href: '/intake',
    icon: <Upload size={16} />,
    badge: '2',
    badgeVariant: 'info',
    group: 'System',
  },
  {
    id: 'nav-admin',
    label: 'Admin',
    href: '/admin',
    icon: <Settings size={16} />,
    group: 'System',
  },
];

const GROUPS = ['Operations', 'Analysis', 'Review', 'System'];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const badgeClass = (variant?: string) => {
    switch (variant) {
      case 'danger':
        return 'badge-danger';
      case 'warning':
        return 'badge-warning';
      case 'info':
        return 'badge-info';
      default:
        return 'badge-neutral';
    }
  };

  return (
    <aside
      className="flex flex-col h-screen sticky top-0 border-r border-border bg-surface transition-all duration-300 ease-in-out shrink-0"
      style={{ width: collapsed ? 64 : 240 }}
      aria-label="Primary navigation"
    >
      {/* Logo */}
      <div className="flex items-center h-12 px-3 border-b border-border shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <AppLogo size={28} />
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-accent font-mono font-700 text-12 tracking-wider leading-none">
                SAT-SA
              </span>
              <span className="text-text-dimmer text-11 leading-none mt-0.5 truncate">
                NCIIPC Supervisory
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-2 min-h-0">
        {GROUPS.map((group) => {
          const items = NAV_ITEMS.filter((i) => i.group === group);
          return (
            <div key={`group-${group}`} className="mb-1">
              {!collapsed && (
                <div className="px-3 py-1.5">
                  <span className="text-text-dimmer text-11 font-500 uppercase tracking-widest">
                    {group}
                  </span>
                </div>
              )}
              {items.map((item) => {
                const isActive =
                  pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={`flex items-center gap-2.5 mx-1.5 px-2.5 py-1.5 rounded transition-all duration-120 group relative ${
                      isActive
                        ? 'bg-accent-bg text-accent border border-accent-dim'
                        : 'text-text-dim hover:bg-surface-2 hover:text-text border border-transparent'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className="shrink-0">{item.icon}</span>
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-13 font-500 truncate">{item.label}</span>
                        {item.badge && (
                          <span className={badgeClass(item.badgeVariant)}>{item.badge}</span>
                        )}
                      </>
                    )}
                    {collapsed && item.badge && (
                      <span
                        className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor:
                            item.badgeVariant === 'danger'
                              ? 'var(--danger)'
                              : item.badgeVariant === 'warning'
                                ? 'var(--warning)'
                                : 'var(--info)',
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* User + collapse */}
      <div className="border-t border-border p-2 shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-2 px-2 py-1.5 mb-1">
            <div className="w-6 h-6 rounded-full bg-surface-3 border border-border-2 flex items-center justify-center shrink-0">
              <Users size={12} className="text-text-dim" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-12 font-500 text-text truncate">examiner_01</div>
              <div className="text-11 text-text-dimmer truncate">Examiner · NCIIPC</div>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="btn-ghost w-full justify-center text-text-dimmer hover:text-text"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight size={14} />
          ) : (
            <>
              <ChevronLeft size={14} />
              <span className="text-12">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
