import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { RealtimeIoAdapter } from './infrastructure/realtime/realtime-io.adapter.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const realtimeAdapter = new RealtimeIoAdapter(app);
  await realtimeAdapter.connectToRedis();
  app.useWebSocketAdapter(realtimeAdapter);
  app.enableShutdownHooks();
  app
    .getHttpAdapter()
    .getInstance()
    .on('close', () => realtimeAdapter.close());
  await app.listen(process.env.PORT ?? 3001);
}
await bootstrap();
