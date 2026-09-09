import { Inject, Injectable } from '@nestjs/common';
import { GeneticsUseCasesPort } from '../../application/ports/in/genetics-use-cases.port.js';

// Transport-neutral shell; no socket server or subscriptions are enabled yet.
@Injectable()
export class GeneticsGateway {
  constructor(
    @Inject(GeneticsUseCasesPort)
    private readonly useCases: GeneticsUseCasesPort,
  ) {}

  // TODO: Add authenticated connections and authorized subscription handlers.
}
