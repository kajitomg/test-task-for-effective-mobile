import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../exceptions/api-error.js';

const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({message: err.message, errors: err.errors})
  }
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'Ошибка валидации данных',
      errors: [err]
    });
  }
  
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({
      message: 'Некорректный JSON формат',
      errors: []
    });
  }
  
  console.error('Unhandled Error:', err);
  return res.status(500).json({
    message: 'Непредвиденная ошибка сервера',
    errors: []
  });
}
export { errorMiddleware }