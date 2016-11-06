//				********************	Main Game function	**********************
	
Game = {
	paint: false,
	canvas : document.getElementById('myCanvas'),
	ctx : document.getElementById("myCanvas").getContext("2d"),
	scale: 120,
	player : new Player(1, 300,300,120,120,"Bill","person/defaultDude.png", "person/defaultBody.png", true),
	tower : new Tower('js/towers/placeholderTower.png', 100, 200, 120, 120),
	tower2 : new Tower('js/towers/placeholderTower.png', 200, 600, 120, 120),
	tower3 : new Tower('js/towers/placeholderTower.png', 150, 400, 120, 120),
	tower4 : new Tower('js/towers/placeholderTower.png', 150, 150, 120, 120),
	//player2 : new Player(2, 300, 300, 120, 120, "Durka", "person/defaultDude.png", "person/defaultBody.png", new baseClass),
	inventory: weaponList,
	xDifference: 0,
	yDifference: 0,
	projectiles : [],
	badProjectiles : [],
	maxProjectiles : 5,
	projectileCooldown : 0,
	enemyCollisions : [],
	projectileCollisions : [],
	images : [],
	imageObj : [],
	sounds : [],
	enemies: [],
	maxEnemies : 10,
	enemyCooldown : 20,
	enemyTimer : 20,
	score : 0,
	keys : [],
	level: new overworld(1,1,30,30),
	showMap : false,
	showDraw : false,
	keyCooldown: 15,
	keyCooldownTimer: 0,
	lastFrameTimeMs: 0,
    maxFPS: 60,
	mousePosition : {x:0,y:0},
	
//				********************	Main Game Loop	**********************
	gameLoop : function() {
		
//				********************	Update items on canvas	**********************			
		if (Game.keyCooldownTimer < Game.keyCooldown) {
			Game.keyCooldownTimer++;
		}
		
		//Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
		Game.checkKeys();
		//Game.level.update();
		Game.player.update();
		Game.tower.update();
		Game.tower2.update();
		Game.tower3.update();
		Game.tower4.update();
		//Game.player2.update();
		
		if (Game.projectiles.length > 0) {
			for (var i=0; i < Game.projectiles.length; i++ ) {
				Game.projectiles[i].update(Game.projectiles, i);
			}
		}
		
		if (Game.badProjectiles.length > 0) {
			for (var i=0; i < Game.badProjectiles.length; i++ ) {
				Game.badProjectiles[i].update(Game.badProjectiles, i);
			}
		}
		
		if (Game.enemies.length > 0) {
			for (var i=0; i < Game.enemies.length; i++ ) {
				Game.enemies[i].update(Game.enemies,i);
			}
		}
		
		//Player projectiles collision with enemies
		if (Game.projectiles.length > 0 && Game.enemies.length > 0) {
			for (var i=0; i < Game.projectiles.length; i++ ) {
				for (var n=0; n < Game.enemies.length; n++) {
					if (Common.checkCollision(Game.projectiles[i],Game.enemies[n])) {	
						Game.enemies[n].damage(Game.enemies,n,1);
						break;
					}
				}
			}
		}
		
		//Enemy projectiles collision with player1
		if (Game.badProjectiles.length > 0) {
			for (var i=0; i < Game.badProjectiles.length; i++ ) {
				if (Common.checkCollision(Game.badProjectiles[i],Game.player)) {	
					console.log('game over');
				}
			}
		}
			
		if ((Math.ceil(Math.random()*10) > 9)) {
			Game.spawnEnemy(Math.ceil(Math.random()*8));
		}
		
		//if (Game.enemies.length < 1) {
		//	Game.spawnEnemy(1);
		//}
		
	
		//requestAnimationFrame(Game.gameLoop);
	},
	
	spawnEnemy : function (amount,x,y) {
		amount = typeof amount !== 'undefined' ? amount : 1;
		x = typeof x !== 'undefined' ? x : Game.canvas.width - 75;
		y = typeof y !== 'undefined' ? y : Math.random() * (Game.canvas.height - 50);
		console.log('x start', x);
		console.log('y start', y);
		for (i=0; i<amount; i++) {
			Game.enemies[Game.enemies.length] = new Player(0,x,y,120,120,"Bill","person/defaultDude.png", "person/defaultBody.png", false);
		}
	},
	gameDraw: function() {
		Game.drawLevel(Game.level);
		//Game.player2.draw(Game.ctx);
		Game.player.draw(Game.ctx);
		Game.tower.draw(Game.ctx);
		Game.tower2.draw(Game.ctx);
		Game.tower3.draw(Game.ctx);
		Game.tower4.draw(Game.ctx);
		if (Game.projectiles && Game.projectiles.length > 0) {
			for (var i=0; i < Game.projectiles.length; i++) {
				Game.projectiles[i].draw(Game.ctx);
			}
		}
		
		if (Game.badProjectiles && Game.badProjectiles.length > 0) {
			for (var i=0; i < Game.badProjectiles.length; i++) {
				Game.badProjectiles[i].draw(Game.ctx);
			}
		}
		
		if (Game.enemies.length > 0) {
			for (var i=0; i < Game.enemies.length; i++ ) {
				Game.enemies[i].draw(Game.ctx);
			}
		}
	},
	
//				******************** 	Code for spawning game objects	**********************
	
	draw : function (obj) {
		Game.ctx.drawImage(obj.img, obj.x, obj.y, obj.width/2,obj.height/2, obj.width/2, obj.height/2);
	},
	
	drawLevel : function(level) {
		for (x = 0; x < level.dimensions[0].length; x++) {
			for (var y=0; y < level.dimensions.length; y++) {
				Game.ctx.drawImage(level.spaces[level.dimensions[y][x]].img, (x * Game.scale)-Game.xDifference, (y * Game.scale)-Game.yDifference, Game.scale, Game.scale);
			}
		}
	},
	
	checkKeys() {
		if (Game.keys[73] && !Game.keysOnCooldown()) {
			Game.showDraw = !Game.showDraw;
			if (Game.showDraw) {
				document.getElementById('drawCanvas').style.display = "inline";
				Draw.go = true;
				Draw.gameLoop();
				
			} else {
				drawReset();
				Draw.go = false;
				document.getElementById('drawCanvas').style.display = "none";
			}
			
			Game.resetKeyCooldown();
		}
		
		if (Game.keys[17] && Game.keys[90] && Game.showDraw && !Game.keysOnCooldown()) {
			var start = Draw.clicks[Draw.clicks.length-1];
			Draw.clickY.splice(start);
			Draw.clickX.splice(start);
			Draw.clickColors.splice(start);
			Draw.clickDrag.splice(start);
			Draw.clicks.splice(Draw.clicks.length-1);
			Draw.undoCooldownTimer = 0;
			update(Draw.ctx);
		}

		if (Game.keys[32] && Game.showDraw && !Game.keysOnCooldown()) {
			getGeneratedSVG();
			Game.showDraw = false;
			drawReset();
			Draw.go = false;
			document.getElementById('drawCanvas').style.display = "none";
		}

		
		if (Game.keys[77] && !Game.keysOnCooldown()) {
			Game.showMap = !Game.showMap;
			
			if (Game.showMap) {
				document.getElementById('mapCanvas').style.display = 'inline';
				Map.update(Game.level);
			} else {
				document.getElementById('mapCanvas').style.display = 'none';
			}
			
			Game.resetKeyCooldown();
		}
		
		if (Game.keys[84] && !Game.keysOnCooldown()) {
			Game.showStatus = !Game.showStatus;
			
			if (Game.showStatus) {
				document.getElementById('statusCanvas').style.display = 'inline';
				Status.drawStatus(Game.player);
			} else {
				document.getElementById('statusCanvas').style.display = 'none';
			}
			
			Game.resetKeyCooldown();
		}
	},
	
	keysOnCooldown() {
		return (Game.keyCooldownTimer !== Game.keyCooldown);
	},
	
	resetKeyCooldown() {
		Game.keyCooldownTimer = 0;
	}
	
};

