import bcrypt from 'bcryptjs';
import { authTokenRepository } from '../../entities/auth-token/index.js';
import { userRepository } from '../../entities/user/index.js';
import { ApiError } from '../../shared/exceptions/api-error.js';
import { validateRefreshToken } from '../../shared/utils/jwt.js';
import { z } from '../../shared/utils/zod.js';
import { RefreshCookiesSchema, SigninBodySchema, SignupBodySchema } from './auth.schemas.js';
import { issueTokens } from './auth.utils.js';

const authService = {
  signup: async (data: z.infer<typeof SignupBodySchema>) => {
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
  signin: async (data: z.infer<typeof SigninBodySchema>) => {
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
  refresh: async (data: z.infer<typeof RefreshCookiesSchema>) => {
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