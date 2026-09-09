import type { Socket } from 'socket.io';

export interface RealtimePrincipal {
  userId: string;
  roles: readonly string[];
  organizationIds: readonly string[];
  claims: Readonly<Record<string, unknown>>;
}

export interface RealtimeSocketData {
  principal?: RealtimePrincipal;
  connectedAt?: number;
}

export type AuthenticatedSocket = Socket & { data: RealtimeSocketData };

export interface RealtimeEvent<TPayload = unknown> {
  id: string;
  type: string;
  version: 1;
  occurredAt: string;
  rooms: readonly string[];
  payload: TPayload;
}

export interface RealtimeSubscriptionPayload {
  room: string;
}

export interface RealtimeAcknowledgement<TData = unknown> {
  ok: boolean;
  data?: TData;
  error?: { code: string; message: string };
}

export interface RealtimeAuthHandshake {
  auth: Record<string, unknown>;
  headers: Record<string, string | string[] | undefined>;
}
