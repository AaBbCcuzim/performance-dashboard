import {
  METRIC_CATEGORIES,
  HOST_IDS,
  DATA_INTERVAL_MS,
} from './constants';
import type { MetricBatch, MetricCategory } from './schema';
import { MetricBatchSchema } from './schema';

function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeSeriesId(host: string, category: MetricCategory): string {
  return `${category}-${host}`;
}

export class MockGenerator {
  private rand: () => number;

  constructor(seed: number) {
    this.rand = mulberry32(seed);
  }

  generateHistory(hours: number, endTime: number): MetricBatch {
    const pointCount = hours * 3600;
    const startTime = endTime - pointCount * DATA_INTERVAL_MS;

    const series = [];
    for (const host of HOST_IDS) {
      for (const category of METRIC_CATEGORIES) {
        const id = makeSeriesId(host, category);
        const points = this.generatePoints(category, startTime, pointCount);
        series.push({ id, points });
      }
    }

    const batch = { timestamp: endTime, series };
    return MetricBatchSchema.parse(batch);
  }

  generateIncrement(count: number): MetricBatch {
    const endTime = Date.now();
    const startTime = endTime - (count - 1) * DATA_INTERVAL_MS;

    const series = [];
    for (const host of HOST_IDS) {
      for (const category of METRIC_CATEGORIES) {
        const id = makeSeriesId(host, category);
        const points = this.generatePoints(category, startTime, count);
        series.push({ id, points });
      }
    }
    const batch = { timestamp: endTime, series };
    return MetricBatchSchema.parse(batch);
  }

  private generatePoints(
    category: MetricCategory,
    startTime: number,
    count: number,
  ) {
    const points = [];
    const ranges: Record<MetricCategory, [number, number]> = {
      cpu: [10, 90],
      memory: [1, 16],
      network: [0, 100],
      disk: [0, 500],
    };
    const [min, max] = ranges[category];
    const base = min + this.rand() * (max - min) * 0.5;

    for (let i = 0; i < count; i++) {
      const noise = (this.rand() - 0.5) * (max - min) * 0.3;
      const trend = Math.sin((i / count) * Math.PI * 2) * (max - min) * 0.15;
      const value = Math.max(min, Math.min(max, base + noise + trend));
      const ts = startTime + i * DATA_INTERVAL_MS;
      points.push({ timestamp: ts, value: Number(value.toFixed(2)) });
    }
    return points;
  }
}
