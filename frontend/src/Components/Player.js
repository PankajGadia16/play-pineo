// import React from 'react';
// import PlayingCardsList from './../utils/playingCardsList'
// export default class Player extends React.Component {
//     constructor(props) {
//         super(props)
//         this.state = {
//             myPlayerId: this.props.myPlayerId,
//             playerId: this.props.playerId,
//             name: null,
//             game: this.props.game
//         }
//     }

//     getName = (game, playerId) => {
//         const {
//             teamA: {
//                 player1: {
//                     name: player1Name = null
//                 } = {},
//                 player2: {
//                     name: player2Name = null
//                 } = {}
//             } = {},
//             teamB: {
//                 player3: {
//                     name: player3Name = null
//                 } = {},
//                 player4: {
//                     name: player4Name = null
//                 } = {}
//             } = {}
//         } = game
//         return eval(playerId + "Name")
//     }
//     componentDidMount() {
//         const { game, playerId } = this.state
//         this.setState({
//             name: this.getName(game, playerId)
//         })
//     }
//     UNSAFE_componentWillReceiveProps(nextProps) {
        
//         const { playerId: statePlayerId, myPlayerId: stateMyPlayerId } = this.state
//         const { playerId: nextPropsPlayerId, myPlayerId: nextPropsMyPlayerId } = nextProps
//         if (statePlayerId == nextPropsPlayerId && stateMyPlayerId == nextPropsMyPlayerId) {
//             this.setState({
//                 game: nextProps.games,
//                 name: this.getName(nextProps.game, nextProps.playerId)
//             })
//         }
//     }


//     render() {
//         const { name = null } = this.state
//         return (
//             <div style={{
//                 display: "flex",
//                 "flex-flow": "column nowrap"
//             }}>
//                 {

//                     (name != null) ?
//                         <div>
//                             <img
//                                 style={{
//                                     display: "flex",
//                                     "align-self": "center",
//                                     height: 120
//                                 }}
//                                 className='Player'
//                                 alt={"payer-image"}
//                                 src={require("./../static/user.png")}
//                             />
//                             <h5 style={{ margin: 3 }}>{name}</h5>
//                         </div>
//                         : <img
//                             style={{
//                                 display: "flex",
//                                 "align-self": "center",
//                                 height: 120
//                             }}



//                             alt={"no-player"}
//                             src={require("./../static/questionMark.png")}
//                         />}
//                 {}
//             </div>
//         )
//     }
// }


import React, { useEffect, useState } from 'react';
import PlayingCardsList from './../utils/playingCardsList';

const Player = (props) => {
  const { myPlayerId, playerId, game } = props;
  const [name, setName] = useState(null);

  const getName = (game, playerId) => {
    const {
      teamA: {
        player1: { name: player1Name = null } = {},
        player2: { name: player2Name = null } = {},
      } = {},
      teamB: {
        player3: { name: player3Name = null } = {},
        player4: { name: player4Name = null } = {},
      } = {},
    } = game || {};
    return eval(playerId + "Name");
  };

  useEffect(() => {
    console.log("player useEffect: ",{ myPlayerId, playerId, game })
    setName(getName(game, playerId));
  }, [game, playerId]);

  // useEffect(() => {
  //   if (playerId === playerId && myPlayerId === myPlayerId) {
  //     setName(getName(game, playerId));
  //   }
  // }, [game, playerId, myPlayerId]);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {name != null ? (
        <div>
          <img
            style={{ display: "flex", alignSelf: "center", height: 120 }}
            className="Player"
            alt="player-image"
            src={require("./../static/user.png")}
          />
          <h5 style={{ margin: 3 }}>{name}</h5>
        </div>
      ) : (
        <img
          style={{ display: "flex", alignSelf: "center", height: 120 }}
          alt="no-player"
          src={require("./../static/questionMark.png")}
        />
      )}
    </div>
  );
};

export default Player;
