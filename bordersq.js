class BorderSq {
	constructor() {
		this.width = SQWIDTH;
	 	this.color = CHARCOAL_GRAY;
	 	this.sqArray = [];
	 	this.ctx = document.querySelector('#mainCanvas').getContext('2d');
	}

	draw() {
		this.ctx.fillStyle = this.color;
		this.ctx.fillRect(this.sqArray[0] * this.width, this.sqArray[1] * this.width, this.width, this.width);
	};

	setLocation(x, y) {
		this.sqArray = [x, y];
	}
}