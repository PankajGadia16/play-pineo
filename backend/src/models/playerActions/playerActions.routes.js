import { Router } from 'express';
import controller from './playerActions.controller'
import authenticateGame from './../../middleware/authenticateGame'
import authorizePlayerAction from './../../middleware/authorizePlayerAction'
const router = new Router();

router.route('/pick-center-heap-card').get(authenticateGame, authorizePlayerAction.bind({ action: "pick-center-heap-card" }), controller.getHeapCard)
router.route('/pick-center-stack-card/:count').get(authenticateGame, authorizePlayerAction.bind({ action: "pick-center-stack-card" }), controller.getStackCard)
router.route('/place-card').post(authenticateGame, authorizePlayerAction.bind({ action: "place-card" }), controller.placeCard)
router.route('/bunch')
    .post(authenticateGame, authorizePlayerAction.bind({ action: "add-bunch" }), controller.addBunch)
    .put(authenticateGame, authorizePlayerAction.bind({ action: "update-bunch" }), controller.updateBunch)
router.route('/merge-bunch').post(authenticateGame, authorizePlayerAction.bind({ action: "merge-bunch" }), controller.mergeBunch)
router.route('/show').post(authenticateGame, authorizePlayerAction.bind({ action: "show" }), controller.show)

export default router
