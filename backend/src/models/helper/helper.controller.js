import STATUS_CODES from '../../utils/statusCodes'
import service from './helper.service'

export default {
    getTime: async (req, res, next) => {
        try {
            const { query = {} } = req
            return res.status(STATUS_CODES.OK).json(await service.find(query));
        }
        catch (err) {
            if (err.statusCode) {
                return res.status(err.statusCode).json({ message: err.message });
            }
            console.log(err)
            slackClient.sendMessage(err);
            return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: err });;
        }
    }
}
