'use client';

import React, { useState } from 'react';
import { Search, Bell, RefreshCw, HelpCircle, Shield } from 'lucide-react';

interface TopbarProps {
  title?: string;
  subtitle?: string;
}

export default function Topbar({ title, subtitle }: TopbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="h-12 border-b border-border bg-surface flex items-center px-4 gap-4 shrink-0">
      {/* Title */}
      <div className="flex-1 min-w-0">
        {title && (
          <div className="flex items-center gap-2">
            <h1 className="text-13 font-600 text-text truncate">{title}</h1>
            {subtitle && (
              <span className="text-text-dimmer text-12 truncate hidden sm:block">
                — {subtitle}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          className="btn-ghost text-text-dimmer"
          onClick={() => setSearchOpen(!searchOpen)}
          aria-label="Open command palette (Ctrl+K)"
          title="Search (Ctrl+K)"
        >
          <Search size={14} />
          <span className="text-11 text-text-dimmer hidden md:block">Ctrl+K</span>
        </button>

        <button
          className="btn-ghost text-text-dimmer relative"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={14} />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-danger" />
        </button>

        <button className="btn-ghost text-text-dimmer" aria-label="Refresh data" title="Refresh">
          <RefreshCw size={14} />
        </button>

        <button className="btn-ghost text-text-dimmer" aria-label="Help" title="Help">
          <HelpCircle size={14} />
        </button>

        <div className="ml-2 flex items-center gap-1.5 px-2 py-1 bg-success-bg border border-success rounded text-success text-11 font-500">
          <Shield size={11} />
          <span>Air-gapped</span>
        </div>
      </div>
    </header>
  );
}
