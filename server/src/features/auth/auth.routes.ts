import { Router } from 'express';
import { authController } from './auth.controller.js';

const routes = Router();

routes.post('/signup', authController.signup)
routes.post('/signin', authController.signin)
routes.get('/refresh', authController.refresh)

export { routes }