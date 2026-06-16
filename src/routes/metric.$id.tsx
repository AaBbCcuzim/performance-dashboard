// @ts-nocheck
import { createFileRoute } from '@tanstack/react-router';
import { TimeSeriesChart } from '@/components/charts/TimeSeriesChart';
import { useMetricData } from '@/hooks/useMetricData';
import { getBuffer } from '@/lib/metric-store';
import { METRIC_DEFS } from '@/lib/constants';
import type { MetricCategory } from '@/lib/schema';

export const Route = createFileRoute('/metric/$id')({
  component: MetricDetail,
});

function MetricDetail() {
  const { id } = Route.useParams();
  const data = useMetricData(id);
  const cat = id.split('-')[0] as MetricCategory;
  const def = METRIC_DEFS[cat];
  const buf = getBuffer(id);
  const total = buf.count;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">
          {def?.name ?? cat} — {id}
        </h2>
        <p className="text-sm text-muted-foreground">
          {total.toLocaleString()} data points
        </p>
      </div>
      <div className="bg-card rounded-lg border p-4">
        <TimeSeriesChart data={data} />
      </div>
    </div>
  );
}
