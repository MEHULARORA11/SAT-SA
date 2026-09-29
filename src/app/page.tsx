import AppLayout from '@/components/AppLayout';
import KPIBentoGrid from './components/KPIBentoGrid';
import EntityRankTable from './components/EntityRankTable';
import SectorHeatTable from './components/SectorHeatTable';
import RunStatusPanel from './components/RunStatusPanel';
import DomainHeatmapChart from './components/DomainHeatmapChart';

export default function CommandCenterPage() {
  return (
    <AppLayout title="Command Center" subtitle="Cycle 8 · 28 Sep 2026 · 28 CSEs">
      <div className="px-6 py-5 space-y-5 max-w-screen-2xl mx-auto">
        {/* Synthetic data notice */}
        <div className="flex items-center gap-2 px-3 py-2 bg-surface-2 border border-border rounded text-text-dimmer text-11 font-mono">
          <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
          <span>
            SYNTHETIC DEMO DATA — illustrative only. Labels: synthetic. No real NCIIPC data used.
          </span>
          <span className="ml-auto tabular-nums">
            Last run: 2026-09-28 12:47 UTC · Block #847 · v2.4.1
          </span>
        </div>

        {/* KPI bento grid */}
        <KPIBentoGrid />

        {/* Main content grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 2xl:grid-cols-3 gap-5">
          {/* Entity rank table — spans 2 cols */}
          <div className="xl:col-span-2 2xl:col-span-2">
            <EntityRankTable />
          </div>
          {/* Right panel */}
          <div className="xl:col-span-1 2xl:col-span-1 space-y-5">
            <RunStatusPanel />
            <SectorHeatTable />
          </div>
        </div>

        {/* Domain heatmap full width */}
        <DomainHeatmapChart />
      </div>
    </AppLayout>
  );
}
