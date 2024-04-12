import { getSiweMessageSchema } from '@/domain/auth/entities/siwe-message.entity';
import { HexSchema } from '@/validation/entities/schemas/hex.schema';
import { z } from 'zod';

export type VerifyAuthMessageDto = z.infer<
  ReturnType<typeof getVerifyAuthMessageDtoSchema>
>;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type - use inferred schema
export function getVerifyAuthMessageDtoSchema(
  maxValidityPeriodInSeconds: number,
) {
  return z.object({
    message: getSiweMessageSchema(maxValidityPeriodInSeconds),
    signature: HexSchema,
  });
}
