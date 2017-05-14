import IPiece from './ipiece.js';
import JPiece from './jpiece.js';
import LPiece from './lpiece.js';
import OPiece from './opiece.js';
import SPiece from './spiece.js';
import TPiece from './tpiece.js';
import ZPiece from './zpiece.js';
import BorderSq from './bordersq.js';

import Dialog from './dialog.js';

import {INITIAL_SPEED,
        SQWIDTH,
        NUM_PIECE_SQS,
        SCORE_PANEL_HEIGHT,
        NEW_PIECE_X,
        NEW_PIECE_Y,
        CHARCOAL_GRAY,
        LARGE_FONT_SIZE,
        MEDIUM_FONT_SIZE,
        SMALL_FONT_SIZE,
        FONT_FAMILY,
        JKEY,
        KKEY,
        LKEY,
        PKEY,
        COMMAKEY,
        SPACEBAR,
        BLACK,
        NORMAL_CLEAR_PTS,
        NUM_FOR_TETRIS,
        TETRIS_CLEAR_PTS,
        DOUBLE_TETRIS_CLEAR_PTS,
        TOP_SPEED,
        RED,
        TEAL} from './constants.js';

export default class Game {
  constructor() {
    this.scoreCounter = 0;
    this.dialog = new Dialog();
    this.go = false;
    this.isLostGame = false;
    this.isFreshGame = true;
    this.tetris = false;
    this.board = [];
    this.speediness = INITIAL_SPEED; // changes with game play
  }

  init() {
    const canvas = document.querySelector('#mainCanvas');
    let board = this.board;

    if (!canvas.getContext) {
      return false;
    }
    this.ctx = canvas.getContext('2d');

    // keeping everything contingent on that which cannot be set here (canvas dimensions)
    this.panelWidth = canvas.width;
    this.gamePanelHeight = canvas.height - SCORE_PANEL_HEIGHT;
    this.rows = this.gamePanelHeight/SQWIDTH + 1;
    this.cols = this.panelWidth/SQWIDTH;

    //game panel
    this.ctx.fillStyle = BLACK;
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

    for (let x = 0; x < this.cols; x++) {
      board[x][0] = new BorderSq();
      board[x][this.rows - 1] = new BorderSq();
      board[x][0].setLocation(x, 0);
      board[x][this.rows - 1].setLocation(x, this.rows - 1);
    }

    this.currPiece = this.pieceFactory(this);
    this.currPiece.setLocation(NEW_PIECE_X, NEW_PIECE_Y);

    this.drawBoard();
    this.drawWelcomeDialog();
    this.setupKeyListeners();
    this.setupClickListeners();

    return true;
  }

  drawWelcomeDialog() {
    this.ctx.fillStyle = this.dialog.color;
    this.ctx.fillRect(this.dialog.x, this.dialog.y, this.dialog.width, this.dialog.height);
    this.ctx.fillStyle = BLACK;
    this.ctx.font = `${MEDIUM_FONT_SIZE} ${FONT_FAMILY}`;
    this.ctx.fillText('Click to Make it Rain Pieces!', this.dialog.x + 10, this.dialog.y + 40, 280);
    this.ctx.font = `${SMALL_FONT_SIZE} ${FONT_FAMILY}`;
    this.ctx.fillText('Left = J-Key, Right = L-key', this.dialog.x + 35, this.dialog.y + 70, 230);
    this.ctx.fillText('Rotate = K-key, Down = Comma-key', this.dialog.x + 35, this.dialog.y + 90, 230);
    this.ctx.fillText('Drop = Space', this.dialog.x + 35, this.dialog.y + 110, 230);
    this.ctx.fillText('Pause = P-key', this.dialog.x + 35, this.dialog.y + 130, 230);
  }

