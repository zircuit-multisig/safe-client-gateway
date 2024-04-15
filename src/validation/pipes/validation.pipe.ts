import { HttpStatus, Inject, Injectable, PipeTransform } from '@nestjs/common';
import { z, ZodError, ZodIssue, ZodSchema } from 'zod';

export class ZodErrorWithCode extends ZodError {
  constructor(
    public issues: ZodIssue[],
    public code: number,
  ) {
    super(issues);
  }
}

@Injectable()
export class ValidationPipe<T extends ZodSchema> implements PipeTransform {
  constructor(
    @Inject('VALIDATION_SCHEMA') private schema: T,
    @Inject('VALIDATION_CODE') private code = HttpStatus.UNPROCESSABLE_ENTITY,
  ) {}

  transform(value: unknown): z.infer<T> {
    const result = this.schema.safeParse(value);

    if (result.success) {
      return result.data;
    }

    throw new ZodErrorWithCode(result.error.issues, this.code);
  }
}
