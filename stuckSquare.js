import {SQWIDTH, BLACK} from './constants.js';
import Piece from './piece.js';

export default class StuckSquare {
	constructor(color) {
		this.width = SQWIDTH;
	 	this.color = color;
	 	this.sqArray = [];
	 	this.ctx = document.querySelector('#mainCanvas').getContext('2d');
	}

	draw() {
		this.ctx.fillStyle = this.color;
		this.ctx.strokeStyle = BLACK;
		this.ctx.lineWidth = 2;

		this.ctx.fillRect(this.sqArray[0] * this.width, this.sqArray[1] * this.width, this.width, this.width);
		this.ctx.strokeRect(this.sqArray[0] * this.width, this.sqArray[1] * this.width, this.width, this.width);
	};

	setLocation(x, y) {
		this.sqArray = [x, y];
	};
}
