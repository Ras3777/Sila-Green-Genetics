import { Module } from '@nestjs/common';
import { OpsUseCasesPort } from './application/ports/in/ops-use-cases.port.js';
import { OpsRepositoryPort } from './application/ports/out/ops-repository.port.js';
import { OpsRealtimePort } from './application/ports/out/ops-realtime.port.js';
import { OpsService } from './application/services/ops.service.js';
import { PrismaOpsRepository } from './infrastructure/persistence/prisma-ops.repository.js';
import { OpsRealtimeAdapter } from './infrastructure/realtime/ops-realtime.adapter.js';
import { OpsController } from './presentation/http/ops.controller.js';
import { OpsGateway } from './presentation/realtime/ops.gateway.js';

@Module({
  controllers: [OpsController],
  providers: [
    { provide: OpsRepositoryPort, useClass: PrismaOpsRepository },
    { provide: OpsRealtimePort, useClass: OpsRealtimeAdapter },
    {
      provide: OpsUseCasesPort,
      useFactory: (
        repository: OpsRepositoryPort,
        realtime: OpsRealtimePort,
      ) => new OpsService(repository, realtime),
      inject: [OpsRepositoryPort, OpsRealtimePort],
    },
    OpsGateway,
  ],
  exports: [OpsUseCasesPort],
})
export class OpsModule {}
