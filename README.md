#Application to play Pineo


A -> [home page]
B -> A[0] -> [Create Game, Join game]
C -> B[0] -> [Name (You will be the first player for this game), {POST create new game}]
D -> B[1] -> [GameId, Name, {POST join game}]


Any any change made my any player. a socket will be emitted to all the 4 members of the game and actions will be taken


As soon as the 4th player joins the game a socket will be emitted that game is started. [with details of which player to play first]

During the game a player can:
    E -> [pick a card from centerHeap, pick 0-n cards from centerStack, place a card, open a bunch cards, update existing bunch (own or partners), merge bunches, show]


Terminology:

Card [rank, suit, pineo]
- rank = i % 13 + 2 [2-14]
- suit = i / 13 | 0 [0-3] ???
- pineo = (52 - i) / 4 [] ???
i = 0- ???



joker
- all pineo and all cards with rank 2

face card
- any card which is not joker is face card

Deck
- 110 cards

Dashboard
- each player has its own dashboard
- all the cards opened by the player will be added to the dashboard

Bunch
- each combined set of cards in dashboard in named as bunch
- bunch will contain either joker or same suit cards in order of rank.
- min size of bunch is 3
- max size is 12
- each bunch can have any number of jokers, but altest 1 face card should be present
- bunch with >=12 cards will make a SET only if no of face card>=9


- As an exception bunch have all cards with rank 3 or all cards with rank 14 (irrespective of suit)
- Merging of bunches:
    - same suit + maintaining order of rank (considering jokers as well) are capable of merging
    - Bx1x can merge only with Bx1x or Bx2x 


Dashboard D1 => (players 1 dashboard) [means D1-D3 are only valid dashboard ids]
[Bs10 , Bs11 , Bs1i.. ] + [Bh11, Bh12, Bh1i..] + B3
[Bs20 , Bs21 , Bs2i.. ] + [Bh21, Bh22, Bh2i..]
[Bd10, Bd11, Bd1i..] + [Bc11, Bc12, Bc1i..] + B14
[Bd20, Bd21, Bd2i..] + [Bc21, Bc22, Bc2i..]
[means B(s/h/d/c)(1/2)(0-9) & B3 & B14 are only valid bunch Ids]
/^B(((S|H|D|C)(1|2)\d)|(3|14))$/igm



game = {
    _id: ObjectId,
    gameId: "123456",
    teamA: {
        player1: {
            name: "",
            cardsInHand: [CARD],
            dashboard: {
                id: "D1",  // no need
                bunches: {
                    bhxx: [CARD],
                    bsxx: [CARD],
                    bdxx: [CARD],
                    bcxx: [CARD],
                    b3: CARD,
                    b14: CARD
                }
            }
        },
        player2: {
            name: "",
            cardsInHand: [],
            dashboard: {
                bunches: {
                    bxxx: []
                }
            }
        },
        totalNoOfSets: 1,
        TotalNoOfPureSets: 0
    },
    teamB: {
        player3: {
            name: "",
            cardsInHand: [],
            dashboard: {
                bunches: {
                    bxxx: []
                }
            }
        },
        player4: {
            name: "",
            cardsInHand: [],
            dashboard: {
                bunches: {
                    bxxx: []
                }
            }
        },
        totalNoOfSets: 1,
        TotalNoOfPureSets: 0
    },
    centerHeap: [CARD],
    centerStack: [CARD]
    turn: {
        teamId: "teamA",
        playerId: "player2",
        position: [cardPicked, cardNotPicked]
    },
    winner: "teamA",
    score: {
        teamA: 23,
        teamB: 12
    },
    state: [STOPPED, IN_PROGRESS, COMPLETED, NOT_STARTED, PAUSED],
    endedBy: {
        teamId: "teamA",
        playerId: "player1"
    },
    dirtyCards: [CARD],
    createdAt: epocTime
}
<!-- card = {
    rank: 1,
    suit: [0,1,2,3],
    pineo: true/false
} -->

card = /^((2|3|4|5|6|7|8|9|10|11|12|13|14)(S|H|D|C)|PINEO)$/ig