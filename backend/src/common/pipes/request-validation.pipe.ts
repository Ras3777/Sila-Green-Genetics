import type { ArgumentMetadata, PipeTransform } from '@nestjs/common';

// TODO: Validate transport inputs before passing them to application services.
export abstract class RequestValidationPipe implements PipeTransform {
  abstract transform(value: unknown, metadata: ArgumentMetadata): unknown;
}
