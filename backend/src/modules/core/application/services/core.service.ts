import { CoreUseCasesPort } from '../ports/in/core-use-cases.port.js';
import type { CoreRepositoryPort } from '../ports/out/core-repository.port.js';
import type { CoreRealtimePort } from '../ports/out/core-realtime.port.js';

export class CoreService extends CoreUseCasesPort {
  constructor(
    protected readonly repository: CoreRepositoryPort,
    protected readonly realtime: CoreRealtimePort,
  ) {
    super();
  }

  // TODO: Implement use cases using domain objects and outbound ports.
}
