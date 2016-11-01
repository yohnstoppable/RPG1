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
	badProjectiles : [],
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
		Game.player2.update();
		
		if (Game.projectiles.length > 0) {
			for (var i=0; i < Game.projectiles.length; i++ ) {
				Game.projectiles[i].update(Game.projectiles, i);
			}
		}
	
		//requestAnimationFrame(Game.gameLoop);
	},
	gameDraw: function() {
		Game.drawLevel(Game.level);
		Game.player2.draw(Game.ctx);
		Game.player.draw(Game.ctx);
		if (Game.projectiles && Game.projectiles.length > 0) {
			for (var i=0; i < Game.projectiles.length; i++) {
				Game.projectiles[i].draw(Game.ctx);
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

