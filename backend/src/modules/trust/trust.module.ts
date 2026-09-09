import { Module } from '@nestjs/common';
import { TrustUseCasesPort } from './application/ports/in/trust-use-cases.port.js';
import { TrustRepositoryPort } from './application/ports/out/trust-repository.port.js';
import { TrustRealtimePort } from './application/ports/out/trust-realtime.port.js';
import { TrustService } from './application/services/trust.service.js';
import { PrismaTrustRepository } from './infrastructure/persistence/prisma-trust.repository.js';
import { TrustRealtimeAdapter } from './infrastructure/realtime/trust-realtime.adapter.js';
import { TrustController } from './presentation/http/trust.controller.js';
import { TrustGateway } from './presentation/realtime/trust.gateway.js';

@Module({
  controllers: [TrustController],
  providers: [
    { provide: TrustRepositoryPort, useClass: PrismaTrustRepository },
    { provide: TrustRealtimePort, useClass: TrustRealtimeAdapter },
    {
      provide: TrustUseCasesPort,
      useFactory: (
        repository: TrustRepositoryPort,
        realtime: TrustRealtimePort,
      ) => new TrustService(repository, realtime),
      inject: [TrustRepositoryPort, TrustRealtimePort],
    },
    TrustGateway,
  ],
  exports: [TrustUseCasesPort],
})
export class TrustModule {}
