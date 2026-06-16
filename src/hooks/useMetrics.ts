import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MockGenerator } from '@/lib/mock-generator';
import { getBuffer, clearAllBuffers } from '@/lib/metric-store';
import { useUIStore } from '@/store/ui-store';
import { DEFAULT_SEED } from '@/lib/constants';
import type { MetricBatch } from '@/lib/schema';

const generator = new MockGenerator(DEFAULT_SEED);

export function useMetrics() {
  const timeRangeHours = useUIStore((s) => s.timeRangeHours);
  const pollingInterval = useUIStore((s) => s.pollingInterval);
  const isInitialLoad = useRef(true);

  return useQuery<MetricBatch | null>({
    queryKey: ['metrics', timeRangeHours],
    queryFn: async () => {
      const now = Date.now();
      if (isInitialLoad.current) {
        isInitialLoad.current = false;
        clearAllBuffers();
        const batch = generator.generateHistory(timeRangeHours, now);
        for (const s of batch.series) {
          const buf = getBuffer(s.id);
          buf.pushMany(s.points);
        }
        return batch;
      }
      const increment = generator.generateIncrement(5);
      for (const s of increment.series) {
        const buf = getBuffer(s.id);
        buf.pushMany(s.points);
      }
      return increment;
    },
    refetchInterval: pollingInterval * 1000,
    refetchIntervalInBackground: false,
    structuralSharing: false,
    gcTime: 5 * 60 * 1000,
  });
}
