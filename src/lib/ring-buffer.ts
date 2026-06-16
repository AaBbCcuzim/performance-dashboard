export class RingBuffer<T> {
  private buffer: (T | undefined)[];
  private head = 0;
  private _count = 0;

  constructor(private capacity: number) {
    this.buffer = new Array(capacity);
  }

  get count(): number {
    return this._count;
  }

  push(item: T): void {
    const idx = (this.head + this._count) % this.capacity;
    this.buffer[idx] = item;
    if (this._count < this.capacity) {
      this._count++;
    } else {
      this.head = (this.head + 1) % this.capacity;
    }
  }

  pushMany(items: T[]): void {
    for (const item of items) {
      this.push(item);
    }
  }

  toArray(): T[] {
    const result: T[] = [];
    for (let i = 0; i < this._count; i++) {
      const idx = (this.head + i) % this.capacity;
      result.push(this.buffer[idx]!);
    }
    return result;
  }

  clear(): void {
    this.buffer = new Array(this.capacity);
    this.head = 0;
    this._count = 0;
  }
}
