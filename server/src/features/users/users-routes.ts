import { Router } from 'express';


const routes = Router();

routes.get('/');
routes.get('/:id');

routes.patch('/block');
routes.patch('/:id/block');

routes.get('/list');

export { routes };