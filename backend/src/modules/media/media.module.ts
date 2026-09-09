import { Module } from '@nestjs/common';
import { MediaUseCasesPort } from './application/ports/in/media-use-cases.port.js';
import { MediaRepositoryPort } from './application/ports/out/media-repository.port.js';
import { MediaRealtimePort } from './application/ports/out/media-realtime.port.js';
import { MediaService } from './application/services/media.service.js';
import { PrismaMediaRepository } from './infrastructure/persistence/prisma-media.repository.js';
import { MediaRealtimeAdapter } from './infrastructure/realtime/media-realtime.adapter.js';
import { MediaController } from './presentation/http/media.controller.js';
import { MediaGateway } from './presentation/realtime/media.gateway.js';

@Module({
  controllers: [MediaController],
  providers: [
    { provide: MediaRepositoryPort, useClass: PrismaMediaRepository },
    { provide: MediaRealtimePort, useClass: MediaRealtimeAdapter },
    {
      provide: MediaUseCasesPort,
      useFactory: (
        repository: MediaRepositoryPort,
        realtime: MediaRealtimePort,
      ) => new MediaService(repository, realtime),
      inject: [MediaRepositoryPort, MediaRealtimePort],
    },
    MediaGateway,
  ],
  exports: [MediaUseCasesPort],
})
export class MediaModule {}
