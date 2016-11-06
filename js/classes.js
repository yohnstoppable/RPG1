//********************     main function used for creating my movable mixins    **********************
//Movement isn't just static, it uses velocity which is gained from acceleration, along with friction to slow it down.
//This makes movement more fluid. 
var asMovable = function() {
	this.boundX = [];
	this.boundY = [];
	this.gravity = 1;

	this.move = function() {
		if (this.playerNumber !== 1) {
			console.log('this.x', this.x);
			console.log('this.y', this.y);
			console.log('this.velX', this.velX);
			console.log('this.velY', this.velY);
		}
		this.x += this.velX;
		this.y += this.velY;
	}
	
	this.stop = function() {
		this.velX = 0;
		this.velY = 0;
	}
	
	this.stopX = function() {
		this.velX = 0;
	}
	
	this.stopY = function() {
		this.velY = 0;
	}
	
	this.slowFriction = function (x,y) {
		this.velX *= x;
		this.velY *= y;
		if (Math.abs(this.velX) <= .01) {
			this.velX = 0;
		}
		if (Math.abs(this.velY) <= .01) {
			this.velY = 0;
		}
	}
	
	this.applyGravity = function (gravity) {
		this.velY += gravity;
	}
	
	this.position = function() {
		return [this.x,this.y];
	}
	
	this.accelerate = function(x, y) {
		this.velX += x;
		this.velY += y;
		
		if (this.maxXSpeed != -1) {
			if (this.velX > this.maxXSpeed) {
				this.velX = this.maxXSpeed;
			} else if (this.velX < -this.maxXSpeed) {
				this.velX = -this.maxXSpeed;
			}
		}
		
		if (this.maxYSpeed != -1) {
			if (this.velY > this.maxYSpeed) {
				this.velY = this.maxYSpeed;
			} else if (this.velY < -this.maxYSpeed) {
				this.velY = -this.maxYSpeed;
			}
		}
	}
	
	this.checkBounds = function() {	
		var returnArray = [];
		
		if (this.x < 0) {
			returnArray[0] =  0;
		} else if (this.x > ((Game.level.dimensions[0].length * Game.scale) - (Game.canvas.width/2))) {
			returnArray[0] = ((Game.level.dimensions[0].length * Game.scale) - (Game.canvas.width/2));
		} else {
			returnArray[0] = -1;
		}
	
		if (this.y < 0) {
			returnArray[1] = 0;
		} else if (this.y > ((Game.level.dimensions.length * Game.scale) - (Game.canvas.height/2))) {
			returnArray[1] = ((Game.level.dimensions.length * Game.scale) - (Game.canvas.height/2));
		} else {
			returnArray[1] = -1;
		}	
		return returnArray;
	}
	
	this.updateRealLocation = function() {
		var x = this.x;
		var y = this.y;
		x = Math.max(this.x - Game.xDifference, Game.scale*2);
		x = Math.min (x, Game.canvas.width - Game.scale*3);
		y = Math.max(this.y - Game.yDifference, Game.scale);
		y = Math.min (y, Game.canvas.height - Game.scale*2);
			
		this.realX = x;
		this.realY = y;				
	}
	
	this.damage = function(array,index,dmg) {
		this.health -= dmg;
		if (this.health <= 0) {
			this.kill(array,index);
		}
	}
	
	this.kill = function(array, index) {
		if (typeof this.deathSound !== 'undefined') {
			createjs.Sound.play(this.deathSound,createjs.Sound.INTERRUPT_ANY);
		}
		
		if (this.drop) {
			Stage.spawnSpecial(this.x, this.y);
		}
		array.splice(index,1);
		delete(this);
		Game.score += this.points;
	}
	
	this.getHealth = function() {
		return this.health;
	}
}; 

var AnimatedObject = function(img, imgWidth, x, y, width, height, totalFrames, movementFrames) {
	this.img = new Image();
	this.img.src = img;
	var that = this;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.totalFrames = 1;
	this.currentFrame = 1;
	this.animationSwitchTime = 0;
	this.time = 0;
	this.totaltime = 0;
	this.finished = true;
	this.stopped = true;
	this.animationType;
	this.startingWidth = 0;
	this.endingWidth = 0;
	this.animationsRun = 0;
	this.totalFrames = totalFrames;
	this.movementFrames = movementFrames;
	if (movementFrames) {
		this.type = "movement";
	} else {
		this.type = "sprite";
	}
	this.frameSize = imgWidth / totalFrames;
}

