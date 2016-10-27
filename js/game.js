//				********************	Main Game function	**********************
	
Game = {
	paint: false,
	canvas : document.getElementById('myCanvas'),
	ctx : document.getElementById("myCanvas").getContext("2d"),
	scale: 120,
	player : new Player(1, 300,300,120,120,"Bill","person/defaultDude.png", "person/defaultBody.png", new baseClass),
	player2 : new Player(2, 300, 300, 120, 120, "Durka", "person/defaultDude.png", "person/defaultBody.png", new baseClass),
	inventory: weaponList,
	xDifference: 0,
	yDifference: 0,
	projectiles : [],
	maxProjectiles : 5,
	projectileCooldown : 0,
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
		Game.player2.update();
	
		//requestAnimationFrame(Game.gameLoop);
	},
	gameDraw: function() {
		Game.drawLevel(Game.level);
		Game.drawPlayer(Game.player2);
		Game.drawPlayer(Game.player);		
	},
	
//				******************** 	Code for spawning game objects	**********************
	
	draw : function (obj) {
		Game.ctx.drawImage(obj.img, obj.x, obj.y, obj.width/2,obj.height/2, obj.width/2, obj.height/2);
	},
	
	drawPlayer : function(player) {
		if (player.playerNumber === 1) {
			var x = player.x;
			var y = player.y;
			x = Math.max(player.x - Game.xDifference, Game.scale*2);
			x = Math.min (x, Game.canvas.width - Game.scale*3);
			y = Math.max(player.y - Game.yDifference, Game.scale);
			y = Math.min (y, Game.canvas.height - Game.scale*2);
			
			player.realX = x;
			player.realY = y;
			Game.xDifference = player.x - x;
			Game.yDifference = player.y - y;
			var obj = {
				img: player.img,
				x: player.realX,
				y: player.realY,
				width: Game.scale,
				height: Game.scale,
			}
			player.draw(player.realX, player.realY, Game.scale, Game.scale, Game.ctx);
		} else {
			player.draw(player.x, player.y, Game.scale, Game.scale, Game.ctx);
		}
		
		
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
	
//			**********		Bindings		********
window.onload = function() {
	Game.canvas.allowTaint = true;
	//Game.gameLoop();
	//Draw.gameLoop();
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

