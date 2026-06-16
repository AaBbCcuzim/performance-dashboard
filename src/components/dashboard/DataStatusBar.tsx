import { getTotalPointCount } from '@/lib/metric-store';
import { useMetrics } from '@/hooks/useMetrics';

export function DataStatusBar() {
  const { dataUpdatedAt, error } = useMetrics();
  const points = getTotalPointCount();

  return (
    <div className="flex items-center gap-4 text-xs text-muted-foreground border-t pt-3 mt-4">
      <span>{points.toLocaleString()} data points loaded</span>
      {dataUpdatedAt > 0 && (
        <span>
          Last updated: {new Date(dataUpdatedAt).toLocaleTimeString()}
        </span>
      )}
      {error && (
        <span className="text-destructive">Error: {error.message}</span>
      )}
    </div>
  );
}
