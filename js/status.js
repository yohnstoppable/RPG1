Status = {
	canvas : document.getElementById('statusCanvas'),
	ctx : document.getElementById("statusCanvas").getContext("2d"),
	
	drawStatus(player) {
		Status.ctx.lineWidth = 2;
		var buffer = Status.canvas.width * 1/10;
		var heightBuffer = Status.canvas.height * 1/10;
		
		
		Status.ctx.fillStyle = "#d3d3d3";
		Status.ctx.fillRect(0, 0, Status.canvas.width, Status.canvas.height);
		
		Status.ctx.fillStyle = "#afceff";
		Status.ctx.fillRect(0, 0, Status.canvas.width/2, Status.canvas.height);
		
		//
		Status.ctx.fillStyle = "#66ff89";
		Status.ctx.fillRect(0, Status.canvas.height - (buffer*2), Status.canvas.width/2, Status.canvas.height - (buffer * 3/2));
		
		Status.ctx.fillStyle = '#404040';
		Status.ctx.fillRect(0, 0, Status.canvas.width/2, buffer/2);
		
		Status.ctx.fillStyle = '#404040';
		Status.ctx.fillRect(0, Status.canvas.height- (buffer * 3/2), Status.canvas.width/2, Status.canvas.height);
		
		//Status.ctx.drawImage(player.img, buffer, buffer/2, Status.canvas.width * 3/10, Status.canvas.width * 3/10);
		player.draw(buffer, buffer/2, Status.canvas.width * 3/10, Status.canvas.width * 3/10, Status.ctx);
		
		
		Status.ctx.rect(0,0,Status.canvas.width/2,Status.canvas.height);
		Status.ctx.stroke();

		Status.ctx.fillStyle = "#fff";
		Status.ctx.font = "bold " + Math.floor(buffer/4).toString() + "px Arial";
		Status.ctx.fillText(player.name + ' - ' + player.playerClass.className, buffer/3, buffer/3);
		
		Status.ctx.fillStyle = "#ff0000"
		Status.ctx.fillText(player.currentHitpoints + '/' + player.hitpoints, buffer*3, buffer/3);
		
		Status.ctx.fillStyle = "#4169e1"
		Status.ctx.fillText(player.currentMana + '/' + player.mana, buffer*4, buffer/3);
		
		Status.ctx.fillStyle = "#fff";
		Status.ctx.fillText("Strength - " + player.getStat('strength'), buffer/2, Status.canvas.height - buffer);
		Status.ctx.fillText("Agility  - " + player.getStat('agility'), buffer/2, Status.canvas.height - buffer/2);
		Status.ctx.fillText("Intelligence - " + player.getStat('intelligence'), buffer*5/2, Status.canvas.height - buffer);
		Status.ctx.fillText("Stamina - " + player.getStat('stamina'), buffer*5/2, Status.canvas.height - buffer/2);
		
		var scale = buffer * 5/3;
		for (var x = Status.canvas.width/2; x < Status.canvas.width; x = x + scale) {
			for (var y = 0; y < Status.canvas.height;  y = y + scale) {
				Status.ctx.rect(x,y,scale,scale);
				Status.ctx.stroke();
			}
		}
		
		var xPosition = 0;
		var yPosition = 0;
		
		
		for (var x=0; x < Game.inventory.length; x++) {
			xPosition = x % 3;
			yPosition = Math.floor(x / 3);
			Status.ctx.drawImage(Game.inventory[x].img, (xPosition * scale) + Status.canvas.width/2 + (scale * 3/8), (yPosition * scale), scale/4 * 3/4, scale * 3/4);
			
			Status.ctx.fillStyle = "#000";
			Status.ctx.font = "bold " + Math.floor(buffer/6).toString() + "px Arial";
			Status.ctx.fillText(Game.inventory[x].name, (xPosition * scale) + Status.canvas.width/2 + (scale * 1/4), (yPosition * scale) + (scale * 7/8));
		}
	}
}