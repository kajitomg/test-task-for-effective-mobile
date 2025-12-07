import {
  AuthResponseSchema,
  SigninBodySchema,
  SignupBodySchema,
} from '../../../../features/auth/index.js';
import { registry } from '../registry.js';

registry.registerPath({
  method: 'post',
  path: '/auth/signup',
  tags: ['Auth'],
  summary: 'Регистрация нового пользователя',
  request: {
    body: {
      content: { 'application/json': { schema: SignupBodySchema } },
    },
  },
  responses: {
    201: {
      description: 'Успешная регистрация',
      content: { 'application/json': { schema: AuthResponseSchema } },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/auth/signin',
  tags: ['Auth'],
  summary: 'Вход в систему',
  request: {
    body: {
      content: { 'application/json': { schema: SigninBodySchema } },
    },
  },
  responses: {
    200: {
      description: 'Успешный вход',
      content: { 'application/json': { schema: AuthResponseSchema } },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/auth/refresh',
  tags: ['Auth'],
  summary: 'Обновление токенов',
  security: [{cookieAuth: []}],
  responses: {
    200: {
      description: 'Токены обновлены',
      content: { 'application/json': { schema: AuthResponseSchema } },
    },
  },
});