import { ApiError } from '../../shared/exceptions/api-error';
import { userRepository } from './user.repository';
import { blockUserByIdSchema, getUserByIdSchema } from './user.schema';
import { z } from 'zod';

const userService = {
  getUserItemById: async (data: z.output<typeof getUserByIdSchema>) => {
    const { id } = data;
    
    const user = userRepository.findById(id)
    
    if (!user) {
      throw ApiError.NotFoundError('Пользователь с данным id не найден!')
    }
    
    return user;
  },
  blockUserById: async (data: z.output<typeof blockUserByIdSchema>) => {
    const { id } = data;
    
    const user = await userRepository.setStatusById(id, 'BLOCKED');
    
    if (!user) {
      throw ApiError.NotFoundError('Произошла ошибка при блокировке пользователя!')
    }
    
    return user;
  },
}

export { userService };