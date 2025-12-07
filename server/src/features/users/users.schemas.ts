import { SafeUserSchema } from '../../shared/schemas/base.schema.js';
import { PaginationMetadataSchema } from '../../shared/utils/pagination.js';
import { z } from '../../shared/utils/zod.js';

const UsersItemResponseSchema = z.object({
  item: SafeUserSchema,
}).openapi('UsersItemResponse');

const UsersListResponseSchema = z.object({
  list: z.array(SafeUserSchema),
  meta: PaginationMetadataSchema
}).openapi('UsersListResponse');

export { UsersItemResponseSchema, UsersListResponseSchema };