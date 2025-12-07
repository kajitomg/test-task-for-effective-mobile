import bcrypt from 'bcryptjs';
import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'vitest';
import { App } from '../../app.js';
import request from 'supertest';
import { prisma } from '../../database.js';
import { User } from '../../generated/zod/index.js';
import { generateTokens } from '../../shared/utils/jwt.js';

describe('/api/v1/account', () => {
  let setup: {
    app: ReturnType<typeof App>,
    user: User,
    accessToken: string,
  }
  
  beforeAll(async () => {
    const app = App()
    
    const user = await prisma.user.create({
      data: {
        first_name: 'testuser',
        email: 'testuser@gmail.com',
        password: await bcrypt.hash('userpass', 8),
      }
    })
    const tokens = generateTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    })
    
    await prisma.authToken.upsert({
      where: { id: user.id},
      update: {},
      create: {
        user_id: user.id,
        refresh: tokens.refreshToken
      }
    })
    setup = { app, user, accessToken: tokens.accessToken }
  })
  
  beforeEach(async () => {
    await prisma.user.update({
      where: { id: setup.user.id},
      data: {
        status: 'ACTIVE'
      }
    })
  })
  
  afterAll(async () => {
    await prisma.authToken.delete({
      where: { user_id: setup.user.id }
    })
    await prisma.user.delete({
      where: { id: setup.user.id }
    })
  })
  
  describe('Запрос данных своего аккаунта', () => {
    test('дано: GET-запрос с accessToken, ожидается: успешное(200) получение данных своего акканута.', async () => {
      const { app, user, accessToken } = setup;
      const { password,  ...safeUser } = user;
      
      const response = await request(app)
        .get('/api/v1/account/')
        .set('authorization', `Bearer ${accessToken}`)
      
      const expected = {
        ...safeUser,
        created_at: expect.any(String),
        updated_at: expect.any(String)
      }
      
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('item')
      expect(response.body.item).toEqual(expected)
    })
  })
  
  describe('Блокировка своего аккаунта', () => {
    test('дано: PATCH-запрос с accessToken, ожидается: успешное(200) блокировка своего аккаунта и получение его данных.', async () => {
      const { app, user, accessToken } = setup;
      const { password,  ...safeUser } = user;
      
      const response = await request(app)
        .patch('/api/v1/account/block')
        .set('authorization', `Bearer ${accessToken}`)
      
      const expected = {
        ...safeUser,
        status: 'BLOCKED',
        created_at: expect.any(String),
        updated_at: expect.any(String)
      }
      
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('item')
      expect(response.body.item).toEqual(expected)
    })
  })
})