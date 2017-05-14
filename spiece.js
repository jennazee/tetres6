class SPiece extends Piece {
	constructor(game) {
		super(game);
		this.color = LIME;

		this.sqArray[0][0] = 1;
		this.sqArray[0][1] = 0;

		this.sqArray[1][0] = 2;
		this.sqArray[1][1] = 0;

		this.sqArray[2][0] = 0;
		this.sqArray[2][1] = 1;

		this.sqArray[3][0] = 1;
		this.sqArray[3][1] = 1;

		this.cloneSqArrayToLayoutArray();
	}
}