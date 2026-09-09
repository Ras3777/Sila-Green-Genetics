import { Controller, Inject } from '@nestjs/common';
import { GovernmentUseCasesPort } from '../../application/ports/in/government-use-cases.port.js';

@Controller('government')
export class GovernmentController {
  constructor(
    @Inject(GovernmentUseCasesPort)
    private readonly useCases: GovernmentUseCasesPort,
  ) {}

  // TODO: Add validated HTTP routes that call the application port.
}
