import { Router } from 'express';
import controller from './helper.controller'

const router = new Router();
router.route('/sample-api').get(controller.getTime)

export default router
