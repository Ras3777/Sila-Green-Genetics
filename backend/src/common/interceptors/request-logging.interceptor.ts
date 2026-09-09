import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import type { Observable } from 'rxjs';

// TODO: Record request metadata through the infrastructure logger.
export abstract class RequestLoggingInterceptor implements NestInterceptor {
  abstract intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> | Promise<Observable<unknown>>;
}
