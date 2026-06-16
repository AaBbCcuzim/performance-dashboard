import { useRef, useCallback, useEffect } from 'react';
import * as echarts from 'echarts/core';
import type { ECharts } from 'echarts/core';
import { ChartPanel } from './ChartPanel';

export function ComparisonView() {
  const chartsRef = useRef<ECharts[]>([]);

  const handleChartReady = useCallback(
    (index: number) => (chart: ECharts) => {
      chart.group = 'compare-group';
      chartsRef.current[index] = chart;
      if (chartsRef.current.filter(Boolean).length === 4) {
        echarts.connect('compare-group');
      }
    },
    [],
  );

  useEffect(() => {
    return () => {
      echarts.disconnect('compare-group');
    };
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4">
      {[0, 1, 2, 3].map((i) => (
        <ChartPanel
          key={i}
          panelIndex={i}
          onChartReady={handleChartReady(i)}
        />
      ))}
    </div>
  );
}
