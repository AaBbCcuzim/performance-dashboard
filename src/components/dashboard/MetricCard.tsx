import { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { DataPoint } from '@/lib/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

echarts.use([LineChart, GridComponent, CanvasRenderer]);

interface MetricCardProps {
  name: string;
  unit: string;
  latestValue: number;
  sparklineData: DataPoint[];
}

export function MetricCard({
  name,
  unit,
  latestValue,
  sparklineData,
}: MetricCardProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    if (!instanceRef.current) {
      instanceRef.current = echarts.init(chartRef.current);
    }
    instanceRef.current.setOption(
      {
        grid: { top: 4, right: 4, bottom: 4, left: 4 },
        xAxis: { show: false },
        yAxis: { show: false, min: 'dataMin', max: 'dataMax' },
        series: [
          {
            type: 'line',
            data: sparklineData.map((d) => d.value),
            showSymbol: false,
            lineStyle: { width: 1.5 },
            areaStyle: { opacity: 0.1 },
            silent: true,
          },
        ],
      },
      { notMerge: true },
    );
    return () => {
      instanceRef.current?.dispose();
      instanceRef.current = null;
    };
  }, [sparklineData]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground">
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xl font-bold">
          {latestValue.toFixed(1)}
          <span className="text-xs font-normal text-muted-foreground ml-1">
            {unit}
          </span>
        </div>
        <div ref={chartRef} className="h-10 mt-1" />
      </CardContent>
    </Card>
  );
}
