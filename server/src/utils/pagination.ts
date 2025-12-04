import { z } from 'zod';

type PaginationOptions = {
  page: number;
  limit: number;
}

const defaultPaginationOptions: PaginationOptions = {
  page: 1,
  limit: 10,
}

const paginationQuerySchema = z.object({
  page: z.int().min(1).default(1),
  limit: z.int().max(100).default(10),
}).strip()

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

export { PaginationOptions, defaultPaginationOptions, paginationQuerySchema, getPaginationParams, getPaginationMetadata };