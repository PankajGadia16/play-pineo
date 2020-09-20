import STATUS_CODES from '../../utils/statusCodes'
import service from './game.service'

export default {
    findOne: async (req, res, next) => {
        try {
            const { params: { gameId = null } = {} } = req
            return res.status(STATUS_CODES.OK).json(await service.findOne(gameId));
        }
        catch (err) {
            if (err.statusCode) {
                return res.status(err.statusCode).json({ message: err.message });
            }
            console.log(err)
            return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: err });;
        }
    },
    create: async (req, res, next) => {
        try {
            const { body } = req
            return res.status(STATUS_CODES.OK).json(await service.create(body));
        }
        catch (err) {
            if (err.statusCode) {
                return res.status(err.statusCode).json({ message: err.message });
            }
            console.log(err)
            return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: err });;
        }
    },
    join: async (req, res, next) => {
        try {
            const { body } = req
            return res.status(STATUS_CODES.OK).json(await service.join(body));
        }
        catch (err) {
            if (err.statusCode) {
                return res.status(err.statusCode).json({ message: err.message });
            }
            console.log(err)
            return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: err });;
        }
    },
    start: async (req, res, next) => {
        try {
            const { body } = req
            await service.start(body)
            return res.status(STATUS_CODES.OK).send();
        }
        catch (err) {
            if (err.statusCode) {
                return res.status(err.statusCode).json({ message: err.message });
            }
            console.log(err)
            return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: err });;
        }
    },
    draw: async (req, res, next) => {
        try {
            const { params: { id = null } = {} } = req
            await service.draw(id)
            return res.status(STATUS_CODES.OK).send();
        }
        catch (err) {
            if (err.statusCode) {
                return res.status(err.statusCode).json({ message: err.message });
            }
            console.log(err)
            return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: err });;
        }
    }
}
