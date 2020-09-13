import 'dotenv/config';

export default {
    HOST: process.env.HOST || "http://localhost:4000/",
    BACKEND_API_PORT: process.env.BACKEND_API_PORT || 4000,
    collectionNames: {
        game: "games"
    },
    PER_PAGE_SIZE: 10,
    JWT_PRIVATE_KEY: "random private key",
    MONGO_URL: process.env.MONGO_URL || "mongodb://127.0.0.1:27017/",
    DATABASE_NAME: "pineo"
}
