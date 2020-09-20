import React from 'react';
import PlayingCardsList from '../utils/playingCardsList'
export default class CardDropWindow extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            myPlayerId: this.props.myPlayerId,
        }
    }
    render() {
        return (
            <div>
                {/* {this.state.myPlayerId} */}
            </div>
        )
    }
}