AnimatedObject.prototype.startAnimation = function(startingFrame, animationType, framesAnimated, totalFrames, animationSwitchTime, totalAnimations, xOffsets, yOffsets) {
	this.stopped = false;
	this.finished = false;
	this.animationType = animationType;
	this.framesAnimated = framesAnimated;
	this.animationSwitchTime = animationSwitchTime;
	this.frameSize = this.img.width / this.totalFrames;
	this.startingFrame = startingFrame;
	this.currentFrame = startingFrame;
	this.stopped = false;
	this.xOffsets = [];
	this.yOffsets = [];
	this.totalAnimations = 0;
	
	if (this.animationType === "movement") {
		this.xOffsets = xOffsets;
		this.yOffsets = yOffsets;
	}
	if (totalAnimations) {
		this.totalAnimations = this.totalAnimations;
	}
}

AnimatedObject.prototype.stopAnimation = function() {
	this.stopped = true;
	this.finished = true;
	this.framesAnimated = 0;
	this.currentFrame = 1;
	this.animationSwitchTime = 0;
	this.time = 0;
	this.totaltime = 0;
	this.finished = true;
	this.stopped = true;
	this.animationType;
	this.startingWidth = 0;
	this.endingWidth = 0;
	this.animationsRun = 0;
}

AnimatedObject.prototype.updateAnimation = function(x,y) {
	if (x) {
		this.x = x;
	}
	if (y) {
		this.y = y ;
	}
	this.time++;
	this.totalTime++;
	var stop = false;
	
	if (this.totalAnimations && this.totalAnimations !== 0 && this.totalTime >= (animationSwitchTime * finishAfter) ) {
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
	}			
	
	if (this.time >= this.animationSwitchTime) {
		this.time = 1;
		this.currentFrame++;

		if (this.currentFrame >= (this.framesAnimated + this.startingFrame)) {
			this.currentFrame = this.startingFrame;
		}
	}
}

AnimatedObject.prototype.isAnimating = function() {
	return (!this.stopped && !this.finished);
}

AnimatedObject.prototype.stopAnimating = function() {
	this.stopped = true;
	this.finished = true;
}

AnimatedObject.prototype.getCurrentImage = function() {
	var offsetX = 0;
	var offsetY = 0;
	
	if (!this.stopped && this.animationType === "movement") {
		offsetX = this.xOffsets[this.currentFrame-2];
		offsetY = this.yOffsets[this.currentFrame-2];
	}
	
	if (this.type === "sprite") {
		return {
			img: this.img,
			sX: this.frameSize * (this.currentFrame-1),
			sY: 0,
			sWidth: this.frameSize,
			sHeight: this.img.height,
			x: this.x,
			y: this.y,
			width: this.width,
			height: this.height
		};
	} else {
		return {
			img: this.img,
			sX: 0,
			sY: 0,
			sWidth: this.img.width,
			sHeight: this.img.height,
			x: this.x + offsetX,
			y: this.y + offsetY,
			width: this.width,
			height: this.height
		};
	}
}

var Tower = function(img, x, y, width, height) {
	this.img = new Image();
	this.img.src = img;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.weapon = new weapon("Short Sword", "js/weapons/img/megaSword.png", 5, 0, 0, 0, 0, 35, true);
}

Tower.prototype.update = function() {
	if (Game.enemies.length > 0) {
		for (var i=0; i < Game.enemies.length; i++ ) {
			if ((Common.distanceBetween(this, Game.enemies[i]) < 500)) {
				this.weapon.throw(this,Game.enemies[i],true);
			}
		}
		if (this.weapon.currentCooldown > 0) {
			this.weapon.currentCooldown = this.weapon.currentCooldown - 1;
		};
	}
}

Tower.prototype.draw = function(context) {
	var x = this.x - Game.xDifference;
	var y = this.y - Game.yDifference;		
    
	context.drawImage(this.img, x, y, this.width, this.height);
	//context.drawImage(this.weapon.img, x, y, this.width, this.height);
}

