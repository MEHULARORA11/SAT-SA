import { SECTOR_HEAT } from '@/lib/mockData';

function ScoreCell({ score }: { score: number }) {
  const bg =
    score >= 80
      ? 'var(--danger-bg)'
      : score >= 65
        ? 'var(--warning-bg)'
        : score >= 45
          ? 'var(--accent-bg)'
          : 'var(--success-bg)';
  const color =
    score >= 80
      ? 'var(--danger)'
      : score >= 65
        ? 'var(--warning)'
        : score >= 45
          ? 'var(--accent)'
          : 'var(--success)';
  return (
    <td className="px-2 py-2 text-center">
      <span
        className="font-mono text-11 tabular-nums px-1.5 py-0.5 rounded"
        style={{ backgroundColor: bg, color }}
      >
        {score}
      </span>
    </td>
  );
}

export default function SectorHeatTable() {
  return (
    <div className="surface-card">
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-13 font-600 text-text">Sector Heat</h2>
        <p className="text-11 text-text-dimmer mt-0.5">Avg SAI by sector · higher = more risk</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-12">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-2 text-text-dimmer text-11 uppercase tracking-wider">
                Sector
              </th>
              <th className="text-center px-2 py-2 text-text-dimmer text-11 uppercase tracking-wider">
                Avg SAI
              </th>
              <th className="text-center px-2 py-2 text-text-dimmer text-11 uppercase tracking-wider">
                Crit
              </th>
              <th className="text-center px-2 py-2 text-text-dimmer text-11 uppercase tracking-wider">
                Abs
              </th>
            </tr>
          </thead>
          <tbody>
            {SECTOR_HEAT.map((s) => (
              <tr
                key={`sector-row-${s.sector}`}
                className="border-b border-border hover:bg-surface-2 transition-colors duration-120"
              >
                <td className="px-4 py-2 text-text font-500 text-12">{s.sector}</td>
                <ScoreCell score={s.avgSai} />
                <td className="px-2 py-2 text-center">
                  <span className="font-mono text-11 text-danger tabular-nums">
                    {s.criticalFindings}
                  </span>
                </td>
                <td className="px-2 py-2 text-center">
                  <span className="font-mono text-11 text-text-dimmer tabular-nums">
                    {s.abstained}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
