import React from 'react';
import PlayingCardsList from './../utils/playingCardsList'
import copy from "copy-to-clipboard";

export default class Bunch extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            game: this.props.game
        }
    }

    Copytext = () => {
        copy(this.state.game.gameId)
    }
    render() {
        const { game: {
            gameId,
            state = null
        } = {} } = this.state
        return (
            <div>
                {(state == "NOT_STARTED") ?
                    <div style={{
                        display: "flex",
                        "flex-flow": "column nowrap",
                        "alignContent": "center",
                    }}>
                        <p
                            style={{
                                margin: 0,
                                marginTop: 25
                            }}
                        >Share this code to add more people!</p>
                        <div style={{
                            display: "flex",
                            flexFlow: "row nowrap",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <h3 style={{
                                margin: 0,
                                marginBottom: 25
                            }}>{gameId}</h3>
                            <img
                                style={{ cursor: "pointer",marginBottom: 25 }}
                                onClick={this.Copytext}
                                height={25}
                                src={require('./../static/copy.png')}
                                alt={"Copy"}
                            />
                        </div>
                    </div>
                    : null}
            </div>
        )
    }
}