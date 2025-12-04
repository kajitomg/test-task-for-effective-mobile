import { RequestHandler } from 'express';
import { ApiError } from '../exceptions/api-error';
import { Role, Status } from '../generated/prisma/enums';

const statusAccessMiddleware: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      throw ApiError.UnauthorizedError();
    }
    
    if (req.user.status !== Status.ACTIVE) {
      throw ApiError.ForbiddenError('Пользователь заблокирован');
    }
    next();
  } catch (e) {
    next(e)
  }
}

const roleAccessMiddleware = (...role: Role[]): RequestHandler => async (req, res, next) => {
  try {
    if (!req.user) {
      throw ApiError.UnauthorizedError();
    }
    
    if (!role.includes(req.user.role)) {
      throw ApiError.ForbiddenError();
    }
    next();
  } catch (e) {
    next(e)
  }
}

export { roleAccessMiddleware, statusAccessMiddleware };