import { UserSchema } from '../../generated/zod/index.js';
import { SafeUserSchema } from '../schemas/base.schema.js';
import { z } from './zod.js';

const sanitizeUser = (user: z.infer<typeof UserSchema>): z.infer<typeof SafeUserSchema> => {
  const { password, ...safeUser } = user;
  return safeUser;
};

export { sanitizeUser };