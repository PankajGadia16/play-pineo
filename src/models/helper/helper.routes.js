import { Router } from 'express';
import controller from './helper.controller'

const router = new Router();
router.route('/time').get(controller.getTime)

export default router
