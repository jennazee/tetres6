//TETRIS
var board = [];

const SQWIDTH = 20;
const SCORE_PANEL_HEIGHT = 60;
const JKEY = 74;
const KKEY = 75
const LKEY = 76;
const PKEY = 80;
const COMMAKEY = 188;
const SPACEBAR = 32;

class Game {
	constructor() {
		this.scoreCounter = 0;
		this.dialog = new Dialog();
		this.go = false;
		this.lost = false;
		this.fresh = true;
		this.tetris = false;
		this.speediness = 1000; // changes with game play
	}

	init() {
		var canvas = document.querySelector('#mainCanvas');

	  if (canvas.getContext) {
			this.ctx = canvas.getContext('2d');

			// keeping everything contingent on that which cannot be set here (canvas dimensions)
			this.panelWidth = canvas.width;
			this.gamePanelHeight = canvas.height - SCORE_PANEL_HEIGHT;
			this.rows = this.gamePanelHeight/SQWIDTH + 1;
			this.cols = this.panelWidth/SQWIDTH;

			//game panel
			this.ctx.fillStyle = '#191919';
			this.ctx.fillRect(0, 0, this.panelWidth, this.gamePanelHeight);


			//make the pieces array. It's empty until pieces start sticking
			for (let j = 0; j < this.rows; j++) {
				board[j] = [];
			}

			for (let y = 0; y < this.rows; y++) {
				board[0][y] = new BorderSq();
				board[0][y].setLocation(0,y);

				board[this.cols - 1][y] = new BorderSq();
				board[this.cols - 1][y].setLocation(this.cols - 1, y);
			}

			for (let x = 0; x < this.cols; x++){
				board[x][0] = new BorderSq();
				board[x][this.rows - 1] = new BorderSq();
				board[x][0].setLocation(x, 0);
				board[x][this.rows - 1].setLocation(x, this.rows - 1);
			}

			this.currPiece = this.pieceFactory(this);
			this.currPiece.setLocation(9,1);

			this.drawBoard();

			//welcome dialog
			this.ctx.fillStyle = this.dialog.color;
			this.ctx.fillRect(this.dialog.x, this.dialog.y, this.dialog.width, this.dialog.height);
			this.ctx.fillStyle = 'Black';
			this.ctx.font = '22px Century Gothic, Calibri';
			this.ctx.fillText('Click to Make it Rain Pieces!', this.dialog.x + 10, this.dialog.y+40, 280);
			this.ctx.font = '14px Century Gothic, Calibri';
			this.ctx.fillText('Left = J-Key, Right = L-key', this.dialog.x + 35, this.dialog.y+70, 230);
			this.ctx.fillText('Rotate = K-key, Down = Comma-key', this.dialog.x + 35, this.dialog.y+90, 230);
			this.ctx.fillText('Drop = Space', this.dialog.x + 35, this.dialog.y+110, 230);
			this.ctx.fillText('Pause = P-key', this.dialog.x + 35, this.dialog.y+130, 230);

			this.setupKeyListeners();
			this.setupClickListeners();

			return true;
		}

		return false;
	}

	drawBoard() {
		for (let r = 0; r < this.rows; r++) {
			for (let c = 0; c < this.cols; c++) {
				if (board[c][r]){
					board[c][r].draw()
				}
			}
		}

		//score panel
		this.ctx.fillStyle = '#333333';
		this.ctx.fillRect(0, this.gamePanelHeight, this.panelWidth, SCORE_PANEL_HEIGHT);
		this.ctx.font = '30px Century Gothic'
		this.ctx.fillStyle = '#FF3333';
		this.ctx.fillText('Score: '+ this.scoreCounter, 20, this.gamePanelHeight+40, this.panelWidth-20);
		this.ctx.fillStyle = '00CCCC';
	}

