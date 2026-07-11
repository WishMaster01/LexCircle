type WindowEntry = {
  count: number;
  start: number;
};

export class SlidingWindowRateLimiter {
  private bucket = new Map<string, WindowEntry>();

  constructor(
    private readonly limit: number,
    private readonly intervalMs: number,
  ) {}

  check(key: string) {
    const now = Date.now();
    const existing = this.bucket.get(key);

    if (!existing || now - existing.start >= this.intervalMs) {
      this.bucket.set(key, { count: 1, start: now });
      return { allowed: true, remaining: this.limit - 1 };
    }

    if (existing.count >= this.limit) {
      return { allowed: false, remaining: 0 };
    }

    existing.count += 1;
    this.bucket.set(key, existing);
    return { allowed: true, remaining: this.limit - existing.count };
  }
}
