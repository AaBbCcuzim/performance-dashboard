import { describe, it, expect } from 'vitest';
import { RingBuffer } from '../ring-buffer';

describe('RingBuffer', () => {
  it('starts empty', () => {
    const buf = new RingBuffer<number>(10);
    expect(buf.count).toBe(0);
    expect(buf.toArray()).toEqual([]);
  });

  it('push adds elements and preserves order', () => {
    const buf = new RingBuffer<number>(10);
    buf.push(1);
    buf.push(2);
    buf.push(3);
    expect(buf.count).toBe(3);
    expect(buf.toArray()).toEqual([1, 2, 3]);
  });

  it('overwrites oldest when full', () => {
    const buf = new RingBuffer<number>(3);
    [1, 2, 3, 4].forEach((n) => buf.push(n));
    expect(buf.count).toBe(3);
    expect(buf.toArray()).toEqual([2, 3, 4]);
  });

  it('preserves order after multiple overwrites', () => {
    const buf = new RingBuffer<number>(3);
    [1, 2, 3, 4, 5, 6].forEach((n) => buf.push(n));
    expect(buf.count).toBe(3);
    expect(buf.toArray()).toEqual([4, 5, 6]);
  });

  it('pushMany adds batch', () => {
    const buf = new RingBuffer<number>(10);
    buf.pushMany([1, 2, 3]);
    expect(buf.count).toBe(3);
    expect(buf.toArray()).toEqual([1, 2, 3]);
  });

  it('pushMany handles overflow', () => {
    const buf = new RingBuffer<number>(3);
    buf.pushMany([1, 2, 3, 4, 5]);
    expect(buf.count).toBe(3);
    expect(buf.toArray()).toEqual([3, 4, 5]);
  });

  it('clear empties buffer', () => {
    const buf = new RingBuffer<number>(10);
    [1, 2, 3].forEach((n) => buf.push(n));
    buf.clear();
    expect(buf.count).toBe(0);
    expect(buf.toArray()).toEqual([]);
  });
});
