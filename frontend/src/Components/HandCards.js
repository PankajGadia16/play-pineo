import React from 'react';
import PlayingCardsList from './../utils/playingCardsList'
import helpers from './../utils/helpers'
import { Droppable, Draggable } from 'react-beautiful-dnd'

export default class HandCards extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            myPlayerId: this.props.myPlayerId,
            playerId: this.props.playerId,
            game: this.props.game,
            cards: []
        }
    }

    getCards = (game, playerId) => {
        const {
            teamA: {
                player1: {
                    cardsInHand: player1CardsInHand = []
                } = {},
                player2: {
                    cardsInHand: player2CardsInHand = []
                } = {}
            } = {},
            teamB: {
                player3: {
                    cardsInHand: player3CardsInHand = []
                } = {},
                player4: {
                    cardsInHand: player4CardsInHand = []
                } = {}
            } = {}
        } = game
        return eval(playerId + "CardsInHand")
    }
    componentDidMount() {
        const { game, playerId } = this.state
        this.setState({
            cards: this.getCards(game, playerId)
        })
    }
    UNSAFE_componentWillReceiveProps(nextProps) {

        const { playerId: statePlayerId, myPlayerId: stateMyPlayerId } = this.state
        const { playerId: nextPropsPlayerId, myPlayerId: nextPropsMyPlayerId } = nextProps
        if (statePlayerId == nextPropsPlayerId && stateMyPlayerId == nextPropsMyPlayerId) {
            this.setState({
                game: nextProps.games,
                cards: this.getCards(nextProps.game, nextProps.playerId)
            })
        }
    }


    stackStyle = (num, myPlayerId, playerId) => {

        return {
            'zIndex': num,
            "marginLeft": (myPlayerId == playerId) ? -68 : -77,
            "height": 120
        }
    }

    getSrc = (card, myPlayerId, playerId) => {
        return (myPlayerId == playerId) ? PlayingCardsList[card] : require('./../CardImages/back.svg')
    }

    getTransform = (playerId, myPlayerId) => {
        return (helpers.getTeamIdFromPlayerId(playerId) == helpers.getTeamIdFromPlayerId(myPlayerId)) ? "null" : "rotate(270deg)"
    }

    render() {
        let index = 0
        const { playerId, myPlayerId } = this.state
        return (
            <Droppable
                direction={"horizontal"}
                isDropDisabled={playerId != myPlayerId}
                droppableId={`handCards-${playerId}`}
            >
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        >
                        <div
                            style={{
                                display: "flex",
                                transform: this.getTransform(playerId, myPlayerId)
                            }}
                        >
                            {
                                this.state.cards.map((card, index2) => {
                                    return (
                                        <Draggable
                                            isDragDisabled={playerId != myPlayerId}
                                            draggableId={`${card}-${playerId}-${index2}`}
                                            index={index2}
                                        >
                                            {
                                                (draggableProvided) => (
                                                    <div
                                                        ref={draggableProvided.innerRef}
                                                        {...draggableProvided.draggableProps}
                                                        {...draggableProvided.dragHandleProps}
                                                    >

                                                        <img
                                                            style={this.stackStyle(index++, myPlayerId, playerId)}
                                                            className='Playing-card'
                                                            alt={card}
                                                            src={this.getSrc(card, myPlayerId, playerId)}
                                                        />
                                                    </div>)
                                            }

                                        </Draggable>
                                    )
                                })
                            }
                        </div>
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        )
    }
}