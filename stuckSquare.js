class StuckSquare {
	constructor(color) {
		this.width = SQWIDTH;
	 	this.color = color;
	 	this.sqArray;
	}

	draw() {
		this.ctx = document.querySelector('#mainCanvas').getContext('2d');
		this.ctx.fillStyle = this.color;
		this.ctx.strokeStyle = '#191919';
		this.ctx.lineWidth = 2;

		this.ctx.fillRect(this.sqArray[0] * this.width, this.sqArray[1] * this.width, this.width, this.width);
		this.ctx.strokeRect(this.sqArray[0] * this.width, this.sqArray[1] * this.width, this.width, this.width);
	};

	setLocation(x, y) {
		this.sqArray = [x, y];
	};
}
