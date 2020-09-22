import { Router } from 'express';
import gameRouter from './game/game.routes'
import playerActionsRouter from './playerActions/playerActions.routes'

const router = Router();
router.use('/game', gameRouter)
router.use('/player-actions', playerActionsRouter)

export default router