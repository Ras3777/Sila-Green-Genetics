import { TrustUseCasesPort } from '../ports/in/trust-use-cases.port.js';
import type { TrustRepositoryPort } from '../ports/out/trust-repository.port.js';
import type { TrustRealtimePort } from '../ports/out/trust-realtime.port.js';

export class TrustService extends TrustUseCasesPort {
  constructor(
    protected readonly repository: TrustRepositoryPort,
    protected readonly realtime: TrustRealtimePort,
  ) {
    super();
  }

  // TODO: Implement use cases using domain objects and outbound ports.
}
