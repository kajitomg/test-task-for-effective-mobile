import { AuthTokenSchema, UserSchema } from '../../generated/zod/index.js';
import { SafeUserSchema } from '../../shared/schemas/base.schema.js';
import { z } from '../../shared/utils/zod.js';

const SignupBodySchema = UserSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  role: true,
  status: true
}).extend({
  middle_name: z.string().optional(),
  last_name: z.string().optional(),
}).strip()

const SigninBodySchema = UserSchema.pick({
  email: true,
  password: true,
}).strip()

const RefreshCookiesSchema = z.object({
  refreshToken: z.string().pipe(AuthTokenSchema.shape.refresh)
})
const AuthResponseSchema = z.object({
  user: SafeUserSchema,
  accessToken: z.string(),
}).openapi('AuthResponse');

export { SigninBodySchema, SignupBodySchema, RefreshCookiesSchema, AuthResponseSchema }