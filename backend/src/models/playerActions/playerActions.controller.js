import STATUS_CODES from '../../utils/statusCodes'
import service from './playerActions.service'

export default {

    getHeapCard: async (req, res, next) => {
        try {
            const { game } = req
            return res.status(STATUS_CODES.OK).json(await service.getHeapCard(game));
        }
        catch (err) {
            if (err.statusCode) {
                return res.status(err.statusCode).json({ message: err.message });
            }
            console.log(err)
            return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: err });;
        }
    },
    getStackCard: async (req, res, next) => {
        try {
            const { params: { count = null } = {}, game, playerId } = req
            return res.status(STATUS_CODES.OK).json(await service.getStackCard({ count }, game, playerId));
        }
        catch (err) {
            if (err.statusCode) {
                return res.status(err.statusCode).json({ message: err.message });
            }
            console.log(err)
            return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: err });;
        }
    },
    placeCard: async (req, res, next) => {
        try {
            const { body, game, playerId } = req
            await service.placeCard(body, game, playerId)
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
    addBunch: async (req, res, next) => {
        try {
            const { body, game, playerId } = req
            return res.status(STATUS_CODES.OK).json(await service.addBunch(body, game, playerId));
        }
        catch (err) {
            if (err.statusCode) {
                return res.status(err.statusCode).json({ message: err.message });
            }
            console.log(err)
            return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: err });;
        }
    },
    updateBunch: async (req, res, next) => {
        try {
            const { body, game, playerId } = req
            return res.status(STATUS_CODES.OK).json(await service.updateBunch(body, game, playerId));
        }
        catch (err) {
            if (err.statusCode) {
                return res.status(err.statusCode).json({ message: err.message });
            }
            console.log(err)
            return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: err });;
        }
    },
    mergeBunch: async (req, res, next) => {
        try {
            const { body, game, playerId } = req
            return res.status(STATUS_CODES.OK).json(await service.mergeBunch(body, game, playerId));
        }
        catch (err) {
            if (err.statusCode) {
                return res.status(err.statusCode).json({ message: err.message });
            }
            console.log(err)
            return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: err });;
        }
    },
    show: async (req, res, next) => {
        try {
            const { body, game, playerId } = req
            return res.status(STATUS_CODES.OK).json(await service.show(body, game, playerId));
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
