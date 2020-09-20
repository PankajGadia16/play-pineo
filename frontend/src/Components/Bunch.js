import React from 'react';
import PlayingCardsList from './../utils/playingCardsList'
export default class Bunch extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            myPlayerId: this.props.myPlayerId,
            playerId: this.props.playerId,
            cards: this.props.cards,
            style: this.props.style
        }
    }
    render() {
        return (
            <div>
                {this.state.myPlayerId}
            </div>
        )
    }
}