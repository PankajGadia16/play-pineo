import React from 'react';
import PlayingCardsList from './../utils/playingCardsList'
export default class Player extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            myPlayerId: this.props.myPlayerId,
            playerId: this.props.playerId,
            name: null,
            game: this.props.game
        }
    }

    getName = (game, playerId) => {
        const {
            teamA: {
                player1: {
                    name: player1Name = null
                } = {},
                player2: {
                    name: player2Name = null
                } = {}
            } = {},
            teamB: {
                player3: {
                    name: player3Name = null
                } = {},
                player4: {
                    name: player4Name = null
                } = {}
            } = {}
        } = game
        return eval(playerId + "Name")
    }
    componentDidMount() {
        const { game, playerId } = this.state
        this.setState({
            name: this.getName(game, playerId)
        })
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        
        const { playerId: statePlayerId, myPlayerId: stateMyPlayerId } = this.state
        const { playerId: nextPropsPlayerId, myPlayerId: nextPropsMyPlayerId } = nextProps
        if (statePlayerId == nextPropsPlayerId && stateMyPlayerId == nextPropsMyPlayerId) {
            this.setState({
                game: nextProps.games,
                name: this.getName(nextProps.game, nextProps.playerId)
            })
        }
    }


    render() {
        const { name = null } = this.state
        return (
            <div style={{
                display: "flex",
                "flex-flow": "column nowrap"
            }}>
                {

                    (name != null) ?
                        <div>
                            <img
                                style={{
                                    display: "flex",
                                    "align-self": "center",
                                    height: 120
                                }}
                                className='Player'
                                alt={"payer-image"}
                                src={require("./../static/user.png")}
                            />
                            <h5 style={{ margin: 3 }}>{name}</h5>
                        </div>
                        : <img
                            style={{
                                display: "flex",
                                "align-self": "center",
                                height: 120
                            }}



                            alt={"no-player"}
                            src={require("./../static/questionMark.png")}
                        />}
                {}
            </div>
        )
    }
}
