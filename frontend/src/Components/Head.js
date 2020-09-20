import React from 'react';
import NewGame from "./NewGame"
import JoinGame from "./JoinGame"

export default class Head extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            requestType: null
        }
    }

    render() {
        const { requestType = null } = this.state
        return (
            <div>
                <button onClick={() => { this.setState({ requestType: "createGame" }) }}>Create new Game</button>
                <button onClick={() => { this.setState({ requestType: "joinGame" }) }}>Join Game</button>
                {(requestType === "createGame") ?
                    <NewGame /> :
                    null}
                {(requestType === "joinGame") ?
                    <JoinGame /> :
                    null}
            </div>
        );
    }
}