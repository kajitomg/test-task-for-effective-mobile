import { Router } from 'express';
import { accountController } from './account.controller';

const routes = Router();

routes.get('/', accountController.getMyAccount);

routes.patch('/block', accountController.blockMyAccount);

export { routes };