import socketIO from 'socket.io'
import server from './../index'
let io
export default {
    getIO: async function () {
        if (!io) {
            io = socketIO(server)
        }
        return io
    }
}