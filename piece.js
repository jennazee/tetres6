import {SQWIDTH, CHARCOAL_GRAY, BLACK, NUM_PIECE_SQS} from './constants.js';
import StuckSquare from './stuckSquare.js';

export default class Piece {
	constructor(game) {
		this.width = SQWIDTH;
		this.game = game;

		this.sqArray = [[], [], [], []];
		this.layoutArray = [];

		this.color = CHARCOAL_GRAY;
		this.ctx = document.querySelector('#mainCanvas').getContext('2d');
	};

	cloneSqArrayToLayoutArray() {
		this.layoutArray = JSON.parse(JSON.stringify(this.sqArray));
	};

	draw() {
		this.ctx.strokeStyle = BLACK;
		this.ctx.lineWidth = 2;
		this.ctx.fillStyle = this.color;

		const width = this.width;

		for (let i = 0; i < NUM_PIECE_SQS; i++) {
			this.ctx.fillRect(this.sqArray[i][0] * width, this.sqArray[i][1] * width, width, width);
			this.ctx.strokeRect(this.sqArray[i][0] * width, this.sqArray[i][1] * width, width, width);
		}
	}

	//smart pieces!!
	checkValidDown() {
		for (let i = 0; i < NUM_PIECE_SQS; i++) {
			if (!!this.game.board[this.sqArray[i][0]][this.sqArray[i][1] + 1]) {
				return false;
			}
		}
		return true;
	}

	checkValidLeft() {
		for (let i = 0; i < NUM_PIECE_SQS; i++) {
			if (!!this.game.board[this.sqArray[i][0] - 1][this.sqArray[i][1]]) {
				return false;
			}
		}
		return true;
	}

	checkValidRight() {
		for (let i = 0; i < NUM_PIECE_SQS; i++) {
			if (this.game.board[this.sqArray[i][0] + 1][this.sqArray[i][1]]) {
				return false;
			}
		}
		return true;
	}

	checkValidRotate() {
		if (this.game.board[this.sqArray[2][0]-this.sqArray[2][1] + this.sqArray[0][1]][this.sqArray[2][0]+this.sqArray[2][1] - this.sqArray[0][0]]) {
			return false;
		}

		if (this.game.board[this.sqArray[2][0]-this.sqArray[2][1] + this.sqArray[1][1]][this.sqArray[2][0]+this.sqArray[2][1] - this.sqArray[1][0]]) {
			return false;
		}

		if (this.game.board[this.sqArray[2][0]-this.sqArray[2][1] + this.sqArray[3][1]][this.sqArray[2][0]+this.sqArray[2][1] - this.sqArray[3][0]]) {
			return false;
		}
		return true;
	}

	moveDown(array) {
		if (this.checkValidDown()) { //if it can move down, move all 4 component squares down
			for (let i = 0; i < NUM_PIECE_SQS; i++) {
				this.sqArray[i][1]++;
			}
		}
		else {
			this.stick();
		}
		this.game.draw();
		this.game.checkLoss();
		this.game.checkLines();
	};

	moveLeft() {
		//if it can move left, move all 4 component squares left
		if (this.checkValidLeft()) {
			for (let i = 0; i < NUM_PIECE_SQS; i++) {
				this.sqArray[i][0]--;
			}
		}
		window.requestAnimationFrame(this.game.draw.bind(this.game));
	};

	moveRight() {
		//if it can move down, move all 4 component squares right
		if (this.checkValidRight()) {
			for (let i = 0; i < NUM_PIECE_SQS; i++) {
				this.sqArray[i][0]++;
			}
		}
		window.requestAnimationFrame(this.game.draw.bind(this.game));
	};

	drop() {
		while (this.checkValidDown()){
			this.moveDown();
		}
		window.requestAnimationFrame(this.game.draw.bind(this.game));
	}

	rotate() {
		//newx = centerOfRotationX - centerOfRotationY + oldYLocation
		//newy = centerOfRotationY + centerOfRotationX - oldXLocation
		if (this.checkValidRotate()){
			const oldx0 = this.sqArray[0][0];
			const oldy0 = this.sqArray[0][1];

			const oldx1 = this.sqArray[1][0];
			const oldy1 = this.sqArray[1][1];

			const oldx3 = this.sqArray[3][0];
			const oldy3 = this.sqArray[3][1];


			this.sqArray[0][0] = this.sqArray[2][0] - this.sqArray[2][1] + oldy0;
			this.sqArray[0][1] = this.sqArray[2][0] + this.sqArray[2][1] - oldx0;

			this.sqArray[1][0] = this.sqArray[2][0] - this.sqArray[2][1] + oldy1;
			this.sqArray[1][1] = this.sqArray[2][0] + this.sqArray[2][1] - oldx1;

			this.sqArray[3][0] = this.sqArray[2][0] - this.sqArray[2][1] + oldy3;
			this.sqArray[3][1] = this.sqArray[2][0] + this.sqArray[2][1] - oldx3;
		}
		window.requestAnimationFrame(this.game.draw.bind(this.game));
	};

	setLocation(x, y) {
		for (let i = 0; i < NUM_PIECE_SQS; i++) {
			this.sqArray[i][0] = this.layoutArray[i][0] + x;
			this.sqArray[i][1] = this.layoutArray[i][1] + y;
		}
		window.requestAnimationFrame(this.game.draw.bind(this.game));
	};

	stick() {
		for (let i = 0; i < NUM_PIECE_SQS; i++) {
			this.game.board[this.sqArray[i][0]][this.sqArray[i][1]] = new StuckSquare(this.color);
			this.game.board[this.sqArray[i][0]][this.sqArray[i][1]].setLocation(this.sqArray[i][0], this.sqArray[i][1]);
		}
		this.game.makeNewPiece();
	}
}
