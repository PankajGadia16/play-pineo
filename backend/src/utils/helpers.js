import constants from './constants'

export default {

    createTimeStamp: function () {
        return {
            createdAt: Date.now()
        }
    },
    getRandomString: function () {
        return (Math.random().toString(36) + '0000000000').slice(2, constants.GAME_ID_LENGTH + 2).toUpperCase()
    },
    getFindParams(options = {}, defaultSortOn = 'createdAt') {
        let { sort = null, page = 1 } = options

        const limit = constants.PER_PAGE_SIZE
        const skip = (page - 1) * limit
        const sortBy = sort ? (sort[0] == '-' ? -1 : 1) : -1
        const sortOn = sort ? (sort[0] == '-' ? sort.slice(1) : sort) : defaultSortOn

        return {
            sort: { [sortOn]: sortBy },
            limit,
            skip
        }
    },
    getTeamIdFromPlayerId(playerId) {
        return ["player1", "player2"].includes(playerId) ? "teamA" : "teamB"
    },
    isValidBunch(cards) {
        let suit = null
        let rank = null
        for (let index = 0; index < cards.length; index++) {
            let card = cards[index]
            if (this.isJoker(card)) {
                if (rank != null) rank += 1
                continue
            }
            let cardRank = this.getCardRank(string)
            if (cardRank < 3 + index) {
                return false
            }
            if (suit == null) {
                suit = card[card.length - 1]
                rank = cardRank
                continue
            }
            if (suit != card[card.length - 1] || rank + 1 != cardRank) {
                return false
            }
            rank += 1
        }
        return !!suit
    },
    isJoker(card) {
        return card == "PINEO" || !!card.match(/^2/ig)
    },
    isValidTrio(cards) {
        for (let card of cards) {
            if (card == "PINEO") return false
            let cardRank = this.getCardRank(card)
            if (cardRank != 3 || cardRank != 14) {
                return false
            }
        }
        return true
    },
    getCardRank(cardString) {
        return parseInt(cardString.slice(0, cardString.length - 1))
    },
    getUpdatedBunch(oldBunch, entry) {
        let itemsToRemove = (entry.isJokerReplaced == true) ? 1 : 0
        let newBunch = [...oldBunch]
        const removedList = newBunch.splice(entry.cardIndex, itemsToRemove, entry.cardToInsert)
        return (itemsToRemove == 1 && removedList[0] != "PINEO") ? (entry.jokerShiftDirection == "left" ? removedList.concat(newBunch) : newBunch.concat(removedList)) : newBunch
    },
    prepareDeck() {
        const deck = ["PINEO", "PINEO", "PINEO", "PINEO", "PINEO", "PINEO"]
        for (let rank = 2; rank <= 14; rank++) {
            for (let suit of ["S", "H", "D", "C"]) {
                deck.push(rank.toString() + suit)
                deck.push(rank.toString() + suit)
            }
        }
        return deck
    },
    shuffleDeck(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * i);
            let temp = deck[i];
            deck[i] = deck[j];
            deck[j] = temp;
        }
        return deck
    },
    distributeCards(deck) {
        const inHandCards = [[], [], [], []]
        for (let index = 1; index <= 72; index++) {
            inHandCards[index % 4].push(deck.pop())
        }
        return { heap: deck, inHandCards }
    },
    calculateScores(game) {
        const teamACards = []
        const teamBCards = []

        const {
            teamA: {
                totalNoOfSets: teamASets = 0,
                TotalNoOfPureSets: teamAPureSets = 0,
                player1: {
                    inHandCards: player1Cards = [],
                    dashboard: {
                        bunches: player1Bunches = {}
                    } = {}
                } = {},
                player2: {
                    inHandCards: player2Cards = [],
                    dashboard: {
                        bunches: player2Bunches = {}
                    } = {}
                } = {}
            } = {},
            teamB: {
                totalNoOfSets: teamBSets = 0,
                TotalNoOfPureSets: teamBPureSets = 0,
                player3: {
                    inHandCards: player3Cards = [],
                    dashboard: {
                        bunches: player3Bunches = {}
                    } = {}
                } = {},
                player4: {
                    inHandCards: player4Cards = [],
                    dashboard: {
                        bunches: player4Bunches = {}
                    } = {}
                } = {}
            } = {}
        } = game || {}

        for (let bunchId in player1Bunches) {
            teamACards.concat(player1Bunches[bunchId])
        }
        for (let bunchId in player2Bunches) {
            teamACards.concat(player2Bunches[bunchId])
        }
        for (let bunchId in player3Bunches) {
            teamBCards.concat(player3Bunches[bunchId])
        }
        for (let bunchId in player4Bunches) {
            teamBCards.concat(player4Bunches[bunchId])
        }

        return {
            teamA: (15 * teamASets) + (5 * teamAPureSets) + totalScoreOFCards(teamACards) - totalScoreOFCards((player1Cards.concat(player2Cards))),
            teamB: (15 * teamBSets) + (5 * teamBPureSets) + totalScoreOFCards(teamBCards) - totalScoreOFCards((player3Cards.concat(player4Cards)))
        }
    },
    totalScoreOFCards(cards) {
        let score = 0
        for (let card of cards) {
            if (card == "PINEO") {
                score += 4
                continue
            }
            const rank = this.getCardRank(card)
            switch (rank) {
                case 2:
                    score += 2
                    break
                case 3:
                case 4:
                case 5:
                case 6:
                    score += 0.5
                    break
                case 7:
                case 8:
                case 9:
                case 10:
                case 11:
                case 12:
                case 13:
                    score += 1
                    break
                case 14:
                    score += 1.5
                    break
            }
        }
        return score
    },
    isSet(cards) {
        let faceCardCount = 0
        for (let card of cards) {
            faceCardCount += this.isJoker(card) ? 0 : 1
        }
        return faceCardCount >= 9

    },
    isPureSet(cards) {
        let faceCardCount = 0
        for (let card of cards) {
            faceCardCount += this.isJoker(card) ? 0 : 1
        }
        return faceCardCount == 12
    },
    getNextTurn(currentTurn) {
        const { teamId: currentTeamId, playerId: currentPlayerId } = currentTurn
        return {
            teamId: currentTeamId == "teamA" ? "teamB" : "teamA",
            playerId: (currentPlayerId == "player1" ? "player3" : (currentPlayerId == "player2" ? "player4" : (currentPlayerId == "player3" ? "player2" : "player1"))),
            position: "CARD_NOT_PICKED"

        }
    },
    sortCards(cards) {
        const sortedCards = []
        for (let card of cards) {
            if (this.getCardRank(card) == 2) sortedCards.push(card)
        }
        for (let card of cards) {
            if (card == "PINEO") sortedCards.push(card)
        }
        cards = cards.filter(card => !this.isJoker(card))
        const spadeCards = cards.filter(card => card[card.length - 1] == "S").sort((a, b) => getCardRank(a) - getCardRank(b))
        const heartsCards = cards.filter(card => card[card.length - 1] == "H").sort((a, b) => getCardRank(a) - getCardRank(b))
        const clubsCards = cards.filter(card => card[card.length - 1] == "C").sort((a, b) => getCardRank(a) - getCardRank(b))
        const diamondCards = cards.filter(card => card[card.length - 1] == "D").sort((a, b) => getCardRank(a) - getCardRank(b))
        return sortedCards.concat(spadeCards).concat(heartsCards).concat(clubsCards).concat(diamondCards)
    }
}