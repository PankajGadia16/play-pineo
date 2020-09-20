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
            socket: io(constants.SERVER_HOST)
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


    render() {
        const {
            game: {
                noOfActivePlayers = null,
                state = null,
                turn = null,
            } = {},
            isActive,
            errroMessage,
            myPlayerId,
            gameId } = this.state


        const {
            bottomPlayerId,
            topPlayerId,
            leftPlayerId,
            rightPlayerId,
        } = this.getPlayerDetails(myPlayerId)

        return (
            <div style={{ backgroundColor: "red" }}>
                {
                    (isActive == false) ?
                        (errroMessage == null) ? <h4>Loading...</h4> : <h4>{errroMessage}</h4>
                        : <div style={{
                            "display": "flex",
                            "justify-content": "space-between",
                            "align-items": "center",
                            "flex-flow": "column nowrap",

                        }}>
                            <div style={{
                                "display": "flex",
                                "flex- flow": "row nowrap",
                                "justify-content": "space-between",
                                "align-items": "center",
                                "align-self": "center",
                                "order": 1
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
                                "flex- flow": "row nowrap",
                                "justify-content": "space-between",
                                "align-items": "center",
                                "order": 2
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
                                            <button
                                                onClick={this.onStartPlay}
                                            >Start the play</button> :
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
                                "flex- flow": "row nowrap",
                                "justify-content": "space-between",
                                "align-items": "center",
                                "align-self": "center",
                                "order": 3
                            }} >
                                <CardDropWindow
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
                                <ActionWindow
                                    game={this.state.game}
                                    myPlayerId={myPlayerId}
                                />
                            </div>
                        </div>
                }
            </div>
        )
    }
}