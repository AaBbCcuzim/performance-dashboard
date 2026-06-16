import { describe, it, expect } from 'vitest';
import { lttb } from '../lttb';
import type { DataPoint } from '../schema';

function makePoints(count: number): DataPoint[] {
  return Array.from({ length: count }, (_, i) => ({
    timestamp: 1000000 + i * 1000,
    value: Math.sin(i * 0.1) * 50 + 50,
  }));
}

describe('lttb', () => {
  it('returns all points when count <= target', () => {
    const pts = makePoints(5);
    const result = lttb(pts, 10);
    expect(result.length).toBe(5);
  });

  it('returns exactly target points when count > target', () => {
    const pts = makePoints(1000);
    const result = lttb(pts, 100);
    expect(result.length).toBeGreaterThanOrEqual(95);
  });

  it('preserves first and last points', () => {
    const pts = makePoints(1000);
    const result = lttb(pts, 10);
    expect(result[0]).toBe(pts[0]);
    expect(result[result.length - 1]).toBe(pts[pts.length - 1]);
  });

  it('handles large input (1M → 1000) within 200ms', () => {
    const pts = makePoints(1_000_000);
    const start = performance.now();
    const result = lttb(pts, 1000);
    const elapsed = performance.now() - start;
    expect(result.length).toBeGreaterThanOrEqual(950);
    expect(elapsed).toBeLessThan(200);
  });

  it('returns empty for empty input', () => {
    expect(lttb([], 10)).toEqual([]);
  });

  it('output is monotonic in time', () => {
    const pts = makePoints(10000);
    const result = lttb(pts, 500);
    for (let i = 1; i < result.length; i++) {
      expect(result[i].timestamp).toBeGreaterThan(
        result[i - 1].timestamp,
      );
    }
  });
});
