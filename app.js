import Game from './game';

export default class App {
	constructor(props) {
		this.game_loop = this.start();
	}

	start() {
		this.game = new Game();

		let play = () => {
	  	this.game.draw();
	  	setTimeout(play, this.game.speediness);
	   	if (this.game.go) {
	   		this.game.currPiece.moveDown();
	   	}
	  };

		if (this.game.init()) {
			return setTimeout(play, this.game.speediness);
		} else {
			alert('You lack a browser able to run HTML5');
		}
	}
}

document.addEventListener('DOMContentLoaded', () => {
	new App();
});
