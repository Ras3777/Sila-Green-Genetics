import { ReproductionUseCasesPort } from '../ports/in/reproduction-use-cases.port.js';
import type { ReproductionRepositoryPort } from '../ports/out/reproduction-repository.port.js';
import type { ReproductionRealtimePort } from '../ports/out/reproduction-realtime.port.js';

export class ReproductionService extends ReproductionUseCasesPort {
  constructor(
    protected readonly repository: ReproductionRepositoryPort,
    protected readonly realtime: ReproductionRealtimePort,
  ) {
    super();
  }

  // TODO: Implement use cases using domain objects and outbound ports.
}
