# SGIP backend

NestJS API generated with the Nest CLI, with Prisma 7 and PostgreSQL.
Requires Node.js 24 or newer supported by NestJS 12.

## Local setup

Run commands from this backend directory:

```powershell
npm install
Copy-Item .env.example .env
```

Set `DATABASE_URL` in `.env` to your PostgreSQL connection string. The included
example expects an existing `sgip` database on localhost:5432 with the local
username/password `postgres`/`postgres`. Replace these values for your database.
The API uses port 3001 by default (`PORT` in `.env`).

```powershell
npm run prisma:generate
npm run start:dev
```

The API connects to PostgreSQL during startup, so PostgreSQL must be available.
The starter endpoint is `GET http://localhost:3001/`.

Realtime connections use Socket.IO at `ws://localhost:3001/realtime` (or the
configured API origin). Send the short-lived JWT in the handshake as
`auth: { token }`; set `JWT_ACCESS_SECRET` before accepting connections. The
realtime infrastructure supports authenticated user rooms, authorization-aware
subscriptions, bounded connection/message rates, connection recovery, and
optional Redis fan-out through `REDIS_URL`. See `src/infrastructure/realtime/README.md`
for the event and room contract.

Upstash Redis cache support is available through the global `CacheClient`.
Configure `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`, then inject
`CacheClient` into application services. It provides namespaced keys, TTL and
stale-while-revalidate windows, tag invalidation, single-flight loading, a
distributed lock, bounded values, health, and fail-open behavior. See
`src/infrastructure/cache/README.md` for the cache contract.

## Database workflow

Define application models in `prisma/schema.prisma`, then create a migration:

```powershell
npm run prisma:migrate -- --name init
npm run prisma:generate
```

No application models or initial migration have been invented for this scaffold.
`PrismaService` is exported globally; inject it into Nest services to query data.
Connections open at application startup and close on shutdown.

Other commands:

- `npm run prisma:validate`: validate the Prisma schema.
- `npm run prisma:studio`: browse your database.
- `npm run prisma:deploy`: apply committed migrations during deployment.
- `npm run build`: generate Prisma Client and compile the API.
- `npm run start:prod`: run the compiled API.
- `npm run lint`: lint source and tests.
- `npm test`: run unit tests.
- `npm run test:e2e`: test the HTTP starter endpoint with Prisma mocked; no database required.

Keep `.env` private. Commit schema changes and migration files, but not the
generated Prisma Client or database credentials. Build and development scripts
automatically generate Prisma Client. Configure `DATABASE_URL` before running them.
