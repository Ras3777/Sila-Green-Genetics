import { MarketplaceUseCasesPort } from '../ports/in/marketplace-use-cases.port.js';
import type { MarketplaceRepositoryPort } from '../ports/out/marketplace-repository.port.js';
import type { MarketplaceRealtimePort } from '../ports/out/marketplace-realtime.port.js';

export class MarketplaceService extends MarketplaceUseCasesPort {
  constructor(
    protected readonly repository: MarketplaceRepositoryPort,
    protected readonly realtime: MarketplaceRealtimePort,
  ) {
    super();
  }

  // TODO: Implement use cases using domain objects and outbound ports.
}
