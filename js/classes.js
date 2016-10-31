
//********************     main function used for creating my movable mixins    **********************
//Movement isn't just static, it uses velocity which is gained from acceleration, along with friction to slow it down.
//This makes movement more fluid. 
var asMovable = function() {
	this.boundX = [];
	this.boundY = [];
	this.gravity = 1;

	this.move = function() {
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
}; 

var Player = function(playerNumber, x, y, width, height, name, head, body, playerClass) {
	console.log(playerClass);
	console.log(playerClass.className);
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
	this.img = new Image();
	this.img.src = head;
	this.body = new Image();
	this.body.src = body;
	this.playerClass = playerClass;
	this.strength = 10;
	this.agility = 5;
	this.intelligence = 11;
	this.hitpoints = 10;
	this.stamina = 15;
	this.currentHitpoints = 10;
	this.mana = 10;
	this.currentMana = 10;
	this.weapon = megaSword;
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
	
	this.update = function() {
		if (this.playerNumber === 1) {
			console.log('blah');			
			this.checkKeys();
			this.move();
			this.bounds();
		} else if (this.playerNumber == 2) {
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
		}			
			
		if (Game.player.velX != 0 || Game.player.velY != 0) {
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
			this.counter = 0;
			this.headOffset = 0;
			this.bodyFrame = 1;
		}
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
		//if (Game.keys[32] && !this.jumping) {
		//	this.jumping = true;
		//	this.accelerate(0,-75);
		//}
	}
};

Player.prototype.getArmorClass = function() {
	return this.getStat("agility") + this.armor.getAC();
}

Player.prototype.getStat = function(stat) {
	console.log(stat);
	console.log(this.getBuffStat(stat));
	console.log(this.getGearStat(stat));
	console.log(this[stat]);
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

Player.prototype.draw = function(x, y, width, height, context) {
	context.drawImage(this.body,((this.bodyFrame-1) * (this.body.width/3)), 0, this.body.width/3, this.body.height, x + width * 2/9, y + (height * 2/3), width/3, height/3);
	context.drawImage(this.img, 0, 0, this.img.width, this.img.height, x - this.headOffset, (y + height/7), width * 2/3, height * 2/3);
	context.drawImage(this.weapon.img, x + width/(Game.scale/15) + (this.bodyFrame*(Game.scale/30)), y + height/(Game.scale/5) + this.headOffset/2 + (this.bodyFrame*(Game.scale/12)), width/6, height * 2/3);
}

var Projectile = function(obj,width,height,src,velX,velY) {
	this.x = obj.x + obj.width;
	this.y = obj.y + obj.height / 2;
	this.width = width;
	this.height = height;
	this.img = new Image();
	this.img.src = src;
	this.velX = velX;
	this.velY = velY;
	this.maxXSpeed = -1;
	this.maxYSpeed = 1;
	
	this.update = function() {
		if (this.x > Game.canvas.width) {
			Game.projectiles.shift();
			delete(this);
		} else {
			this.move();
			Game.draw(this);
		}
	}
};

var Enemy = function(width,height,src) {
	this.width = width;
	this.height = height;
	this.img = new Image();
	this.img.src = src;
	this.x = Game.canvas.width - this.width;
	this.y = Math.random() * (Game.canvas.height - this.height);
	this.velX = 0;
	this.velY = 0;
	this.maxXSpeed = 3;
	this.maxYSpeed = 3;
	this.acceleration = 1;
	
	this.update = function() {
		if (Math.random() < .5) {
			this.accelerate(0,this.acceleration);
		} else {
			this.accelerate(0,-this.acceleration);
		}
		this.accelerate(-this.acceleration,0);
		this.move();
		this.bounds();
		Game.draw(this);
	}
	
	this.bounds = function() {
		var check = this.checkBounds();
		if (check[0] != -1) {
			Game.enemies.push();
			delete(this);
		}
		if (check[1] != -1) {
			this.y = check[1];
		}
	}
	
	this.getDestroyed = function(item) {
		Game.enemies.splice(item,1);
		delete(this);
		Game.score++;
	}
}
//Inherit the methods from the asMovable function, creating our mixins
asMovable.call(Player.prototype);
asMovable.call(Projectile.prototype);
asMovable.call(Enemy.prototype);
