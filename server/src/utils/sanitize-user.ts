import { UserCreateInput } from '../generated/prisma/models/User';

const sanitizeUser = (user: UserCreateInput): Omit<UserCreateInput, 'password'> => {
  const { password, ...safeUser } = user;
  return safeUser;
};

export { sanitizeUser };