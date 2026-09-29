import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function AppLayout({ children, title, subtitle }: AppLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Disclaimer bar */}
        <div className="disclaimer-bar shrink-0 no-print">
          <span>
            ⚠ Decision support only. Every finding requires examiner review. Synthetic demo data —
            not real NCIIPC data.
          </span>
        </div>
        <Topbar title={title} subtitle={subtitle} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
