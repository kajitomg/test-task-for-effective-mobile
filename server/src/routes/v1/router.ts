import { Router } from 'express';

const router = Router()

router.use('/auth')
router.use('/users')

export { router }