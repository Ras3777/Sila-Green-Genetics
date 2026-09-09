import { OpsUseCasesPort } from '../ports/in/ops-use-cases.port.js';
import type { OpsRepositoryPort } from '../ports/out/ops-repository.port.js';
import type { OpsRealtimePort } from '../ports/out/ops-realtime.port.js';

export class OpsService extends OpsUseCasesPort {
  constructor(
    protected readonly repository: OpsRepositoryPort,
    protected readonly realtime: OpsRealtimePort,
  ) {
    super();
  }

  // TODO: Implement use cases using domain objects and outbound ports.
}
