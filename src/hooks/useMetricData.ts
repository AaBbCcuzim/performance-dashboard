import { useMemo } from 'react';
import { getBuffer } from '@/lib/metric-store';
import { useMetrics } from './useMetrics';
import { useDownsampledData } from './useDownsampledData';
import { useViewportWidth } from './useViewportWidth';

export function useMetricData(seriesId: string) {
  const { data } = useMetrics();
  const vw = useViewportWidth();
  const seriesData = useMemo(
    () => getBuffer(seriesId).toArray(),
    [data, seriesId],
  );
  const downsampled = useDownsampledData(seriesData, vw);
  return downsampled;
}
