import { Router } from 'express';
import helperRouter from './helper/helper.routes'

const router = Router();
router.use('/helper', helperRouter)

export default router