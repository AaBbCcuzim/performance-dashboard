import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDownsampledData } from '../useDownsampledData';
import type { DataPoint } from '@/lib/schema';

describe('useDownsampledData', () => {
  it('returns all points when count is small', () => {
    const data: DataPoint[] = [
      { timestamp: 1, value: 10 },
      { timestamp: 2, value: 20 },
      { timestamp: 3, value: 30 },
    ];
    const { result } = renderHook(() => useDownsampledData(data, 1200));
    expect(result.current.length).toBe(3);
  });

  it('downsamples when count exceeds viewport threshold', () => {
    const data: DataPoint[] = Array.from({ length: 5000 }, (_, i) => ({
      timestamp: i * 1000,
      value: Math.random() * 100,
    }));
    const { result } = renderHook(() => useDownsampledData(data, 1200));
    expect(result.current.length).toBeLessThan(5000);
    expect(result.current.length).toBeGreaterThanOrEqual(500);
  });

  it('handles empty data', () => {
    const { result } = renderHook(() => useDownsampledData([], 1200));
    expect(result.current).toEqual([]);
  });
});
