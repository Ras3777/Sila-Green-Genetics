import { Injectable } from '@nestjs/common';

interface Bucket {
  available: number;
  updatedAt: number;
}

@Injectable()
export class RealtimeRateLimiter {
  private readonly buckets = new Map<string, Bucket>();
  private readonly capacity = 60;
  private readonly refillPerSecond = 10;

  consume(key: string, cost = 1): boolean {
    const now = Date.now();
    const bucket = this.buckets.get(key) ?? {
      available: this.capacity,
      updatedAt: now,
    };
    bucket.available = Math.min(
      this.capacity,
      bucket.available +
        ((now - bucket.updatedAt) / 1_000) * this.refillPerSecond,
    );
    bucket.updatedAt = now;
    if (bucket.available < cost) {
      this.buckets.set(key, bucket);
      return false;
    }
    bucket.available -= cost;
    this.buckets.set(key, bucket);
    return true;
  }

  remove(key: string): void {
    this.buckets.delete(key);
  }
}
