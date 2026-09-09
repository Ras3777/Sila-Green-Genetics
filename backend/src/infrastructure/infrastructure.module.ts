import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module.js';
import { CacheModule } from './cache/cache.module.js';
import { MessagingModule } from './messaging/messaging.module.js';
import { RealtimeModule } from './realtime/realtime.module.js';
import { StorageModule } from './storage/storage.module.js';
import { ObservabilityModule } from './observability/observability.module.js';
import { HealthModule } from './health/health.module.js';

@Module({
  imports: [
    DatabaseModule,
    CacheModule,
    MessagingModule,
    RealtimeModule,
    StorageModule,
    ObservabilityModule,
    HealthModule,
  ],
  exports: [DatabaseModule],
})
export class InfrastructureModule {}
