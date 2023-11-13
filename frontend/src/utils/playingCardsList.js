
let PlayingCardsList = {};
let suits = ['C', 'D', 'H', 'S'];

for (let i = 2; i < 15; i++) {
	for (let suit of suits) {
		PlayingCardsList[i + suit] = require('./../CardImages/' + i + suit.toLowerCase() + '.svg');
	}
}
PlayingCardsList.back = require('./../CardImages/back.png');
PlayingCardsList.PINEO = require('./../CardImages/pineo.png')
export default PlayingCardsList;

//https://github.com/deck-of-cards/deck-of-cards/blob/master/example/faces/back.png	