import React from 'react';
import axios from "axios";
import constants from '../utils/constants'
import Player from './Player'
import HandCards from './HandCards';
import Dashboard from './Dashboard';
import CenterStack from "./CenterStack"
import CenterHeap from './CenterHeap';
import CardDropWindow from './CardDropWindow'
import ActionWindow from './ActionWindow'
import GameMessageBox from './GameMessageBox'
import io from 'socket.io-client'
import { DragDropContext } from 'react-beautiful-dnd'
import helpers from '../utils/helpers';
import { Button } from 'react-bootstrap'

const DEFAULT_ERROR_MESSAGE = "Something went wrong! please refresh or try again to join the game! "
export default class Game extends React.Component {

    constructor(props) {
        super(props)
        const { location: { state: { gameId = null, myPlayerId = null } = {} } = {} } = props
        if (gameId == null || myPlayerId == null) {
            this.state = {
                isActive: false,
                errroMessage: DEFAULT_ERROR_MESSAGE
            }
        }

        this.state = {
            isActive: false,
            errroMessage: null,
            game: undefined,
            myPlayerId,
            gameId,
            socket: io(constants.SERVER_HOST),
            cardDropWindowCards: []
        }
    }

    getPlayerId = (myPlayerId, direction) => {

        if ((myPlayerId == "player1" && direction == "bottom") ||
            (myPlayerId == "player2" && direction == "top") ||
            (myPlayerId == "player3" && direction == "right") ||
            (myPlayerId == "player4" && direction == "left")
        ) {
            return "player1"
        }
        if ((myPlayerId == "player1" && direction == "top") ||
            (myPlayerId == "player2" && direction == "bottom") ||
            (myPlayerId == "player3" && direction == "left") ||
            (myPlayerId == "player4" && direction == "right")
        ) {
            return "player2"
        }
        if ((myPlayerId == "player1" && direction == "left") ||
            (myPlayerId == "player2" && direction == "right") ||
            (myPlayerId == "player3" && direction == "bottom") ||
            (myPlayerId == "player4" && direction == "top")
        ) {
            return "player3"
        }
        if ((myPlayerId == "player1" && direction == "right") ||
            (myPlayerId == "player2" && direction == "left") ||
            (myPlayerId == "player3" && direction == "top") ||
            (myPlayerId == "player4" && direction == "bottom")
        ) {
            return "player4"
        }
    }

    async componentDidMount() {
        const { game, gameId, socket } = this.state
        if (!game) {
            axios.get(`${constants.SERVER_HOST}/api/game/${gameId}`)
                .then((response) => {
                    if (response.status == 200) {
                        this.setState({
                            isActive: true,
                            game: response.data,
                            errroMessage: null
                        })
                    }
                    else {
                        this.setState({
                            errroMessage: `${response.message} \n ${DEFAULT_ERROR_MESSAGE}`
                        })
                    }
                })
                .catch(err => {
                    this.setState({
                        errroMessage: `${err} \n ${DEFAULT_ERROR_MESSAGE}`
                    })
                })
        }

        socket.on("NOTIFICATION", (updatedGame) => {
            if (gameId == updatedGame.gameId)
                this.setState({
                    game: updatedGame
                })
        })
    }

    onStartPlay = () => {
        axios.post(`${constants.SERVER_HOST}/api/game/start`, { gameId: this.state.gameId })
            .then((response) => {
                if (response.status != 200) {
                    this.setState({
                        isActive: false,
                        errroMessage: `${response.message} \n ${DEFAULT_ERROR_MESSAGE}`
                    })
                }
            })
            .catch(err => {
                this.setState({
                    isActive: false,
                    errroMessage: `${err} \n ${DEFAULT_ERROR_MESSAGE}`
                })
            })
    }

    getPlayerDetails = (myPlayerId) => {
        return {
            bottomPlayerId: this.getPlayerId(myPlayerId, "bottom"),
            topPlayerId: this.getPlayerId(myPlayerId, "top"),
            rightPlayerId: this.getPlayerId(myPlayerId, "right"),
            leftPlayerId: this.getPlayerId(myPlayerId, "left")
        }
    }

    onDragEnd = result => {

        const { game: { turn: { playerId: turnPlayerId = null, position: turnPosition = null } = {} } = {}, myPlayerId, cardDropWindowCards } = this.state
        const { source: { index: sourceIndex, droppableId: sourceDroppableId = null } = {}, destination, draggableId = null } = result
        const { droppableId: destinationDroppableId = null, index: dropIndex } = destination || {}

        if (myPlayerId != turnPlayerId || turnPosition != "CARD_PICKED") return

        const cardMoved = draggableId.split("-")[0]
        const teamId = helpers.getTeamIdFromPlayerId(myPlayerId)
        const cardsInHand = Array.from(this.state.game[teamId][myPlayerId].cardsInHand)
        const newCardDropWindowCards = Array.from(cardDropWindowCards)


        if (sourceDroppableId == `handCards-${myPlayerId}` && destinationDroppableId == "cardDropWindow") {
            cardsInHand.splice(sourceIndex, 1)
            newCardDropWindowCards.splice(dropIndex, 0, cardMoved)
        }
        else if (sourceDroppableId == "cardDropWindow" && destinationDroppableId == `handCards-${myPlayerId}`) {
            cardsInHand.splice(dropIndex, 0, cardMoved)
            newCardDropWindowCards.splice(sourceIndex, 1)
        }
        else if (sourceDroppableId == `cardDropWindow` && destinationDroppableId == "cardDropWindow") {
            newCardDropWindowCards.splice(sourceIndex, 1)
            newCardDropWindowCards.splice(dropIndex, 0, cardMoved)
        }
        else return

        this.setState({
            game: {
                ...this.state.game,
                [teamId]: {
                    ...this.state.game[teamId],
                    [myPlayerId]: {
                        ...this.state.game[teamId][myPlayerId],
                        cardsInHand
                    }
                }
            },
            cardDropWindowCards: newCardDropWindowCards
        })

    }

