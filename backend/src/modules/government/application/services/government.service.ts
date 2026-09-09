import { GovernmentUseCasesPort } from '../ports/in/government-use-cases.port.js';
import type { GovernmentRepositoryPort } from '../ports/out/government-repository.port.js';
import type { GovernmentRealtimePort } from '../ports/out/government-realtime.port.js';

export class GovernmentService extends GovernmentUseCasesPort {
  constructor(
    protected readonly repository: GovernmentRepositoryPort,
    protected readonly realtime: GovernmentRealtimePort,
  ) {
    super();
  }

  // TODO: Implement use cases using domain objects and outbound ports.
}
