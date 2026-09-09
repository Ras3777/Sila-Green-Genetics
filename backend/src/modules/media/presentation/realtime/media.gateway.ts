import { Inject, Injectable } from '@nestjs/common';
import { MediaUseCasesPort } from '../../application/ports/in/media-use-cases.port.js';

// Transport-neutral shell; no socket server or subscriptions are enabled yet.
@Injectable()
export class MediaGateway {
  constructor(
    @Inject(MediaUseCasesPort)
    private readonly useCases: MediaUseCasesPort,
  ) {}

  // TODO: Add authenticated connections and authorized subscription handlers.
}
