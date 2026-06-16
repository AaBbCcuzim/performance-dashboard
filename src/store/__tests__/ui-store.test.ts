import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from '../ui-store';
import { DEFAULT_POLLING_INTERVAL, DEFAULT_TIME_RANGE_HOURS } from '@/lib/constants';

describe('useUIStore', () => {
  beforeEach(() => {
    useUIStore.setState({
      timeRangeHours: DEFAULT_TIME_RANGE_HOURS,
      pollingInterval: DEFAULT_POLLING_INTERVAL,
      compareDimensions: {},
    });
  });

  it('has default time range', () => {
    expect(useUIStore.getState().timeRangeHours).toBe(DEFAULT_TIME_RANGE_HOURS);
  });

  it('has default polling interval', () => {
    expect(useUIStore.getState().pollingInterval).toBe(DEFAULT_POLLING_INTERVAL);
  });

  it('setTimeRange updates value', () => {
    useUIStore.getState().setTimeRange(24);
    expect(useUIStore.getState().timeRangeHours).toBe(24);
  });

  it('setPollingInterval updates value', () => {
    useUIStore.getState().setPollingInterval(10);
    expect(useUIStore.getState().pollingInterval).toBe(10);
  });

  it('setCompareDimension sets panel dimension', () => {
    useUIStore.getState().setCompareDimension(0, { category: 'cpu', host: 'server-01' });
    expect(useUIStore.getState().compareDimensions[0]).toEqual({
      category: 'cpu',
      host: 'server-01',
    });
  });

  it('compareDimensions starts empty', () => {
    expect(useUIStore.getState().compareDimensions).toEqual({});
  });
});
