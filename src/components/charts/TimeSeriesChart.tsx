import { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  DataZoomComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { DataPoint } from '@/lib/schema';

echarts.use([
  LineChart,
  GridComponent,
  TooltipComponent,
  DataZoomComponent,
  CanvasRenderer,
]);

interface TimeSeriesChartProps {
  data: DataPoint[];
  title?: string;
  onChartReady?: (chart: echarts.ECharts) => void;
}

export function TimeSeriesChart({
  data,
  title,
  onChartReady,
}: TimeSeriesChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    if (!instanceRef.current) {
      instanceRef.current = echarts.init(chartRef.current);
      onChartReady?.(instanceRef.current);
    }

    const timestamps = data.map((d) => d.timestamp);
    const values = data.map((d) => d.value);

    instanceRef.current.setOption(
      {
        tooltip: { trigger: 'axis' },
        grid: { left: 50, right: 16, top: title ? 40 : 16, bottom: 50 },
        xAxis: {
          type: 'category',
          data: timestamps,
          axisLabel: {
            formatter: (value: number) => {
              const d = new Date(value);
              return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
            },
          },
        },
        yAxis: { type: 'value' },
        dataZoom: [
          { type: 'inside', start: 0, end: 100 },
          { type: 'slider', start: 0, end: 100, height: 20, bottom: 6 },
        ],
        series: [
          {
            type: 'line',
            data: values,
            showSymbol: false,
            sampling: 'lttb',
            large: true,
            largeThreshold: 500,
            progressive: 400,
            progressiveThreshold: 3000,
            animation: data.length < 10000,
          },
        ],
      },
      { notMerge: true },
    );

    return () => {
      instanceRef.current?.dispose();
      instanceRef.current = null;
    };
  }, [data, title, onChartReady]);

  return (
    <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
  );
}
