import 'dotenv/config';

export default {
    HOST: process.env.HOST || "http://localhost:4000/",
    BACKEND_API_PORT: process.env.BACKEND_API_PORT || 4000,
    collectionNames: {
        game: "games"
    },
    PER_PAGE_SIZE: 10,
    JWT_PRIVATE_KEY: "random private key",
    MONGO_URL: process.env.MONGO_URL || "mongodb+srv://pankaj:gadia@my-free-cluster.fukpejr.mongodb.net/?retryWrites=true&w=majority",
    DATABASE_NAME: "play-pineo",
    VALID_PLAYER_IDS: ["player1", "player2", "player3", "player4"],
    CARD_REGEX: /^((2|3|4|5|6|7|8|9|10|11|12|13|14)(S|H|D|C)|PINEO)$/im,
    RANK_REGEX: /^(2|3|4|5|6|7|8|9|10|11|12|13|14)/igm,
    BUNCH_ID_REGEX: /^B(((S|H|D|C)(1|2)\d)|(3|14))$/igm,
    GAME_ID_LENGTH: 6
}