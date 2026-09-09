import type { CanActivate, ExecutionContext } from '@nestjs/common';
import type { Observable } from 'rxjs';

// TODO: Implement authentication before registering a concrete guard.
export abstract class AuthenticationGuard implements CanActivate {
  abstract canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean>;
}
