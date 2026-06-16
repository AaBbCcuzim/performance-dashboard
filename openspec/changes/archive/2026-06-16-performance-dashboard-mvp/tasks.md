<!-- review skipped: subagent worktree isolation unavailable -->


## 1. 项目脚手架与工具链

- [x] 1.1 Vite + React + TypeScript 项目初始化，配置 Tailwind CSS
- [x] 1.2 安装依赖：TanStack Router/Query、ECharts、Zod、Zustand
- [x] 1.3 配置 ESLint + Prettier，验证零告警
- [x] 1.4 配置 Vitest + Playwright 测试框架
- [x] 1.5 配置 TanStack Router 文件路由 + Vite 代码生成插件

## 2. 数据层

- [x] 2.1 定义 TypeScript 类型（MetricSeries, DataPoint, MetricCategory）
- [x] 2.2 定义 Zod schema（MetricSeriesSchema, DataPointSchema）
- [x] 2.3 实现 RingBuffer 环形缓冲区
- [x] 2.4 实现 MockDataGenerator 模拟数据生成器（多主机、多指标、可配置时间窗口）
- [x] 2.5 实现 Zod 校验集成，数据入口统一校验

## 3. 核心业务 Hook

- [x] 3.1 实现 useMetrics TanStack Query hook（包含 refetchInterval 轮询配置）
- [x] 3.2 实现 LTTB 降采样算法
- [x] 3.3 实现 useDownsampledData hook（视口分辨率感知，自动调参）

## 4. UI 状态管理

- [x] 4.1 创建 Zustand UI store（时间范围、轮询间隔、对比维度选择）
- [x] 4.2 实现 TimeRangeSelector 组件（1h/6h/24h/自定义）
- [x] 4.3 实现 PollingController 组件（1s/5s/10s/30s）

## 5. 仪表盘视图

- [x] 5.1 实现根布局组件（Header + QueryClientProvider + 导航）
- [x] 5.2 实现 MetricCard 组件（当前值 + 迷你趋势线）
- [x] 5.3 实现 MetricCardGrid 组件（响应式网格布局）
- [x] 5.4 实现仪表盘主页路由 `/`（组合卡片网格 + 状态栏）

## 6. 时序图表

- [x] 6.1 封装 TimeSeriesChart ECharts 组件（large:true, Canvas, LTTB sampling）
- [x] 6.2 实现增量数据追加（仅 setOption 新点，避免全量刷新）
- [x] 6.3 实现 tooltip + dataZoom 交互

## 7. 多维度对比

- [x] 7.1 实现 ChartPanel 可配置图表面板（指标类型选择、主机选择）
- [x] 7.2 实现 ComparisonView 容器（最多 4 面板并列）
- [x] 7.3 实现 `/compare` 路由页面

## 8. 单指标详情

- [x] 8.1 实现 `/metric/$id` 路由页面（大图表 + 元数据）

## 9. 性能验证与调优

- [x] 9.1 基准测试：1M 数据点渲染帧率验证（≥30fps）
- [x] 9.2 内存泄漏测试：10 分钟连续运行 heap 增长 <50MB

## 10. E2E 测试

- [x] 10.1 Playwright 编写仪表盘关键路径测试（加载、轮询更新、导航）
- [x] 10.2 Playwright 编写对比视图测试（多面板交互、时间范围切换）
