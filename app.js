// <script src="https://code.jquery.com/jquery-2.2.4.min.js" integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44="crossorigin="anonymous"></script>

class App {
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
