import { validateGetStackCard, validatePlaceCard, validateAddBunch, valiadteUpdateBunch, validateMergeBunch, validateShow } from './playerActions.validator'
import exceptionHandler from '../../utils/exceptionHandler'
import gameFacade from './../game/game.facade'
import helpers from "./../../utils/helpers"
import bunchActions from './bunch.actions'
import socketClient from './../../utils/socketClient'

export default {
    getHeapCard: async function (game, playerId) {
        const card = game.centerHeap.pop()
        const teamId = helpers.getTeamIdFromPlayerId(playerId)

        let cardsInHand = game[teamId][playerId].cardsInHand
        cardsInHand.push(card)

        const fieldsToUpdate = {
            $set: {
                centerHeap: game.centerHeap,
                "turn.position": "CARD_PICKED",
                [teamId + "." + playerId + ".cardsInHand"]: helpers.sortCards(cardsInHand)
            }
        }
        await gameFacade.updateOne(game, fieldsToUpdate)
        await socketClient.emitByGame(game)
        return { card }
    },
    getStackCard: async function (entry, game, playerId) {

        //validate
        const error = validateGetStackCard(entry, game)
        if (error) exceptionHandler.throwError(error)

        const teamId = helpers.getTeamIdFromPlayerId(playerId)
        const cards = (Array.from(Array(entry.count))).reduce((cards, x) => cards.concat([game.centerStack.pop()]), [])
        let cardsInHand = game[teamId + "." + playerId + ".cardsInHand"]
        cardsInHand = cardsInHand.concat(cards)

        const fieldsToUpdate = {
            $set: {
                centerStack: game.centerStack,
                "turn.position": "CARD_PICKED",
                [teamId + "." + playerId + ".cardsInHand"]: helpers.sortCards(cardsInHand)
            }
        }
        await gameFacade.updateOne(game, fieldsToUpdate)
        await socketClient.emitByGame(game)
        return { cards }
    },
    placeCard: async function (entry, game, playerId) {

        //validate
        const error = validatePlaceCard(entry, game, playerId)
        if (error) exceptionHandler.throwError(error)

        const teamId = helpers.getTeamIdFromPlayerId(playerId)
        let cardsInHand = game[teamId + "." + playerId + ".cardsInHand"]
        cardsInHand.splice(cardsInHand.indexOf(entry.card), 1)

        let fieldsToUpdate = {
            $set: {
                [teamId + "." + playerId + ".cardsInHand"]: cardsInHand,
                turn: helpers.getNextTurn(game.turn)
            }
        }

        if (helpers.isJoker(entry.card)) {
            fieldsToUpdate = {
                ...fieldsToUpdate,
                $set: {
                    ...fieldsToUpdate.set || {},
                    centerStack: []
                },
                $push: {
                    ...fieldsToUpdate.$push || {},
                    dirtyCards: {
                        $each: game.centerStack.concat([entry.card])
                    }
                }
            }
        } else {
            fieldsToUpdate = {
                ...fieldsToUpdate,
                $push: {
                    ...fieldsToUpdate.$push || {},
                    centerStack: entry.card
                }
            }
        }
        await gameFacade.updateOne(game, fieldsToUpdate)
        await socketClient.emitByGame(game)
    },
    addBunch: async function (entry, game, playerId) {

        //validate
        const error = validateAddBunch(entry, game, playerId)
        if (error) exceptionHandler.throwError(error)

        const newBunches = bunchActions.modifyBunch(entry.cards, game, playerId)
        const teamId = helpers.getTeamIdFromPlayerId(playerId)
        const cardsInHand = game[teamId][playerId].cardsInHand
        for (let card in entry.cards) {
            cardsInHand.splice(cardsInHand.indexOf(card), 1)
        }
        let noOfSets = game[teamId + ".totalNoOfSets"]
        let noOfPureSets = game[teamId + ".TotalNoOfPureSets"]
        if (helpers.isSet(entry.cards)) {
            noOfSets += 1
            if (helpers.isPureSet(entry.cards)) {
                noOfPureSets += 1
            }
        }

        const fieldsToUpdate = {
            $set: {
                [teamId + "." + playerId + ".dashboard.bunches"]: newBunches,
                [teamId + "." + playerId + ".cardsInHand"]: helpers.sortCards(cardsInHand),
                [teamId + ".totalNoOfSets"]: noOfSets,
                [teamId + ".TotalNoOfPureSets"]: noOfPureSets
            }
        }

        await gameFacade.updateOne(game, fieldsToUpdate)
        await socketClient.emitByGame(game)
    },
    updateBunch: async function (entry, game, playerId) {

        //validate
        const error = valiadteUpdateBunch(entry, game, playerId)
        if (error) exceptionHandler.throwError(error)


        const teamId = helpers.getTeamIdFromPlayerId(playerId)
        const oldBunch = game[teamId][playerId].dashboard.bunches[entry.bunchId]
        const newBunch = helpers.getUpdatedBunch(oldBunch, entry)
        const cardsInHand = game[teamId][playerId].cardsInHand
        cardsInHand.splice(cardsInHand.indexOf(entry.cardToInsert), 1)
        if (oldBunch.length == newBunch.length) {
            cardsInHand.push("PINEO")
        }

        let noOfSets = game[teamId + ".totalNoOfSets"]
        let noOfPureSets = game[teamId + ".TotalNoOfPureSets"]

        if (!helpers.isSet(oldBunch) && helpers.isSet(newBunch)) {
            noOfSets += 1
            if (helpers.isPureSet(newBunch)) {
                noOfPureSets += 1
            }
        }

        const fieldsToUpdate = {
            $set: {
                [teamId + "." + playerId + ".dashboard.bunches." + entry.bunchId]: newBunch,
                [teamId + "." + playerId + ".cardsInHand"]: helpers.sortCards(cardsInHand),
                [teamId + ".totalNoOfSets"]: noOfSets,
                [teamId + ".TotalNoOfPureSets"]: noOfPureSets
            }
        }

        await gameFacade.updateOne(game, fieldsToUpdate)
        await socketClient.emitByGame(game)
    },
    mergeBunch: async function (entry, game, playerId) {

        //validate
        const error = validateMergeBunch(entry, game, playerId)
        if (error) exceptionHandler.throwError(error)

        const teamId = helpers.getTeamIdFromPlayerId(playerId)
        const bunchCards1 = game[teamId][playerId].dashboard.bunches[entry.bunchId1]
        const bunchCards2 = game[teamId][playerId].dashboard.bunches[entry.bunchId2]
        const mergedBunch = bunchCards1.concat(bunchCards2)

        let noOfSets = game[teamId + ".totalNoOfSets"]
        let noOfPureSets = game[teamId + ".TotalNoOfPureSets"]

        if (helpers.isSet(mergedBunch)) {
            noOfSets += 1
            if (helpers.isPureSet(mergedBunch)) {
                noOfPureSets += 1
            }
        }

        const fieldsToUpdate = {
            $set: {
                [teamId + "." + playerId + ".dashboard.bunches." + entry.bunchId1]: mergedBunch,
                [teamId + ".totalNoOfSets"]: noOfSets,
                [teamId + ".TotalNoOfPureSets"]: noOfPureSets
            },
            $unset: {
                [teamId + "." + playerId + ".dashboard.bunches." + entry.bunchId2]: ""
            }
        }

        await gameFacade.updateOne(game, fieldsToUpdate)
        await socketClient.emitByGame(game)
    },
    show: async function (entry, game, playerId) {

        //validate
        const error = validateShow(entry, game, playerId)
        if (error) exceptionHandler.throwError(error)

        const scores = helpers.calculateScores(game)

        const teamId = helpers.getTeamIdFromPlayerId(playerId)
        const fieldsToUpdate = {
            $set: {
                [teamId + "." + playerId + ".cardsInHand"]: [],
                scores,
                state: "COMPLETED",
                "ended_by.teamId": teamId,
                "ended_by.player_id": playerId,
                winner: (scores.teamA == scores.teamB) ? "TIE" : (scores.teamA > scores.teamB ? "team   A" : "teamB")
            },
            $push: {
                centerStack: entry.card
            }
        }

        await gameFacade.updateOne(game, fieldsToUpdate)
        await socketClient.emitByGame(game)
    }
}