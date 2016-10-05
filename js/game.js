//				********************	Main Game function	**********************

Game = {
	canvas : document.getElementById('myCanvas'),
	ctx : document.getElementById("myCanvas").getContext("2d"),
	player : new Player(1,1,150,100,"dude","images/dude.png"),
	projectiles : [],
	maxProjectiles : 5,
	projectileCooldown : 0,
	enemies: [],
	maxEnemies : 10,
	enemyCooldown : 20,
	enemyTimer : 20,
	score : 0,
	keys : [],
	level: new overworld(),
	
//				********************	Main Game Loop	**********************
	gameLoop : function() {

		Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
		
//				********************	Update items on canvas	**********************			

		Game.level.update();
		Game.player.update();	
		
		
		requestAnimationFrame(Game.gameLoop);
	},
	
//				******************** 	Code for spawning game objects	**********************
	spawnProjectile : function() {
		if (Game.projectiles.length <= Game.maxProjectiles) {
			Game.projectiles[Game.projectiles.length] = new Projectile(Game.player1,10,7,"images/bullet.jpg",15,0);
			Game.projectileCooldown = 5;
		}
	},
	
	spawnEnemy : function () {
		if (Game.enemies.length <= Game.maxEnemies) {
			Game.enemies[Game.enemies.length] = new Enemy(50,150,"images/shreddar.png");
			Game.enemyTimer = Game.enemyCooldown;
			//Game.enemyCooldown--;
		}
	},
	
	checkCollision : function(obj1, obj2, i1, n1) {
		var xRange = false;
		var yRange = false;
		document.getElementById("item").innerHTML = i1 + "," + n1 + " - enemies.length (" + Game.enemies.length + ") - projectiles.length( " + Game.projectiles.length + ")";
		if (((obj1.x >= obj2.x) && (obj1.x <= (obj2.x + obj2.width))) || (((obj1.x + obj1.width) >= obj2.x) && ((obj1.x + obj1.width) <= (obj2.x + obj2.width)))) {
			xRange = true;
		}
		if (((obj1.y > obj2.y) && (obj1.y < (obj2.y + obj2.height))) || (((obj1.y + obj1.height) >= obj2.y) && ((obj1.y + obj1.height) <= (obj2.y + obj2.height)))) {
			yRange = true;
		}
		
		return (xRange && yRange);
	},
	
	draw : function (obj) {
		console.log('obj', obj);
		Game.ctx.drawImage(obj.img, obj.x, obj.y,obj.width,obj.height);
	},
	
	drawLevel : function(level, xStart, yStart) {
		for (var x = xStart; x < xStart + 10; x++) {
			for (var y = yStart; y < yStart + 10; y++) {
				console.log('level.scale', level.scale);
				Game.ctx.drawImage(level.dimensions[x][y].img, x * level.scale, y * level.scale, level.scale, level.scale);
			}
		}
	}
	
};
	
//			**********		Bindings		********
window.onload = function() {
	Game.gameLoop();
}

window.addEventListener('keydown', function(event) {
	Game.keys[event.keyCode] = true;
	event.preventDefault();
});

window.addEventListener('keyup', function(event) {
	Game.keys[event.keyCode] = false;
	event.preventDefault();
});