import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { Redis } from 'ioredis';
import type { Server, ServerOptions } from 'socket.io';

export class RealtimeIoAdapter extends IoAdapter {
  private pubClient?: Redis;
  private subClient?: Redis;
  private redisAdapter?: ReturnType<typeof createAdapter>;

  async connectToRedis(): Promise<void> {
    const url = process.env.REDIS_URL;
    if (!url) return;
    try {
      this.pubClient = new Redis(url, {
        lazyConnect: true,
        maxRetriesPerRequest: null,
      });
      this.subClient = this.pubClient.duplicate();
      await Promise.all([this.pubClient.connect(), this.subClient.connect()]);
      this.redisAdapter = createAdapter(this.pubClient, this.subClient);
    } catch (error) {
      await Promise.allSettled([
        this.pubClient?.quit(),
        this.subClient?.quit(),
      ]);
      this.pubClient = undefined;
      this.subClient = undefined;
      if (process.env.REALTIME_REDIS_REQUIRED === 'true') throw error;
      console.warn(
        'Realtime Redis adapter unavailable; using process-local fan-out.',
      );
    }
  }

  createIOServer(port: number, options?: ServerOptions): Server {
    const server = super.createIOServer(port, options) as Server;
    if (this.redisAdapter) server.adapter(this.redisAdapter);
    return server;
  }

  async close(): Promise<void> {
    await Promise.allSettled([this.pubClient?.quit(), this.subClient?.quit()]);
    this.pubClient = undefined;
    this.subClient = undefined;
    this.redisAdapter = undefined;
  }
}
