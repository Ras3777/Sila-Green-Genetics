import type { NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

// TODO: Establish per-request context when the required fields are defined.
export abstract class RequestContextMiddleware implements NestMiddleware {
  abstract use(request: Request, response: Response, next: NextFunction): void;
}
