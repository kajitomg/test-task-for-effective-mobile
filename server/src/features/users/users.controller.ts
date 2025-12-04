import { RequestHandler } from 'express';
import { ApiError } from '../../exceptions/api-error';
import { paginationQuerySchema } from '../../utils/pagination';
import { validateBody, validateQuery } from '../../utils/validator';
import { blockUserByIdSchema, getUserByIdSchema } from './users.schemas';
import { usersService } from './users.service';


const usersController = {
  getUserById: async (req, res, next) => {
    try {
      const data = await validateBody(getUserByIdSchema, req);
      
      const user = await usersService.getUserItemById(data);
      
      res.status(200).json({ item: user });
    } catch (e) {
      next(e);
    }
  },
  blockUserById: async (req, res, next) => {
    try {
      const data = await validateBody(blockUserByIdSchema, req);
      
      const user = await usersService.blockUserById(data);
      
      res.status(200).json({ item: user });
    } catch (e) {
      next(e);
    }
  },
  getUsersList: async (req, res, next) => {
    try {
      const options = await validateQuery(paginationQuerySchema, req);
      
      const result = await usersService.getUsersList(options);
      
      res.status(200).json({
        items: result.users,
        meta: result.meta
      });
    } catch (e) {
      next(e);
    }
  },
} satisfies Record<string, RequestHandler>

export { usersController };