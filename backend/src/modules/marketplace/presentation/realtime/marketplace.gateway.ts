import { Inject, Injectable } from '@nestjs/common';
import { MarketplaceUseCasesPort } from '../../application/ports/in/marketplace-use-cases.port.js';

// Transport-neutral shell; no socket server or subscriptions are enabled yet.
@Injectable()
export class MarketplaceGateway {
  constructor(
    @Inject(MarketplaceUseCasesPort)
    private readonly useCases: MarketplaceUseCasesPort,
  ) {}

  // TODO: Add authenticated connections and authorized subscription handlers.
}
