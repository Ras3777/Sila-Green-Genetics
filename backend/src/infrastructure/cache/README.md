# Upstash cache

`CacheClient` is the application-facing cache-aside boundary. It uses the
Upstash REST API, so the API process does not own a Redis TCP connection pool.
The client is global through `CacheModule` and is safe to inject into module
application services.

```ts
const animal = await cache.getOrSet(
  `animal:${animalId}`,
  () => animals.findById(animalId),
  { ttlSeconds: 60, staleWhileRevalidateSeconds: 30, tags: [`animal:${animalId}`, 'animals'] },
);

await cache.invalidateTag(`animal:${animalId}`);
```

Keys and tags are namespaced by `CACHE_KEY_PREFIX` and validated before being
sent to Redis. Values use a versioned envelope with freshness timestamps and a
bounded JSON payload size. Tag indexes support targeted invalidation. Updating
an entry removes tags that are no longer attached to it.

`getOrSet` deduplicates concurrent loads within a process and uses a short-lived
distributed `NX` lock across processes. Lock ownership is released with a
compare-and-delete Lua script, so one process cannot delete another process's
lock. If the lock wait budget expires, one caller becomes a bounded fail-safe
loader rather than waiting indefinitely.

Stale-while-revalidate serves a stale value during its configured stale window
and refreshes it in the background. The cache is not a source of truth: writes
must be made to the database first, then invalidated or repopulated after a
successful commit. Avoid caching secrets, credentials, or unbounded user input.

By default cache failures fail open: reads return a miss and writes are ignored.
Set `CACHE_FAIL_OPEN=false` for a strict deployment where cache failures must be
visible to callers. `health()` reports configuration, reachability, and latency;
`snapshot()` exposes local counters for metrics integration. Counters are local
process observations, not distributed billing or capacity metrics.

Required environment variables are `UPSTASH_REDIS_REST_URL` and
`UPSTASH_REDIS_REST_TOKEN`. The standard names work with an Upstash Redis
database and should be stored in the deployment secret manager. Configure TTL,
lock, payload, and namespace settings with the `CACHE_*` variables in
`backend/.env.example`.
