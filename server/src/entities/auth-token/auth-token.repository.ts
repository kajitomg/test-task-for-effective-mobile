import { prisma } from '../../database.js';
import { PrismaClient } from '../../generated/prisma/client.js';

export type TransactionClient = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>;

type PrismaDatabase = PrismaClient | TransactionClient

const authTokenRepository = {
  saveToken: async (data: { user_id: string, refresh: string }, database: PrismaDatabase = prisma) => {
    return database.authToken.upsert({
      where: {
        user_id: data.user_id,
      },
      update: {
        refresh: data.refresh,
      },
      create: data
    });
  },
  findByUserId: async (user_id: string, database: PrismaDatabase = prisma) => {
    return database.authToken.findUnique({
      where: {
        user_id
      }
    })
  }
}

export { authTokenRepository };