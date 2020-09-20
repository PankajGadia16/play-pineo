import React from 'react';
import PlayingCardsList from './../utils/playingCardsList'
export default class CenterStack extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            myPlayerId: this.props.myPlayerId,
            centerStack: [],
            game: this.props.game
        }
    }

    componentDidMount() {
        const { game: { centerStack = [] } = {} } = this.state
        this.setState({
            centerStack
        })
    }
    UNSAFE_componentWillReceiveProps(nextProps) {

        const { playerId: statePlayerId, myPlayerId: stateMyPlayerId } = this.state
        const { playerId: nextPropsPlayerId, myPlayerId: nextPropsMyPlayerId, game: { centerStack = [] } = {} } = nextProps
        if (statePlayerId == nextPropsPlayerId && stateMyPlayerId == nextPropsMyPlayerId) {
            this.setState({
                game: nextProps.games,
                centerStack
            })
        }
    }

    stackStyle = (num) => {

        return {
            'zIndex': num,
            "marginLeft": -72,
            "height": 120
        }
    }

    render() {
        let index = 0
        return (
            <div style={{
                display: "flex",
                margin: 120
            }}>
                {
                    this.state.centerStack.map(card => {
                        return (
                            <img
                                style={this.stackStyle(index++)}
                                className='Playing-card'
                                alt={card}
                                src={PlayingCardsList[card]}
                            />
                        )
                    })
                }
            </div>
        )
    }
}