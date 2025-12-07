import { apiReference } from '@scalar/express-api-reference';
import { Router } from 'express';
import { accountRoutes } from '../../features/account/index.js';
import { authRoutes } from '../../features/auth/index.js';
import { usersRoutes } from '../../features/users/index.js';
import { roleAccessMiddleware, statusAccessMiddleware } from '../../shared/middlewares/access.middleware.js';
import { authMiddleware } from '../../shared/middlewares/auth.middleware.js';
import { getOpenApiDocumentation } from './docs/index.js';

const router = Router();

router.use(
  '/docs',
  apiReference({
    content: getOpenApiDocumentation(),
  })
);
router.use('/auth', authRoutes);
router.use('/users', authMiddleware, roleAccessMiddleware('ADMIN'), statusAccessMiddleware, usersRoutes);
router.use('/account', authMiddleware, accountRoutes);

export { router };