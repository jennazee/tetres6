class Piece {
	constructor(game) {
		this.width = SQ_WIDTH;
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

		for (let i = 0; i < 4; i++) {
			this.ctx.fillRect(this.sqArray[i][0] * this.width, this.sqArray[i][1] * this.width, this.width, this.width);
			this.ctx.strokeRect(this.sqArray[i][0] * this.width, this.sqArray[i][1] * this.width, this.width, this.width);
		}
	}

	//smart pieces!!
	checkValidDown() {
		for (let i = 0; i < 4; i++) {
			if (!!board[this.sqArray[i][0]][this.sqArray[i][1] + 1]) {
				return false;
			}
		}
		return true;
	}

	checkValidLeft() {
		for (let i = 0; i < 4; i++) {
			if (!!board[this.sqArray[i][0] - 1][this.sqArray[i][1]]) {
				return false;
			}
		}
		return true;
	}

	checkValidRight() {
		for (let i = 0; i < 4; i++) {
			if (board[this.sqArray[i][0] + 1][this.sqArray[i][1]]) {
				return false;
			}
		}
		return true;
	}

	checkValidRotate() {
		if (board[this.sqArray[2][0]-this.sqArray[2][1] + this.sqArray[0][1]][this.sqArray[2][0]+this.sqArray[2][1] - this.sqArray[0][0]]) {
			return false;
		}

		if (board[this.sqArray[2][0]-this.sqArray[2][1] + this.sqArray[1][1]][this.sqArray[2][0]+this.sqArray[2][1] - this.sqArray[1][0]]) {
			return false;
		}

		if (board[this.sqArray[2][0]-this.sqArray[2][1] + this.sqArray[3][1]][this.sqArray[2][0]+this.sqArray[2][1] - this.sqArray[3][0]]) {
			return false;
		}
		return true;
	}

	moveDown(array) {
		if (this.checkValidDown()) { //if it can move down, move all 4 component squares down
			for (let i = 0; i < 4; i++) {
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
			for (let i = 0; i < 4; i++) {
				this.sqArray[i][0]--;
			}
		}
		this.game.draw();
	};

	moveRight() {
		//if it can move down, move all 4 component squares right
		if (this.checkValidRight()) {
			for (let i = 0; i < 4; i++) {
				this.sqArray[i][0]++;
			}
		}
		this.game.draw();
	};

	drop() {
		while (this.checkValidDown()){
			this.moveDown();
		}
		this.game.draw();
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
		this.game.draw();
	};

	setLocation(x, y) {
		for (let i = 0; i < 4; i++) {
			this.sqArray[i][0] = this.layoutArray[i][0] + x;
			this.sqArray[i][1] = this.layoutArray[i][1] + y;
		}
		this.game.draw();
	};

	stick() {
		for (let i = 0; i < 4; i++) {
			board[this.sqArray[i][0]][this.sqArray[i][1]] = new StuckSquare(this.color);
			board[this.sqArray[i][0]][this.sqArray[i][1]].setLocation(this.sqArray[i][0], this.sqArray[i][1]);
		}
		this.game.makeNewPiece();
	}
}
