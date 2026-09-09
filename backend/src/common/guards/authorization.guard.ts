import type { CanActivate, ExecutionContext } from '@nestjs/common';
import type { Observable } from 'rxjs';

// TODO: Enforce access policies before registering a concrete guard.
export abstract class AuthorizationGuard implements CanActivate {
  abstract canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean>;
}
