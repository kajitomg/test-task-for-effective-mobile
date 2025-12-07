import { RequestHandler } from 'express';
import { setRefreshCookie } from '../../shared/utils/cookie.js';
import { validateBody, validateCookies } from '../../shared/utils/validator.js';
import { RefreshCookiesSchema, SigninBodySchema, SignupBodySchema } from './auth.schemas.js';
import { authService } from './auth.service.js';

const authController = {
  signup: async (req, res, next) => {
    try {
      const data = await validateBody(SignupBodySchema, req);

      const result = await authService.signup(data);
      
      setRefreshCookie(res, result.refreshToken);
      
      res.status(201).json({
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (e) {
      next(e);
    }
  },
  signin: async (req, res, next) => {
    try {
      const data = await validateBody(SigninBodySchema, req);
      
      const result = await authService.signin(data);
      
      setRefreshCookie(res, result.refreshToken);
      
      res.status(200).json({
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (e) {
      next(e);
    }
  },
  refresh: async (req, res, next) => {
    try {
      const data = await validateCookies(RefreshCookiesSchema, req);

      const result = await authService.refresh(data);
      
      setRefreshCookie(res, result.refreshToken);
      
      res.status(200).json({
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (e) {
      next(e);
    }
  }
} satisfies Record<string, RequestHandler>

export { authController }