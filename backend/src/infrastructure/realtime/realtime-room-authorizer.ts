import { Injectable } from '@nestjs/common';
import type { RealtimePrincipal } from './realtime.types.js';

const roomPattern = /^(user|org|farm|herd|animal|topic):[a-zA-Z0-9:_-]{1,128}$/;

@Injectable()
export class RealtimeRoomAuthorizer {
  isValidRoom(room: string): boolean {
    return room.length <= 160 && roomPattern.test(room);
  }

  canSubscribe(principal: RealtimePrincipal, room: string): boolean {
    const [kind, identifier] = room.split(':', 2);
    if (kind === 'user') return identifier === principal.userId;
    if (kind === 'org')
      return (
        principal.organizationIds.includes(identifier) ||
        this.isPrivileged(principal)
      );
    return (
      this.isPrivileged(principal) ||
      principal.roles.includes('realtime:subscribe')
    );
  }

  private isPrivileged(principal: RealtimePrincipal): boolean {
    return principal.roles.some((role) =>
      ['admin', 'platform-admin', 'realtime:admin'].includes(role),
    );
  }
}
