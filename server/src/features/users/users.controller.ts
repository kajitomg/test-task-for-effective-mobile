import { RequestHandler } from 'express';
import { blockUserByIdSchema, getUserByIdSchema, userService } from '../../entities/user';
import { PaginationQuerySchema } from '../../shared/utils/pagination';
import { validateParams, validateQuery } from '../../shared/utils/validator';
import { usersService } from './users.service';


const usersController = {
  getUserById: async (req, res, next) => {
    try {
      const data = await validateParams(getUserByIdSchema, req);
      
      const user = await userService.getUserItemById(data);
      
      res.status(200).json({ item: user });
    } catch (e) {
      next(e);
    }
  },
  blockUserById: async (req, res, next) => {
    try {
      const data = await validateParams(blockUserByIdSchema, req);
      
      const user = await userService.blockUserById(data);
      
      res.status(200).json({ item: user });
    } catch (e) {
      next(e);
    }
  },
  getUsersList: async (req, res, next) => {
    try {
      const options = await validateQuery(PaginationQuerySchema, req);
      
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