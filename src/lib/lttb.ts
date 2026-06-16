import type { DataPoint } from './schema';

export function lttb(data: DataPoint[], targetCount: number): DataPoint[] {
  const n = data.length;
  if (n === 0) return [];
  if (n <= targetCount || targetCount < 2) return data.slice();

  const result: DataPoint[] = [];
  result.push(data[0]);

  const bucketSize = (n - 2) / (targetCount - 2);
  let a = 0;

  for (let i = 0; i < targetCount - 2; i++) {
    const avgRangeStart = Math.floor(i * bucketSize) + 1;
    const avgRangeEnd = Math.min(
      Math.floor((i + 1) * bucketSize) + 1,
      n - 1,
    );
    let avgX = 0;
    let avgY = 0;
    const avgLen = avgRangeEnd - avgRangeStart;
    if (avgLen === 0) {
      if (result[result.length - 1] !== data[avgRangeStart]) {
        result.push(data[avgRangeStart]);
      }
      a = avgRangeStart;
      continue;
    }
    for (let j = avgRangeStart; j < avgRangeEnd; j++) {
      avgX += data[j].timestamp;
      avgY += data[j].value;
    }
    avgX /= avgLen;
    avgY /= avgLen;

    const rangeOffs = Math.floor((i + 1) * bucketSize) + 1;
    const rangeTo = Math.min(
      Math.floor((i + 2) * bucketSize) + 1,
      n - 1,
    );
    if (rangeOffs >= rangeTo) {
      if (result[result.length - 1] !== data[rangeOffs]) {
        result.push(data[rangeOffs]);
      }
      a = rangeOffs;
      continue;
    }

    const pointA = data[a];
    let maxArea = -1;
    let maxIdx = rangeOffs;

    for (let j = rangeOffs; j < rangeTo; j++) {
      const area =
        Math.abs(
          (pointA.timestamp - avgX) * (data[j].value - pointA.value) -
            (pointA.timestamp - data[j].timestamp) *
              (avgY - pointA.value),
        ) * 0.5;
      if (area > maxArea) {
        maxArea = area;
        maxIdx = j;
      }
    }

    if (result[result.length - 1] !== data[maxIdx]) {
      result.push(data[maxIdx]);
    }
    a = maxIdx;
  }

  if (result[result.length - 1] !== data[n - 1]) {
    result.push(data[n - 1]);
  }
  return result;
}
