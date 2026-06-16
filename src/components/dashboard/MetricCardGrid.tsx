import { METRIC_CATEGORIES, HOST_IDS, METRIC_DEFS } from '@/lib/constants';
import { getLatestValues, getBuffer } from '@/lib/metric-store';
import { useMetrics } from '@/hooks/useMetrics';
import { MetricCard } from './MetricCard';
import type { MetricCategory } from '@/lib/schema';

function makeSeriesId(host: string, category: MetricCategory) {
  return `${category}-${host}`;
}

export function MetricCardGrid() {
  const { isFetching } = useMetrics();

  if (isFetching) {
    return (
      <div className="text-muted-foreground text-sm">Loading metrics...</div>
    );
  }

  const latest = getLatestValues();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {HOST_IDS.map((host) =>
        METRIC_CATEGORIES.map((category) => {
          const id = makeSeriesId(host, category);
          const def = METRIC_DEFS[category];
          const val = latest.get(id) ?? 0;
          const buf = getBuffer(id);
          const sparkline = buf.toArray().slice(-30);
          return (
            <MetricCard
              key={id}
              name={`${def.name}`}
              unit={def.unit}
              latestValue={val}
              sparklineData={sparkline}
            />
          );
        }),
      )}
    </div>
  );
}
