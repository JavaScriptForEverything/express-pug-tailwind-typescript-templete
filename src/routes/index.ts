import { Router } from 'express';
import { router as pageRouter } from './pageRoutes';

const router = Router()

router.use('/', pageRouter)


export default router