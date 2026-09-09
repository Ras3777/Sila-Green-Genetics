import { Controller, Inject } from '@nestjs/common';
import { HealthUseCasesPort } from '../../application/ports/in/health-use-cases.port.js';

@Controller('health')
export class HealthController {
  constructor(
    @Inject(HealthUseCasesPort)
    private readonly useCases: HealthUseCasesPort,
  ) {}

  // TODO: Add validated HTTP routes that call the application port.
}
