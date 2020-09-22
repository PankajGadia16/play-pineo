import { validateCreate, validateJoin, validateStart, validateDraw } from './game.validator'
import exceptionHandler from '../../utils/exceptionHandler'
import gameFacade from './game.facade';
import helpers from '../../utils/helpers';
import socketClient from './../../utils/socketClient'


export default {
    findOne: async function (gameId) {

        const game = await gameFacade.findOne({ gameId })
        if (game == null) {
            exceptionHandler.throwError("Invalid game id!")
        }
        return game;
    },
    create: async function (entry) {

        //validate
        const { error } = validateCreate(entry)
        if (error) exceptionHandler.throwError(error.details[0].message)

        const createdGame = await gameFacade.create(entry)
        await socketClient.emitByGame(createdGame)
        return createdGame
    },
    join: async function (entry) {

        //validate
        const { error } = validateJoin(entry)
        if (error) exceptionHandler.throwError(error.details[0].message)

        const game = await gameFacade.findOne({ gameId: entry.gameId, state: "NOT_STARTED", noOfActivePlayers: { $lt: 4 } })
        if (game == null) {
            exceptionHandler.throwError("Invalid Game id!")
        }
        const playerId = "player" + (game.noOfActivePlayers + 1).toString()
        const teamId = helpers.getTeamIdFromPlayerId(playerId)
        const fieldsToUpdate = {
            $set: {
                [teamId]: {
                    ...game[teamId],
                    [playerId]: {
                        name: entry.name,
                        cardsInHand: [],
                        dashboard: {
                            bunches: {
                            }
                        }
                    }
                },
                noOfActivePlayers: game.noOfActivePlayers + 1
            }
        }
        await gameFacade.updateOne(game, fieldsToUpdate)
        await socketClient.emitByGameId(entry.gameId)
        return {
            playerId
        }

    },
    start: async function (entry) {
        //validate
        const { error } = validateStart(entry)
        if (error) exceptionHandler.throwError(error.details[0].message)

        const game = await gameFacade.findOne({ gameId: entry.gameId, state: "NOT_STARTED" })

        if (game == null) {
            exceptionHandler.throwError("Invalid Game id!")
        }

        if (game.noOfActivePlayers != 4) {
            exceptionHandler.throwError("4 active players are necessary!")
        }

        const deck = game.centerHeap
        const shuffledDeck = helpers.shuffleDeck(deck)
        const { heap, inHandCards } = helpers.distributeCards(shuffledDeck)


        const centerStack = [heap.pop()]
        const fieldsToUpdate = {
            $set: {
                centerHeap: heap,
                centerStack,
                turn: {
                    teamId: "teamA",
                    playerId: "player1",
                    position: "CARD_NOT_PICKED"
                },
                state: "IN_PROGRESS",
                "teamA.player1.cardsInHand": helpers.sortCards(inHandCards[0]),
                "teamA.player2.cardsInHand": helpers.sortCards(inHandCards[2]),
                "teamB.player3.cardsInHand": helpers.sortCards(inHandCards[1]),
                "teamB.player4.cardsInHand": helpers.sortCards(inHandCards[3])
            }
        }
        await gameFacade.updateOne(game, fieldsToUpdate)
        await socketClient.emitByGameId(entry.gameId)

    },
    draw: async function (gameId) {
        const game = await gameFacade.findOne({ gameId, state: "IN_PROGRESS" })
        //validate
        const { error } = validateDraw(game)
        if (error) exceptionHandler.throwError(error)

        const scores = helpers.calculateScores(game)

        const fieldsToUpdate = {
            $set: {
                scores,
                state: "COMPLLETED",
                winner: "DRAWN"
            }
        }
        await gameFacade.updateOne({ gameId }, fieldsToUpdate)
        await socketClient.emitByGameId(entry.gameId)

    }
}