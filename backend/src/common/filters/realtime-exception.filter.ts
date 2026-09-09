import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';

// TODO: Define transport-specific realtime error delivery.
export abstract class RealtimeExceptionFilter implements ExceptionFilter {
  abstract catch(exception: unknown, host: ArgumentsHost): void;
}
