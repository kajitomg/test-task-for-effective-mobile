import { SafeUserSchema } from '../../shared/schemas/base.schema.js';
import { z } from '../../shared/utils/zod.js';

const AccountResponseSchema = z.object({
  user: SafeUserSchema,
}).openapi('AccountResponse');

export { AccountResponseSchema };