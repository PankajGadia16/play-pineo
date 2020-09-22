import React from 'react';
import NewGame from "./NewGame"
import JoinGame from "./JoinGame"
import { Button } from 'react-bootstrap'

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
                <Button style={{ margin: 8 }} onClick={() => { this.setState({ requestType: "createGame" }) }}>Create new Game</Button>
                <Button style={{ margin: 8 }} onClick={() => { this.setState({ requestType: "joinGame" }) }}>Join Game</Button>
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