	setupKeyListeners() {
		document.addEventListener('keydown', (e) => {
			//if game is in play, J-key moves falling piece left
			if (e.keyCode === JKEY) {
				if (this.game.go){
					e.preventDefault();
					this.currPiece.moveLeft()
				}
			}

			//if game is in play, L-key moves piece right
			if (e.keyCode === LKEY) {
				if (this.game.go){
					e.preventDefault();
					this.currPiece.moveRight()
				}
			}

			//if game is in play, K-key rotates the piece
			if (e.keyCode === KKEY) {
				if (this.game.go){
					e.preventDefault();
					this.currPiece.rotate();
				}
			}

			//if game is in play, comma-key moves piece down a row
			if (e.keyCode === COMMAKEY) {
				if (this.game.go){
					e.preventDefault();
					this.currPiece.moveDown()
				}
			}

			//if game is in play, space bar drops the piece
			if (e.keyCode === SPACEBAR) {
				if (this.game.go) {
					e.preventDefault();
					this.currPiece.drop();
				}
			}
			//p for pause
			if (e.keyCode === PKEY) {
	  		e.preventDefault();
	    	this.go = !this.go;
	    }
		});
	}

	setupClickListeners() {
		mainCanvas.addEventListener('click', (e) => {
			if (this.game.fresh) {
				this.fresh = false;
			}
			if (!this.game.go){
				this.go = true;
			}
			if (this.lost) {
				clearInterval(this.game_loop);
				this.game_loop = start();
				this.game.lost = false
				this.game.go = false;
				this.game.fresh = true;
			}
		});
	}

	//DRAWING updates
	draw() {
		if (this.go){
			//game panel
			this.ctx.fillStyle = '#191919';
			this.ctx.fillRect(0, 0, this.panelWidth, this.gamePanelHeight);

			this.drawBoard();

			this.currPiece.draw();
		}

		else {
			// game is paused
			if(!this.lost && !this.fresh){
	 			this.ctx.fillStyle= this.dialog.color;
				this.ctx.fillRect(this.dialog.x, this.dialog.y, this.dialog.width, this.dialog.height);
				this.ctx.fillStyle = 'Black';
				this.ctx.font = '22px Century Gothic, Calibri';
				this.ctx.fillText('Game Paused.', this.dialog.x + 65, this.dialog.y+80, 280);
			}
			// game is over
			else if (this.lost && !this.fresh) {
				this.ctx.fillStyle= this.dialog.color;
				this.ctx.fillRect(this.dialog.x, this.dialog.y, this.dialog.width, this.dialog.height);
				this.ctx.fillStyle = 'Black';
				this.ctx.font = '22px Century Gothic, Calibri';
				this.ctx.fillText('Sorry! Game Over :(', this.dialog.x + 30, this.dialog.y+70, 280);
				this.ctx.font = '14px Century Gothic, Calibri';
				this.ctx.fillText('Click to start a new game.', this.dialog.x + 55, this.dialog.y+95, 230);
				return;
			}
		}
	}

	pieceFactory(game) {
		switch (Math.floor(Math.random() * 7)) {

			case 0:
				return new IPiece(game);

			case 1:
				return new JPiece(game);

			case 2:
				return new LPiece(game);

			case 3:
				return new OPiece(game);

			case 4:
				return new SPiece(game);

			case 5:
				return new TPiece(game);

			case 6:
				return new ZPiece(game);
		}
	}

	makeNewPiece() {
		this.currPiece = this.pieceFactory(this);
		if (!this.lost) {
			this.currPiece.setLocation(9,1);
		}
	}

	checkLines() {
		var numCleared = 0;
		for (let j = 1; j < rows-1; j++) {
			var numFull = 0;
			for (let i = 1; i < cols-1; i++){
				if (!board[i][j]){
					break;
				}
				else {
					numFull++;
				}
			}
			if (numFull === cols - 2){
				numCleared++;
				for (let p = j; p > 2; p--){
					//cols
					for (let q = 1; q < cols - 1; q++){
						board[q][p] = board[q][p-1]
						if (board[q][p]){
						 	board[q][p].setLocation(q,p);
						 	this.draw();
						}
					}
				}
				if (this.speediness > 100) {
					this.speediness = this.speediness - 50;
				}
				this.scoreCounter = this.scoreCounter + 10;
				//one tetris
				if (numCleared === 4 && !tetris) {
					this.scoreCounter = this.scoreCounter + 100;
					this.tetris = true;
				}
				//back to back tetrises!!!
				else if (numCleared === 4 && tetris) {
					this.scoreCounter = this.scoreCounter + 500;
				}
				else {
					this.tetris = false;
				}
			}
		}
	}

	checkLoss() {
		for (let s = 0; s < 4; s++){
			if (board[this.currPiece.sqArray[s][0]][this.currPiece.sqArray[s][1]]){
				this.go = false;
				this.lost = true;
				this.draw()
			}
		}
	}
}