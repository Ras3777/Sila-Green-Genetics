import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Subject, type Subscription } from 'rxjs';
import type { RealtimeEvent } from './realtime.types.js';

@Injectable()
export class RealtimeEventBus implements OnApplicationShutdown {
  private readonly events$ = new Subject<RealtimeEvent>();

  publish<TPayload>(
    event: Omit<RealtimeEvent<TPayload>, 'id' | 'version' | 'occurredAt'>,
  ): RealtimeEvent<TPayload> {
    const completeEvent: RealtimeEvent<TPayload> = {
      ...event,
      id: randomUUID(),
      version: 1,
      occurredAt: new Date().toISOString(),
    };
    this.events$.next(completeEvent);
    return completeEvent;
  }

  subscribe(handler: (event: RealtimeEvent) => void): Subscription {
    return this.events$.subscribe(handler);
  }

  onApplicationShutdown(): void {
    this.events$.complete();
  }
}
