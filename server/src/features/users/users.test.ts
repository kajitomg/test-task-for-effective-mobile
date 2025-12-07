import bcrypt from 'bcryptjs';
import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'vitest';
import { App } from '../../app.js';
import request from 'supertest';
import { prisma } from '../../database.js';
import { User } from '../../generated/zod/index.js';
import { generateTokens } from '../../shared/utils/jwt.js';

describe('/api/v1/users', () => {
  let setup: {
    app: ReturnType<typeof App>,
    user: User,
    admin: User,
    adminAccessToken: string,
    userAccessToken: string,
  }
  
  beforeAll(async () => {
    const app = App()
    
    const user = await prisma.user.create({
      data: {
        first_name: 'testuser3',
        email: 'testuser3@gmail.com',
        password: await bcrypt.hash('userpass', 8),
      }
    })
    const userTokens = generateTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    })
    
    await prisma.authToken.upsert({
      where: { id: user.id},
      update: {},
      create: {
        user_id: user.id,
        refresh: userTokens.refreshToken
      }
    })
    
    const admin = await prisma.user.create({
      data: {
        first_name: 'testadmin',
        email: 'testadmin@gmail.com',
        password: await bcrypt.hash('adminpass', 8),
        role: 'ADMIN'
      }
    })
    const adminTokens = generateTokens({
      id: admin.id,
      email: admin.email,
      role: admin.role,
    })
    
    await prisma.authToken.upsert({
      where: { id: admin.id},
      update: {},
      create: {
        user_id: admin.id,
        refresh: adminTokens.refreshToken
      }
    })
    
    setup = { app, user, admin, adminAccessToken: adminTokens.accessToken, userAccessToken: userTokens.accessToken }
  })
  
  beforeEach(async () => {
    await prisma.user.updateMany({
      where: { id: {in: [setup.user.id, setup.admin.id]}},
      data: {
        status: 'ACTIVE'
      }
    })
  })
  
  afterAll(async () => {
    await prisma.authToken.deleteMany({
      where: { user_id: {in: [setup.user.id, setup.admin.id]}}
    })
    await prisma.user.deleteMany({
      where: { id: {in: [setup.user.id, setup.admin.id]} }
    })
  })
  
  describe('Запрос данных аккаунта по id используя аккаунт role=ADMIN', () => {
    test('дано: GET-запрос с id, ожидается: успешное(200) получение данных акканута.', async () => {
      const { app, user, adminAccessToken } = setup;
      const { password,  ...safeUser } = user;
      
      const response = await request(app)
        .get(`/api/v1/users/${user.id}`)
        .set('authorization', `Bearer ${adminAccessToken}`)
      
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
  
  describe('Запрос данных аккаунта по id используя аккаунт role=USER', () => {
    test('дано: GET-запрос с id, ожидается: неуспешное(403) получение данных акканута.', async () => {
      const { app, user, userAccessToken } = setup;
      
      const response = await request(app)
        .get(`/api/v1/users/${user.id}`)
        .set('authorization', `Bearer ${userAccessToken}`)
      
      expect(response.status).toBe(403)
    })
  })
  
  describe('Блокировка аккаунта по id используя аккаунт role=ADMIN', () => {
    test('дано: PATCH-запрос с id, ожидается: успешная(200) блокировка аккаунта и получение его данных.', async () => {
      const { app, user, adminAccessToken } = setup;
      const { password,  ...safeUser } = user;
      
      const response = await request(app)
        .patch(`/api/v1/users/${user.id}/block`)
        .set('authorization', `Bearer ${adminAccessToken}`)
      
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
  
  describe('Блокировка аккаунта по id используя аккаунт role=USER', () => {
    test('дано: PATCH-запрос с id, ожидается: неуспешная(403) блокировка аккаунта и получение его данных.', async () => {
      const { app, user, userAccessToken } = setup;
      
      const response = await request(app)
        .patch(`/api/v1/users/${user.id}/block`)
        .set('authorization', `Bearer ${userAccessToken}`)
      
      expect(response.status).toBe(403)
    })
  })
  
  describe('Запрос списка всех пользователей используя аккаунт role=ADMIN', () => {
    test('дано: GET-запрос, ожидается: успешное(200) получение списка аккаунтов с их данными.', async () => {
      const { app, adminAccessToken } = setup;
      
      const response = await request(app)
        .get(`/api/v1/users/`)
        .set('authorization', `Bearer ${adminAccessToken}`)
      
      const metaExpected = {
        page: 1,
        limit: 20,
        total: expect.any(Number),
        totalPages: expect.any(Number),
      }
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('list')
      expect(response.body).toHaveProperty('meta')
      expect(response.body.meta).toEqual(metaExpected)
    })
  })
  
  describe('Запрос списка всех пользователей используя аккаунт role=USER', () => {
    test('дано: GET-запрос, ожидается: неуспешное(403) получение списка аккаунтов с их данными.', async () => {
      const { app, userAccessToken } = setup;
      
      const response = await request(app)
        .get(`/api/v1/users/`)
        .set('authorization', `Bearer ${userAccessToken}`)
      
      expect(response.status).toBe(403)
    })
  })
  
  describe('Запрос списка всех пользователей используя аккаунт role=ADMIN', () => {
    test('дано: GET-запрос c page = 1 limit = 1, ожидается: успешное(200) получение списка аккаунтов с их данными.', async () => {
      const { app, adminAccessToken } = setup;
      
      const response = await request(app)
        .get(`/api/v1/users/`)
        .query({page: 1, limit: 1})
        .set('authorization', `Bearer ${adminAccessToken}`)
      
      const metaExpected = {
        page: 1,
        limit: 1,
        total: expect.any(Number),
        totalPages: expect.any(Number),
      }
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('list')
      expect(response.body.list.length).toEqual(1)
      expect(response.body).toHaveProperty('meta')
      expect(response.body.meta).toEqual(metaExpected)
    })
  })
  
  describe('Запрос списка всех пользователей используя аккаунт role=ADMIN', () => {
    test('дано: GET-запрос c page = 1 limit = 2, ожидается: успешное(200) получение списка аккаунтов с их данными.', async () => {
      const { app, adminAccessToken } = setup;
      
      const response = await request(app)
        .get(`/api/v1/users/`)
        .query({page: 1, limit: 2})
        .set('authorization', `Bearer ${adminAccessToken}`)
      
      const metaExpected = {
        page: 1,
        limit: 2,
        total: expect.any(Number),
        totalPages: expect.any(Number),
      }
      
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('list')
      expect(response.body.list.length).toEqual(2)
      expect(response.body).toHaveProperty('meta')
      expect(response.body.meta).toEqual(metaExpected)
    })
  })
  
  describe('Запрос списка всех пользователей используя аккаунт role=ADMIN', () => {
    test('дано: GET-запрос c page = 2 limit = 1, ожидается: успешное(200) получение списка аккаунтов с их данными.', async () => {
      const { app, adminAccessToken } = setup;
      
      const response = await request(app)
        .get(`/api/v1/users/`)
        .query({page: 2, limit: 1})
        .set('authorization', `Bearer ${adminAccessToken}`)
      
      const metaExpected = {
        page: 2,
        limit: 1,
        total: expect.any(Number),
        totalPages: expect.any(Number),
      }
      
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('list')
      expect(response.body.list.length).toEqual(1)
      expect(response.body).toHaveProperty('meta')
      expect(response.body.meta).toEqual(metaExpected)
    })
  })
})