var Player = function(playerNumber, x, y, width, height, name, head, body, friend) {
    this.x = x;
    this.y = y;
	this.realX = x;
	this.realY = y;
	this.width = width;
	this.height = height;
    this.name = name;
	this.velX = 0;
	this.velY = 0;
	this.maxXSpeed = 5;
	this.maxYSpeed = 5;
	this.friction = .8;
	this.acceleration = .2;
	this.jumping = false;	
	this.friend = friend;
	this.strength = 10;
	this.agility = 5;
	this.intelligence = 11;
	this.hitpoints = 10;
	this.stamina = 15;
	this.currentHitpoints = 10;
	this.mana = 10;
	this.currentMana = 10;
	if (friend) {
		this.weapon = new weapon("Mega Sword", "js/weapons/img/megaSword.png", 15, 5, 0, 0, 0, 10, true);
	} else {
		this.weapon = new weapon("Mega Sword", "js/weapons/img/shortSword.png", 15, 5, 0, 0, 0, 10, false);
	}
	
	this.armor;
	this.helmet;
	this.accessory;
	this.characterClass;
	this.buffs = [];
	this.counter = 0;
	this.headOffset = 0;
	this.bodyFrame = 1;
	this.movementHistoryX = [];
	this.movementHistoryY = [];
	this.playerNumber = playerNumber;
	this.updateDiagnostics = 100;
	this.updateDiag = 0;
	this.head = new AnimatedObject(head, 450, x, y + (this.height * 1/6), width * 2/3, height * 2/3, 1, 2);
	this.body = new AnimatedObject(body, 500, x + (this.width * 2/9), y + (this.height * 2/3), width * 1/3, height * 1/3, 3);
	
	
	/*context.drawImage(this.body,((this.bodyFrame-1) * (this.body.width/3)), 0, this.body.width/3, this.body.height, x + width * 2/9, y + (height * 2/3), width/3, height/3);
	context.drawImage(this.img, 0, 0, this.img.width, this.img.height, x, (y + height/7) - this.headOffset, width * 2/3, height * 2/3);
	context.drawImage(this.weapon.img, x + width/(Game.scale/15) + (this.bodyFrame*(Game.scale/30)), y + height/(Game.scale/5) + this.headOffset/2 + (this.bodyFrame*(Game.scale/12)), width/6, height * 2/3);*/
	
	this.update = function() {
		if (this.playerNumber === 1) {			
			this.checkKeys();
			this.move();
			this.bounds();
		} else if (this.playerNumber === 2) {
			if (Game.player.velX != 0) {
				this.x = Game.player.realX - ((Math.abs(Game.player.velX)/Game.player.velX)*Game.scale/2);
				if (Game.player.velY === 0) {
					this.y = Game.player.realY;
				}
			}
			if (Game.player.velY != 0) {
				this.y = Game.player.realY - ((Math.abs(Game.player.velY)/Game.player.velY)*(Game.scale * 2/3));
				if (Game.player.velX === 0) {
					this.x = Game.player.realX
				}
			}
		} else {
			this.accelerate(-this.acceleration,0);
			this.move();
			this.bounds();
			if (Math.random() < .01) {
				this.weapon.throw(this,Game.player,false);
			}
			//this.updateCooldowns();
		}		
			
		if (this.velX != 0 || this.velY != 0) {
			if (!this.body.isAnimating()) {
				this.body.startAnimation(2, "sprite", 2, 3, 15);
			} else if (this.playerNumber === 1) {
				this.body.updateAnimation(this.realX + (this.width * 2/9), this.realY + (this.height * 2/3));
			} else {
				this.body.updateAnimation(this.x-Game.xDifference + (this.width * 2/9), this.y-Game.yDifference + (this.height * 2/3));
			}
			
			if (!this.head.isAnimating()) {
				this.head.startAnimation(2, "movement", 2, 3, 15, 0, [0,0], [-6,6]);
			} else if (this.playerNumber === 1) {
				this.head.updateAnimation(this.realX, this.realY + (this.height * 1/6));
			} else {
				this.head.updateAnimation(this.x - Game.xDifference, this.y - Game.yDifference + (this.height * 1/6));
			}
			//this.headAnimation = new animation(this.head)
			this.counter += Math.max(Math.abs(Game.player.velX), Math.abs(Game.player.velY))/4;
			if (this.counter <= 15) {
				this.headOffset = Game.scale/20;
				this.bodyFrame = 2;
			} else {
				this.headOffset = -Game.scale/20;
				this.bodyFrame = 3;
			}
			
			if (this.counter >= 30) {
				this.counter = 0;
			}
		} else {
			if (this.body.isAnimating()) {
				this.body.stopAnimating();
			} 
			
			if (this.head.isAnimating()) {
				this.head.stopAnimating();
			}
			this.counter = 0;
			this.headOffset = 0;
			this.bodyFrame = 1;
		}
		
		if (this.playerNumber === 1) {
			this.updateRealLocation();
			Game.xDifference = this.x - this.realX;
			Game.yDifference = this.y - this.realY;
		}
		
		if (this.weapon.currentCooldown > 0) {
			this.weapon.currentCooldown = this.weapon.currentCooldown - 1;
		};
		/*context.drawImage(this.body,((this.bodyFrame-1) * (this.body.width/3)), 0, this.body.width/3, this.body.height, x + width * 2/9, y + (height * 2/3), width/3, height/3);*/
	}
	
	
	this.bounds = function () {
		var check = this.checkBounds();
		if (check[0] != -1) {
			this.x = check[0];
		}
		
		if (check[1] != -1) {
			this.y = check[1];
		}
	}
	
	this.checkKeys = function() {
		//right arrow or d
		if (Game.keys[39] || Game.keys[68]) {
			this.accelerate(this.acceleration,0);
		}
		//left arrow or s
		if (Game.keys[37] || Game.keys[65]) {
			this.accelerate(-this.acceleration,0);
		}
		//up arrow or w
		if (Game.keys[38] || Game.keys[87]) {
			this.accelerate(0,-this.acceleration);
		}
		//down arrow or d
		if (Game.keys[40] || Game.keys[83]) {
			this.accelerate(0,this.acceleration);
		}
		//if not moving left or right, slow using defined friction
		if (!(Game.keys[37] || Game.keys[39] || Game.keys[65] || Game.keys[68])) {
			this.slowFriction(this.friction,1);
		}
		//if not moving left or right, slow using defined friction. Can also be updated to use gravity
		if (!(Game.keys[40] || Game.keys[83] || Game.keys[38] || Game.keys[87])) {
			this.slowFriction(1,this.friction);
		}
		//check for space bar to shoot
		if (Game.keys[32]) {
			console.log('weapon', this.weapon);
              var position = {
                  x: (Game.mousePosition.x + Game.xDifference),
                  y: (Game.mousePosition.y + Game.yDifference)
               };
              
              console.log('position', position);
			this.weapon.throw(this,position,true);
		}
	}
	
	this.damage = function(array, index, damage) {
		array.splice(index,1);
		delete(this);
	}
};

