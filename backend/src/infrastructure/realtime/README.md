# Realtime infrastructure

The backend exposes a Socket.IO namespace at `/realtime`. Connections are
authenticated in namespace middleware before `handleConnection` runs.

## Client contract

Send a short-lived access JWT in the Socket.IO `auth` handshake field:

```ts
const socket = io(`${API_URL}/realtime`, {
  auth: { token: accessToken },
  withCredentials: true,
  transports: ['websocket', 'polling'],
});
```

The JWT must use `HS256`, contain a `sub` user id, and be signed with
`JWT_ACCESS_SECRET`. Optional `JWT_ISSUER`, `JWT_AUDIENCE`, `roles`, and
`organizationIds` claims are used for room authorization. Avoid query-string
tokens because URLs are commonly logged.

The server emits `realtime.ready` after authentication and automatically joins
the user room `user:<userId>`. It emits `realtime.error` with a stable error
code for authentication, authorization, payload, rate-limit, and connection
limit failures. Client application events should use the versioned envelope
published by `RealtimeEventBus`:

```ts
{
  id: 'event-id',
  type: 'animal.updated',
  version: 1,
  occurredAt: '2026-01-01T00:00:00.000Z',
  rooms: ['animal:<animal-id>'],
  payload: { /* domain-specific data */ },
}
```

Clients can request `realtime.subscribe` and `realtime.unsubscribe` with
`{ room }`. User rooms are self-only; organization rooms require an
`organizationIds` claim; farm, herd, animal, and topic rooms require a
privileged role or `realtime:subscribe`. Room names are bounded and allow-listed.

## Reliability and scaling

Socket.IO heartbeat, bounded payload size, connection-state recovery, and a
per-connection token bucket protect the transport. Only authenticated sockets
are registered, with a limit of eight connections per user per process.

Set `REDIS_URL` to enable the Socket.IO Redis adapter for cross-instance
broadcasts. Set `REALTIME_REDIS_REQUIRED=true` when deployment must fail closed
if Redis is unavailable; the default keeps local development process-local.
Use sticky sessions when polling fallback is enabled, or configure clients for
websocket-only when the deployment guarantees websocket affinity.

`RealtimeEventBus` is an in-process publication boundary. In a multi-instance
deployment, publish committed domain events to the bus after persistence and
use Redis (or a durable broker) for cross-instance delivery. The Redis adapter
does not provide durable replay; connection-state recovery only covers the
configured short disconnection window.

`RealtimeIoAdapter` is installed in `main.ts` before the Nest application starts
listening and closes Redis clients with the HTTP server. The transport adapter
is injectable so module application services can publish without importing
Socket.IO types.
