import { describe, it, expect } from 'vitest';
import {
  DataPointSchema,
  MetricBatchSchema,
  MetricCategorySchema,
} from '../schema';

describe('DataPointSchema', () => {
  it('passes for valid data point', () => {
    const result = DataPointSchema.safeParse({
      timestamp: 1700000000000,
      value: 42.5,
    });
    expect(result.success).toBe(true);
  });

  it('fails for missing timestamp', () => {
    const result = DataPointSchema.safeParse({ value: 42.5 });
    expect(result.success).toBe(false);
  });

  it('fails for non-number value', () => {
    const result = DataPointSchema.safeParse({
      timestamp: 1,
      value: 'abc',
    });
    expect(result.success).toBe(false);
  });

  it('fails for negative timestamp', () => {
    const result = DataPointSchema.safeParse({ timestamp: -1, value: 1 });
    expect(result.success).toBe(false);
  });
});

describe('MetricBatchSchema', () => {
  it('passes for valid batch', () => {
    const batch = {
      timestamp: 1700000000000,
      series: [
        {
          id: 'cpu-server-01',
          points: [{ timestamp: 1700000000000, value: 42 }],
        },
      ],
    };
    const result = MetricBatchSchema.safeParse(batch);
    expect(result.success).toBe(true);
  });

  it('fails for empty points array', () => {
    const batch = {
      timestamp: 1700000000000,
      series: [{ id: 'cpu-server-01', points: [] }],
    };
    const result = MetricBatchSchema.safeParse(batch);
    expect(result.success).toBe(false);
  });

  it('fails for missing series', () => {
    const result = MetricBatchSchema.safeParse({ timestamp: 1 });
    expect(result.success).toBe(false);
  });
});

describe('MetricCategorySchema', () => {
  it('passes for valid categories', () => {
    expect(MetricCategorySchema.safeParse('cpu').success).toBe(true);
    expect(MetricCategorySchema.safeParse('memory').success).toBe(true);
    expect(MetricCategorySchema.safeParse('network').success).toBe(true);
    expect(MetricCategorySchema.safeParse('disk').success).toBe(true);
  });

  it('fails for invalid category', () => {
    expect(MetricCategorySchema.safeParse('gpu').success).toBe(false);
  });
});
