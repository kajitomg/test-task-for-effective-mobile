import bcrypt from 'bcryptjs';
import { PrismaClient } from '../../src/generated/prisma/client';

async function seedUsers(prisma: PrismaClient){
  console.log('Seeding users...')
  
  const user = await prisma.user.upsert({
    where: { email: 'user@gmail.com'},
    update: {},
    create: {
      first_name: 'user',
      email: 'user@gmail.com',
      password: await bcrypt.hash('userpass', 8),
    }
  })
  
  const admin = await prisma.user.upsert({
    where: { email: 'users@gmail.com'},
    update: {},
    create: {
      first_name: 'admin',
      email: 'users@gmail.com',
      password: await bcrypt.hash('adminpass', 8),
      role: 'ADMIN'
    },
  })
  
  console.log('Created users:', {
    user: user.email,
    admin: admin.email,
  })
}

export { seedUsers }