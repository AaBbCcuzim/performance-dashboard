import { describe, it, expect } from 'vitest';
import { MockGenerator } from '../mock-generator';

describe('MockGenerator', () => {
  it('generates same data with same seed', () => {
    const g1 = new MockGenerator(42);
    const g2 = new MockGenerator(42);
    const now = 1700000000000;
    const b1 = g1.generateHistory(1, now);
    const b2 = g2.generateHistory(1, now);
    expect(b1).toEqual(b2);
  });

  it('generates different data with different seeds', () => {
    const g1 = new MockGenerator(42);
    const g2 = new MockGenerator(99);
    const now = 1700000000000;
    const b1 = g1.generateHistory(1, now);
    const b2 = g2.generateHistory(1, now);
    expect(b1.series[0].points[0].value).not.toBe(
      b2.series[0].points[0].value,
    );
  });

  it('generates 20 series (5 hosts × 4 categories)', () => {
    const gen = new MockGenerator(42);
    const batch = gen.generateHistory(6, Date.now());
    expect(batch.series.length).toBe(20);
  });

  it('generates correct points per series for 1 hour', () => {
    const gen = new MockGenerator(42);
    const batch = gen.generateHistory(1, Date.now());
    for (const s of batch.series) {
      expect(s.points.length).toBe(3600);
    }
  });

  it('timestamps are monotonic with 1s interval', () => {
    const gen = new MockGenerator(42);
    const batch = gen.generateHistory(1, Date.now());
    for (const s of batch.series) {
      for (let i = 1; i < s.points.length; i++) {
        expect(s.points[i].timestamp).toBeGreaterThan(
          s.points[i - 1].timestamp,
        );
        expect(s.points[i].timestamp - s.points[i - 1].timestamp).toBe(1000);
      }
    }
  });

  it('generateIncrement produces recent points with correct count', () => {
    const gen = new MockGenerator(42);
    const now = Date.now();
    const increment = gen.generateIncrement(5);
    for (const s of increment.series) {
      expect(s.points.length).toBe(5);
      // Points should be within the last few seconds
      expect(s.points[0].timestamp).toBeGreaterThan(now - 10000);
      expect(s.points[4].timestamp).toBeLessThanOrEqual(Date.now());
    }
  });

  it('values stay within reasonable bounds', () => {
    const gen = new MockGenerator(42);
    const batch = gen.generateHistory(1, Date.now());
    for (const s of batch.series) {
      for (const p of s.points) {
        expect(p.value).toBeGreaterThanOrEqual(0);
        expect(p.value).toBeLessThanOrEqual(1000);
      }
    }
  });
});
