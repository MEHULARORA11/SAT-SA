// Grid plan: 5 cards → grid-cols-5 row 1: hero (spans 2) + 3 regular
// Hero: entities above SAI threshold (most urgent)
import { ENTITIES, FINDINGS } from '@/lib/mockData';

function getSaiClass(sai: number) {
  if (sai >= 75) return 'sai-critical';
  if (sai >= 60) return 'sai-high';
  if (sai >= 40) return 'sai-medium';
  return 'sai-low';
}

export default function KPIBentoGrid() {
  const criticalEntities = ENTITIES.filter((e) => e.sai >= 75 && e.status !== 'Abstained');
  const newFindings = FINDINGS.filter((f) => f.status === 'New').length;
  const persistingFindings = FINDINGS.filter(
    (f) => f.status === 'Persisting' || f.status === 'Chronic'
  ).length;
  const abstained = ENTITIES.filter((e) => e.status === 'Abstained').length;
  const criticalFindings = FINDINGS.filter((f) => f.severity === 'Critical').length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-5 gap-3">
      {/* Hero card — entities requiring immediate attention */}
      <div className="col-span-2 md:col-span-2 lg:col-span-2 xl:col-span-2 surface-card p-4 border-danger-dim bg-danger-bg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-danger" />
        <div className="pl-3">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-11 font-500 uppercase tracking-widest text-text-dim mb-1">
                Entities Requiring Attention
              </p>
              <div className="text-metric text-danger">{criticalEntities.length}</div>
              <p className="text-12 text-text-dimmer mt-1">of 28 CSEs · SAI ≥ 75</p>
            </div>
            <div className="flex flex-col gap-1 text-right">
              {criticalEntities.slice(0, 3).map((e) => (
                <div key={`hero-entity-${e.id}`} className="flex items-center gap-2 justify-end">
                  <span className="text-11 text-text-dimmer truncate max-w-[120px]">{e.name}</span>
                  <span className="font-mono text-11 text-danger tabular-nums">{e.sai}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 text-11 text-text-dimmer">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-danger" />
              <span>{criticalEntities.filter((e) => e.saiDelta > 0).length} trending up</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-warning" />
              <span>{ENTITIES.filter((e) => e.sai >= 50 && e.sai < 75).length} elevated</span>
            </span>
          </div>
        </div>
      </div>

      {/* New findings */}
      <div className="surface-card p-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-warning" />
        <div className="pl-3">
          <p className="text-11 font-500 uppercase tracking-widest text-text-dim mb-2">
            New Findings
          </p>
          <div className="text-metric-sm text-warning">{newFindings}</div>
          <p className="text-11 text-text-dimmer mt-1">this cycle</p>
          <div className="mt-3 flex gap-2">
            <span className="badge-danger">{criticalFindings} CRIT</span>
            <span className="badge-warning">
              {FINDINGS.filter((f) => f.severity === 'High' && f.status === 'New').length} HIGH
            </span>
          </div>
        </div>
      </div>

      {/* Persisting / Chronic */}
      <div className="surface-card p-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
        <div className="pl-3">
          <p className="text-11 font-500 uppercase tracking-widest text-text-dim mb-2">
            Persisting / Chronic
          </p>
          <div className="text-metric-sm text-accent">{persistingFindings}</div>
          <p className="text-11 text-text-dimmer mt-1">across cycles</p>
          <div className="mt-3">
            <span className="badge-warning">
              {FINDINGS.filter((f) => f.status === 'Chronic').length} chronic
            </span>
          </div>
        </div>
      </div>

      {/* Abstained + Critical findings combined */}
      <div className="surface-card p-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-text-dimmer" />
        <div className="pl-3">
          <p className="text-11 font-500 uppercase tracking-widest text-text-dim mb-2">Abstained</p>
          <div className="text-metric-sm text-text-dim">{abstained}</div>
          <p className="text-11 text-text-dimmer mt-1">DRS &lt; 0.60</p>
          <div className="mt-3">
            <span className="badge-neutral">Insufficient evidence</span>
          </div>
        </div>
      </div>
    </div>
  );
}
