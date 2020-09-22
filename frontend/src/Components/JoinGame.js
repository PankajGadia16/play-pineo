import React from 'react';
import { withRouter } from 'react-router-dom'
import constants from '../utils/constants'
import axios from "axios";
import { Button } from 'react-bootstrap'
class JoinGame extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            name: null,
            gameId: null,
            errorMessage: undefined
        }
    }



    handleChange = ({ target }) => {
        this.setState({
            [target.id]: target.value
        });
    }
    join = async () => {

        axios.post(`${constants.SERVER_HOST}/api/game/join`, {
            name: this.state.name,
            gameId: this.state.gameId
        })
            .then(response => {
                if (response.status == 200) {
                    this.props.history.push({
                        pathname: '/game',
                        state: {
                            gameId: this.state.gameId,
                            myPlayerId: response.data.playerId
                        }
                    })
                } else {
                    this.setState({
                        errorMessage: `${response.message} \n Something went wrong! please try again`
                    })
                }

            })
            .catch(error => {
                this.setState({
                    errorMessage: `${error} \n Something went wrong! please try again`
                })
            })

    }

    render() {
        const { errorMessage = null } = this.state
        return (
            <div>
                {
                    (errorMessage != null) ? <h4>{errorMessage}</h4> :
                        <div>
                            <input style={{ margin: 8 }} class="form-control" placeholder="Name" id="name" value={this.state.name} onChange={this.handleChange} />
                            <input style={{ margin: 8 }} class="form-control" placeholder="Game code" id="gameId" value={this.state.gameId} onChange={this.handleChange} />
                            <Button style={{ margin: 8 }} onClick={this.join}>Join</Button>
                        </div>
                }
            </div>
        )
    }
}

export default withRouter(JoinGame)