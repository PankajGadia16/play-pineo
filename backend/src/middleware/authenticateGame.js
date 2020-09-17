import gameFacade from './../models/game/game.facade'
import constants from '../utils/constants';

export default async function (req, res, next) {

    const { params: { gameId = null } = {} } = req || {}

    if (gameId == null || gameId.length != constants.GAME_ID_LENGTH) {
        return res.status(401).send("Invalid gameId");
    }
    const game = await gameFacade.findOne({ gameId })
    if (!game) {
        return res.status(401).send("Invalid gameId");
    }
    req.game = game
    next()
}