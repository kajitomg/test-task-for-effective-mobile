import { Router } from 'express';
import { accountRoutes } from '../../features/account';
import { authRoutes } from '../../features/auth';
import { usersRoutes } from '../../features/users';
import { roleAccessMiddleware, statusAccessMiddleware } from '../../middlewares/access.middleware';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router()

router.use('/auth', authRoutes)
router.use('/users', authMiddleware, roleAccessMiddleware('ADMIN'), statusAccessMiddleware, usersRoutes)
router.use('/account', authMiddleware, accountRoutes)

export { router }