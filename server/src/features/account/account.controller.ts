import { RequestHandler } from 'express';
import { ApiError } from '../../shared/exceptions/api-error.js';
import { userService } from '../../entities/user/index.js';

const accountController = {
  getMyAccount: async (req, res, next) => {
    try {
      if (!req.user) {
        throw ApiError.UnauthorizedError();
      }
      const { id } = req.user;
      
      const user = await userService.getUserItemById({id});
      
      res.status(200).json({ item: user });
    } catch (e) {
      next(e);
    }
  },
  blockMyAccount: async (req, res, next) => {
    try {
      if (!req.user) {
        throw ApiError.UnauthorizedError();
      }
      const { id } = req.user;
      
      const user = await userService.blockUserById({id});
      
      res.status(200).json({ item: user });
    } catch (e) {
      next(e);
    }
  },
} satisfies Record<string, RequestHandler>

export { accountController };