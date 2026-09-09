import { Controller, Inject } from '@nestjs/common';
import { TrustUseCasesPort } from '../../application/ports/in/trust-use-cases.port.js';

@Controller('trust')
export class TrustController {
  constructor(
    @Inject(TrustUseCasesPort)
    private readonly useCases: TrustUseCasesPort,
  ) {}

  // TODO: Add validated HTTP routes that call the application port.
}
