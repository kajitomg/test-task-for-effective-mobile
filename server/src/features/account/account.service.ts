import { ApiError } from '../../exceptions/api-error';
import { userRepository } from '../../repositories/user.repository';

const accountService = {
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
}

export { accountService };