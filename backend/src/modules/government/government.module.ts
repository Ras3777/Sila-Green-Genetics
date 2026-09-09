import { Module } from '@nestjs/common';
import { GovernmentUseCasesPort } from './application/ports/in/government-use-cases.port.js';
import { GovernmentRepositoryPort } from './application/ports/out/government-repository.port.js';
import { GovernmentRealtimePort } from './application/ports/out/government-realtime.port.js';
import { GovernmentService } from './application/services/government.service.js';
import { PrismaGovernmentRepository } from './infrastructure/persistence/prisma-government.repository.js';
import { GovernmentRealtimeAdapter } from './infrastructure/realtime/government-realtime.adapter.js';
import { GovernmentController } from './presentation/http/government.controller.js';
import { GovernmentGateway } from './presentation/realtime/government.gateway.js';

@Module({
  controllers: [GovernmentController],
  providers: [
    { provide: GovernmentRepositoryPort, useClass: PrismaGovernmentRepository },
    { provide: GovernmentRealtimePort, useClass: GovernmentRealtimeAdapter },
    {
      provide: GovernmentUseCasesPort,
      useFactory: (
        repository: GovernmentRepositoryPort,
        realtime: GovernmentRealtimePort,
      ) => new GovernmentService(repository, realtime),
      inject: [GovernmentRepositoryPort, GovernmentRealtimePort],
    },
    GovernmentGateway,
  ],
  exports: [GovernmentUseCasesPort],
})
export class GovernmentModule {}
