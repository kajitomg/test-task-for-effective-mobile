import { RequestHandler } from 'express';
import { BlockUserByIdSchema, GetUserByIdSchema, userService } from '../../entities/user/index.js';
import { PaginationQuerySchema } from '../../shared/utils/pagination.js';
import { validateParams, validateQuery } from '../../shared/utils/validator.js';
import { usersService } from './users.service.js';


const usersController = {
  getUserById: async (req, res, next) => {
    try {
      const data = await validateParams(GetUserByIdSchema, req);
      
      const user = await userService.getUserItemById(data);
      
      res.status(200).json({ item: user });
    } catch (e) {
      next(e);
    }
  },
  blockUserById: async (req, res, next) => {
    try {
      const data = await validateParams(BlockUserByIdSchema, req);
      
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
        list: result.users,
        meta: result.meta
      });
    } catch (e) {
      next(e);
    }
  },
} satisfies Record<string, RequestHandler>

export { usersController };