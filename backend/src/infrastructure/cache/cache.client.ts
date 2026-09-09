import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { Redis } from '@upstash/redis';
import { randomUUID } from 'node:crypto';

export interface CacheSetOptions {
  ttlSeconds?: number;
  staleWhileRevalidateSeconds?: number;
  tags?: readonly string[];
}

export interface CacheGetOptions {
  allowStale?: boolean;
}

export interface CacheGetOrSetOptions extends CacheSetOptions {
  allowStale?: boolean;
}

export interface CacheHealth {
  enabled: boolean;
  healthy: boolean;
  latencyMs?: number;
  error?: string;
}

export interface CacheMetrics {
  enabled: boolean;
  hits: number;
  misses: number;
  staleHits: number;
  sets: number;
  deletes: number;
  tagInvalidations: number;
  lockContentions: number;
  errors: number;
}

interface CacheEnvelope<T> {
  schema: 1;
  value: T;
  freshUntil: number;
  staleUntil: number;
  tags: readonly string[];
}

interface CacheEntry<T> {
  value: T;
  stale: boolean;
  tags: readonly string[];
}

const RELEASE_LOCK_SCRIPT = `
  if redis.call('get', KEYS[1]) == ARGV[1] then
    return redis.call('del', KEYS[1])
  end
  return 0
`;

const DEFAULT_TTL_SECONDS = 60;
const DEFAULT_STALE_SECONDS = 0;
const DEFAULT_LOCK_TTL_MS = 5_000;
const DEFAULT_LOCK_WAIT_MS = 2_500;
const DEFAULT_MAX_VALUE_BYTES = 512_000;
const MAX_KEY_LENGTH = 240;
const MAX_TAGS = 16;
const SERIALIZED_PREFIX = 'sgip-cache:1:';

export class CacheConfigurationError extends Error {}
export class CacheInputError extends Error {}
export class CacheUnavailableError extends Error {}

@Injectable()
export class CacheClient implements OnApplicationShutdown {
  private readonly redis?: Redis;
  private readonly failOpen: boolean;
  private readonly enabled: boolean;
  private readonly keyPrefix: string;
  private readonly defaultTtlSeconds: number;
  private readonly defaultStaleSeconds: number;
  private readonly lockTtlMs: number;
  private readonly lockWaitMs: number;
  private readonly maxValueBytes: number;
  private readonly inFlight = new Map<string, Promise<unknown>>();
  private readonly metrics: CacheMetrics;

  constructor() {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    this.enabled = Boolean(url && token);
    this.failOpen = process.env.CACHE_FAIL_OPEN !== 'false';
    this.keyPrefix = this.readPrefix(
      process.env.CACHE_KEY_PREFIX ?? 'sgip:cache:v1',
    );
    this.defaultTtlSeconds = this.readNumber(
      'CACHE_DEFAULT_TTL_SECONDS',
      DEFAULT_TTL_SECONDS,
      1,
      86_400,
    );
    this.defaultStaleSeconds = this.readNumber(
      'CACHE_DEFAULT_STALE_SECONDS',
      DEFAULT_STALE_SECONDS,
      0,
      86_400,
    );
    this.lockTtlMs = this.readNumber(
      'CACHE_LOCK_TTL_MS',
      DEFAULT_LOCK_TTL_MS,
      100,
      120_000,
    );
    this.lockWaitMs = this.readNumber(
      'CACHE_LOCK_WAIT_MS',
      DEFAULT_LOCK_WAIT_MS,
      0,
      120_000,
    );
    this.maxValueBytes = this.readNumber(
      'CACHE_MAX_VALUE_BYTES',
      DEFAULT_MAX_VALUE_BYTES,
      1_024,
      5_000_000,
    );
    this.redis = this.enabled
      ? new Redis({ url: url!, token: token!, latencyLogging: false })
      : undefined;
    this.metrics = {
      enabled: this.enabled,
      hits: 0,
      misses: 0,
      staleHits: 0,
      sets: 0,
      deletes: 0,
      tagInvalidations: 0,
      lockContentions: 0,
      errors: 0,
    };
  }

  async get<T>(
    key: string,
    options: CacheGetOptions = {},
  ): Promise<T | undefined> {
    const normalizedKey = this.dataKey(key);
    if (!this.redis) return this.unavailable(undefined);
    try {
      const entry = await this.read<T>(
        normalizedKey,
        options.allowStale ?? false,
      );
      if (!entry) return undefined;
      return entry.value;
    } catch (error) {
      return this.handleFailure('get', error, undefined);
    }
  }

  async set<T>(
    key: string,
    value: T,
    options: CacheSetOptions = {},
  ): Promise<boolean> {
    const normalizedKey = this.dataKey(key);
    if (!this.redis) return this.unavailable(false);
    try {
      await this.write(normalizedKey, value, options);
      this.metrics.sets += 1;
      return true;
    } catch (error) {
      return this.handleFailure('set', error, false);
    }
  }

