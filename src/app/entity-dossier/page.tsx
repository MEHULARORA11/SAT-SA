'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import AppLayout from '@/components/AppLayout';
import EntityHeader from './components/EntityHeader';
import DomainRadarChart from './components/DomainRadarChart';
import AlertHeatmap from './components/AlertHeatmap';
import FindingsTable from './components/FindingsTable';
import ClaimsRegister from './components/ClaimsRegister';
import ScoreWaterfall from './components/ScoreWaterfall';
import IntegrityPanel from './components/IntegrityPanel';
import AlertFlowSankey from './components/AlertFlowSankey';
import { ENTITIES } from '@/lib/mockData';

function EntityDossierContent() {
  const searchParams = useSearchParams();
  const entityId = searchParams?.get('id');
  // Find entity by ID from query param, fall back to first entity for demo
  const entity = (entityId ? ENTITIES?.find((e) => e?.id === entityId) : null) ?? ENTITIES?.[0];

  return (
    <AppLayout title="Entity Dossier" subtitle={entity?.name}>
      <div className="px-6 py-5 space-y-5 max-w-screen-2xl mx-auto">
        <EntityHeader entity={entity} />

        {/* Main grid: radar + heatmap */}
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2 gap-5">
          <DomainRadarChart />
          <AlertHeatmap />
        </div>

        {/* Sankey full width */}
        <AlertFlowSankey />

        {/* Score waterfall + Integrity */}
        <div className="grid grid-cols-1 xl:grid-cols-3 2xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2 2xl:col-span-2">
            <ScoreWaterfall />
          </div>
          <div className="xl:col-span-1 2xl:col-span-1">
            <IntegrityPanel entity={entity} />
          </div>
        </div>

        {/* Findings table full width */}
        <FindingsTable entityId={entity?.id} />

        {/* Claims register full width */}
        <ClaimsRegister entityId={entity?.id} />
      </div>
    </AppLayout>
  );
}

export default function EntityDossierPage() {
  return (
    <Suspense
      fallback={
        <AppLayout title="Entity Dossier" subtitle="Loading…">
          <div className="px-6 py-5 flex items-center justify-center h-64">
            <span className="text-text-dimmer text-13">Loading entity data…</span>
          </div>
        </AppLayout>
      }
    >
      <EntityDossierContent />
    </Suspense>
  );
}
