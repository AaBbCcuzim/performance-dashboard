# Comet Design Handoff

- Change: performance-dashboard-mvp
- Phase: design
- Mode: compact
- Context hash: 3cb495c0a4799c96b5f01f94c4f3e2d051c178f5dfeeb3cdce165f5559625e69

Generated-by: comet-handoff.sh

OpenSpec remains the canonical capability spec. This handoff is a deterministic, source-traceable context pack, not an agent-authored summary.

## openspec/changes/performance-dashboard-mvp/proposal.md

- Source: openspec/changes/performance-dashboard-mvp/proposal.md
- Lines: 1-29
- SHA256: 9a1a04554bd37ba15e14b167a0a49098753a9bc93a2500f1d873c1859e60e4b1

```md
## Why

需要构建一个性能分析平台 MVP，能够流畅展示百万级性能指标数据、支持实时轮询更新和多维度图表对比。解决大数据量场景下的前端渲染性能和实时数据展示问题。

## What Changes

- 新增性能仪表盘 SPA，包含指标卡片、时序折线图、多维度对比视图
- 引入 TanStack Router 1.170 实现文件路由，TanStack Query 5.60 管理服务端数据缓存与轮询
- 使用 ECharts Canvas 渲染百万级数据点，配合 LTTB 降采样策略保证渲染帧率
- 使用 Zod 3.23 校验数据 schema，Zustand 管理 UI 状态
- 提供模拟数据生成器（多主机、多指标类型），通过 TanStack Query 消耗
- 配置 ESLint + Prettier 代码规范，Vitest + Playwright 测试体系

## Capabilities

### New Capabilities

- `performance-dashboard`: 性能分析仪表盘，支持实时指标展示、百万级数据时序图表、多维度对比视图

### Modified Capabilities

<!-- 无现有 capability 被修改 -->

## Impact

- 全新前端项目，无现有代码修改
- 依赖：React 18、ECharts、TanStack Router/Query、Zod、Zustand、Tailwind CSS、Vite
- 测试：Vitest（单元测试）、Playwright（E2E 测试）
- 工具链：ESLint、Prettier
```

## openspec/changes/performance-dashboard-mvp/design.md

- Source: openspec/changes/performance-dashboard-mvp/design.md
- Lines: 1-121
- SHA256: 5e2d93b9f3d069b49f4659325a0f90cffcd27d076da71d60e3d0b78971b861c2

[TRUNCATED]

```md
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
```

Full source: openspec/changes/performance-dashboard-mvp/design.md

## openspec/changes/performance-dashboard-mvp/tasks.md

- Source: openspec/changes/performance-dashboard-mvp/tasks.md
- Lines: 1-60
- SHA256: a1971157e350589e4cafe880418cdb5a64ee0e3de2f00b482a92a1da69436f39

```md
## 1. 项目脚手架与工具链

- [ ] 1.1 Vite + React + TypeScript 项目初始化，配置 Tailwind CSS
- [ ] 1.2 安装依赖：TanStack Router/Query、ECharts、Zod、Zustand
- [ ] 1.3 配置 ESLint + Prettier，验证零告警
- [ ] 1.4 配置 Vitest + Playwright 测试框架
- [ ] 1.5 配置 TanStack Router 文件路由 + Vite 代码生成插件

## 2. 数据层

- [ ] 2.1 定义 TypeScript 类型（MetricSeries, DataPoint, MetricCategory）
- [ ] 2.2 定义 Zod schema（MetricSeriesSchema, DataPointSchema）
- [ ] 2.3 实现 RingBuffer 环形缓冲区
- [ ] 2.4 实现 MockDataGenerator 模拟数据生成器（多主机、多指标、可配置时间窗口）
- [ ] 2.5 实现 Zod 校验集成，数据入口统一校验

## 3. 核心业务 Hook

- [ ] 3.1 实现 useMetrics TanStack Query hook（包含 refetchInterval 轮询配置）
- [ ] 3.2 实现 LTTB 降采样算法
- [ ] 3.3 实现 useDownsampledData hook（视口分辨率感知，自动调参）

## 4. UI 状态管理

- [ ] 4.1 创建 Zustand UI store（时间范围、轮询间隔、对比维度选择）
- [ ] 4.2 实现 TimeRangeSelector 组件（1h/6h/24h/自定义）
- [ ] 4.3 实现 PollingController 组件（1s/5s/10s/30s）

## 5. 仪表盘视图

- [ ] 5.1 实现根布局组件（Header + QueryClientProvider + 导航）
- [ ] 5.2 实现 MetricCard 组件（当前值 + 迷你趋势线）
- [ ] 5.3 实现 MetricCardGrid 组件（响应式网格布局）
- [ ] 5.4 实现仪表盘主页路由 `/`（组合卡片网格 + 状态栏）

## 6. 时序图表

- [ ] 6.1 封装 TimeSeriesChart ECharts 组件（large:true, Canvas, LTTB sampling）
- [ ] 6.2 实现增量数据追加（仅 setOption 新点，避免全量刷新）
- [ ] 6.3 实现 tooltip + dataZoom 交互

## 7. 多维度对比

- [ ] 7.1 实现 ChartPanel 可配置图表面板（指标类型选择、主机选择）
- [ ] 7.2 实现 ComparisonView 容器（最多 4 面板并列）
- [ ] 7.3 实现 `/compare` 路由页面

## 8. 单指标详情

- [ ] 8.1 实现 `/metric/$id` 路由页面（大图表 + 元数据）

## 9. 性能验证与调优

- [ ] 9.1 基准测试：1M 数据点渲染帧率验证（≥30fps）
- [ ] 9.2 内存泄漏测试：10 分钟连续运行 heap 增长 <50MB

## 10. E2E 测试

- [ ] 10.1 Playwright 编写仪表盘关键路径测试（加载、轮询更新、导航）
- [ ] 10.2 Playwright 编写对比视图测试（多面板交互、时间范围切换）
```

