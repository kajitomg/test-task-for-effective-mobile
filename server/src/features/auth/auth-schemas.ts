import { z } from 'zod';

const signupBodySchema = z.object({
  first_name: z.string(),
  middle_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.email(),
  password: z.string().min(6),
}).strip()

const signinBodySchema = z.object({
  email: z.email(),
  password: z.string(),
}).strip()

const refreshCookiesSchema = z.object({
  refreshToken: z.string(),
}).strip()

export { signinBodySchema, signupBodySchema, refreshCookiesSchema}