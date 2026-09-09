import { GeneticsUseCasesPort } from '../ports/in/genetics-use-cases.port.js';
import type { GeneticsRepositoryPort } from '../ports/out/genetics-repository.port.js';
import type { GeneticsRealtimePort } from '../ports/out/genetics-realtime.port.js';

export class GeneticsService extends GeneticsUseCasesPort {
  constructor(
    protected readonly repository: GeneticsRepositoryPort,
    protected readonly realtime: GeneticsRealtimePort,
  ) {
    super();
  }

  // TODO: Implement use cases using domain objects and outbound ports.
}
