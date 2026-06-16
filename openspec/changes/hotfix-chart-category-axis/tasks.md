## 1. 修复 TimeSeriesChart xAxis 配置

- [x] 1.1 将 xAxis type 从 `category` 恢复为 `time`，移除 `data: timestamps`
- [x] 1.2 将 series data 从 `values` 恢复为 `[[timestamp, value], ...]` 元组数组
- [x] 1.3 恢复 tooltip `axisPointer: { type: 'cross' }` 配置
- [x] 1.4 运行 `npm run build` 和 `npx vitest run` 确认无回归
