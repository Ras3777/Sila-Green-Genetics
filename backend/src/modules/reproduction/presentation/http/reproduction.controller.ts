import { Controller, Inject } from '@nestjs/common';
import { ReproductionUseCasesPort } from '../../application/ports/in/reproduction-use-cases.port.js';

@Controller('reproduction')
export class ReproductionController {
  constructor(
    @Inject(ReproductionUseCasesPort)
    private readonly useCases: ReproductionUseCasesPort,
  ) {}

  // TODO: Add validated HTTP routes that call the application port.
}
