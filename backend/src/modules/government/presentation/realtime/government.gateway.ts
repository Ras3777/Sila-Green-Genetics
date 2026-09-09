import { Inject, Injectable } from '@nestjs/common';
import { GovernmentUseCasesPort } from '../../application/ports/in/government-use-cases.port.js';

// Transport-neutral shell; no socket server or subscriptions are enabled yet.
@Injectable()
export class GovernmentGateway {
  constructor(
    @Inject(GovernmentUseCasesPort)
    private readonly useCases: GovernmentUseCasesPort,
  ) {}

  // TODO: Add authenticated connections and authorized subscription handlers.
}
