import { RequestHandler } from 'express';
import { ApiError } from '../exceptions/api-error';
import { userRepository } from '../../entities/user';
import { validateAccessToken } from '../utils/jwt';

const authMiddleware: RequestHandler = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization?.startsWith('Bearer ')) {
      throw ApiError.UnauthorizedError('Токен не предоставлен!');
    }
    
    const accessToken = authorization.split(' ')[1];
    if (!accessToken) {
      throw ApiError.UnauthorizedError('Невалидный токен!');
    }
    
    const payload = validateAccessToken(accessToken);
    if (!payload) {
      throw ApiError.UnauthorizedError();
    }
    const user = await userRepository.findById(payload.id)
    
    if (!user) {
      throw ApiError.UnauthorizedError('Пользователь не найден!');
    }
    
    req.user = user;
    next()
  } catch (e) {
    next(e);
  }
}

export { authMiddleware };