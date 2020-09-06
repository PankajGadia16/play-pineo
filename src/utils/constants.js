import 'dotenv/config';

export default {
    HOST: process.env.HOST || "http://localhost:4000/",
    BASE_MONGO_URL: process.env.BASE_MONGO_URL || 'mongodb://127.0.0.1:27017/',
    // BASE_MONGO_URL: "mongodb+srv://OYbRUBSiiB:EiplrmksGu@cluster0-6jaov.mongodb.net/test?retryWrites=true&w=majority",
    BASE_DATABASE: 'pineo',
    API_PORT: process.env.PORT || 4000,
    collectionNames: {
        game: "games"
    },
    JWT_PRIVATE_KEY: "random private key"
}
