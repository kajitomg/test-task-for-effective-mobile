import { ApiError } from '../../exceptions/api-error';
import { userRepository } from '../../repositories/user.repository';
import { PaginationOptions } from '../../utils/pagination';

const usersService = {
  getUserItemById: async (data: { id: string }) => {
    const { id } = data;
    
    const user = userRepository.findById(id)
    
    if (!user) {
      throw ApiError.NotFoundError('Пользователь с данным id не найден!')
    }
    
    return user;
  },
  blockUserById: async (data: { id: string }) => {
    const { id } = data;
    
    const user = await userRepository.setStatusById(id, 'BLOCKED');
    
    if (!user) {
      throw ApiError.NotFoundError('Произошла ошибка при блокировке пользователя!')
    }
    
    return user;
  },
  getUsersList: async (options: PaginationOptions) => {
    const data = await userRepository.findList(options);
    
    if (!data) {
      throw ApiError.NotFoundError('Произошла ошибка при запросе списка пользователей!')
    }
    
    return data;
  },
}

export { usersService };