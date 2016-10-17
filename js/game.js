//				********************	Main Game function	**********************
	
Game = {
	paint: false,
	canvas : document.getElementById('myCanvas'),
	ctx : document.getElementById("myCanvas").getContext("2d"),
	scale: 30,
	player : new Player(1,1,30,30,"dude","images/dude.png"),
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
	
//				********************	Main Game Loop	**********************
	gameLoop : function() {

		Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
		
//				********************	Update items on canvas	**********************			

		Game.checkSettingsKeys();
		Game.level.update();
		Game.player.update();
		
		
		
		requestAnimationFrame(Game.gameLoop);
	},
	
//				******************** 	Code for spawning game objects	**********************
	
	draw : function (obj) {
		Game.ctx.drawImage(obj.img, Game.canvas.width/2, Game.canvas.height/2,obj.width,obj.height);
	},
	
	drawLevel : function(level) {
		var xStart = Math.ceil(Game.player.x/Game.scale);
		var yStart = Math.ceil(Game.player.y/Game.scale);
		xStart = Math.max(xStart-2, 0);
		yStart = Math.max(yStart-2, 0);
		var offsetX = Game.player.x % Game.scale;
		var offsetY = Game.player.y % Game.scale;
		document.getElementById("projCooldown").innerHTML = "X Start - " + xStart;
		document.getElementById("enemyCooldown").innerHTML = "Y Start - " + yStart;
		document.getElementById('item').innerHTML = 'Offset X - ' + offsetX;
		document.getElementById('score').innerHTML = 'Offset Y - ' + offsetY;
		var tempX = [];
		var tempY = [];
		for (var x=xStart; x <= xStart + (Math.ceil(Game.canvas.width/Game.scale)+4); x++) {
			for (var y = yStart; y <= yStart + (Math.ceil(Game.canvas.height/Game.scale)+4); y++) {
				Game.ctx.drawImage(level.spaces[level.dimensions[y][x]].img, ((x-xStart) * Game.scale) - offsetX-40, ((y-yStart) * Game.scale) - offsetY-40, Game.scale, Game.scale);
			}
		}
	},
	
	checkSettingsKeys() {
		if (Game.keys[109] && Game.scale > 20) {
			Game.scale--;
			Game.player.width--;
			Game.player.height--;
			Game.player.x = Game.player.x * Game.scale/(Game.scale+1) - ((Game.canvas.width)/((Game.scale+1)*2));
			Game.player.y = Game.player.y * Game.scale/(Game.scale+1) - ((Game.canvas.height)/((Game.scale+1)*2));
		}
		
		if (Game.keys[107] && Game.scale < 50) {
			Game.scale++;
			Game.player.width++;
			Game.player.height++;
			Game.player.x = Game.player.x * Game.scale/(Game.scale-1) + ((Game.canvas.width)/((Game.scale-1)*2));
			Game.player.y = Game.player.y * Game.scale/(Game.scale-1) + ((Game.canvas.height)/((Game.scale-1)*2));
		}
	}
	
};
	
//			**********		Bindings		********
window.onload = function() {
	Game.gameLoop();
	//Draw.gameLoop()
}

window.addEventListener('keydown', function(event) {
	Game.keys[event.keyCode] = true;
	event.preventDefault();
});

window.addEventListener('keyup', function(event) {
	Game.keys[event.keyCode] = false;
	event.preventDefault();
});