    render() {
        const {
            game: {
                noOfActivePlayers = null,
                state = null,
                turn: {
                    teamId: turnTeamId = null,
                    playerId: turnPlayerId = null,
                    position: turnPosition = null
                } = {},
            } = {},
            isActive,
            errroMessage,
            myPlayerId,
            cardDropWindowCards,
            gameId
        } = this.state


        const {
            bottomPlayerId,
            topPlayerId,
            leftPlayerId,
            rightPlayerId,
        } = this.getPlayerDetails(myPlayerId)

        return (
            <div >
                {
                    (isActive == false) ?
                        (errroMessage == null) ? <h4>Loading...</h4> : <h4>{errroMessage}</h4>
                        : <DragDropContext
                            onDragEnd={this.onDragEnd}>
                            <div style={{
                                "display": "flex",
                                "justify-content": "space-between",
                                "align-items": "center",
                                "flex-flow": "column nowrap",

                            }}>
                                <p style={{
                                    "display": "flex",
                                    "align-self": "center",
                                }}>
                                    {(state == "IN_PROGRESS") ? `${this.state.game[turnTeamId][turnPlayerId].name}'s turn [ ${turnPosition.split("_").join(" ").toLowerCase()} ]` : null}
                                </p>
                                <div style={{
                                    "display": "flex",
                                    "flex-flow": "row nowrap",
                                    "justify-content": "space-between",
                                    "align-items": "center",
                                    "align-self": "center",
                                    "order": 2
                                }} >
                                    <div >
                                        <Player
                                            myPlayerId={myPlayerId}
                                            game={this.state.game}
                                            playerId={topPlayerId}
                                        />
                                        <HandCards
                                            game={this.state.game}
                                            myPlayerId={myPlayerId}
                                            playerId={topPlayerId}
                                        />
                                    </div>
                                </div>
                                <div style={{
                                    "display": "flex",
                                    "flex-flow": "row nowrap",
                                    "justify-content": "space-between",
                                    "align-items": "center",
                                    "order": 3
                                }}>

                                    <Player
                                        myPlayerId={myPlayerId}
                                        game={this.state.game}
                                        playerId={leftPlayerId}
                                    />
                                    <HandCards
                                        game={this.state.game}
                                        myPlayerId={myPlayerId}
                                        playerId={leftPlayerId}
                                    />
                                    <Dashboard
                                        game={this.state.game}
                                        myPlayerId={myPlayerId}
                                        playerId={leftPlayerId}
                                    />
                                    <div style={{
                                        "display": "flex",
                                        "flex-flow": "column nowrap",
                                        "justify-content": "space-between",
                                        "align-items": "center"
                                    }}>
                                        {(state != "IN_PROGRESS") ?
                                            ((noOfActivePlayers == 4) ?
                                                <Button
                                                    onClick={this.onStartPlay}
                                                >Start the play</Button> :
                                                <GameMessageBox
                                                    game={this.state.game}
                                                />)

                                            : <Dashboard
                                                myPlayerId={myPlayerId}
                                                playerId={topPlayerId}
                                                game={this.state.game}
                                            />}
                                        <div style={{
                                            "display": "flex",
                                            "flex-flow": "row nowrap",
                                            "justify-content": "space-between",
                                            "align-items": "center"
                                        }}>
                                            <CenterStack
                                                game={this.state.game}
                                                myPlayerId={myPlayerId}
                                            />
                                            <CenterHeap
                                                game={this.state.game}
                                                myPlayerId={myPlayerId}
                                            />
                                        </div>
                                        <Dashboard
                                            game={this.state.game}
                                            myPlayerId={myPlayerId}
                                            playerId={bottomPlayerId}
                                        />
                                    </div>
                                    <Dashboard
                                        game={this.state.game}
                                        myPlayerId={myPlayerId}
                                        playerId={rightPlayerId}
                                    />
                                    <HandCards
                                        game={this.state.game}
                                        myPlayerId={myPlayerId}
                                        playerId={rightPlayerId}
                                    />
                                    <Player
                                        myPlayerId={myPlayerId}
                                        game={this.state.game}
                                        playerId={rightPlayerId}
                                    />
                                </div>
                                <div style={{
                                    "display": "flex",
                                    "flex-flow": "row nowrap",
                                    "justify-content": "space-between",
                                    "align-items": "center",
                                    "align-self": "center",
                                    "order": 4
                                }} >
                                    <ActionWindow
                                        game={this.state.game}
                                        myPlayerId={myPlayerId}
                                    />
                                    <div>
                                        <HandCards
                                            game={this.state.game}
                                            myPlayerId={myPlayerId}
                                            playerId={bottomPlayerId}
                                        />
                                        <Player
                                            myPlayerId={myPlayerId}
                                            game={this.state.game}
                                            playerId={bottomPlayerId}
                                        />

                                    </div>
                                    <CardDropWindow
                                        game={this.state.game}
                                        myPlayerId={myPlayerId}
                                        cardDropWindowCards={cardDropWindowCards}
                                    />
                                </div>
                            </div>
                        </DragDropContext>
                }
            </div>
        )
    }
}