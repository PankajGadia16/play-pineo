import { Router } from 'express';
import controller from './game.controller'

const router = new Router();

router.route('/:gameId').get(controller.findOne)
router.route('/create').post(controller.create)
router.route('/join').post(controller.join)
router.route('/start').post(controller.start)
router.route('/:id/draw').get(controller.draw)
// router.route('/suspend').post(controller.suspend)

export default router
