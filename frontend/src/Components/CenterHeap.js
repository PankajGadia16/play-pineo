import React from 'react';
import PlayingCardsList from '../utils/playingCardsList'
export default class CenterHeap extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            myPlayerId: this.props.myPlayerId,
            centerHeap: [],
            game: this.props.game
        }
    }

    componentDidMount() {
        const { game: { centerHeap = [] } = {} } = this.state
        this.setState({
            centerHeap
        })
    }
    UNSAFE_componentWillReceiveProps(nextProps) {

        const { playerId: statePlayerId, myPlayerId: stateMyPlayerId } = this.state
        const { playerId: nextPropsPlayerId, myPlayerId: nextPropsMyPlayerId, game: { centerHeap = [] } = {} } = nextProps
        if (statePlayerId == nextPropsPlayerId && stateMyPlayerId == nextPropsMyPlayerId) {
            this.setState({
                game: nextProps.games,
                centerHeap
            })
        }
    }

    stackStyle = (num) => {

        return {
            'zIndex': num,
            "marginLeft": -85.8,
            "height": 120
        }
    }

    render() {
        let index = 0
        return (
            <div style={{
                display: "flex",
                margin: 10
            }}>

                {
                    this.state.centerHeap.map(card => {
                        return (
                            <img
                                style={this.stackStyle(index++)}
                                className='Playing-card'
                                alt={card}
                                src={require('./../CardImages/back.svg')}
                            />
                        )
                    })
                }
            </div>
        )
    }
}