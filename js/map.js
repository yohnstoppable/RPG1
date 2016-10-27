Map = {
	canvas : document.getElementById('mapCanvas'),
	ctx : document.getElementById("mapCanvas").getContext("2d"),
	
	update : function(level) {
		if (level) {
			console.log('drawing');
			var scaleX = Map.canvas.width/level.width;
			var scaleY = Map.canvas.height/level.height;
			var scale = Math.min(scaleX, scaleY);
			for (x = 0; x < level.dimensions[0].length; x++) {
				for (var y=0; y < level.dimensions.length; y++) {
					Map.ctx.drawImage(level.spaces[level.dimensions[y][x]].img, x * scale, y * scale, scale, scale);
				}
			}
		}
	}
}