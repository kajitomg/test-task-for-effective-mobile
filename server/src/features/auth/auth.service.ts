import bcrypt from 'bcryptjs';
import { ApiError } from '../../exceptions/api-error';
import { authTokenRepository } from '../../repositories/auth-token.repository';
import { userRepository } from '../../repositories/user.repository';
import { validateRefreshToken } from '../../utils/jwt';
import { issueTokens } from './auth.utils';

const authService = {
  signup: async (data: { first_name: string, middle_name?: string, last_name?: string, email: string, password: string }) => {
    const { first_name, middle_name, last_name, email, password } = data;
    
    const candidate = await userRepository.findByEmail(email)
    if (candidate) {
      throw ApiError.ConflictError('Пользователь с данным email адресом уже существует!');
    }
    
    const hashedPassword = await bcrypt.hash(password, 8);
      
    const user = await userRepository.createUser({
      first_name,
      middle_name,
      last_name,
      email,
      password: hashedPassword,
    })
    
    return issueTokens(user);
  },
  signin: async (data: { email: string, password: string }) => {
    const { email, password } = data;
    
    const user = await userRepository.findByEmailWithCredentials(email);
    
    if (!user) {
      throw ApiError.UnauthorizedError('Неверный email адрес или пароль!');
    }
      
    const compare = await bcrypt.compare(password, user.password);
      
    if (!compare) {
      throw ApiError.UnauthorizedError('Неверный email адрес или пароль!');
    }
    
    return issueTokens(user);
  },
  refresh: async (data: { refreshToken: string }) => {
    const { refreshToken } = data;
    const payload = validateRefreshToken(refreshToken)
    
    if (!payload) {
      throw ApiError.ForbiddenError()
    }
    
    const storedToken = await authTokenRepository.findByUserId(payload.id);
    
    if (!storedToken || storedToken.refresh !== refreshToken) {
      throw ApiError.UnauthorizedError('Токен отозван!');
    }
      
    const user = await userRepository.findById(payload.id)
      
    if (!user) {
      throw ApiError.NotFoundError('Пользователь не найден!')
    }
    
    return issueTokens(user);
  }
}

export { authService }