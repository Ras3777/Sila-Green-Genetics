import { Controller, Inject } from '@nestjs/common';
import { GeneticsUseCasesPort } from '../../application/ports/in/genetics-use-cases.port.js';

@Controller('genetics')
export class GeneticsController {
  constructor(
    @Inject(GeneticsUseCasesPort)
    private readonly useCases: GeneticsUseCasesPort,
  ) {}

  // TODO: Add validated HTTP routes that call the application port.
}
