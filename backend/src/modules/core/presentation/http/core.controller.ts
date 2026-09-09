import { Controller, Inject } from '@nestjs/common';
import { CoreUseCasesPort } from '../../application/ports/in/core-use-cases.port.js';

@Controller('core')
export class CoreController {
  constructor(
    @Inject(CoreUseCasesPort)
    private readonly useCases: CoreUseCasesPort,
  ) {}

  // TODO: Add validated HTTP routes that call the application port.
}
