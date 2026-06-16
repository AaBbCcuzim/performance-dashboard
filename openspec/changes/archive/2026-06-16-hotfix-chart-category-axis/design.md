## Context

HEAD 提交 (`fb1f9e0`) 已将 xAxis 修复为 `type: 'time'`，但工作区未提交修改将其回退为 `type: 'category'`。`category` 轴将时间戳作为分类标签处理，ECharts 的 axisLabel formatter 无法正确格式化，输出 `NaN:NaN`。

## Goals / Non-Goals

**Goals:**
- 恢复 xAxis `type: 'time'`，使横轴正常显示时间格式

**Non-Goals:**
- 不改变图表其他行为
- 不新增功能或接口

## Decisions

**方案：恢复 `type: 'time'` + `[[timestamp, value], ...]` 数据格式**

- ECharts time 轴原生支持时间戳格式化，无需手动 formatter
- 数据使用 `[timestamp, value]` 元组数组，time 轴自动解析第一个元素为时间
- 保留 tooltip `axisPointer: { type: 'cross' }` 提升交互体验

## Risks / Trade-offs

- 无新增风险 — 此方案与已提交的修复完全一致，仅恢复被工作区回退的代码
