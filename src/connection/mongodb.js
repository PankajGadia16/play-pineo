import { MongoClient } from 'mongodb';
import constants from '../utils/constants'

let client
export default {
    getClient: async function () {
        // console.log("------Called getCLient function------")
        // console.log(`Client is ${client ? 'present' : 'absent, hence creating new connection!'}`)
        if (!client) {
            client = MongoClient.connect(constants.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        }
        return client
    },
    getDb: async function (dbName = constants.DATABASE_NAME) {
        // console.log("------Called getDb function------")
        const dbClient = await this.getClient()
        return dbClient.db(dbName)
    },
    isConnected: () => {
        return client ? client.isConnected() : false
    }
}