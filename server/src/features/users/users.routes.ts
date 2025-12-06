import { Router } from 'express';
import { usersController } from './users.controller';

const routes = Router();

routes.get('/', usersController.getUsersList);

routes.get('/:id', usersController.getUserById);

routes.patch('/:id/block', usersController.blockUserById);

export { routes };