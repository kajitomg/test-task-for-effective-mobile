import { RequestHandler } from 'express';
import { setRefreshCookie } from '../../utils/cookie';
import { validateBody, validateCookies } from '../../utils/validator';
import { refreshCookiesSchema, signinBodySchema, signupBodySchema } from './auth.schemas';
import { authService } from './auth.service';

const authController = {
  signup: async (req, res, next) => {
    try {
      const data = await validateBody(signupBodySchema, req);

      const result = await authService.signup(data);
      
      setRefreshCookie(res, result.refreshToken);
      
      res.status(200).json({
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (e) {
      console.log(e)
      next(e);
    }
  },
  signin: async (req, res, next) => {
    try {
      const data = await validateBody(signinBodySchema, req);
      
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
      const data = await validateCookies(refreshCookiesSchema, req);
      
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