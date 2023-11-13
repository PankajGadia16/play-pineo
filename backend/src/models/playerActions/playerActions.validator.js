import Joi from 'joi'
import helpers from '../../utils/helpers';
import constants from './../../utils/constants'

export const validateGetStackCard = function (entry, game) {
    const schema = {
        count: Joi.number().min(1).required()
    }
    const { error = null } = Joi.validate(entry, schema)
    if (error || entry.count > game.centerStack.length) {
        return ((error && error.details[0].message) || "Invalid count!")
    }
    return null
}

export const validatePlaceCard = function (entry, game, playerId) {
    const schema = {
        card: Joi.string().regex(constants.CARD_REGEX).required()
    }
    const { error = null } = Joi.validate(entry, schema)
    const teamId = helpers.getTeamIdFromPlayerId(playerId)
    const cards = game[teamId][playerId].cardsInHand

    if (error || cards.length <= 1 || !cards.includes(entry.card)) {
        return ((error && error.details[0].message) || "Invalid card or No card available to place!")
    }
    return null
}

export const validateAddBunch = function (entry, game, playerId) {
    const schema = {
        cards: Joi.array().items(
            Joi.string()
        ).min(3).required()
    }

    const { error = null } = Joi.validate(entry, schema)
    if (error) return error.details[0].message

    const teamId = helpers.getTeamIdFromPlayerId(playerId)

    for (let card of entry.cards) {
        if (!game[teamId][playerId].cardsInHand.includes(card)) {
            return "Invalid card(s)!"
        }
    }

    if (helpers.isValidBunch(entry.cards) || helpers.isValidTrio(entry.cards)) { return null }
    return "Invalid sequence of cards!"
}
export const valiadteUpdateBunch = function (entry, game, playerId) {
    const schema = {
        bunchId: Joi.string().regex(BUNCH_ID_REGEX).required(),
        cardToInsert: Joi.string().regex(constants.CARD_REGEX).required(),
        cardIndex: Joi.number().min(0).required(),
        isJokerReplaced: Joi.boolean(),     // true in case of card replacing any type of joker
        jokerShiftDirection: Joi.string().values('left', 'right')   // applicable only when isJokerReplaced = true and joker is not pineo
        // cases
        // added joker on left or right
        //added face card on left or right
        // replace exisiting pineo by face card
        //replace existing non-pineo joker  by face card and move joker to left
        //replace existing non-pineo joker  by face card and move joker to right
    }
    const { error = null } = Joi.validate(entry, schema)
    if (error) return error.details[0].message

    const teamId = helpers.getTeamIdFromPlayerId(playerId)

    if (!game[teamId][playerId].cardsInHand.includes(cardToInsert)) {
        return "Invalid card!"
    }

    const bunchCards = game[teamId][playerId].dashboard.bunches[entry.bunchId]

    if (bunchCards == null || bunchCards.length <= 0) {
        return "Invalid sequence of cards!"
    }

    if (entry.cardIndex > bunchCards.length) {
        return "Invalid position to insert the card!"
    }
    const newBunch = helpers.getUpdatedBunch(bunchCards, entry)
    if (helpers.isValidBunch(newBunch) || helpers.isValidTrio(newBunch)) {
        return null
    }
    return "Bad request"
}
export const validateMergeBunch = function (entry, game, playerId) {
    const schema = {
        bundId1: Joi.string().regex(BUNCH_ID_REGEX).required(),
        bundId2: Joi.string().regex(BUNCH_ID_REGEX).required()
    }
    const { error = null } = Joi.validate(entry, schema)
    if (error) return error.details[0].message

    const teamId = helpers.getTeamIdFromPlayerId(playerId)
    const bunchCards1 = game[teamId][playerId].dashboard.bunches[entry.bunchId1]
    const bunchCards2 = game[teamId][playerId].dashboard.bunches[entry.bunchId2]
    const mergedBunch = bunchCards1.concat(bunchCards2)

    if (bunchCards1 == null || bunchCards2 == null) { return "Invalid Request!" }
    if (helpers.isValidBunch(mergedBunch) || helpers.isValidTrio(mergedBunch)) { return null }
    return "Requested sequences can't be merged!"
}

export const validateShow = function (entry, game, playerId) {
    const schema = {
        card: Joi.string().regex(constants.CARD_REGEX).required()
    }
    const { error = null } = Joi.validate(entry, schema)
    const teamId = helpers.getTeamIdFromPlayerId(playerId)
    if (error || !(game[teamId][playerId].cardsInHand.length == 1 && game[teamId].totalNoOfSets >= 1)) {
        return ((error && error.details[0].message) || "Can't show at this moment!")
    }
    return null
}