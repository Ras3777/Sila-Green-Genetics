import { Module } from '@nestjs/common';
import { MarketplaceUseCasesPort } from './application/ports/in/marketplace-use-cases.port.js';
import { MarketplaceRepositoryPort } from './application/ports/out/marketplace-repository.port.js';
import { MarketplaceRealtimePort } from './application/ports/out/marketplace-realtime.port.js';
import { MarketplaceService } from './application/services/marketplace.service.js';
import { PrismaMarketplaceRepository } from './infrastructure/persistence/prisma-marketplace.repository.js';
import { MarketplaceRealtimeAdapter } from './infrastructure/realtime/marketplace-realtime.adapter.js';
import { MarketplaceController } from './presentation/http/marketplace.controller.js';
import { MarketplaceGateway } from './presentation/realtime/marketplace.gateway.js';

@Module({
  controllers: [MarketplaceController],
  providers: [
    { provide: MarketplaceRepositoryPort, useClass: PrismaMarketplaceRepository },
    { provide: MarketplaceRealtimePort, useClass: MarketplaceRealtimeAdapter },
    {
      provide: MarketplaceUseCasesPort,
      useFactory: (
        repository: MarketplaceRepositoryPort,
        realtime: MarketplaceRealtimePort,
      ) => new MarketplaceService(repository, realtime),
      inject: [MarketplaceRepositoryPort, MarketplaceRealtimePort],
    },
    MarketplaceGateway,
  ],
  exports: [MarketplaceUseCasesPort],
})
export class MarketplaceModule {}
