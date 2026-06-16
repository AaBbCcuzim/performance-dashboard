import { RingBuffer } from './ring-buffer';
import { RING_BUFFER_CAPACITY } from './constants';
import type { DataPoint } from './schema';

const buffers = new Map<string, RingBuffer<DataPoint>>();

export function getBuffer(seriesId: string): RingBuffer<DataPoint> {
  let buf = buffers.get(seriesId);
  if (!buf) {
    buf = new RingBuffer<DataPoint>(RING_BUFFER_CAPACITY);
    buffers.set(seriesId, buf);
  }
  return buf;
}

export function clearAllBuffers(): void {
  for (const buf of buffers.values()) buf.clear();
}

export function getLatestValues(): Map<string, number> {
  const values = new Map<string, number>();
  for (const [id, buf] of buffers) {
    const arr = buf.toArray();
    if (arr.length > 0) {
      values.set(id, arr[arr.length - 1].value);
    }
  }
  return values;
}

export function getTotalPointCount(): number {
  let total = 0;
  for (const buf of buffers.values()) total += buf.count;
  return total;
}
