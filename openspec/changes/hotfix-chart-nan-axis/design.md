## 修复方案

TimeSeriesChart 的 xAxis 改用 ECharts 原生 `type: 'time'` 时间轴，利用内置的时间格式化能力。series data 从单独的值数组改为 `[timestamp, value]` 对。

`type: 'time'` 优势：
- 自动处理时间刻度分布
- 内置时间标签格式化
- dataZoom 自然支持时间范围缩放
- 不依赖手写 formatter
