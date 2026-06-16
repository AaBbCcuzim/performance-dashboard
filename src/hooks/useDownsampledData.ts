import { useMemo } from 'react';
import { lttb } from '@/lib/lttb';
import { DOWNSAMPLE_RESOLUTIONS } from '@/lib/constants';
import type { DataPoint } from '@/lib/schema';

function getTargetPoints(viewportWidth: number): number {
  for (const r of DOWNSAMPLE_RESOLUTIONS) {
    if (viewportWidth <= r.maxWidth) return r.target;
  }
  return 2000;
}

export function useDownsampledData(
  data: DataPoint[],
  viewportWidth: number,
): DataPoint[] {
  return useMemo(() => {
    if (data.length === 0) return [];
    const target = getTargetPoints(viewportWidth);
    if (data.length <= target) return data;
    return lttb(data, target);
  }, [data, viewportWidth]);
}
