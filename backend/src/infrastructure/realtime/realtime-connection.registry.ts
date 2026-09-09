import { Injectable } from '@nestjs/common';
import { REALTIME_MAX_CONNECTIONS_PER_USER } from './realtime.constants.js';
import type {
  AuthenticatedSocket,
  RealtimePrincipal,
} from './realtime.types.js';

@Injectable()
export class RealtimeConnectionRegistry {
  private readonly connections = new Map<
    string,
    {
      socket: AuthenticatedSocket;
      principal: RealtimePrincipal;
      connectedAt: number;
    }
  >();
  private readonly userConnections = new Map<string, Set<string>>();

  register(socket: AuthenticatedSocket, principal: RealtimePrincipal): boolean {
    const existing = this.userConnections.get(principal.userId);
    if ((existing?.size ?? 0) >= REALTIME_MAX_CONNECTIONS_PER_USER)
      return false;
    const connectedAt = Date.now();
    this.connections.set(socket.id, { socket, principal, connectedAt });
    const socketIds = existing ?? new Set<string>();
    socketIds.add(socket.id);
    this.userConnections.set(principal.userId, socketIds);
    return true;
  }

  unregister(socketId: string): void {
    const connection = this.connections.get(socketId);
    if (!connection) return;
    this.connections.delete(socketId);
    const socketIds = this.userConnections.get(connection.principal.userId);
    socketIds?.delete(socketId);
    if (socketIds?.size === 0)
      this.userConnections.delete(connection.principal.userId);
  }

  get(socketId: string): RealtimePrincipal | undefined {
    return this.connections.get(socketId)?.principal;
  }

  count(): number {
    return this.connections.size;
  }

  countForUser(userId: string): number {
    return this.userConnections.get(userId)?.size ?? 0;
  }
}
