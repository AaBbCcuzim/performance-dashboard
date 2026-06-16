## Why

图表横轴时间显示为 "NaN:NaN"，`xAxis: type: 'category'` 搭配 `formatter` 对大数值时间戳处理异常，`new Date(value)` 返回 Invalid Date 导致 `.getHours()/.getMinutes()` 输出 NaN。

## What Changes

- **TimeSeriesChart**: xAxis 从 `type: 'category'` 改为 `type: 'time'`，series data 改为 `[timestamp, value]` 格式

## Impact

- 仅 `src/components/charts/TimeSeriesChart.tsx` 一个文件
