//Holder for common game functions like math and collision detection

Common = {
	//calculates the speed of x and y according to the speed and how far to the side and up/down a target is
	getRiseRun : function(obj,target,weapon) {
		var projectileSpeed = weapon.bulletSpeed;
		var offsetX = 0;
		var offsetX2 = 0;
		var offsetY = 0;
		var offsetY2 = 0;
		
		if (target) {
			if (target.width) {
				offsetX += target.width;
			}
			
			if (target.height) {
				offsetY += target.height;
			}
		}
		
		if (weapon) {
			if (weapon.width) {
				offsetX -= weapon.width;
			}
			
			if (weapon.height) {
				offsetY -= weapon.height;
			}
		}

		if (obj) {
			if (obj.width){
				offsetX2 += obj.width;
			}
			
			if (obj.height) {
				offsetY2 += obj.height;
			}
		}
		
		var rise = target.y - obj.y + (offsetY/2) - (offsetY2/4);
		var run = target.x - obj.x + (offsetX/2) - (offsetY2/4);
		
		var hyp = Math.sqrt(Math.pow(run,2) + Math.pow(rise,2));
		
		rise *= (projectileSpeed/hyp);
		run *= (projectileSpeed/hyp);
		
		return {
			x : run,
			y : rise
		};
	},
	
	//Simple collision check between two objects. Will rework if/when more complex objects are created
	checkCollision : function(obj1, obj2) {
		var xRange = false;
		var yRange = false;
		
		//checks for x collision. If there is one, then check for y next. 
		if (obj2.x-obj1.x <= obj1.width && obj2.x-obj1.x >= -obj2.width) {
			xRange = true;
			if (obj2.y-obj1.y <= obj1.height && obj2.y-obj1.y >= -obj2.height) {
				yRange = true;
			}
		}
		
		return (xRange && yRange);
	},
	
	//********** Draw Game Objects **********
	draw : function (obj) {
		try {
			Game.ctx.drawImage(obj.img, obj.x, obj.y,obj.width,obj.height);
		} catch (e) {

		}
	},
	
	drawRotated : function(img, x, y, width, height, ctx, angle) {

		// save the context's co-ordinate system
		ctx.save(); 
 
		// move the origin to object   
		ctx.translate(x, y); 
 
		// now move across and down half the width and height of the object
		ctx.translate(width/2, height/2); 
 
		// rotate around this point
		ctx.rotate(angle); 
 
		// then draw the image back and up
		ctx.drawImage(img, -(width/2), -(height/2), width, height);
 
		// and restore the co-ordinate system to its default
		ctx.restore();
	},
	
	distanceBetween(obj1, obj2) {
		return Math.hypot(obj2.x-obj1.x, obj2.y-obj1.y);
	}
}