  async delete(key: string): Promise<boolean> {
    const normalizedKey = this.dataKey(key);
    if (!this.redis) return this.unavailable(false);
    try {
      const existing = await this.readEnvelope(normalizedKey);
      const pipeline = this.redis.pipeline();
      pipeline.del(normalizedKey);
      for (const tag of existing?.tags ?? [])
        pipeline.srem(this.tagKey(tag), normalizedKey);
      await pipeline.exec();
      this.metrics.deletes += 1;
      return true;
    } catch (error) {
      return this.handleFailure('delete', error, false);
    }
  }

  async invalidateTag(tag: string): Promise<number> {
    const normalizedTag = this.normalizePart(tag, 'tag');
    if (!this.redis) return this.unavailable(0);
    try {
      const indexKey = this.tagKey(normalizedTag);
      const keys = await this.redis.smembers<string[]>(indexKey);
      if (keys.length === 0) return 0;
      const pipeline = this.redis.pipeline();
      pipeline.del(...keys);
      pipeline.del(indexKey);
      await pipeline.exec();
      this.metrics.tagInvalidations += 1;
      this.metrics.deletes += keys.length;
      return keys.length;
    } catch (error) {
      return this.handleFailure('tag invalidation', error, 0);
    }
  }

  async getOrSet<T>(
    key: string,
    factory: () => Promise<T> | T,
    options: CacheGetOrSetOptions = {},
  ): Promise<T> {
    const normalizedKey = this.dataKey(key);
    if (!this.redis) {
      if (!this.failOpen)
        throw new CacheUnavailableError('Upstash Redis is not configured.');
      return factory();
    }
    let cached: CacheEntry<T> | undefined;
    try {
      cached = await this.read<T>(normalizedKey, options.allowStale ?? true);
    } catch (error) {
      if (this.failOpen) return factory();
      throw new CacheUnavailableError(
        `Cache get failed: ${this.message(error)}`,
      );
    }
    if (cached && !cached.stale) return cached.value;
    if (cached?.stale) {
      void this.revalidate(normalizedKey, factory, options).catch(
        () => undefined,
      );
      return cached.value;
    }
    const running = this.inFlight.get(normalizedKey) as Promise<T> | undefined;
    if (running) return running;
    const pending = this.populate(normalizedKey, factory, options);
    this.inFlight.set(normalizedKey, pending);
    try {
      return await pending;
    } finally {
      if (this.inFlight.get(normalizedKey) === pending)
        this.inFlight.delete(normalizedKey);
    }
  }

  async health(): Promise<CacheHealth> {
    if (!this.redis)
      return {
        enabled: false,
        healthy: false,
        error: 'Upstash Redis is not configured.',
      };
    const startedAt = Date.now();
    try {
      await this.redis.ping();
      return {
        enabled: true,
        healthy: true,
        latencyMs: Date.now() - startedAt,
      };
    } catch (error) {
      this.metrics.errors += 1;
      return {
        enabled: true,
        healthy: false,
        latencyMs: Date.now() - startedAt,
        error: this.message(error),
      };
    }
  }

  snapshot(): CacheMetrics {
    return { ...this.metrics };
  }

  async onApplicationShutdown(): Promise<void> {
    this.inFlight.clear();
  }

  private async populate<T>(
    key: string,
    factory: () => Promise<T> | T,
    options: CacheSetOptions,
  ): Promise<T> {
    const token = randomUUID();
    let locked = false;
    try {
      locked =
        (await this.redis!.set(this.lockKey(key), token, {
          nx: true,
          px: this.lockTtlMs,
        })) === 'OK';
      if (!locked) {
        this.metrics.lockContentions += 1;
        const deadline = Date.now() + this.lockWaitMs;
        while (Date.now() < deadline) {
          await this.delay(Math.min(100, Math.max(10, deadline - Date.now())));
          const available = await this.read<T>(key, false);
          if (available) return available.value;
        }
      }
      const value = await factory();
      await this.write(key, value, options);
      this.metrics.sets += 1;
      return value;
    } finally {
      if (locked) await this.releaseLock(key, token);
    }
  }

  private async revalidate<T>(
    key: string,
    factory: () => Promise<T> | T,
    options: CacheSetOptions,
  ): Promise<void> {
    const running = this.inFlight.get(key);
    if (running) return;
    const pending = this.populate(key, factory, options).catch(
      (error: unknown) => {
        this.metrics.errors += 1;
        if (!this.failOpen) throw error;
      },
    );
    this.inFlight.set(key, pending);
    await pending.finally(() => {
      if (this.inFlight.get(key) === pending) this.inFlight.delete(key);
    });
  }

