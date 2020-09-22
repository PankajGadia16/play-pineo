import React from 'react';
import PlayingCardsList from '../utils/playingCardsList'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import axios from "axios";
import constants from '../utils/constants'
import { Button } from 'react-bootstrap'
const DEFAULT_ERROR_MESSAGE = "Please try again!"
export default class CardDropWindow extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            myPlayerId: this.props.myPlayerId,
            cards: this.props.cardDropWindowCards,
            game: this.props.game
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {

        const { myPlayerId: stateMyPlayerId } = this.state
        const { cardDropWindowCards: nextPropsCards, myPlayerId: nextPropsMyPlayerId, game } = nextProps
        if (stateMyPlayerId == nextPropsMyPlayerId) {
            this.setState({
                cards: nextPropsCards,
                game
            })
        }
    }


    openBunch = () => {
        const { myPlayerId, cards = [], game: { gameId } = {} } = this.state
        axios.post(`${constants.SERVER_HOST}/api/player-actions/${gameId}/${myPlayerId}/bunch`, { cards })
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
    render() {
        const { errroMessage = null } = this.state
        return (
            <div>
                {(errroMessage != null) ? <h5> {errroMessage}</h5> : null}
                <Droppable
                    direction={"horizontal"}
                    droppableId={`cardDropWindow`}
                >
                    {(provided) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            style={{ display: "flex", flexDirection: "column", minWidth: 400, minHeight: 150, backgroundColor: "gray", border: "1px solid lightgray", borderRadius: 4 }}
                        >
                            <div style={{ display: "flex", order: 1, flexDirection: "row" }}>
                                {
                                    this.state.cards.map((card, index) => {
                                        return (
                                            <Draggable
                                                draggableId={`${card}-${index}`}
                                                index={index}
                                            >
                                                {
                                                    (draggableProvided) => (
                                                        <div
                                                            ref={draggableProvided.innerRef}
                                                            {...draggableProvided.draggableProps}
                                                            {...draggableProvided.dragHandleProps}
                                                        >

                                                            <img
                                                                style={{
                                                                    margin: "7px",
                                                                    height: 120
                                                                }}
                                                                className='Playing-card'
                                                                alt={card}
                                                                src={PlayingCardsList[card]}
                                                            />
                                                        </div>)
                                                }

                                            </Draggable>
                                        )
                                    })
                                }
                            </div>
                            {/* {provided.placeholder} */}
                            {(this.state.cards.length > 0) ?
                                <Button
                                    disabled={this.state.cards.length < 3}
                                    onClick={this.openBunch}
                                    style={{ order: 2, textAlign: "center" }}
                                > Open</Button> : null}
                        </div>
                    )}
                </Droppable>
            </div>
        )
    }
}