Player.prototype.getArmorClass = function() {
	return this.getStat("agility") + this.armor.getAC();
}

Player.prototype.getStat = function(stat) {
	return this.getBuffStat(stat) + this.getGearStat(stat) + this[stat];
}

Player.prototype.getGearStat = function(stat) {
	let gearStat = 0;
	
	if (this.helmet) {
		gearStat += this.helmet[stat];
	}
	
	if (this.armor) {
		gearStat += this.armor[stat];
	}
	
	if (this.accessory) {
		gearStat += this.accessory[stat];
	}
	
	if (this.weapon) {
		gearStat += this.weapon[stat];
	}
	
	return gearStat;
}

Player.prototype.getBuffStat = function(stat) {
	if (this.buffs.length > 0) {
		return this.buffs.reduce(function(previousValue, currentValue, currentIndex, array) {
			return previousValue[stat] + currentValue[stat];
		});
	}
	
	return 0;
}

Player.prototype.draw = function(context) {
	var x = this.x;
	var y = this.y;
	if (this.playerNumber === 1) {
		x = this.realX;
		y = this.realY;
	} else {
		x = this.x - Game.xDifference;
		y = this.y - Game.yDifference;
	}
	var bodyInfo = this.body.getCurrentImage();
	var headInfo = this.head.getCurrentImage();
	context.drawImage(bodyInfo.img, bodyInfo.sX, bodyInfo.sY, bodyInfo.sWidth, bodyInfo.sHeight, bodyInfo.x, bodyInfo.y, bodyInfo.width, bodyInfo.height);
	context.drawImage(headInfo.img, headInfo.sX, headInfo.sY, headInfo.sWidth, headInfo.sHeight, headInfo.x, headInfo.y, headInfo.width, headInfo.height);
	context.drawImage(this.weapon.img, x + this.width/(Game.scale/15) + (this.bodyFrame*(Game.scale/30)), y + this.height/(Game.scale/5) + this.headOffset/2 + (this.bodyFrame*(Game.scale/12)), this.width/6, this.height * 2/3);
}

