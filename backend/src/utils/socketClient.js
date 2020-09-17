import socket from '../connection/socket'
import gameFacade from '../models/game/game.facade';

export default {
    emitByGame: async (game) => {
        const io = await socket.getIO()
        io.emit('NOTIFICATION', game)
    },
    emitByGameId: async (gameId) => {
        const io = await socket.getIO()
        const game = await gameFacade.findOne({ gameId })
        io.emit('NOTIFICATION', game)
    }
}