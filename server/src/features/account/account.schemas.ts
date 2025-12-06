import { SafeUserSchema } from '../../shared/schemas/base.schema';
import { z } from '../../shared/utils/zod';

const AccountResponseSchema = z.object({
  user: SafeUserSchema,
}).openapi('AccountResponse');

export { AccountResponseSchema };