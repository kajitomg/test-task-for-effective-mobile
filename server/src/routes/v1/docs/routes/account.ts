import { AccountResponseSchema } from '../../../../features/account/index.js';
import { registry } from '../registry.js';

registry.registerPath({
  method: 'get',
  path: '/account',
  tags: ['Account'],
  summary: 'Получить свой профиль пользователя',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Профиль пользователя',
      content: { 'application/json': { schema: AccountResponseSchema } },
    },
  },
});

registry.registerPath({
  method: 'patch',
  path: '/account/block',
  tags: ['Account'],
  summary: 'Заблокировать свой аккаунт',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Аккаунт заблокирован',
      content: { 'application/json': { schema: AccountResponseSchema } },
    },
  },
});