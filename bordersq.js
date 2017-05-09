class BorderSq {
	constructor() {
		this.width = 20;
	 	this.color = '#333';
	 	this.sqArray;
	}

	draw() {
		this.ctx = document.querySelector('#mainCanvas').getContext('2d');
		this.ctx.fillStyle = this.color;
		this.ctx.fillRect(this.sqArray[0] * this.width, this.sqArray[1] * this.width, this.width, this.width);
	};

	setLocation(x, y) {
		this.sqArray = [x, y];
	}
}