  private async write<T>(
    key: string,
    value: T,
    options: CacheSetOptions,
  ): Promise<void> {
    const serializedValue = JSON.stringify(value);
    if (serializedValue === undefined)
      throw new CacheInputError('Cache values must be JSON serializable.');
    if (Buffer.byteLength(serializedValue, 'utf8') > this.maxValueBytes)
      throw new CacheInputError(
        `Cache value exceeds the ${this.maxValueBytes}-byte limit.`,
      );
    const ttlSeconds = this.readOptionNumber(
      options.ttlSeconds,
      this.defaultTtlSeconds,
      1,
      86_400,
      'TTL',
    );
    const staleSeconds = this.readOptionNumber(
      options.staleWhileRevalidateSeconds,
      this.defaultStaleSeconds,
      0,
      86_400,
      'stale TTL',
    );
    const tags = [
      ...new Set(
        (options.tags ?? []).map((tag) => this.normalizePart(tag, 'tag')),
      ),
    ].slice(0, MAX_TAGS);
    const now = Date.now();
    const envelope: CacheEnvelope<T> = {
      schema: 1,
      value,
      freshUntil: now + ttlSeconds * 1_000,
      staleUntil: now + (ttlSeconds + staleSeconds) * 1_000,
      tags,
    };
    const previous = await this.readEnvelope(key);
    const pipeline = this.redis!.pipeline();
    // Prevent Upstash automatic JSON deserialization from changing the envelope.
    pipeline.set(key, SERIALIZED_PREFIX + JSON.stringify(envelope), {
      ex: ttlSeconds + staleSeconds,
    });
    for (const tag of previous?.tags ?? [])
      if (!tags.includes(tag)) pipeline.srem(this.tagKey(tag), key);
    for (const tag of tags) pipeline.sadd(this.tagKey(tag), key);
    await pipeline.exec();
  }

  private async read<T>(
    key: string,
    allowStale: boolean,
  ): Promise<CacheEntry<T> | undefined> {
    const envelope = await this.readEnvelope<T>(key);
    if (!envelope) {
      this.metrics.misses += 1;
      return undefined;
    }
    const now = Date.now();
    if (now <= envelope.freshUntil) {
      this.metrics.hits += 1;
      return { value: envelope.value, stale: false, tags: envelope.tags };
    }
    if (allowStale && now <= envelope.staleUntil) {
      this.metrics.staleHits += 1;
      return { value: envelope.value, stale: true, tags: envelope.tags };
    }
    this.metrics.misses += 1;
    return undefined;
  }

  private async readEnvelope<T = unknown>(
    key: string,
  ): Promise<CacheEnvelope<T> | undefined> {
    const raw = await this.redis!.get<unknown>(key);
    if (!raw) return undefined;
    try {
      const envelope = (
        typeof raw === 'string'
          ? JSON.parse(
              raw.startsWith(SERIALIZED_PREFIX)
                ? raw.slice(SERIALIZED_PREFIX.length)
                : raw,
            )
          : raw
      ) as CacheEnvelope<T>;
      if (
        envelope.schema !== 1 ||
        typeof envelope.freshUntil !== 'number' ||
        typeof envelope.staleUntil !== 'number' ||
        !Array.isArray(envelope.tags)
      )
        return undefined;
      return envelope;
    } catch {
      await this.redis!.del(key);
      return undefined;
    }
  }

  private async releaseLock(key: string, token: string): Promise<void> {
    try {
      await this.redis!.eval(RELEASE_LOCK_SCRIPT, [this.lockKey(key)], [token]);
    } catch {
      this.metrics.errors += 1;
    }
  }

  private dataKey(key: string): string {
    return `${this.keyPrefix}:data:${this.normalizePart(key, 'key')}`;
  }

  private tagKey(tag: string): string {
    return `${this.keyPrefix}:tag:${tag}`;
  }

  private lockKey(key: string): string {
    return `${this.keyPrefix}:lock:${key.slice(this.keyPrefix.length + 1)}`;
  }

  private normalizePart(value: string, kind: string): string {
    if (
      typeof value !== 'string' ||
      value.length === 0 ||
      value.length > MAX_KEY_LENGTH ||
      !/^[A-Za-z0-9][A-Za-z0-9._:/-]*$/.test(value)
    )
      throw new CacheInputError(`Invalid cache ${kind}.`);
    return value;
  }

  private readPrefix(value: string): string {
    return this.normalizePart(value, 'prefix');
  }

  private readNumber(
    name: string,
    fallback: number,
    min: number,
    max: number,
  ): number {
    const value =
      process.env[name] === undefined ? fallback : Number(process.env[name]);
    return this.readOptionNumber(value, fallback, min, max, name);
  }

  private readOptionNumber(
    value: unknown,
    fallback: number,
    min: number,
    max: number,
    name: string,
  ): number {
    const resolved = value === undefined ? fallback : Number(value);
    if (!Number.isFinite(resolved) || resolved < min || resolved > max)
      throw new CacheConfigurationError(`Invalid ${name} configuration.`);
    return Math.floor(resolved);
  }

  private async delay(milliseconds: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  private handleFailure<T>(operation: string, error: unknown, fallback: T): T {
    this.metrics.errors += 1;
    if (this.failOpen) return fallback;
    throw new CacheUnavailableError(
      `Cache ${operation} failed: ${this.message(error)}`,
    );
  }

  private unavailable<T>(fallback: T): T {
    if (!this.failOpen)
      throw new CacheUnavailableError('Upstash Redis is not configured.');
    return fallback;
  }

  private message(error: unknown): string {
    return error instanceof Error ? error.message : 'unknown cache error';
  }
}

export { CacheClient as UpstashCache, CacheClient as CacheService };
