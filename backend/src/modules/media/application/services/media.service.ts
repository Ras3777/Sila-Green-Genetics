import { MediaUseCasesPort } from '../ports/in/media-use-cases.port.js';
import type { MediaRepositoryPort } from '../ports/out/media-repository.port.js';
import type { MediaRealtimePort } from '../ports/out/media-realtime.port.js';

export class MediaService extends MediaUseCasesPort {
  constructor(
    protected readonly repository: MediaRepositoryPort,
    protected readonly realtime: MediaRealtimePort,
  ) {
    super();
  }

  // TODO: Implement use cases using domain objects and outbound ports.
}
