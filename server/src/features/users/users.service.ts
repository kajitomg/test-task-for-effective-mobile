import { userRepository } from '../../entities/user';
import { ApiError } from '../../shared/exceptions/api-error';
import { PaginationOptions } from '../../shared/utils/pagination';

const usersService = {
  getUsersList: async (options: PaginationOptions) => {
    const data = await userRepository.findList(options);
    
    if (!data) {
      throw ApiError.NotFoundError('Произошла ошибка при запросе списка пользователей!')
    }
    
    return data;
  },
}

export { usersService };