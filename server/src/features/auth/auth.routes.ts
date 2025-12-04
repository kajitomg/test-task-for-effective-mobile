import { Router } from 'express';
import { authController } from './auth.controller';

const routes = Router();

routes.post('/signup', authController.signup)
routes.post('/signin', authController.signin)
routes.post('/refresh', authController.refresh)

export { routes }