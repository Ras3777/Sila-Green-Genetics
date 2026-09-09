import { Module } from '@nestjs/common';
import { CoreUseCasesPort } from './application/ports/in/core-use-cases.port.js';
import { CoreRepositoryPort } from './application/ports/out/core-repository.port.js';
import { CoreRealtimePort } from './application/ports/out/core-realtime.port.js';
import { CoreService } from './application/services/core.service.js';
import { PrismaCoreRepository } from './infrastructure/persistence/prisma-core.repository.js';
import { CoreRealtimeAdapter } from './infrastructure/realtime/core-realtime.adapter.js';
import { CoreController } from './presentation/http/core.controller.js';
import { CoreGateway } from './presentation/realtime/core.gateway.js';

@Module({
  controllers: [CoreController],
  providers: [
    { provide: CoreRepositoryPort, useClass: PrismaCoreRepository },
    { provide: CoreRealtimePort, useClass: CoreRealtimeAdapter },
    {
      provide: CoreUseCasesPort,
      useFactory: (
        repository: CoreRepositoryPort,
        realtime: CoreRealtimePort,
      ) => new CoreService(repository, realtime),
      inject: [CoreRepositoryPort, CoreRealtimePort],
    },
    CoreGateway,
  ],
  exports: [CoreUseCasesPort],
})
export class CoreModule {}
