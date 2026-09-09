import { Controller, Inject } from '@nestjs/common';
import { MarketplaceUseCasesPort } from '../../application/ports/in/marketplace-use-cases.port.js';

@Controller('marketplace')
export class MarketplaceController {
  constructor(
    @Inject(MarketplaceUseCasesPort)
    private readonly useCases: MarketplaceUseCasesPort,
  ) {}

  // TODO: Add validated HTTP routes that call the application port.
}
