//				********************	Main Game function	**********************
	
Game = {
	paint: false,
	canvas : document.getElementById('myCanvas'),
	ctx : document.getElementById("myCanvas").getContext("2d"),
	scale: 90,
	player : new Player(300,300,90,90,"dude","images/dude.png"),
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
	mapCooldown: 15,
	mapCooldownTimer: 0,
	
//				********************	Main Game Loop	**********************
	gameLoop : function() {

		Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
		
//				********************	Update items on canvas	**********************			

		Game.checkKeys();
		Game.level.update();
		Game.player.update();
		
		if (Game.mapCooldownTimer < Game.mapCooldown) {
			Game.mapCooldownTimer++;
		}
		
	
		requestAnimationFrame(Game.gameLoop);
	},
	
//				******************** 	Code for spawning game objects	**********************
	
	draw : function (obj) {
		Game.ctx.drawImage(obj.img, obj.x, obj.y, obj.width,obj.height);
	},
	
	drawPlayer : function(player) {
		var x = player.x;
		var y = player.y;
		x = Math.max(player.x - Game.xDifference, Game.scale*2);
		x = Math.min (x, Game.canvas.width - Game.scale*3);
		y = Math.max(player.y - Game.yDifference, Game.scale*2);
		y = Math.min (y, Game.canvas.height - Game.scale*3);
		
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
		Game.draw(obj);
	},
	
	drawLevel : function(level) {
		for (x = 0; x < level.dimensions[0].length; x++) {
			for (var y=0; y < level.dimensions.length; y++) {
				Game.ctx.drawImage(level.spaces[level.dimensions[y][x]].img, (x * Game.scale)-Game.xDifference, (y * Game.scale)-Game.yDifference, Game.scale, Game.scale);
			}
		}
	},
	
	checkKeys() {
		if (Game.keys[73]) {
			document.getElementById('drawCanvas').style.display = "inline";
			Draw.gameLoop();
			Draw.go = true;
		}
		
		if (Game.keys[74]) {
			drawReset();
			document.getElementById('drawCanvas').style.display = "none";
		}
		
		if (Game.keys[109] && Game.scale > 4) {
			Game.scale--;
			Game.player.width--;
			Game.player.height--;
		}
		
		if (Game.keys[107] && Game.scale < 60) {
			Game.scale++;
			Game.player.width++;
			Game.player.height++;
		}
		
		if (Game.keys[77] && Game.mapCooldownTimer >= Game.mapCooldown) {
			Game.showMap = !Game.showMap;
			
			if (Game.showMap) {
				document.getElementById('mapCanvas').style.display = 'inline';
				Map.update(Game.level);
			} else {
				document.getElementById('mapCanvas').style.display = 'none';
			}
			
			Game.mapCooldownTimer = 0;
			
		}
	}
	
};
	
//			**********		Bindings		********
window.onload = function() {
	Game.canvas.allowTaint = true;
	Game.gameLoop();
	//Draw.gameLoop();
}

window.addEventListener('keydown', function(event) {
	Game.keys[event.keyCode] = true;
	event.preventDefault();
});

window.addEventListener('keyup', function(event) {
	Game.keys[event.keyCode] = false;
	event.preventDefault();
});

