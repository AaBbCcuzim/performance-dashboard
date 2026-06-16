---
comet_change: performance-dashboard-mvp
role: technical-design
canonical_spec: openspec
archived-with: 2026-06-16-performance-dashboard-mvp
status: final
---

# Performance Dashboard MVP — Technical Design

## Architecture Overview

```
src/
├── main.tsx                         # QueryClientProvider + RouterProvider
├── routeTree.gen.ts                 # TanStack Router 代码生成
├── routes/
│   ├── __root.tsx                   # Header (Nav + TimeRange + Polling) + Outlet
│   ├── index.tsx                    # Dashboard: MetricCardGrid + TimeSeriesChart + StatusBar
│   ├── compare.tsx                  # Comparison: 4× ChartPanel, echarts.connect sync
│   └── metric.$id.tsx               # Single metric detail view
├── components/
│   ├── dashboard/
│   │   ├── MetricCard.tsx           # Name + current value + ECharts mini sparkline
│   │   ├── MetricCardGrid.tsx       # Responsive grid (grid-cols-2 ~ 5)
│   │   └── DataStatusBar.tsx        # Total points / last update / render time
│   ├── charts/
│   │   ├── TimeSeriesChart.tsx      # ECharts wrapper: large:true, LTTB, Canvas
│   │   ├── ChartPanel.tsx           # Chart + dimension selector dropdowns
│   │   └── ComparisonView.tsx       # 2×2 grid, echarts.connect for synced zoom
│   ├── controls/
│   │   ├── TimeRangeSelector.tsx    # Preset button group + custom input
│   │   └── PollingController.tsx    # Dropdown: 1s/5s/10s/30s
│   └── ui/                          # shadcn/ui primitives
├── hooks/
│   ├── useMetrics.ts               # TanStack Query: queryKey + refetchInterval
│   ├── useDownsampledData.ts        # Viewport width → LTTB target count
│   └── useViewportWidth.ts          # ResizeObserver → px width
├── lib/
│   ├── ring-buffer.ts
│   ├── lttb.ts
│   ├── mock-generator.ts
│   ├── schema.ts
│   └── constants.ts
├── store/
│   └── ui-store.ts                  # Zustand: timeRange, pollingInterval, compareDimensions
└── types/
    └── metrics.ts                   # Inferred from Zod schemas
```

## Data Flow

```
MockGenerator (seeded) → Zod validate → TanStack Query cache → RingBuffer (per series)
                                                                      │
                                                        ┌─────────────┘
                                                        ▼
                                              LTTB downsample (viewport-aware)
                                                        │
                                                        ▼
                                              ECharts Canvas (large:true)
```

Unidirectional. Each layer has a single responsibility. No circular dependencies.

## Key Design Decisions

### D1: ECharts Canvas rendering for large datasets
- `large: true` skips per-point event detection
- `sampling: 'lttb'` provides second-layer downsampling during dataZoom
- `progressive: 400` throttles per-frame render
- `animation: false` avoids layout jank on data append
- `echarts.connect([...])` enables synced time-axis pan/zoom across comparison panels

### D2: TanStack Query for data lifecycle
- `refetchInterval` drives polling schedule
- `queryKey: ['metrics', timeRange]` auto-invalidates on time range change
- `structuralSharing: false` — deep equality check is too expensive for large arrays
- Component declares query; framework handles dedup, cleanup, racing

### D3: RingBuffer with fixed capacity
- 1,000,000 points per series, O(1) append via modulo arithmetic
- Automatic overwrite of oldest data when full → constant memory
- No slice/concat in hot path — mutates in place, exports shallow copy on read

### D4: LTTB downsampling
- Largest Triangle Three Buckets: O(n), preserves peaks and valleys
- Dynamic target count derived from viewport pixel width (300–2000 points)
- Pure function: `(data: DataPoint[], targetCount: number) => DataPoint[]`

### D5: Zustand for UI state only
- Service data (metrics) lives in TanStack Query cache, not Zustand
- Store holds: `timeRange`, `pollingInterval`, `compareDimensions`
- Selectors prevent unnecessary re-renders

