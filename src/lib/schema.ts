import { z } from 'zod';

export const DataPointSchema = z.object({
  timestamp: z.number().nonnegative().int(),
  value: z.number(),
});

export const MetricCategorySchema = z.enum([
  'cpu',
  'memory',
  'network',
  'disk',
]);

export const MetricBatchSchema = z.object({
  timestamp: z.number().nonnegative().int(),
  series: z.array(
    z.object({
      id: z.string(),
      points: z.array(DataPointSchema).min(1),
    }),
  ),
});

export type DataPoint = z.infer<typeof DataPointSchema>;
export type MetricCategory = z.infer<typeof MetricCategorySchema>;
export type MetricBatch = z.infer<typeof MetricBatchSchema>;
