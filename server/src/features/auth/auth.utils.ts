import { authTokenRepository } from '../../repositories/auth-token.repository';
import { generateTokens } from '../../utils/jwt';
import { sanitizeUser } from '../../utils/sanitize-user';

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