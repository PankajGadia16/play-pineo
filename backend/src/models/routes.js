import { Router } from 'express';
import gameRouter from './game/game.routes'
import playerActionsRouter from './playerActions/playerActions.routes'

const router = Router();
router.use('/game', gameRouter)
router.use('/:gameId/player-actions/:playerId', playerActionsRouter)

export default router