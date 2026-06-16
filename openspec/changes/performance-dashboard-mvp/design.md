## Context

全新项目，无现有代码。目标是构建一个纯前端性能分析平台 MVP，所有数据由客户端模拟生成。系统需要对 AI 生成代码友好（类型完备、规范清晰、不可变数据流）。

## Goals / Non-Goals

**Goals:**
- 百万级数据点流畅渲染（≥30fps，首渲染 <2s）
- 实时轮询更新，图表无闪烁追加新数据
- 多维度对比视图（最多 4 图并列）
- 可配置轮询间隔和时间范围
- TypeScript 全量类型覆盖，ESLint 零告警

**Non-Goals:**
- 真实数据采集器（模拟数据即可）
- 后端服务 / 数据库持久化
- 用户认证与权限
- 告警规则引擎
- 导出 / 报表功能
- 移动端适配

## Decisions

### D1: ECharts Canvas 模式 vs SVG 方案
**选择**: ECharts Canvas 渲染
**理由**: 百万级数据点场景 SVG DOM 节点数不可承受。Canvas 单画布绘制，ECharts 内置大数据量模式（`large: true`），配合降采样可达亚秒级首帧。
**替代方案**: D3 + Canvas 手写 — 灵活但开发量数倍，且缺乏 ECharts 的 tooltip/zoom/brush 开箱交互。

### D2: TanStack Query 驱动数据流
**选择**: TanStack Query 5.60 管理所有服务端数据
**理由**: 轮询（`refetchInterval`）、缓存、去重、后台更新天然内置。与 TanStack Router 同生态，类型推理贯通。将「服务端数据」抽象剥离后，组件只需声明 query，不再手动管理 fetch 生命周期。
**替代方案**: 手写 `setInterval` + fetch — 需自行处理竞态、组件卸载清理、缓存去重，样板代码多且容易出 bug。

### D3: LTTB 降采样算法
**选择**: Largest Triangle Three Buckets (LTTB)
**理由**: 视觉保真度优于均匀采样，时间复杂度 O(n)，百万点 → 1000 点可在 50ms 内完成。ECharts 内置 `sampling: 'lttb'` 可在 dataZoom 层级自动降采样，无需手动实现。
**替代方案**: 均匀采样 — 简单但丢失峰值/谷值；Ramer-Douglas-Peucker — 适合几何曲线而非时序数据。

### D4: 环形缓冲区存储原始数据
**选择**: 固定容量环形缓冲区（`RingBuffer<T>`, capacity = 1,000,000）
**理由**: O(1) 追加和批量读取，自动淘汰旧数据，无 GC 压力。Zustand 不存储服务端数据，仅存 UI 状态。
**替代方案**: 普通数组 `push` + `slice` — 百万点 `shift` 是 O(n)，频繁操作会卡顿。

### D5: 文件路由 + 代码生成
**选择**: TanStack Router 1.170 文件路由模式
**理由**: 类型安全的路径参数（`/metric/$id`），自动生成路由树，减少手写样板。Vite 插件支持 HMR 热更新路由。
**替代方案**: React Router — 无编译时类型检查，路径参数需手动解析和校验。

### D6: Vitest + Playwright 双测试层
**选择**: Vitest 单元测试 + Playwright E2E
**理由**: Vitest 与 Vite 共用配置，原生 ESM 支持，速度快。Playwright 用于关键用户路径验证（图表渲染、轮询更新、内存泄漏检测）。
**替代方案**: Jest — 需要额外配置，ESM 支持不原生。

## Architecture

```
src/
├── main.tsx                      # 入口
├── routeTree.gen.ts             # TanStack Router 代码生成
├── routes/
│   ├── __root.tsx               # 根布局（Header + QueryClientProvider）
│   ├── index.tsx                # 仪表盘主页
│   ├── compare.tsx              # 多维度对比页
│   └── metric.$id.tsx           # 单指标详情页
├── components/
│   ├── MetricCard.tsx           # 指标卡片
│   ├── MetricCardGrid.tsx       # 卡片网格
│   ├── TimeSeriesChart.tsx      # ECharts 封装（大数据量折线图）
│   ├── ChartPanel.tsx           # 可配置图表面板
│   ├── ComparisonView.tsx       # 多维度对比容器
│   ├── TimeRangeSelector.tsx    # 时间范围选择器
│   ├── PollingController.tsx    # 轮询间隔控制
│   └── DataStatusBar.tsx        # 数据状态栏
├── data/
│   ├── mock-generator.ts        # 模拟数据生成器
│   ├── ring-buffer.ts           # 环形缓冲区
│   ├── downsample.ts            # LTTB 降采样
│   └── schema.ts                # Zod schema 定义
├── hooks/
│   ├── useMetrics.ts            # TanStack Query hook
│   └── useDownsampledData.ts    # 降采样 hook
├── store/
│   └── ui-store.ts              # Zustand UI 状态（时间范围、对比维度）
└── types/
    └── metrics.ts               # 类型定义
```

## Data Flow

```
MockDataGenerator → Zod Validate → TanStack Query Cache → useMetrics hook
                                                              │
                                              ┌───────────────┘
                                              ▼
                              RingBuffer (per series) → Downsample (LTTB)
                                                              │
                                              ┌───────────────┘
                                              ▼
                                         ECharts setOption
```

## Performance Strategy

| 层级 | 策略 | 目标 |
|------|------|------|
| **数据层** | 环形缓冲区固定容量 1M，无 GC 抖动 | 追加 O(1)，内存恒定 |
| **降采样层** | LTTB 按视口分辨率动态降采样 | 渲染点 ≤ 2000 |
| **渲染层** | ECharts `large: true` + Canvas | 30fps+ |
| **更新层** | TanStack Query 缓存 diff，仅追加新点 | 避免全量 setOption |
| **调度层** | requestAnimationFrame 合并批量更新 | 避免 layout thrashing |

## Risks / Trade-offs

- [ECharts 绑定体积 ~800KB gzip ~250KB] → 按需引入 echarts/core + echarts/charts + echarts/components，首屏代码分割
- [LTTB JS 实现可能成为热点] → 先用 ECharts 内置 sampling，不满足再迁移到 Web Worker
- [模拟数据与真实数据 schema 偏移] → Zod schema 定义与真实 API schema 严格一致，未来替换数据源只需改 endpoint
- [RingBuffer 容量 1M 固定，不可弹性扩缩] → MVP 足够，未来可参数化配置

## Open Questions

- 1M 数据点 LTTB 在移动设备上的性能边界（MVP 暂不覆盖移动端）
