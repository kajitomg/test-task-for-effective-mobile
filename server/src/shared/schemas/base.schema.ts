import { UserSchema } from '../../generated/zod/index.js';
import { z } from '../utils/zod.js';

const UserIdSchema = z.object({
  id: z.string().pipe(UserSchema.shape.id)
});

const SafeUserSchema = UserSchema.omit({password: true});

export { UserIdSchema, SafeUserSchema };