import { Inject, Injectable } from '@nestjs/common';
import { OpsUseCasesPort } from '../../application/ports/in/ops-use-cases.port.js';

// Transport-neutral shell; no socket server or subscriptions are enabled yet.
@Injectable()
export class OpsGateway {
  constructor(
    @Inject(OpsUseCasesPort)
    private readonly useCases: OpsUseCasesPort,
  ) {}

  // TODO: Add authenticated connections and authorized subscription handlers.
}
