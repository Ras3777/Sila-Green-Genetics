import 'dotenv/config';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace } from 'socket.io';
import {
  REALTIME_CONNECTION_RECOVERY_MS,
  REALTIME_DEFAULT_MAX_HTTP_BUFFER_SIZE,
  REALTIME_DEFAULT_PING_INTERVAL_MS,
  REALTIME_DEFAULT_PING_TIMEOUT_MS,
  REALTIME_ERROR_CODES,
  REALTIME_EVENTS,
  REALTIME_NAMESPACE,
  REALTIME_USER_ROOM_PREFIX,
} from './realtime.constants.js';
import {
  RealtimeAuthenticator,
  RealtimeAuthenticationError,
} from './realtime-authenticator.js';
import { RealtimeConnectionRegistry } from './realtime-connection.registry.js';
import { RealtimeRateLimiter } from './realtime-rate-limiter.js';
import { RealtimeRoomAuthorizer } from './realtime-room-authorizer.js';
import { RealtimeTransportAdapter } from './realtime-transport.adapter.js';
import type {
  AuthenticatedSocket,
  RealtimeAcknowledgement,
  RealtimeSubscriptionPayload,
} from './realtime.types.js';

function origins(): string[] {
  return (process.env.REALTIME_ALLOWED_ORIGINS ?? 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

@WebSocketGateway({
  namespace: REALTIME_NAMESPACE,
  transports: ['websocket', 'polling'],
  cors: { origin: origins(), credentials: true },
  connectionStateRecovery: {
    maxDisconnectionDuration: REALTIME_CONNECTION_RECOVERY_MS,
    skipMiddlewares: false,
  },
  pingInterval: REALTIME_DEFAULT_PING_INTERVAL_MS,
  pingTimeout: REALTIME_DEFAULT_PING_TIMEOUT_MS,
  maxHttpBufferSize: REALTIME_DEFAULT_MAX_HTTP_BUFFER_SIZE,
  perMessageDeflate: false,
})
export class RealtimeGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() private server!: Namespace;

  constructor(
    private readonly authenticator: RealtimeAuthenticator,
    private readonly registry: RealtimeConnectionRegistry,
    private readonly rateLimiter: RealtimeRateLimiter,
    private readonly roomAuthorizer: RealtimeRoomAuthorizer,
    private readonly transport: RealtimeTransportAdapter,
  ) {}

  afterInit(server: Namespace): void {
    this.server = server;
    this.transport.bind(server);
    server.use(async (socket, next) => {
      try {
        const principal = await this.authenticator.authenticate({
          auth: socket.handshake.auth as Record<string, unknown>,
          headers: socket.handshake.headers,
        });
        (socket as AuthenticatedSocket).data.principal = principal;
        next();
      } catch (error) {
        const authError =
          error instanceof RealtimeAuthenticationError
            ? error
            : new RealtimeAuthenticationError(
                REALTIME_ERROR_CODES.authInvalid,
                'Realtime authentication failed.',
              );
        const connectionError = new Error(authError.message);
        Object.assign(connectionError, { data: { code: authError.code } });
        next(connectionError);
      }
    });
  }

  async handleConnection(socket: AuthenticatedSocket): Promise<void> {
    try {
      const principal =
        socket.data.principal ??
        (await this.authenticator.authenticate({
          auth: socket.handshake.auth as Record<string, unknown>,
          headers: socket.handshake.headers,
        }));
      if (!this.registry.register(socket, principal)) {
        socket.emit(REALTIME_EVENTS.error, {
          code: REALTIME_ERROR_CODES.tooManyConnections,
          message: 'The connection limit for this user has been reached.',
        });
        socket.disconnect(true);
        return;
      }
      socket.data.principal = principal;
      socket.data.connectedAt = Date.now();
      await socket.join(`${REALTIME_USER_ROOM_PREFIX}${principal.userId}`);
      socket.emit(REALTIME_EVENTS.ready, {
        namespace: REALTIME_NAMESPACE,
        recoveryEnabled: true,
        serverTime: new Date().toISOString(),
      });
    } catch (error) {
      const authError =
        error instanceof RealtimeAuthenticationError
          ? error
          : new RealtimeAuthenticationError(
              REALTIME_ERROR_CODES.authInvalid,
              'Realtime authentication failed.',
            );
      socket.emit(REALTIME_EVENTS.error, {
        code: authError.code,
        message: authError.message,
      });
      socket.disconnect(true);
    }
  }

  handleDisconnect(socket: AuthenticatedSocket): void {
    this.registry.unregister(socket.id);
    this.rateLimiter.remove(socket.id);
  }

  @SubscribeMessage(REALTIME_EVENTS.ping)
  ping(
    @ConnectedSocket() socket: AuthenticatedSocket,
  ): RealtimeAcknowledgement<{ serverTime: string }> {
    if (!this.allow(socket)) return this.rateLimited();
    return { ok: true, data: { serverTime: new Date().toISOString() } };
  }

  @SubscribeMessage(REALTIME_EVENTS.subscribe)
  async subscribe(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() payload: RealtimeSubscriptionPayload,
  ): Promise<RealtimeAcknowledgement<{ room: string }>> {
    if (!this.allow(socket)) return this.rateLimited();
    const principal = socket.data.principal;
    const room = typeof payload?.room === 'string' ? payload.room.trim() : '';
    if (!principal || !this.roomAuthorizer.isValidRoom(room)) {
      return this.failure(
        REALTIME_ERROR_CODES.invalidPayload,
        'A valid room is required.',
      );
    }
    if (!this.roomAuthorizer.canSubscribe(principal, room)) {
      return this.failure(
        REALTIME_ERROR_CODES.forbidden,
        'You are not allowed to subscribe to this room.',
      );
    }
    await socket.join(room);
    return { ok: true, data: { room } };
  }

  @SubscribeMessage(REALTIME_EVENTS.unsubscribe)
  async unsubscribe(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() payload: RealtimeSubscriptionPayload,
  ): Promise<RealtimeAcknowledgement<{ room: string }>> {
    if (!this.allow(socket)) return this.rateLimited();
    const room = typeof payload?.room === 'string' ? payload.room.trim() : '';
    if (!this.roomAuthorizer.isValidRoom(room)) {
      return this.failure(
        REALTIME_ERROR_CODES.invalidPayload,
        'A valid room is required.',
      );
    }
    await socket.leave(room);
    return { ok: true, data: { room } };
  }

  private allow(socket: AuthenticatedSocket): boolean {
    return (
      this.registry.get(socket.id) !== undefined &&
      this.rateLimiter.consume(socket.id)
    );
  }

  private rateLimited<TData = unknown>(): RealtimeAcknowledgement<TData> {
    return this.failure(
      REALTIME_ERROR_CODES.rateLimited,
      'Too many realtime messages.',
    );
  }

  private failure<TData = unknown>(
    code: string,
    message: string,
  ): RealtimeAcknowledgement<TData> {
    return { ok: false, error: { code, message } };
  }
}
