import bcrypt from 'bcryptjs';
import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'vitest';
import { z } from 'zod';
import { App } from '../../app.js';
import request from 'supertest';
import { prisma } from '../../database.js';
import { User } from '../../generated/zod/index.js';
import { SafeUserSchema } from '../../shared/schemas/base.schema.js';
import { generateTokens } from '../../shared/utils/jwt.js';

describe('/api/v1/auth', () => {
  let setup: {
    app: ReturnType<typeof App>,
    createUserData: {
      first_name: string,
      email: string,
      password: string,
    },
    userData: {
      email: string,
      password: string,
    },
    user: User,
    createdUsers: string[]
  }
  
  beforeAll(async () => {
    const app = App()
    const userData = {
      email: 'testuser1@gmail.com',
      password: 'userpass',
    }
    const createUserData = {
      first_name: 'testuser2',
      email: 'testuser2@gmail.com',
      password: 'userpass',
    }
    
    const user = await prisma.user.create({
      data: {
        first_name: 'testuser1',
        email: userData.email,
        password: await bcrypt.hash(userData.password, 8),
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
    
    setup = { createUserData, userData, app, user, createdUsers:[] };
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
    await prisma.authToken.deleteMany({
      where: { user_id: { in: [...setup.createdUsers, setup.user.id] }}
    })
    await prisma.user.deleteMany({
      where: { id:{ in: [...setup.createdUsers, setup.user.id] } }
    })
  })
  
  describe('Создание аккаунта', () => {
    test('дано: POST-запрос c first_name, email, password, ожидается: успешное(201) создание акканута, получаение его данных и accessToken, а так же refreshToken в cookies.', async () => {
      const { app, createUserData } = setup;
      
      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send(createUserData)
      
      
      const expected: z.infer<typeof SafeUserSchema> = {
        id: expect.any(String),
        role: 'USER',
        status: 'ACTIVE',
        email: createUserData.email,
        first_name: createUserData.first_name,
        middle_name: null,
        last_name: null,
        created_at: expect.any(String),
        updated_at: expect.any(String)
      }
      
      expect(response.status).toBe(201)
      setup.createdUsers.push(response.body.user.id)
      expect(response.body).toHaveProperty('user')
      expect(response.body).toHaveProperty('accessToken')
      expect(response.body.user).toEqual(expected)
    })
  })
  
  describe('Вход в свой аккаунт', () => {
    test('дано: POST-запрос с email и password, ожидается: успешная(200) авторизация в аккаунт и получение его данных и accessToken, а так же refreshToken в cookies.', async () => {
      const { app, user, userData } = setup;
      const { password,  ...safeUser } = user;
      
      const response = await request(app)
        .post('/api/v1/auth/signin')
        .send(userData)
      
      const expected = {
        ...safeUser,
        created_at: expect.any(String),
        updated_at: expect.any(String)
      }
      
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('user')
      expect(response.body).toHaveProperty('accessToken')
      expect(response.body.user).toEqual(expected)
    })
  })
  
  describe('Обновление accessToken своего аккаунт', () => {
    test('дано: GET-запрос с refreshToken в cookie, ожидается: успешная(200) авторизация в аккаунт и получение его данных и accessToken, а так же refreshToken в cookies.', async () => {
      const { app, user, userData } = setup;
      const { password,  ...safeUser } = user;
      
      const expected = {
        ...safeUser,
        created_at: expect.any(String),
        updated_at: expect.any(String)
      }
      
      const login = await request(app)
        .post('/api/v1/auth/signin')
        .send(userData);
      
      expect(login.status).toBe(200)
      expect(login.body).toHaveProperty('user')
      expect(login.body).toHaveProperty('accessToken')
      expect(login.body.user).toEqual(expected)
      
      const cookies = login.headers['set-cookie'];
      
      const response = await request(app)
        .get('/api/v1/auth/refresh')
        .set('Cookie', cookies)
      
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('user')
      expect(response.body).toHaveProperty('accessToken')
      expect(response.body.user).toEqual(expected)
    })
  })
})