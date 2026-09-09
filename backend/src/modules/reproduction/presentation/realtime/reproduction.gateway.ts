import { Inject, Injectable } from '@nestjs/common';
import { ReproductionUseCasesPort } from '../../application/ports/in/reproduction-use-cases.port.js';

// Transport-neutral shell; no socket server or subscriptions are enabled yet.
@Injectable()
export class ReproductionGateway {
  constructor(
    @Inject(ReproductionUseCasesPort)
    private readonly useCases: ReproductionUseCasesPort,
  ) {}

  // TODO: Add authenticated connections and authorized subscription handlers.
}
