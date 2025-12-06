import { z } from './zod';

const PaginationQuerySchema = z.object({
  page: z.int().min(1).default(1),
  limit: z.int().max(100).default(10),
}).strip()

type PaginationOptions = z.output<typeof PaginationQuerySchema>

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

export { PaginationOptions, defaultPaginationOptions, PaginationQuerySchema, getPaginationParams, getPaginationMetadata };