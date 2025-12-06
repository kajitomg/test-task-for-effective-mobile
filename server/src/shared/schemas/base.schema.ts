import { UserSchema } from '../../generated/zod';
import { z } from '../utils/zod';

const UserIdSchema = z.object({
  id: z.string().pipe(UserSchema.shape.id)
});

const SafeUserSchema = UserSchema.omit({password: true});

export { UserIdSchema, SafeUserSchema };