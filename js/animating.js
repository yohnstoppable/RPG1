var animation = function(obj, animationType, totalFrames, animationSwitchTime, finishAfter, xOffsets, yOffsets) {
	this.img = new Image();
	this.img.src = obj.img.src;
	this.totalFrames = totalFrames;
	this.currentFrame = 1;
	this.animationSwitchTime = animationSwitchTime;
	this.time = 1;
	var totaltime = 1;
	this.finished = false;
	this.width = obj.width;
	this.height = obj.height;
	this.frameSize = this.img.width / totalFrames;
	this.x = obj.x;
	this.y = obj.y;
	this.stopped = false;
	this.animationType = animationtype;
	this.startingWidth = 0;
	this.endingWidth = this.frameSize;
}

animation.prototype.update = function(obj, stop) {
	this.time++;
	this.totalTime++;
	var stop = false;
	
	if (this.finishAfter && this.totalTime >= (animationSwitchTime * finishAfter) ) {
		stop = true;		
	}
	if (stop || this.stop) {
		if (this.finishCallback) {
			this.finishCallback();
		}
		this.stopped = true;
	}
	
	if (this.animationType === "sprite") {
		var startingWidth = (this.currentFrame-1) * this.frameSize;
		var endingWidth = startingWidth + this.frameSize;
		
		if (this.time >= this.animationSwitchTime) {
			this.time = 1;
		}
		if (this.currentFrame >= this.totalFrames) {
			this.currentFrame = 1;
		}
	}
				
}

animation.prototype.getCurrentImage() {
	if (this.stopped) {
		return false;
	} else {
		if this.animationType === "sprite" {
			return (this.img, startingWidth, 0, endingWidth, this.img.height, this.x, this.y, this.width, this.height);
		} else if this.animationType === "movement" {
			return (this.img, 0, 0, this.img.width, this.img.height, this.x + xOffsets[currentFrame], this.y + yOffsets[currentFrame], this.width, this.height);
		}
	}
}