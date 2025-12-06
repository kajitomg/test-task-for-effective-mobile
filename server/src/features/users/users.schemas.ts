import { SafeUserSchema } from '../../shared/schemas/base.schema';
import { PaginationQuerySchema } from '../../shared/utils/pagination';
import { z } from '../../shared/utils/zod';

const UsersItemResponseSchema = z.object({
  item: SafeUserSchema,
}).openapi('UsersItemResponse');

const UsersListResponseSchema = z.object({
  list: SafeUserSchema,
  meta: PaginationQuerySchema
}).openapi('UsersListResponse');

export { UsersItemResponseSchema, UsersListResponseSchema };