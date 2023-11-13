import React, { useState } from 'react';
import constants from '../utils/constants';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const NewGame = () => {
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate();

  const handleChange = ({ target }) => {
    console.log("ad")
    setName(target.value);
  };

  const create = async () => {
    try {
      console.log("pankj")
      const response = await axios.post(`${constants.SERVER_HOST}/api/game/create`, {
        name: name,
      });
      if (response.status === 200) {
        navigate('/game', {
          state: {
            gameId: response.data.gameId,
            myPlayerId: 'player1',
            game: response.data,
          },
        });
      } else {
        setErrorMessage(`${response.message} \n Something went wrong! please try again`);
      }
    } catch (error) {
      setErrorMessage(`${error} \n Something went wrong! please try again sadas`);
    }
  };

  return (
    <div>
      {errorMessage !== null ? (
        <h4>{errorMessage}</h4>
      ) : (
        <div>
          <input
            style={{ margin: 8 }}
            className="form-control"
            placeholder="Name"
            id="name"
            value={name}
            onChange={handleChange}
          />
          <Button style={{ margin: 8 }} onClick={create}>
            Create
          </Button>
        </div>
      )}
    </div>
  );
};

export default NewGame;
