// @ts-nocheck
import { createFileRoute } from '@tanstack/react-router';
import { MetricCardGrid } from '@/components/dashboard/MetricCardGrid';
import { DataStatusBar } from '@/components/dashboard/DataStatusBar';
import { TimeSeriesChart } from '@/components/charts/TimeSeriesChart';
import { useMetricData } from '@/hooks/useMetricData';

export const Route = createFileRoute('/')({
  component: Dashboard,
});

function Dashboard() {
  const cpuData = useMetricData('cpu-server-01');

  return (
    <div className="space-y-6">
      <MetricCardGrid />
      <div className="bg-card rounded-lg border p-4">
        <h2 className="text-sm font-medium mb-3">CPU Usage — server-01</h2>
        <TimeSeriesChart data={cpuData} />
      </div>
      <DataStatusBar />
    </div>
  );
}
