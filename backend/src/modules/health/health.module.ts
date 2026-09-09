import { Module } from '@nestjs/common';
import { HealthUseCasesPort } from './application/ports/in/health-use-cases.port.js';
import { HealthRepositoryPort } from './application/ports/out/health-repository.port.js';
import { HealthRealtimePort } from './application/ports/out/health-realtime.port.js';
import { HealthService } from './application/services/health.service.js';
import { PrismaHealthRepository } from './infrastructure/persistence/prisma-health.repository.js';
import { HealthRealtimeAdapter } from './infrastructure/realtime/health-realtime.adapter.js';
import { HealthController } from './presentation/http/health.controller.js';
import { HealthGateway } from './presentation/realtime/health.gateway.js';

@Module({
  controllers: [HealthController],
  providers: [
    { provide: HealthRepositoryPort, useClass: PrismaHealthRepository },
    { provide: HealthRealtimePort, useClass: HealthRealtimeAdapter },
    {
      provide: HealthUseCasesPort,
      useFactory: (
        repository: HealthRepositoryPort,
        realtime: HealthRealtimePort,
      ) => new HealthService(repository, realtime),
      inject: [HealthRepositoryPort, HealthRealtimePort],
    },
    HealthGateway,
  ],
  exports: [HealthUseCasesPort],
})
export class HealthModule {}
