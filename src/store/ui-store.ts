import { create } from 'zustand';
import type { MetricCategory } from '@/lib/schema';
import {
  DEFAULT_POLLING_INTERVAL,
  DEFAULT_TIME_RANGE_HOURS,
} from '@/lib/constants';

export interface CompareDimension {
  category: MetricCategory;
  host: string;
}

interface UIState {
  timeRangeHours: number;
  pollingInterval: number;
  compareDimensions: Record<number, CompareDimension>;
  setTimeRange: (hours: number) => void;
  setPollingInterval: (seconds: number) => void;
  setCompareDimension: (panelIndex: number, dim: CompareDimension) => void;
}

export const useUIStore = create<UIState>((set) => ({
  timeRangeHours: DEFAULT_TIME_RANGE_HOURS,
  pollingInterval: DEFAULT_POLLING_INTERVAL,
  compareDimensions: {},

  setTimeRange: (hours) => set({ timeRangeHours: hours }),
  setPollingInterval: (seconds) => set({ pollingInterval: seconds }),
  setCompareDimension: (panelIndex, dim) =>
    set((s) => ({
      compareDimensions: { ...s.compareDimensions, [panelIndex]: dim },
    })),
}));
