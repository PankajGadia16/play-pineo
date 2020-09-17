import dbCLient from '../../connection/mongodb'
import constants from '../../utils/constants'
import exceptionHandler from './../../utils/exceptionHandler'
import helpers from '../../utils/helpers';

const GAMES_COLLECTION_NAME = constants.collectionNames.game;

export default {
    findOne: async function (filters) {
        const db = await dbCLient.getDb()
        return db.collection(GAMES_COLLECTION_NAME).findOne(filters)
    },
    find: async function (options = {}) {
        const db = await dbCLient.getDb()
        let { sort, limit, skip } = helpers.getFindParams(options);

        return db.collection(GAMES_COLLECTION_NAME)
            .find()
            .sort(sort)
            .limit(limit)
            .skip(skip)
            .toArray()
    },
    create: async function (entry) {
        const db = await dbCLient.getDb()
        const { name } = entry
        const entryToInsert = {
            gameId: helpers.getRandomString(),
            teamA: {
                player1: {
                    name,
                    cardsInHand: [],
                    dashboard: {
                        bunches: {
                        }
                    }
                },
                totalNoOfSets: 0,
                TotalNoOfPureSets: 0
            },
            teamB: {
                totalNoOfSets: 0,
                TotalNoOfPureSets: 0
            },
            centerHeap: [],
            centerStack: [],
            turn: {
                teamId: null,
                playerId: null,
                position: null
            },
            winner: null,
            scores: {
                teamA: null,
                teamB: null
            },
            state: "NOT_STARTED",
            endedBy: {
                teamId: null,
                playerId: null
            },
            dirtyCards: [],
            noOfActivePlayers: 1,
            ...helpers.createTimeStamp()
        }
        const { ops: [createdEntry] } = await db.collection(GAMES_COLLECTION_NAME).insertOne(entryToInsert, { returnOriginal: false }).catch(exceptionHandler.handleDbError)
        return createdEntry
    },
    updateOne: async function (game, fieldsToUpdate) {

        const db = await dbCLient.getDb()
        return await db.collection(GAMES_COLLECTION_NAME).updateOne(game, fieldsToUpdate)
    }
}