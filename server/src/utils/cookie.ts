import 'dotenv/config';
import { Response } from 'express';

const refreshAge = Number(process.env.JWT_REFRESH_AGE) || 30;
const mode = process.env.NODE_ENV || 'dev';

const setRefreshCookie = (res: Response, token: string) => {
  res.cookie('refreshToken', token, {
    maxAge: refreshAge * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: mode === 'production',
    sameSite: 'strict',
  });
};

export { setRefreshCookie };