import { z } from './zod.js';

const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().max(100).default(20),
}).strip().openapi('PaginationQuery')

const PaginationMetadataSchema = z.object({
  page: z.int().min(1).default(1),
  limit: z.int().max(100).default(20),
  total: z.int(),
  totalPages: z.int(),
}).strip().openapi('PaginationMetadata')

type PaginationOptions = z.infer<typeof PaginationQuerySchema>

const defaultPaginationOptions: PaginationOptions = {
  page: 1,
  limit: 10,
}

const getPaginationParams = (page: number, limit: number) => {
  const skip = (page - 1) * limit;
  
  return { page, limit, skip };
}

const getPaginationMetadata = (page: number, limit: number, total: number) => {
  const totalPages = limit === 0 ? Number(!!total) : Math.ceil(total / limit);
  
  return {
    page,
    limit,
    total,
    totalPages
  }
}

export { PaginationOptions, defaultPaginationOptions, PaginationQuerySchema, PaginationMetadataSchema, getPaginationParams, getPaginationMetadata };