### D6: shadcn/ui component primitives
- Controls layer (buttons, select dropdowns, cards) uses shadcn/ui
- Chart area uses raw ECharts — no wrapping in UI component library
- Tailwind CSS for layout and spacing

## Data Model

```typescript
// Zod schemas (single source of truth, TS types inferred via z.infer)
const DataPointSchema = z.object({
  timestamp: z.number(),     // epoch ms
  value: z.number(),
});

const MetricBatchSchema = z.object({
  timestamp: z.number(),
  series: z.array(z.object({
    id: z.string(),
    points: z.array(DataPointSchema).min(1),
  })),
});

type DataPoint = z.infer<typeof DataPointSchema>;
type MetricBatch = z.infer<typeof MetricBatchSchema>;
```

## Simulation Parameters

| Parameter | Value |
|-----------|-------|
| Hosts | 5 (server-01 ~ server-05) |
| Metric categories | cpu, memory, network, disk |
| Total series | 20 |
| Data interval | 1 second |
| Historical depth | 6 hours |
| Points per series (initial) | 21,600 |
| RingBuffer capacity | 1,000,000 |
| Random seed | Deterministic (42) |

## Performance Strategy

| Layer | Technique | Target |
|-------|-----------|--------|
| Data | RingBuffer O(1) push, fixed capacity | Zero GC pressure |
| Downsample | LTTB: 1M → viewport-appropriate (≤2000) | < 50ms |
| Render | ECharts Canvas large mode, progressive rendering | 30fps+ |
| Update | rAF-batched setOption, notMerge: false | Incremental append |
| Memory | Fixed buffer, no allocations in hot path | < 50MB growth over 10min |

## Component Boundaries

| Unit | Responsibility | Does NOT |
|------|---------------|----------|
| `mock-generator` | Seeded random DataPoint[] generation | Storage, validation |
| `schema.ts` | Zod validation + TS type export | Business logic |
| `ring-buffer` | O(1) push/read with modulo index | Downsampling, rendering |
| `lttb.ts` | Pure function: points → target → downsampled | Viewport detection |
| `useMetrics` | Query cache + polling lifecycle | UI rendering |
| `useDownsampledData` | Viewport → target count → lttb() call | Data fetching |
| `TimeSeriesChart` | ECharts instance lifecycle + setOption | Data source selection |
| `ui-store` | timeRange, pollingInterval, compareDims | Service data |

## Interaction Design

- **Time axis sync (comparison)**: echarts.connect across 4 instances. All charts pan/zoom in lockstep.
- **Incremental append**: Polled data pushed to RingBuffer, LTTB recomputed, ECharts `setOption` with `notMerge: false` for smooth line extension.
- **Time range switch**: Invalidates query, fetches full historical data, repopulates buffers, re-downsamples.
- **Sparkline (MetricCard)**: Separate lightweight ECharts instance with minimal options (no axis, no tooltip).

## Testing Strategy

### Unit (Vitest)
- RingBuffer: push, overflow, toArray order, empty state, count
- LTTB: correctness for 1M→1000, edge case n < target, monotonicity preservation
- MockGenerator: seed reproducibility, series count, monotonic timestamps, batch correctness
- Zod schemas: valid pass, invalid reject, missing fields reject

### Component (Vitest + Testing Library)
- MetricCard: renders value/unit, sparkline presence, null value fallback
- TimeRangeSelector: click → store update, active state styling
- PollingController: option render, selection syncs to store
- DataStatusBar: point count display, timestamp formatting

### E2E (Playwright)
- Dashboard loads: 4 metric cards, main chart visible, status bar populated
- Polling update: wait 10s, status bar count increases, chart extends, no console errors
- Time range switch: click 24h → chart reloads → count changes
- Navigation: dashboard → compare → detail → back, URLs correct
- Comparison: 4 panels render, dimension selector works, zoom syncs
- Memory: 5min continuous run, JSHeapSize growth < 50MB
