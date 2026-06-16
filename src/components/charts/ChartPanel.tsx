import type { ECharts } from 'echarts/core';
import { TimeSeriesChart } from './TimeSeriesChart';
import { useMetricData } from '@/hooks/useMetricData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { METRIC_CATEGORIES, HOST_IDS, METRIC_DEFS } from '@/lib/constants';
import { useUIStore } from '@/store/ui-store';
import type { MetricCategory } from '@/lib/schema';

interface ChartPanelProps {
  panelIndex: number;
  onChartReady?: (chart: ECharts) => void;
}

export function ChartPanel({ panelIndex, onChartReady }: ChartPanelProps) {
  const compareDimensions = useUIStore((s) => s.compareDimensions);
  const setCompareDimension = useUIStore((s) => s.setCompareDimension);
  const dim = compareDimensions[panelIndex] ?? {
    category: 'cpu' as MetricCategory,
    host: 'server-01',
  };

  const seriesId = `${dim.category}-${dim.host}`;
  const data = useMetricData(seriesId);
  const def = METRIC_DEFS[dim.category];

  return (
    <div className="border rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <Select
          value={dim.category}
          onValueChange={(v) =>
            setCompareDimension(panelIndex, {
              ...dim,
              category: v as MetricCategory,
            })
          }
        >
          <SelectTrigger className="w-28 h-7 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {METRIC_CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {METRIC_DEFS[c].name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={dim.host}
          onValueChange={(v) =>
            setCompareDimension(panelIndex, { ...dim, host: v })
          }
        >
          <SelectTrigger className="w-28 h-7 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {HOST_IDS.map((h) => (
              <SelectItem key={h} value={h}>
                {h}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <TimeSeriesChart
        data={data}
        title={`${def.name} — ${dim.host}`}
        onChartReady={onChartReady}
      />
    </div>
  );
}
