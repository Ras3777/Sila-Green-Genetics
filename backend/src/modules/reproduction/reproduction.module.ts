import { Module } from '@nestjs/common';
import { ReproductionUseCasesPort } from './application/ports/in/reproduction-use-cases.port.js';
import { ReproductionRepositoryPort } from './application/ports/out/reproduction-repository.port.js';
import { ReproductionRealtimePort } from './application/ports/out/reproduction-realtime.port.js';
import { ReproductionService } from './application/services/reproduction.service.js';
import { PrismaReproductionRepository } from './infrastructure/persistence/prisma-reproduction.repository.js';
import { ReproductionRealtimeAdapter } from './infrastructure/realtime/reproduction-realtime.adapter.js';
import { ReproductionController } from './presentation/http/reproduction.controller.js';
import { ReproductionGateway } from './presentation/realtime/reproduction.gateway.js';

@Module({
  controllers: [ReproductionController],
  providers: [
    { provide: ReproductionRepositoryPort, useClass: PrismaReproductionRepository },
    { provide: ReproductionRealtimePort, useClass: ReproductionRealtimeAdapter },
    {
      provide: ReproductionUseCasesPort,
      useFactory: (
        repository: ReproductionRepositoryPort,
        realtime: ReproductionRealtimePort,
      ) => new ReproductionService(repository, realtime),
      inject: [ReproductionRepositoryPort, ReproductionRealtimePort],
    },
    ReproductionGateway,
  ],
  exports: [ReproductionUseCasesPort],
})
export class ReproductionModule {}
