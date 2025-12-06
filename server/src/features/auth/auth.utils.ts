import { authTokenRepository } from '../../entities/auth-token';
import { generateTokens } from '../../shared/utils/jwt';
import { sanitizeUser } from '../../shared/utils/sanitize-user';

const issueTokens = async (user: any) => {
  const tokens = generateTokens({
    id: user.id,
    email: user.email,
    role: user.role,
  });
  
  await authTokenRepository.saveToken({
    user_id: user.id,
    refresh: tokens.refreshToken,
  });
  
  return {
    user: sanitizeUser(user),
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
};

export { issueTokens };