import {PURPLE} from './constants.js';
import Piece from './piece.js';

export default class OPiece extends Piece {
	constructor(game) {
		super(game);
	 	this.color = PURPLE;

		this.sqArray[0][0] = 0;
		this.sqArray[0][1] = 0;

		this.sqArray[1][0] = 1;
		this.sqArray[1][1] = 0;

		this.sqArray[2][0] = 0;
		this.sqArray[2][1] = 1;

		this.sqArray[3][0] = 1;
		this.sqArray[3][1] = 1;

		this.cloneSqArrayToLayoutArray();
	}
};