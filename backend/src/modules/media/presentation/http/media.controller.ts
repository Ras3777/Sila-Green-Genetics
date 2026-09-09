import { Controller, Inject } from '@nestjs/common';
import { MediaUseCasesPort } from '../../application/ports/in/media-use-cases.port.js';

@Controller('media')
export class MediaController {
  constructor(
    @Inject(MediaUseCasesPort)
    private readonly useCases: MediaUseCasesPort,
  ) {}

  // TODO: Add validated HTTP routes that call the application port.
}
