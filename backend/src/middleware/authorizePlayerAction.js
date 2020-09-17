import constants from './../utils/constants'

export default async function (req, res, next) {
    const action = this.action
    const { params: { playerId = null } = {}, game: { state: stateOfGame = "STOPPED", turn: { playerId: playerToTurn = null, position: playerPosition = null } = {} } = {} } = req || {}
    if (playerId == null || !constants.VALID_PLAYER_IDS.includes(playerId)) {
        return res.status(401).send("Invalid Player!");
    }
    if (stateOfGame != "IN_PROGRESS") {
        return res.status(401).send("Game is not in progress!");
    }

    if (playerToTurn != playerId) {
        return res.status(400).send("Its not your turn!");
    }
    req.playerId = playerId
    switch (action) {

        case "pick-center-heap-card":
            if (playerPosition != "CARD_NOT_PICKED") {
                return res.status(401).send("You have already picked up the card!");
            }
            break
        case "pick-center-stack-card":
            if (playerPosition != "CARD_NOT_PICKED") {
                return res.status(401).send("You have already picked up the card!");
            }
            break
        case "place-card":
            if (playerPosition == "CARD_NOT_PICKED") {
                return res.status(401).send("Please pick a card!");
            }
            break
        case "add-bunch":
            if (playerPosition == "CARD_NOT_PICKED") {
                return res.status(401).send("Please pick a card!");
            }
            break
        case "update-bunch":
            if (playerPosition == "CARD_NOT_PICKED") {
                return res.status(401).send("Please pick a card!");
            }
            break
        case "merge-bunch":
            if (playerPosition == "CARD_NOT_PICKED") {
                return res.status(401).send("Please pick a card!");
            }
            break
        case "show":
            if (playerPosition == "CARD_NOT_PICKED") {
                return res.status(401).send("Please pick a card!");
            }
            break
        default:
            return next()
    }
    return next()
}