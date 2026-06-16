import type { MetricCategory } from './schema';

export const DEFAULT_SEED = 42;
export const POLLING_INTERVALS = [1, 5, 10, 30] as const;
export const DEFAULT_POLLING_INTERVAL = 5;

export const TIME_RANGES = [
  { label: '1h', hours: 1 },
  { label: '6h', hours: 6 },
  { label: '24h', hours: 24 },
] as const;
export const DEFAULT_TIME_RANGE_HOURS = 6;

export const METRIC_CATEGORIES: MetricCategory[] = [
  'cpu',
  'memory',
  'network',
  'disk',
];

export const HOST_IDS = [
  'server-01',
  'server-02',
  'server-03',
  'server-04',
  'server-05',
];

export const METRIC_DEFS: Record<
  MetricCategory,
  { name: string; unit: string }
> = {
  cpu: { name: 'CPU Usage', unit: '%' },
  memory: { name: 'Memory', unit: 'GB' },
  network: { name: 'Network I/O', unit: 'MB/s' },
  disk: { name: 'Disk I/O', unit: 'IOPS' },
};

export const DATA_INTERVAL_MS = 1000;
export const RING_BUFFER_CAPACITY = 1_000_000;

export const DOWNSAMPLE_RESOLUTIONS = [
  { maxWidth: 600, target: 300 },
  { maxWidth: 1200, target: 600 },
  { maxWidth: 2000, target: 1000 },
  { maxWidth: Infinity, target: 2000 },
] as const;
