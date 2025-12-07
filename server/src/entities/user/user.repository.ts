import { prisma } from '../../database.js';
import { PrismaClient, Status } from '../../generated/prisma/client.js';
import { UserCreateInput } from '../../generated/prisma/models/User.js';

import {
  defaultPaginationOptions,
  PaginationOptions,
  getPaginationParams,
  getPaginationMetadata,
} from '../../shared/utils/pagination.js';

export type TransactionClient = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>;

type PrismaDatabase<Client = PrismaClient | TransactionClient> = Client

type DatabaseOptions<Client = PrismaClient | TransactionClient> = {
  database: Client;
}

const userRepository = {
  createUser: async (data: Pick<UserCreateInput, 'email' | 'password' | 'first_name' | 'middle_name' | 'last_name'>, database: PrismaDatabase = prisma) => {
    return database.user.create({
      data,
      omit: {
        password: true,
      }
    })
  },
  findByIdWithCredentials: async (id: string, database: PrismaDatabase = prisma) => {
    return database.user.findUnique({
      where: {
        id,
      }
    })
  },
  findById: async (id: string, database: PrismaDatabase = prisma) => {
    return database.user.findUnique({
      where: {
        id,
      },
      omit: {
        password: true,
      }
    })
  },
  findByEmailWithCredentials: async (email: string, database: PrismaDatabase = prisma) => {
    return database.user.findUnique({
      where: {
        email,
      }
    })
  },
  findByEmail: async (email: string, database: PrismaDatabase = prisma) => {
    return database.user.findUnique({
      where: {
        email,
      },
      omit: {
        password: true,
      }
    })
  },
  setStatusById: async (id: string, status: Status, database: PrismaDatabase = prisma) => {
    return database.user.update({
      where: {
        id,
      },
      data: {
        status,
      },
      omit: {
        password: true,
      }
    })
  },
  findList: async (options?: Partial<PaginationOptions & DatabaseOptions>) => {
    const data = {
      ...defaultPaginationOptions,
      database: prisma,
      ...options,
    };
    const { database } = data;
    
    const { page, limit, skip } = getPaginationParams(data.page, data.limit);
    
    const countQuery = database.user.count({
      select: {
        _all: true,
      }
    })
    const usersQuery =  database?.user.findMany({
      skip,
      take: limit,
      omit: {
        password: true,
      }
    })
    
    const [count, users] = await Promise.all([countQuery, usersQuery]);
    
    return {
      users,
      meta: getPaginationMetadata(page, limit, count._all),
    }
  },
}

export { userRepository };