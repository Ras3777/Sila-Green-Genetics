import { Module } from '@nestjs/common';
import { GeneticsUseCasesPort } from './application/ports/in/genetics-use-cases.port.js';
import { GeneticsRepositoryPort } from './application/ports/out/genetics-repository.port.js';
import { GeneticsRealtimePort } from './application/ports/out/genetics-realtime.port.js';
import { GeneticsService } from './application/services/genetics.service.js';
import { PrismaGeneticsRepository } from './infrastructure/persistence/prisma-genetics.repository.js';
import { GeneticsRealtimeAdapter } from './infrastructure/realtime/genetics-realtime.adapter.js';
import { GeneticsController } from './presentation/http/genetics.controller.js';
import { GeneticsGateway } from './presentation/realtime/genetics.gateway.js';

@Module({
  controllers: [GeneticsController],
  providers: [
    { provide: GeneticsRepositoryPort, useClass: PrismaGeneticsRepository },
    { provide: GeneticsRealtimePort, useClass: GeneticsRealtimeAdapter },
    {
      provide: GeneticsUseCasesPort,
      useFactory: (
        repository: GeneticsRepositoryPort,
        realtime: GeneticsRealtimePort,
      ) => new GeneticsService(repository, realtime),
      inject: [GeneticsRepositoryPort, GeneticsRealtimePort],
    },
    GeneticsGateway,
  ],
  exports: [GeneticsUseCasesPort],
})
export class GeneticsModule {}
