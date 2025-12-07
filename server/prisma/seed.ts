import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { seedUsers } from './seeds/user.js';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
  await seedUsers(prisma)
}

main()
  .catch((e) => {
    console.error('Ошибка посева:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })