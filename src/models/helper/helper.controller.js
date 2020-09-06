import STATUS_CODES from '../../utils/statusCodes'

export default {
    getTime: async (req, res, next) => {
        console.log("Testing!!")
        return res.status(STATUS_CODES.OK).json({
            time: Date.now()
        });
    }
}
