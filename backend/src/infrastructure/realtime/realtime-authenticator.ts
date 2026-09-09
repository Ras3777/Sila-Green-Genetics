import { Injectable } from '@nestjs/common';
import { jwtVerify, type JWTPayload } from 'jose';
import { REALTIME_ERROR_CODES } from './realtime.constants.js';
import type {
  RealtimeAuthHandshake,
  RealtimePrincipal,
} from './realtime.types.js';

export class RealtimeAuthenticationError extends Error {
  constructor(
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'RealtimeAuthenticationError';
  }
}

@Injectable()
export class RealtimeAuthenticator {
  async authenticate(
    handshake: RealtimeAuthHandshake,
  ): Promise<RealtimePrincipal> {
    const token = this.readBearerToken(handshake);
    if (!token) {
      throw new RealtimeAuthenticationError(
        REALTIME_ERROR_CODES.authRequired,
        'A bearer access token is required for realtime connections.',
      );
    }
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) {
      throw new RealtimeAuthenticationError(
        REALTIME_ERROR_CODES.authUnavailable,
        'Realtime authentication is not configured.',
      );
    }
    try {
      const verification = await jwtVerify(
        token,
        new TextEncoder().encode(secret),
        {
          algorithms: ['HS256'],
          issuer: process.env.JWT_ISSUER || undefined,
          audience: process.env.JWT_AUDIENCE || undefined,
        },
      );
      return this.toPrincipal(verification.payload);
    } catch {
      throw new RealtimeAuthenticationError(
        REALTIME_ERROR_CODES.authInvalid,
        'The realtime access token is invalid or expired.',
      );
    }
  }

  private readBearerToken(
    handshake: RealtimeAuthHandshake,
  ): string | undefined {
    const authToken = handshake.auth.token;
    if (typeof authToken === 'string' && authToken.length > 0) return authToken;
    const authorization = handshake.headers.authorization;
    const header = Array.isArray(authorization)
      ? authorization[0]
      : authorization;
    if (!header?.startsWith('Bearer ')) return undefined;
    return header.slice('Bearer '.length).trim() || undefined;
  }

  private toPrincipal(payload: JWTPayload): RealtimePrincipal {
    if (typeof payload.sub !== 'string' || payload.sub.length === 0) {
      throw new RealtimeAuthenticationError(
        REALTIME_ERROR_CODES.authInvalid,
        'The realtime access token has no subject.',
      );
    }
    return {
      userId: payload.sub,
      roles: this.readStringArray(payload.roles ?? payload.role),
      organizationIds: this.readStringArray(
        payload.organizationIds ?? payload.organizationId,
      ),
      claims: payload as Readonly<Record<string, unknown>>,
    };
  }

  private readStringArray(value: unknown): readonly string[] {
    if (Array.isArray(value))
      return value.filter((item): item is string => typeof item === 'string');
    return typeof value === 'string' ? [value] : [];
  }
}
