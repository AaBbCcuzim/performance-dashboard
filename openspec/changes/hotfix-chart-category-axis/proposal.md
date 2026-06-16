## Why

所有表格（TimeSeriesChart）横轴显示 `NaN:NaN`，图表时间轴完全不可读。工作区未提交修改将 xAxis 类型从 `time` 回退为 `category`，导致 ECharts 无法正确格式化时间戳。

## What Changes

- 将 `TimeSeriesChart.tsx` 中 xAxis 类型恢复为 `time`
- 将数据格式恢复为 `[[timestamp, value], ...]` 元组数组以匹配 time 轴要求
- 恢复 tooltip 的 `axisPointer: { type: 'cross' }` 配置

## Capabilities

### New Capabilities

（无）

### Modified Capabilities

（无 — 纯 bug 修复，不涉及 spec 级别行为变更）

## Impact

- `src/components/charts/TimeSeriesChart.tsx` — 恢复 xAxis type='time' 及配套数据格式
