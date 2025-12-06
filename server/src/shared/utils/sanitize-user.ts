import { UserSchema } from '../../generated/zod';
import { SafeUserSchema } from '../schemas/base.schema';
import { z } from './zod';

const sanitizeUser = (user: z.output<typeof UserSchema>): z.output<typeof SafeUserSchema> => {
  const { password, ...safeUser } = user;
  return safeUser;
};

export { sanitizeUser };