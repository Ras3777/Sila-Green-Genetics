import { Inject, Injectable } from '@nestjs/common';
import { CoreUseCasesPort } from '../../application/ports/in/core-use-cases.port.js';

// Transport-neutral shell; no socket server or subscriptions are enabled yet.
@Injectable()
export class CoreGateway {
  constructor(
    @Inject(CoreUseCasesPort)
    private readonly useCases: CoreUseCasesPort,
  ) {}

  // TODO: Add authenticated connections and authorized subscription handlers.
}
