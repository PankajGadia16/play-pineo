import constants from './constants'
import { ObjectId } from 'mongodb'

export default {


    updateTimeStamp: function () {
        return {
            updatedAt: Date.now()
        }
    },
    getRandomString: function () {
        return (Math.random().toString(36) + '0000000000').slice(2, 10 + 2)
    },
    isValidMongoId(id) {
        return ObjectId.isValid(id)
    },
    getFindParams(options = {}, defaultSortOn = 'createdAt') {
        let { sort = null, page = 1 } = options

        const limit = constants.PER_PAGE_SIZE
        const skip = (page - 1) * limit
        const sortBy = sort ? (sort[0] == '-' ? -1 : 1) : -1
        const sortOn = sort ? (sort[0] == '-' ? sort.slice(1) : sort) : defaultSortOn

        return {
            sort: { [sortOn]: sortBy },
            limit,
            skip
        }
    }
}
