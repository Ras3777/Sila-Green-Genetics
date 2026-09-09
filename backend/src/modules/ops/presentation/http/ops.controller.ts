import { Controller, Inject } from '@nestjs/common';
import { OpsUseCasesPort } from '../../application/ports/in/ops-use-cases.port.js';

@Controller('ops')
export class OpsController {
  constructor(
    @Inject(OpsUseCasesPort)
    private readonly useCases: OpsUseCasesPort,
  ) {}

  // TODO: Add validated HTTP routes that call the application port.
}
