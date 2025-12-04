import { RequestHandler } from 'express';
import { ApiError } from '../../exceptions/api-error';
import { accountService } from './account.service';

const accountController = {
  getMyAccount: async (req, res, next) => {
    try {
      if (!req.user) {
        throw ApiError.UnauthorizedError();
      }
      const { id } = req.user;
      
      const user = await accountService.getUserItemById({id});
      
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
      
      const user = await accountService.blockUserById({id});
      
      res.status(200).json({ item: user });
    } catch (e) {
      next(e);
    }
  },
} satisfies Record<string, RequestHandler>

export { accountController };