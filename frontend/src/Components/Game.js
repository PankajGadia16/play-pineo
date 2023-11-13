import React, { useEffect, useState } from 'react';
import axios from 'axios';
import constants from '../utils/constants';
import Player from './Player';
import HandCards from './HandCards';
import Dashboard from './Dashboard';
import CenterStack from './CenterStack';
import CenterHeap from './CenterHeap';
import CardDropWindow from './CardDropWindow';
import ActionWindow from './ActionWindow';
import GameMessageBox from './GameMessageBox';
import io from 'socket.io-client';
import { DragDropContext } from 'react-beautiful-dnd';
import helpers from '../utils/helpers';
import { Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

const DEFAULT_ERROR_MESSAGE =
    'Something went wrong! please refresh or try again to join the game! ';

const Game = (props) => {
    // const {
    //     location: {
    //         state: { gameId = null, myPlayerId = null } = {},
    //     } = {},
    // } = props;

    const stateFromLocation = useLocation().state;

    const [isActive, setIsActive] = useState(false);
    const [errorMessage, setErrorMessage] = useState(DEFAULT_ERROR_MESSAGE);
    const [game, setGame] = useState(stateFromLocation.game || undefined);
    const [socket] = useState(io(constants.SERVER_HOST));
    const [cardDropWindowCards, setCardDropWindowCards] = useState([]);
    const [gameId] = useState(stateFromLocation.gameId || null);
    const [myPlayerId] = useState(stateFromLocation.myPlayerId || null);

    const getPlayerId = (myPlayerId, direction) => {

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



    const onStartPlay = () => {
        axios.post(`${constants.SERVER_HOST}/api/game/start`, { gameId })
            .then((response) => {
                if (response.status != 200) {
                    setIsActive(false)
                    setErrorMessage(`${response.message} \n ${DEFAULT_ERROR_MESSAGE}`)
                }
            })
            .catch(err => {
                setIsActive(false)
                setErrorMessage(`${err} \n ${DEFAULT_ERROR_MESSAGE}`)
            })
    }

    const getPlayerDetails = (myPlayerId) => {
        return {
            bottomPlayerId: getPlayerId(myPlayerId, "bottom"),
            topPlayerId: getPlayerId(myPlayerId, "top"),
            rightPlayerId: getPlayerId(myPlayerId, "right"),
            leftPlayerId: getPlayerId(myPlayerId, "left")
        }
    }

    const onDragEnd = result => {

        const { game: { turn: { playerId: turnPlayerId = null, position: turnPosition = null } = {} } = {}, myPlayerId, cardDropWindowCards } = this.state
        const { source: { index: sourceIndex, droppableId: sourceDroppableId = null } = {}, destination, draggableId = null } = result
        const { droppableId: destinationDroppableId = null, index: dropIndex } = destination || {}

        if (myPlayerId != turnPlayerId || turnPosition != "CARD_PICKED") return

        const cardMoved = draggableId.split("-")[0]
        const teamId = helpers.getTeamIdFromPlayerId(myPlayerId)
        const cardsInHand = Array.from(game[teamId][myPlayerId].cardsInHand)
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
                ...game,
                [teamId]: {
                    ...game[teamId],
                    [myPlayerId]: {
                        ...game[teamId][myPlayerId],
                        cardsInHand
                    }
                }
            },
            cardDropWindowCards: newCardDropWindowCards
        })

    }

    const loadGame = () => {
        
        axios
        .get(`${constants.SERVER_HOST}/api/game/${gameId}`)
        .then((response) => {
            if (response.status === 200) {
                setIsActive(true);
                setGame(response.data);
                setErrorMessage(null);
            } else {
                setErrorMessage(`${response.message} \n ${DEFAULT_ERROR_MESSAGE}`);
            }
        })
        .catch((err) => {
            setErrorMessage(`${err} \n ${DEFAULT_ERROR_MESSAGE}`);
        });
    }


    useEffect(() => {
        console.log("Game useEffect called")

        if (!game) {
            loadGame()
        } else {
            setIsActive(true);
        }

        socket.on('NOTIFICATION', (updatedGame) => {
            if (gameId === updatedGame.gameId) {
                setGame(updatedGame);
            }
        });

        

        return () => {
            socket.disconnect();
        };
    }, [gameId, game, socket]);

    const {
        noOfActivePlayers = null,
        state = null,
        turn: { teamId: turnTeamId = null, playerId: turnPlayerId = null, position: turnPosition = null } = {},
    } = game || {};
    console.log("noOfActivePlayers", noOfActivePlayers)
    const {
        bottomPlayerId,
        topPlayerId,
        leftPlayerId,
        rightPlayerId,
    } = getPlayerDetails(myPlayerId);


    return (
        <div>
            {!isActive ?
                (errorMessage == null) ? <h4>Loading...</h4> : <h4>{errorMessage}</h4>
                : (
                    <DragDropContext onDragEnd={onDragEnd}>
                        <div style={{
                            "display": "flex",
                            "justify-content": "space-between",
                            "align-items": "center",
                            "flex-flow": "column nowrap",

                        }}>
                            {/* <Button style={{ margin: 8 }} onClick={loadGame}>Refresh</Button> */}
                            <img
                                style={{ cursor: "pointer",marginBottom: 25 }}
                                onClick={loadGame}
                                height={25}
                                src={require('./../static/refresh.jpeg')}
                                alt={"refresh"}
                            />
                            <p style={{
                                "display": "flex",
                                "align-self": "center",
                            }}>
                                {(state == "IN_PROGRESS") ? `${game[turnTeamId][turnPlayerId].name}'s turn [ ${turnPosition.split("_").join(" ").toLowerCase()} ]` : null}
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
                                        game={game}
                                        playerId={topPlayerId}
                                    />
                                    <HandCards
                                        game={game}
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
                                    game={game}
                                    playerId={leftPlayerId}
                                />
                                <HandCards
                                    game={game}
                                    myPlayerId={myPlayerId}
                                    playerId={leftPlayerId}
                                />
                                <Dashboard
                                    game={game}
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
                                                onClick={onStartPlay}
                                            >Start the play</Button> :
                                            <GameMessageBox
                                                game={game}
                                            />)

                                        : <Dashboard
                                            myPlayerId={myPlayerId}
                                            playerId={topPlayerId}
                                            game={game}
                                        />}
                                    <div style={{
                                        "display": "flex",
                                        "flex-flow": "row nowrap",
                                        "justify-content": "space-between",
                                        "align-items": "center"
                                    }}>
                                        <CenterStack
                                            game={game}
                                            myPlayerId={myPlayerId}
                                        />
                                        <CenterHeap
                                            game={game}
                                            myPlayerId={myPlayerId}
                                        />
                                    </div>
                                    <Dashboard
                                        game={game}
                                        myPlayerId={myPlayerId}
                                        playerId={bottomPlayerId}
                                    />
                                </div>
                                <Dashboard
                                    game={game}
                                    myPlayerId={myPlayerId}
                                    playerId={rightPlayerId}
                                />
                                <HandCards
                                    game={game}
                                    myPlayerId={myPlayerId}
                                    playerId={rightPlayerId}
                                />
                                <Player
                                    myPlayerId={myPlayerId}
                                    game={game}
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
                                    game={game}
                                    myPlayerId={myPlayerId}
                                />
                                <div>
                                    <HandCards
                                        game={game}
                                        myPlayerId={myPlayerId}
                                        playerId={bottomPlayerId}
                                    />
                                    <Player
                                        myPlayerId={myPlayerId}
                                        game={game}
                                        playerId={bottomPlayerId}
                                    />

                                </div>
                                <CardDropWindow
                                    game={game}
                                    myPlayerId={myPlayerId}
                                    cardDropWindowCards={cardDropWindowCards}
                                />
                            </div>
                        </div>
                    </DragDropContext>
                )}
        </div>
    );
};

export default Game;
