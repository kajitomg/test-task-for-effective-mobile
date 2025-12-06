import { Router } from 'express';
import { v1, registry, bearerAuth, getOpenApiDocumentation } from './v1';

const router = Router();

router.use('/api/v1', v1);

export { router, registry, bearerAuth, getOpenApiDocumentation };