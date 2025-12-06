import { apiReference } from '@scalar/express-api-reference';
import { Router } from 'express';
import { accountRoutes } from '../../features/account';
import { authRoutes } from '../../features/auth';
import { usersRoutes } from '../../features/users';
import { roleAccessMiddleware, statusAccessMiddleware } from '../../shared/middlewares/access.middleware';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';
import { getOpenApiDocumentation } from './docs';

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