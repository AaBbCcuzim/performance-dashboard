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
