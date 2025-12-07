import { ApiError } from '../../shared/exceptions/api-error.js';
import { z } from '../../shared/utils/zod.js';
import { userRepository } from './user.repository.js';
import { BlockUserByIdSchema, GetUserByIdSchema } from './user.schema.js';

const userService = {
  getUserItemById: async (data: z.output<typeof GetUserByIdSchema>) => {
    const { id } = data;
    
    const user = await userRepository.findById(id)
    
    if (!user) {
      throw ApiError.NotFoundError('Пользователь с данным id не найден!')
    }
    
    return user;
  },
  blockUserById: async (data: z.output<typeof BlockUserByIdSchema>) => {
    const { id } = data;
    
    const user = await userRepository.setStatusById(id, 'BLOCKED');
    
    if (!user) {
      throw ApiError.NotFoundError('Произошла ошибка при блокировке пользователя!')
    }
    
    return user;
  },
}

export { userService };