function end() {
	
}

function getMousePos(canvas, e) {
	var rect = canvas.getBoundingClientRect();
	return {
        x: e.clientX - rect.left,
		y: e.clientY - rect.top
	};
}
	
//			**********		Bindings		********
window.onload = function() {
	Game.canvas.allowTaint = true;
	//Game.gameLoop();
	//Draw.gameLoop();
	Game.images[0] = "images/dog.png";
	Game.images[1] = "images/bone.png";
	Game.images[2] = "images/wasp.png";
	Game.images[3] = "images/background1.jpg";
	Game.images[4] = "images/background2.jpg";
	Game.images[5] = "images/cat.png";
	Game.images[6] = "images/explosion.png";	
	Game.images[7] = "images/machineGun.png";
	Game.images[8] = "images/spread.png";		
	Game.images[9] = "images/wasp2.png";	
	Game.images[10] = "images/dog2.png";
	Game.images[11] = "images/stinger2.png";
	Game.images[12] = "images/shreddar.png";
	Game.images[13] = "images/shreddar.png";
	Game.images[14] = "images/bfg.png";
	Game.images[15] = "images/special.png";

	Game.sounds[0] = "audio/lazerShot.mp3";
	Game.sounds[1] = "audio/lazerShotBad.mp3";
	Game.sounds[2] = "audio/death.mp3";
	Game.sounds[3] = "audio/hit.mp3";
	Game.sounds[4] = "audio/hahaha.mp3";
	Game.sounds[5] = "audio/zipzop.mp3";
	MainLoop.setMaxAllowedFPS(60);
	MainLoop.setUpdate(Game.gameLoop).setDraw(Game.gameDraw).setEnd(end).start();
}

window.addEventListener('keydown', function(event) {
	Game.keys[event.keyCode] = true;
	event.preventDefault();
});

window.addEventListener('keyup', function(event) {
	Game.keys[event.keyCode] = false;
	event.preventDefault();
});

Game.canvas.addEventListener('mousemove', function(e) {
	Game.mousePosition = getMousePos(Game.canvas, e);
}, false);