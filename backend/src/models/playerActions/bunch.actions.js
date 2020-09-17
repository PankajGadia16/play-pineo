import helpers from "../../utils/helpers";
import exceptionHandler from "../../utils/exceptionHandler";

export default {
    modifyBunch: async function (cards, game, playerId) {
        if (cards[0][0] + cards[1][0] == "33") return "B3"
        if (cards[0][1] + cards[1][1] == "44") return "B14"

        const teamId = helpers.getTeamIdFromPlayerId(playerId)
        const { [teamId]: { [playerId]: { dashboard: { bunches = {} } = {} } = {} } = {} } = game

        const suit = cards.reduce((suit, card) => helpers.isJoker(card) ? suit : card[card.length - 1], "")

        const row1Bunches = []
        const row2Bunches = []
        for (let bunch of Object.keys(bunches).sort()) {
            if (bunch[1] == suit && bunch[2] == 1) row1Bunches.push(bunches[bunch])
            if (bunch[1] == suit && bunch[2] == 2) row2Bunches.push(bunches[bunch])
        }

        if (row1Bunches.length == 0) return "B" + suit + "11"

        const { possible, bunchList } = this.matchBunch(cards, row1Bunches)
        if (possible == true) {
            return this.prepareBunches(bunches, bunchList, suit + "1")
        } else {
            const { possible: possible2, bunchList: bunchList2 } = this.matchBunch(cards, row2Bunches)
            if (possible2 == true) {
                return this.prepareBunches(bunches, bunchList2, suit + "2")
            } else {
                exceptionHandler.throwError("Something went wrong identifying sequences of cards!", 500)
            }
        }
    },
    matchBunch: async function (cards, bunches) {

        for (let i = 0; i <= bunches.length; i++) {

            let newBunches = [...bunches]
            newBunches.splice(i, 0, cards)
            if (this.isValidBunchList(newBunches))
                return { possible: true, bunchList: newBunches }
        }
        return { possible: false }
    },
    isValidBunchList: async function (bunches) {
        let rank = 0
        for (let bunch of bunches) {
            for (let card of bunch) {
                if (helpers.isJoker(card)) {
                    rank += 1
                } else {
                    const cardRank = helpers.getCardRank(card)
                    if (rank >= cardRank) return false
                    rank = cardRank
                }
            }
        }
        return true
    },
    prepareBunches: async function (originalBunches, bunchesList, type) {
        const bunches = {
            ...originalBunches,
        }
        for (let i = 0; i < 9; i++) {
            delete bunches["B" + type + i.toString()]
        }
        for (let i = 0; i < bunchesList.length; i++) {
            bunches["B" + type + (i + 1).toString()] = bunchesList[i]
        }
        return bunches
    },

    matchBunch: async function (cards, bunches) {

        for (let i = 0; i <= bunches.length; i++) {

            let newBunches = [...bunches]
            newBunches.splice(i, 0, cards)
            if (isValidBunchList(newBunches))
                return { possible: true, bunchList: newBunches }
        }
        return { possible: false }
    }
}