  drawBoard() {
    const board = this.board;
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (board[c][r]){
          board[c][r].draw()
        }
      }
    }

    //score panel
    this.ctx.fillStyle = CHARCOAL_GRAY;
    this.ctx.fillRect(0, this.gamePanelHeight, this.panelWidth, SCORE_PANEL_HEIGHT);
    this.ctx.font = `${LARGE_FONT_SIZE} ${FONT_FAMILY}`;
    this.ctx.fillStyle = RED;
    this.ctx.fillText('Score: '+ this.scoreCounter, 20, this.gamePanelHeight + 40, this.panelWidth - 20);
  }

  setupKeyListeners() {
    document.addEventListener('keydown', (e) => {
      //if game is in play, J-key moves falling piece left
      if (e.keyCode === JKEY) {
        if (this.go){
          e.preventDefault();
          this.currPiece.moveLeft()
        }
      }

      //if game is in play, L-key moves piece right
      if (e.keyCode === LKEY) {
        if (this.go){
          e.preventDefault();
          this.currPiece.moveRight()
        }
      }

      //if game is in play, K-key rotates the piece
      if (e.keyCode === KKEY) {
        if (this.go) {
          e.preventDefault();
          this.currPiece.rotate();
        }
      }

      //if game is in play, comma-key moves piece down a row
      if (e.keyCode === COMMAKEY) {
        if (this.go){
          e.preventDefault();
          this.currPiece.moveDown()
        }
      }

      //if game is in play, space bar drops the piece
      if (e.keyCode === SPACEBAR) {
        if (this.go) {
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
      if (this.isFreshGame) {
        this.isFreshGame = false;
      }
      if (!this.go){
        this.go = true;
      }
      if (this.isLostGame) {
        clearInterval(this.game_loop);
        this.game_loop = start();
        this.isLostGame = false
        this.go = false;
        this.isFreshGame = true;
      }
    });
  }

  //DRAWING updates
  draw() {
    if (this.go) {
      //game panel
      this.ctx.fillStyle = BLACK;
      this.ctx.fillRect(0, 0, this.panelWidth, this.gamePanelHeight);

      this.drawBoard();

      this.currPiece.draw();
    } else {
      // game is paused
      if(!this.isLostGame && !this.isFreshGame) {
        this.ctx.fillStyle = this.dialog.color;
        this.ctx.fillRect(this.dialog.x, this.dialog.y, this.dialog.width, this.dialog.height);
        this.ctx.fillStyle = BLACK;
        this.ctx.font = `${MEDIUM_FONT_SIZE} ${FONT_FAMILY}`;
        this.ctx.fillText('Game Paused.', this.dialog.x + 65, this.dialog.y+80, 280);
      }
      // game is over
      else if (this.isLostGame && !this.isFreshGame) {
        this.ctx.fillStyle= this.dialog.color;
        this.ctx.fillRect(this.dialog.x, this.dialog.y, this.dialog.width, this.dialog.height);
        this.ctx.fillStyle = BLACK;
        this.ctx.font = `${MEDIUM_FONT_SIZE} ${FONT_FAMILY}`;
        this.ctx.fillText('Sorry! Game Over :(', this.dialog.x + 30, this.dialog.y + 70, 280);
        this.ctx.font = `${SMALL_FONT_SIZE} ${FONT_FAMILY}`;
        this.ctx.fillText('Click to start a new game.', this.dialog.x + 55, this.dialog.y + 95, 230);
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
    if (!this.isLostGame) {
      this.currPiece.setLocation(NEW_PIECE_X, NEW_PIECE_Y);
    }
  }

  checkLines() {
    let board = this.board;
    let numCleared = 0;
    for (let j = 1; j < this.rows - 1; j++) {
      let numFull = 0;
      for (let i = 1; i < this.cols - 1; i++) {
        if (!board[i][j]) {
          break;
        } else {
          numFull++;
        }
      }
      if (numFull === this.cols - 2) {
        numCleared++;
        for (let p = j; p > 2; p--) {
          //cols
          for (let q = 1; q < this.cols - 1; q++) {
            board[q][p] = board[q][p - 1]
            if (board[q][p]){
              board[q][p].setLocation(q, p);
              this.draw();
            }
          }
        }
        if (this.speediness > TOP_SPEED) {
          this.speediness = this.speediness - SPEED_UP_AMT;
        }
        this.scoreCounter = this.scoreCounter + NORMAL_CLEAR_PTS;
        //one tetris
        if (numCleared === NUM_FOR_TETRIS && !this.tetris) {
          this.scoreCounter = this.scoreCounter + TETRIS_CLEAR_PTS;
          this.tetris = true;
        }
        //back to back tetrises!!!
        else if (numCleared === NUM_FOR_TETRIS && this.tetris) {
          this.scoreCounter = this.scoreCounter + DOUBLE_TETRIS_CLEAR_PTS;
        }
        else {
          this.tetris = false;
        }
      }
    }
  }

  checkLoss() {
    for (let s = 0; s < NUM_PIECE_SQS; s++) {
      if (this.board[this.currPiece.sqArray[s][0]][this.currPiece.sqArray[s][1]]){
        this.go = false;
        this.isLostGame = true;
        this.draw()
      }
    }
  }
};
