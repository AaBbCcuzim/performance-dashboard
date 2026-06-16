# Brainstorm Summary

- Change: performance-dashboard-mvp
- Date: 2026-06-16

## 确认的技术方案

- **架构**：分层单向数据流 — MockGenerator → Zod → TanStack Query Cache → RingBuffer → LTTB → ECharts Canvas
- **仪表盘布局**：纵向堆叠（指标卡片行 → 全宽主图表 → 底部状态栏）
- **主题**：shadcn/ui 默认风格，Tailwind CSS
- **对比视图**：4 面板 grid-2×2，echarts.connect 联动时间轴
- **RingBuffer**：固定容量 1M，O(1) push/read，满时自动覆盖
- **降采样**：LTTB 算法，视口宽度 → 目标点数（300-2000），ECharts 内置 sampling:'lttb' 作为 dataZoom 缩放时的第二层降采样
- **轮询调度**：TanStack Query refetchInterval + rAF 合并渲染，debounce 200ms resize
- **数据规模**：5 主机 × 4 指标 = 20 系列，历史深度 6h × 1s = 每系列 21,600 点
- **数据生成**：种子确定性随机（相同 seed 相同输出），1 秒间隔
- **路由**：文件路由 — `/` 仪表盘, `/compare` 对比视图, `/metric/$id` 详情

## 关键取舍与风险

- ECharts 绑定体积 ~250KB gzip → 按需引入
- 1M 数据点内存峰值 ~480MB → 固定容量 RingBuffer 兜底
- LTTB JS 实现可能成为热点 → 先用 ECharts 内置 sampling，不满足再 Web Worker
- shadcn/ui 组件只用于 controls/ui 层，图表区域纯 ECharts Canvas

## 测试策略

- **单元 (Vitest)**：RingBuffer, LTTB, MockGenerator, Zod schema
- **组件 (Vitest + RTL)**：MetricCard, TimeRangeSelector, PollingController, DataStatusBar
- **E2E (Playwright)**：仪表盘加载、轮询更新、时间范围切换、导航、对比视图联动、5min 内存泄漏检测

## Spec Patch

无 — 当前 delta spec 已覆盖所有确认的设计决策，无需回写
