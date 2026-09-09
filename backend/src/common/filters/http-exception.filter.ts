import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';

// TODO: Map errors to HTTP responses without exposing internal details.
export abstract class HttpExceptionFilter implements ExceptionFilter {
  abstract catch(exception: unknown, host: ArgumentsHost): void;
}
