import React from 'react';
import PlayingCardsList from './../utils/playingCardsList'
export default class Dashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            myPlayerId: this.props.myPlayerId,
            playerId: this.props.playerId,
            dashboard: this.props.dashboard
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