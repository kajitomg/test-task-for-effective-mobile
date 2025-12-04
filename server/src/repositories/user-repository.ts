import { prisma } from '../database';
import { PrismaClient } from '../generated/prisma/client';

type TransactionClient = Parameters<
  Parameters<PrismaClient['$transaction']>[0]
>[0]

type PrismaDatabase = PrismaClient | TransactionClient

const userRepository = {
  createUser: async (data: {
      first_name: string,
      middle_name?: string,
      last_name?: string,
      email: string,
      password: string
    }, database: PrismaDatabase = prisma) => {
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
  }
}

export { userRepository };