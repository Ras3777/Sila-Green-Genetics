# Backend source layout

```text
src/
  main.ts                         Application entry point
  app.module.ts                   Root composition
  bootstrap/                      Future global application configuration
  config/                         Configuration shapes and environment validation
  common/                         Nest and transport-specific helpers
    constants/
    decorators/
    extensions/
    filters/
    guards/
    interceptors/
    middleware/
    pipes/
    types/
  shared/                         Framework-independent shared kernel
    domain/
      entities/
      errors/
      events/
      value-objects/
    types/
    utils/
  infrastructure/                 Shared technical integrations
    database/prisma/              Existing Prisma module and connection lifecycle
    cache/
    messaging/
    realtime/
    storage/
    observability/
    health/
  modules/                        Business contexts with their own four layers
  generated/                      Generated code; do not edit manually
```

Use `common` (singular) for reusable Nest and transport helpers. Guards,
decorators, pipes, filters, interceptors, and middleware belong here when shared
across contexts. Keep feature-specific helpers in their module's presentation
layer. `extensions` is reserved for explicit framework extensions; do not add
global prototype mutations or place unrelated utility functions there.

Keep `shared` small and independent of Nest, Prisma, environment variables, and
transports. Shared domain classes are optional shells, not mandatory base classes
for all entities. Business enums, policies, and DTOs stay in their owning context.

Root `infrastructure` owns reusable technical clients and connection lifecycles.
Module infrastructure owns domain-specific repositories, mappers, and adapters
implementing that module's application ports. Modules' domain/application layers
must not import infrastructure, common helpers, config, or generated Prisma types.
Technical messaging is for future background jobs/integration delivery, not CQRS.
Root realtime infrastructure is the future transport; module gateways and
publishers retain responsibility for their business use cases and audiences.

`AppModule` imports `InfrastructureModule` and `ModulesModule`. Only the moved
Prisma connection is operational. New integrations, configuration, and bootstrap
files are shells; no new libraries, endpoints, or transports are enabled.
Guards, pipes, filters, interceptors, and middleware are abstract and deliberately
unregistered. Implement and verify them before enabling them globally. The
existing main.ts and Prisma environment loading behavior remains in effect.

The starter app controller/service and tests remain in place. Operational
readiness/liveness endpoints can later live under infrastructure/health.
