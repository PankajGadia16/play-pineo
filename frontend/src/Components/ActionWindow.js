import React from 'react';
import axios from "axios";
import constants from '../utils/constants'
import Button from 'react-bootstrap/Button';
const DEFAULT_ERROR_MESSAGE = "Please try again!"
export default class ActionWindow extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            myPlayerId: this.props.myPlayerId,
            game: this.props.game,
            errroMessage: null
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {

        const { myPlayerId: stateMyPlayerId } = this.state
        const { myPlayerId: nextPropsMyPlayerId, game } = nextProps
        if (stateMyPlayerId == nextPropsMyPlayerId) {
            this.setState({
                game
            })
        }
    }

    pickCenterHeapCard = () => {
        const { myPlayerId, game: { gameId = null } = {} } = this.state
        axios.get(`${constants.SERVER_HOST}/api/player-actions/${gameId}/${myPlayerId}/pick-center-heap-card`)
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
    // pickCenterStackCards
    // placeCard
    // addBunch
    // updateBunch
    // merge bunch
    // show


    render() {
        const { errroMessage = null, game: { turn: { playerId: turnPlayerId, position = null } = {} } = {}, myPlayerId } = this.state
        return (

            <div>
                {(errroMessage != null) ? <h5> {errroMessage}</h5> : null}
                <Button
                    variant="primary"
                    onClick={this.pickCenterHeapCard}
                    disabled={turnPlayerId != myPlayerId || position != "CARD_NOT_PICKED"}
                >Pick a new card</Button>
                {this.state.myPlayerId}
            </div>
        )
    }
}