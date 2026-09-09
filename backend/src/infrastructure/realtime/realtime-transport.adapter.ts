import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import type { Namespace } from 'socket.io';
import type { Subscription } from 'rxjs';
import { RealtimeEventBus } from './realtime-event-bus.js';
import type { RealtimeEvent } from './realtime.types.js';

@Injectable()
export class RealtimeTransportAdapter implements OnApplicationShutdown {
  private namespace?: Namespace;
  private subscription?: Subscription;

  constructor(private readonly eventBus: RealtimeEventBus) {}

  bind(namespace: Namespace): void {
    this.namespace = namespace;
    this.subscription?.unsubscribe();
    this.subscription = this.eventBus.subscribe((event) => this.emit(event));
  }

  emit<TPayload>(event: RealtimeEvent<TPayload>): void {
    if (!this.namespace || event.rooms.length === 0) return;
    this.namespace.to([...event.rooms]).emit(event.type, event);
  }

  emitToRoom<TPayload>(room: string, event: RealtimeEvent<TPayload>): void {
    this.namespace?.to(room).emit(event.type, event);
  }

  onApplicationShutdown(): void {
    this.subscription?.unsubscribe();
    this.subscription = undefined;
    this.namespace = undefined;
  }
}
