import { Global, Module } from '@nestjs/common';
import { RealtimeAuthenticator } from './realtime-authenticator.js';
import { RealtimeConnectionRegistry } from './realtime-connection.registry.js';
import { RealtimeEventBus } from './realtime-event-bus.js';
import { RealtimeGateway } from './realtime.gateway.js';
import { RealtimeRateLimiter } from './realtime-rate-limiter.js';
import { RealtimeRoomAuthorizer } from './realtime-room-authorizer.js';
import { RealtimeTransportAdapter } from './realtime-transport.adapter.js';

@Global()
@Module({
  providers: [
    RealtimeAuthenticator,
    RealtimeConnectionRegistry,
    RealtimeEventBus,
    RealtimeRateLimiter,
    RealtimeRoomAuthorizer,
    RealtimeTransportAdapter,
    RealtimeGateway,
  ],
  exports: [RealtimeEventBus, RealtimeTransportAdapter],
})
export class RealtimeModule {}
