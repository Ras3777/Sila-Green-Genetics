import { Inject, Injectable } from '@nestjs/common';
import { HealthUseCasesPort } from '../../application/ports/in/health-use-cases.port.js';

// Transport-neutral shell; no socket server or subscriptions are enabled yet.
@Injectable()
export class HealthGateway {
  constructor(
    @Inject(HealthUseCasesPort)
    private readonly useCases: HealthUseCasesPort,
  ) {}

  // TODO: Add authenticated connections and authorized subscription handlers.
}
