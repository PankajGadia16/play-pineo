import dbCLient from '../../connection/mongodb'
import constants from '../../utils/constants'
import helpers from "../../utils/helpers";

const GAMES_COLLECTION_NAME = constants.collectionNames.game;



export default {

    find: async function (options = {}) {
        const db = await dbCLient.getDb()
        let { sort, limit, skip } = helpers.getFindParams(options);

        return db.collection(GAMES_COLLECTION_NAME)
            .find()
            .sort(sort)
            .limit(limit)
            .skip(skip)
            .toArray()
    }
}
