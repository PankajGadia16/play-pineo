import React from 'react';
import constants from '../utils/constants'
import axios from "axios";
import { withRouter } from 'react-router-dom'
import { Button } from 'react-bootstrap'

class NewGame extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            name: null,
            errorMessage: undefined
        }

    }

    handleChange = ({ target }) => {
        this.setState({
            [target.id]: target.value
        });
    }

    create = async () => {

        axios.post(`${constants.SERVER_HOST}/api/game/create`, {
            name: this.state.name
        })
            .then(response => {
                if (response.status == 200) {
                    this.props.history.push({
                        pathname: '/game',
                        state: {
                            gameId: response.data.gameId,
                            myPlayerId: "player1",
                            game: response.data
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
                            <Button style={{ margin: 8 }} onClick={this.create}>Create</Button>
                        </div>
                }
            </div>
        )
    }
}

export default withRouter(NewGame)