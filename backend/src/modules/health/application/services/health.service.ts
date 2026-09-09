import { HealthUseCasesPort } from '../ports/in/health-use-cases.port.js';
import type { HealthRepositoryPort } from '../ports/out/health-repository.port.js';
import type { HealthRealtimePort } from '../ports/out/health-realtime.port.js';

export class HealthService extends HealthUseCasesPort {
  constructor(
    protected readonly repository: HealthRepositoryPort,
    protected readonly realtime: HealthRealtimePort,
  ) {
    super();
  }

  // TODO: Implement use cases using domain objects and outbound ports.
}
