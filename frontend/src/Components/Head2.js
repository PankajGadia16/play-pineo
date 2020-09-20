import React from 'react';
import axios from "axios";

export default class Head2 extends React.Component {
    constructor(props) {
        console.log("constructor")
        super(props)
        this.state = {
            games: null
        }
    }
    // UNSAFE_componentWillMount() {
    //     console.log("UNSAFE_componentWillMount")
    // }
    // UNSAFE_componentWillReceiveProps() {
    //     console.log("UNSAFE_componentWillReceiveProps")
    // }
    // UNSAFE_componentWillUpdate() {
    //     console.log("UNSAFE_componentWillUpdate")
    // }
    // static async getDerivedStateFromProps(props, state) {
    //     console.log("getDerivedStateFromProps")
    //     const data = await axios.get("http://localhost:8081/api/helper/sample-api")
    //     console.log("data", data.data)
    //     return {
    //         abcd: "pankaj",
    //         games: data.data
    //     }
    //     // if our state is dependent on props then those values will get change if the values of props changes
    //     // to mange that this function is called
    // }
    async componentDidMount() {
        const data = await axios.get("http://localhost:4000/api/helper/sample-api")
        this.setState({
            games: data.data
        })

    }

    getSnapshotBeforeUpdate(prevProps, prevState) {
        // The return value for this lifecycle will be passed as the third parameter to componentDidUpdate. (This lifecycle isn’t often needed, but can be useful in cases like manually preserving scroll position during rerenders.)
        console.log("getSnapshotBeforeUpdate")
        return null
    }
    componentDidUpdate() {
        console.log("componentDidUpdate")
    }
    // componentWillMount() {
    //     //can be ignored
    //     console.log("componentWillMount")
    // }

    render() {
        console.log("render")
        console.log(this.state)
        console.log(this.state.games && this.state.games[0].name)
        var deck = Deck(true);
        const deck2 = Deck(true);
        deck.cards = deck.cards.concat(deck2.cards)
        var $container = document.getElementById('root');
        deck.mount($container);
        deck.shuffle()
        // const newCard = new Card(23)
        // deck.cards.append(newCard)

        // deck.intro()
        // deck.flip()
        // deck.bysuit()
        console.log(deck.cards[0].x)
        deck.cards.forEach(function (card, i) {
            /* card.setSide(Math.random() < 0.5 ? 'front' : 'back') */
            ;
            
            // explode
            card.animateTo({
                delay: 1000 + i * 2, // wait 1 second + i * 2 ms
                duration: 2000,
                ease: 'quartOut',

                x: window.innerWidth / 2,
                y: window.innerHeight / 2
            });
            card.x = window.innerWidth / 2
            card.y = window.innerHeight / 2
        });
        
        setTimeout(deck.fan, 5000)
        
        return (
            <div>
                {/* <script src="https://deck-of-cards.js.org/dist/deck.min.js"></script>
                <link rel="stylesheet" href="https://deck-of-cards.js.org/example.css"></link> */}


                <h1>{this.state.games && this.state.games[0].name}</h1>
            </div>
        );
    }
}