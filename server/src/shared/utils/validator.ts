import type { Request } from 'express';
import type { ZodType } from 'zod';
import { ZodError } from 'zod';
import { ApiError } from '../exceptions/api-error.js';

export function createValidate(key: 'body' | 'query' | 'params' | 'cookies') {
  return async function validate<T>(
    schema: ZodType<T>,
    request: Request,
  ): Promise<T> {
    try {
      return await schema.parseAsync(request[key]);
    } catch (error) {
      if (error instanceof ZodError) {
        throw ApiError.BadRequest('Ошибка валидации', error.issues.map(item => item.message));
      }
      throw error;
    }
  };
}

const validateBody = createValidate('body');
const validateQuery = createValidate('query');
const validateParams = createValidate('params');
const validateCookies = createValidate('cookies');

export { validateBody, validateQuery, validateParams, validateCookies }