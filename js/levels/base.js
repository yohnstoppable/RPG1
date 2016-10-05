var baseLevel = function() {
	this.name = "default";
	this.scale = 10;
}

var space = function(type, event) {
	this.type = type;
	this.triggerEvent = event;
}

var grass = function() {
	this.img = new Image();
	this.img.src = "js/spaces/img/grass2.png";
	this.friction = 1;
}

var overworld = function () {
	this.dimensions = [];
	this.tempY = [];
	this.scale = 40;
	this.x = 100;
	this.y = 100;
	
	this.update = function() {
		Game.drawLevel(this,0,0);
	}
	
	for (var x=0; x < 100; x++) {
		for (var y=0; y < 100; y++) {
			this.tempY.push(new grass);
		}
		this.dimensions[x] = this.tempY;
		this.tempY = [];
	}
	
	
}

baseLevel.call(overworld.prototype);