var Projectile = function(obj,weapon) {
	this.weapon = weapon;
	this.x = obj.x + obj.width/4;
	this.y = obj.y + obj.height/4;
	this.width = weapon.width;
	this.height = weapon.height;
	this.img = weapon.img;
	this.velX = weapon.speed.x;
	this.velY = weapon.speed.y;
	this.maxXSpeed = -1;
	this.maxYSpeed = 1;
	this.health = 2;
	//this.audio = weapon.spawnSound;
	//createjs.Sound.play(this.audio,createjs.Sound.INTERRUPT_ANY);
	
	this.update = function(gameArray,index) {
		if (Math.abs(this.health) > 10) {
			document.getElementById("projectile").innerHTML = this.health;
		}
		if (this.bounds(gameArray,index)) {
			this.kill(gameArray,index);
			return;
		} else {
			this.move();
		}
	}
	
	this.bounds = function(gameArray,index) {
		var check = this.checkBounds(this.width,this.height);
		if (check[0] != -1 || check[1] != -1) {
			return true;
		} else {
			return false;
		}
	}
};

Projectile.prototype.draw = function(context) {
	var x = this.x - Game.xDifference;
	var y = this.y - Game.yDifference;		
    
	this.angle = (Math.atan2(this.velY, this.velX));
    this.angle += (Math.PI)/2;

		if (this.angle != 0) {
			Common.drawRotated(this.weapon.img, x, y, this.width, this.height, context, this.angle);
		} else {
			context.drawImage(this.weapon.img, x, y, this.width, this.height);
		}

	//context.drawImage(this.weapon.img, x, y, this.width, this.height);
}

Projectile.prototype.kill = function(array, index) {
		//if (typeof this.deathSound !== 'undefined') {
		//	createjs.Sound.play(this.deathSound,createjs.Sound.INTERRUPT_ANY);
		//}
		
		//if (this.drop) {
		//	Stage.spawnSpecial(this.x, this.y);
		//}
		array.splice(index,1);
		delete(this);
		//Game.score += this.points;
	}
var Enemy = function(startingX,startingY,width,height,imgLeft,imgRight,health) {
	this.width = width;
	this.height = height;
	this.imgLeft = imgLeft;
	this.imgRight = new Image();
	this.imgRight.src = imgRight.src;
	this.img = new Image();
	this.img.src = imgLeft;
	this.x = startingX;
	this.y = startingY;
	this.velX = 0;
	this.velY = 0;
	this.maxXSpeed = 4;
	this.maxYSpeed = 3;
	this.health = health;
	this.accelerationX = 1;
	this.accelerationY = 1;
	this.shotChance = .003;
	this.points = 1;
	this.weapon = new weapon("Short Sword", "js/weapons/img/shortSword.png", 5, 0, 0, 0, 0, 35, false);
	this.health = 2;
	
	this.update = function(gameArray,index) {
		if (Math.random() < .5) {
			this.accelerate(0,this.accelerationY);
		} else {
			this.accelerate(0,-this.accelerationY);
		}
		this.accelerate(-this.accelerationX,0);
		this.move();
		this.bounds();
		//if (this.height > 100) {
		//	document.getElementById("boss").innerHTML = this.health;
		//}
		
		if (Math.random() < this.shotChance) {
			this.weapon.throw(this,Game.player,false);
		}
		//this.updateCooldowns();
		//this.draw();
	}
	
	this.bounds = function() {
		var check = this.checkBounds();
		if (check[0] != -1) {
			delete(this);
		}
		
		if (check[1] != -1) {
			this.y = check[1];
		}
	}
	
	this.equip = function(weapon) {
		this.weapon = weapon;
	}
	
	this.updateCooldowns = function() {
		if (this.weapon.currentCooldown > 0) {
			this.weapon.currentCooldown--;
		}
	}
	
	this.draw = function(context) {
		var x = this.x - Game.xDifference;
		var y = this.y - Game.yDifference;		
		
		//this.angle = (Math.atan2(this.velY, this.velX));
		//this.angle += (Math.PI)/2;

		//if (this.angle != 0) {
		//	Common.drawRotated(this.img, x, y, this.width, this.height, context, this.angle);
		//} else {
			context.drawImage(this.img, x, y, this.width, this.height);
		//}
	}
	
	this.damage = function(array, index, damage) {
		array.splice(index,1);
		delete(this);
	}
}

//Inherit the methods from the asMovable function, creating our mixins
asMovable.call(Player.prototype);
asMovable.call(Projectile.prototype);
asMovable.call(Enemy.prototype);