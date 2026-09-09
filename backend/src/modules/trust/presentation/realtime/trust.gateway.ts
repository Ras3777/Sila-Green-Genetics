import { Inject, Injectable } from '@nestjs/common';
import { TrustUseCasesPort } from '../../application/ports/in/trust-use-cases.port.js';

// Transport-neutral shell; no socket server or subscriptions are enabled yet.
@Injectable()
export class TrustGateway {
  constructor(
    @Inject(TrustUseCasesPort)
    private readonly useCases: TrustUseCasesPort,
  ) {}

  // TODO: Add authenticated connections and authorized subscription handlers.
}
