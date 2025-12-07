import { UsersItemResponseSchema, UsersListResponseSchema } from '../../../../features/users/index.js';
import { UserIdSchema } from '../../../../shared/schemas/base.schema.js';
import { PaginationQuerySchema } from '../../../../shared/utils/pagination.js';
import { registry } from '../registry.js';

registry.registerPath({
  method: 'get',
  path: '/users',
  tags: ['Users'],
  summary: 'Получить список всех пользователей',
  security: [{bearerAuth: []}],
  request: {
    params: PaginationQuerySchema,
  },
  responses: {
    200: {
      description: 'Список пользователей',
      content: {
        'application/json': {
          schema: UsersListResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/users/{id}',
  tags: ['Users'],
  summary: 'Получить пользователя по ID',
  security: [{ bearerAuth: [] }],
  request: {
    params: UserIdSchema
  },
  responses: {
    200: {
      description: 'Данные пользователя',
      content: { 'application/json': { schema: UsersItemResponseSchema } },
    },
  },
});

registry.registerPath({
  method: 'patch',
  path: '/users/{id}/block',
  tags: ['Users'],
  summary: 'Заблокировать пользователя по ID',
  security: [{ bearerAuth: [] }],
  request: {
    params: UserIdSchema
  },
  responses: {
    200: {
      description: 'Пользователь заблокирован',
      content: { 'application/json': { schema: UsersItemResponseSchema } },
    },
  },
});