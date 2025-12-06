import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { User } from '../../generated/prisma/client';

const accessKey = process.env.JWT_ACCESS_KEY;
const accessAge = Number(process.env.JWT_ACCESS_AGE) || 24;
const refreshKey = process.env.JWT_REFRESH_KEY;
const refreshAge = Number(process.env.JWT_REFRESH_AGE) || 30;

if (!accessKey) {
  throw new Error('Access key не найден!');
}
if (!refreshKey) {
  throw new Error('Refresh key не найден!');
}

export interface TokenPayload extends Pick<User, 'id' | 'email' | 'role'> {};

const generateTokens = (payload: TokenPayload) => {
  const accessToken = jwt.sign(payload, accessKey, { expiresIn: `${accessAge}h` });
  const refreshToken = jwt.sign(payload, refreshKey, { expiresIn:`${refreshAge}d` });
  
  return {
    accessToken,
    refreshToken,
  }
}

const validateAccessToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, accessKey) as TokenPayload
  } catch (e) {
    return null;
  }
}
const validateRefreshToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, refreshKey) as TokenPayload
  } catch (e) {
    return null;
  }
}

export { generateTokens, validateAccessToken, validateRefreshToken };