## openspec/changes/performance-dashboard-mvp/specs/performance-dashboard/spec.md

- Source: openspec/changes/performance-dashboard-mvp/specs/performance-dashboard/spec.md
- Lines: 1-77
- SHA256: 591cb246f74fd66e9df84ea8db75c6ee3f6f520ae59d5046183a94a470a16c81

```md
## ADDED Requirements

### Requirement: Dashboard renders metric cards with latest values
The system SHALL display metric cards on the main dashboard showing the latest value for each tracked metric (CPU, Memory, Network, Disk) per host. Each card MUST display the metric name, current value with unit, and a mini sparkline of recent trend.

#### Scenario: Dashboard loads with default metrics
- **WHEN** user navigates to the dashboard homepage
- **THEN** metric cards render for all default metric categories showing their latest values

#### Scenario: New data arrives via polling
- **WHEN** the polling scheduler fetches a new batch of metric data
- **THEN** metric cards update their displayed values within 200ms without full page reload

### Requirement: Time-series chart renders large datasets
The system SHALL render time-series line charts using Canvas-based rendering that supports up to 1,000,000 data points per chart. The system MUST apply LTTB downsampling to reduce rendered points to the viewport resolution while preserving visual characteristics.

#### Scenario: Chart loads 1 million data points
- **WHEN** a chart receives a series with 1,000,000 data points
- **THEN** the chart renders at 30fps or higher and first paint completes within 2 seconds

#### Scenario: Downsampling activates on data threshold
- **WHEN** the raw data points exceed 2x the viewport pixel width
- **THEN** the system automatically applies LTTB downsampling before passing data to the chart renderer

### Requirement: Multi-dimensional comparison view
The system SHALL provide a comparison view where users can display up to 4 time-series charts simultaneously, each configurable to show different metric/host combinations. Each chart MUST support independent pan, zoom, and time range selection.

#### Scenario: Side-by-side metric comparison
- **WHEN** user configures 4 chart panels with different metric types
- **THEN** all 4 charts render independently and respond to user interaction without blocking each other

#### Scenario: Chart interaction does not block UI
- **WHEN** user zooms into one chart while other charts are visible
- **THEN** the zoom interaction completes within 100ms and the main thread remains responsive

### Requirement: Configurable polling interval
The system SHALL poll for new metric data at a configurable interval (1s, 5s, 10s, 30s). TanStack Query MUST manage cache invalidation and deduplication of concurrent requests.

#### Scenario: Polling interval change takes effect
- **WHEN** user changes polling interval from 5s to 10s
- **THEN** subsequent polls occur at the new 10s interval without requiring page refresh

#### Scenario: Query deduplication
- **WHEN** multiple components request the same metric data within the same polling window
- **THEN** only one network request is made and results are shared across components

### Requirement: Time range selection
The system SHALL provide a time range selector with presets (Last 1 hour, Last 6 hours, Last 24 hours) and a custom range option. Changing the time range MUST trigger automatic downsampling resolution adjustment.

#### Scenario: Switching from 1h to 24h range
- **WHEN** user selects "Last 24 hours" from the time range selector
- **THEN** charts reload with appropriate downsampling for the wider time window

### Requirement: Mock data generation with schema validation
The system SHALL include a mock data generator that produces realistic multi-host, multi-metric time-series data. All generated data MUST pass Zod schema validation before being consumed by the application.

#### Scenario: Generated data passes validation
- **WHEN** the mock generator produces a batch of metric data points
- **THEN** Zod schema validation succeeds and data enters the TanStack Query cache

#### Scenario: Invalid data is rejected
- **WHEN** corrupted or schema-mismatched data enters the system
- **THEN** Zod validation fails and the data is discarded with a console warning

### Requirement: Routing with code-generated file routes
The system SHALL use TanStack Router with file-based routing and auto-generated route tree. Routes MUST include: root layout (`/`), dashboard index (`/`), comparison view (`/compare`), and metric detail (`/metric/$id`).

#### Scenario: Navigation between views
- **WHEN** user clicks a navigation link to the comparison view
- **THEN** TanStack Router navigates to `/compare` and renders the comparison component without full page reload

### Requirement: Memory stability under continuous operation
The system SHALL maintain stable memory usage during continuous operation. After 10 minutes of polling with 5-second intervals while displaying 4 charts with 1M data points each, total JavaScript heap growth MUST not exceed 50MB.

#### Scenario: Extended run without memory leak
- **WHEN** the dashboard runs for 10 minutes with 5s polling and 1M-point charts
- **THEN** memory profiler shows heap growth under 50MB and no detached DOM nodes accumulate
```

