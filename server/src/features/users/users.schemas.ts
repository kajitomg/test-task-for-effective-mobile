import { z } from 'zod';


const getUserByIdSchema = z.object({
  id: z.string(),
}).strip()

const blockUserByIdSchema = z.object({
  id: z.string(),
}).strip()

export { getUserByIdSchema, blockUserByIdSchema };