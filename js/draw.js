Draw = {
	mousePosition : {x:0,y:0},
	clickX : new Array(),
	clickY : new Array(),
	clickDrag : new Array(),
	clickColors: new Array(),
	clicks : new Array(),
	undoCooldown: 30,
	undoCooldownTimer: 0,
	paint : false,
	go: true,
	selectedColor: '#000',
	colorList : ['#ff0000', '#ffa500', '#ffff00','#008000','#4169e1','#ff00ff','#fff','#000','#808080','#935100'],
	canvas : document.getElementById('drawCanvas'),
	ctx : document.getElementById("drawCanvas").getContext("2d"),
	keyCooldown: 15,
	keyCooldownTimer: 0,
	
	gameLoop : function() {
		Draw.ctx.clearRect(0, 0, Draw.canvas.width, Draw.canvas.height);
		Draw.ctx.fillStyle = "#fff";
		Draw.ctx.fillRect(0, 0, Draw.canvas.width, Draw.canvas.height);
		createHead(Draw.ctx, '#989898', createColorList);
		//createBody(Draw.ctx);
		//createColorList(Draw.ctx);
	
//				********************	Update items on canvas	**********************			

		keyCheck();
		//createMouse(Draw.ctx);
		update(Draw.ctx);
		increment();
		
			//requestAnimationFrame(Draw.gameLoop);
	},
	draw : function (obj) {
		Game.ctx.drawImage(obj.img, obj.x, obj.y, obj.width, obj.height);
	},
	keysOnCooldown() {
		return (Game.keyCooldownTimer !== Game.keyCooldown);
	},
	
	resetKeyCooldown() {
		Game.keyCooldownTimer = 0;
	}
}

function update(context) {
	context.lineJoin = "round";
	context.lineWidth = 10;
		
	for(var i=0; i < Draw.clickX.length; i++) {		
		context.strokeStyle = Draw.clickColors[i];
		context.beginPath();
		if(Draw.clickDrag[i] && i){
			context.moveTo(Draw.clickX[i-1], Draw.clickY[i-1]);
		}else{
			context.moveTo(Draw.clickX[i]-1, Draw.clickY[i]);
		}
		context.lineTo(Draw.clickX[i], Draw.clickY[i]);
		context.closePath();
		context.stroke();
	}
}

function getMousePos(canvas, e) {
	var rect = canvas.getBoundingClientRect();
	return {
        x: e.clientX - rect.left,
		y: e.clientY - rect.top
	};
}

Draw.canvas.addEventListener('mousemove', function(e) {
	Draw.mousePosition = getMousePos(Draw.canvas, e);
}, false);

Draw.canvas.addEventListener('touchmove', touchHandler, false);
Draw.canvas.addEventListener('touchstart', touchHandler, false);
Draw.canvas.addEventListener('mousemove', touchHandler, false);
Draw.canvas.addEventListener('mousedown', touchHandler, false);

Draw.canvas.addEventListener("touchend", touchHandler, false);
Draw.canvas.addEventListener("mouseup", touchHandler, false);

function touchHandler(e) {	
	e.preventDefault();
	if (Draw.mousePosition.y > Draw.canvas.height * 9/10) {
		if (e.type === "touchStart" || e.type === 'mousedown') {
			Draw.selectedColor = Draw.colorList[Math.floor(Draw.mousePosition.x / (Draw.canvas.width/10))];
		}
	}
	if (e.type === "touchstart" || e.type === 'mousedown') {
		Draw.paint = true;
		addClick(Draw.mousePosition.x, Draw.mousePosition.y, false);
		Draw.gameLoop();
	} else if ((e.type === "touchmove"|| e.type === 'mousemove') && Draw.paint) {
		addClick(Draw.mousePosition.x, Draw.mousePosition.y, true);
		if (Draw.paint) {
			Draw.gameLoop();
		}
	} else if (e.type === 'mouseup' || e.type === 'touchend') {
		Draw.paint = false;
	}
}

function addClick(x,y,dragging) {
	Draw.clickX.push(x);
	Draw.clickY.push(y);
	Draw.clickDrag.push(dragging);
	Draw.clickColors.push(Draw.selectedColor);
	if (!dragging) {
		Draw.clicks.push(Draw.clickX.length-1);
	}
}

function getGeneratedSVG() {
	var tempCanvas = document.createElement('canvas');
	tempCanvas.width = 500;
	tempCanvas.height = 500;
	var tempContext = tempCanvas.getContext("2d");
	createHead(tempContext, '#000');
	update(tempContext);
	var img = new Image();
	img.src = tempCanvas.toDataURL("image/png");
	Game.player.head.img = img;
	drawReset();
}

function drawReset() {
	Draw.clickDrag = [];
	Draw.clickX = [];
	Draw.clickY = [];
	Draw.paint = false;
	Draw.clicks = [];
}

function createHead(context, color, callback1, callback2) {
	context.lineWidth = 20;
	context.fillStyle = "#fff";
	context.strokeStyle = "#000";
	
	context.beginPath();
	context.arc(Draw.canvas.width/2,Draw.canvas.height * 9/20,Draw.canvas.width/4,0,Math.PI*2,true); // Outer circle
	context.fill();
	context.stroke();
	if (callback1) {
		if (callback2) {
			callback1(context, color, callback2);
		} else {
			callback1(context, color);
		}
	}
}

function createBody(context, color, callback) {
	context.lineWidth = 20;
	console.log(color);
	
	context.fillStyle = "#fff";
	
	context.strokeStyle = color;
	context.beginPath();
	context.moveTo(Draw.canvas.width/2, Draw.canvas.height/2 + 30);
	context.lineTo(Draw.canvas.width/2, Draw.canvas.height/2 + 150);
	context.stroke();
	context.beginPath();
	context.moveTo(Draw.canvas.width/2, Draw.canvas.height/2 + 145);
	context.lineTo(Draw.canvas.width/2 + 100, Draw.canvas.height/2 + 200);
	context.stroke();
	context.beginPath();
	context.moveTo(Draw.canvas.width/2, Draw.canvas.height/2 + 145);
	context.lineTo(Draw.canvas.width/2 - 100, Draw.canvas.height/2 + 200);
	context.stroke();
	
	context.beginPath();
	context.moveTo(Draw.canvas.width/2, Draw.canvas.height/2 + 100);
	context.lineTo(Draw.canvas.width/2 + 100, Draw.canvas.height/2 + 45);
	context.stroke();
	context.beginPath();
	context.moveTo(Draw.canvas.width/2, Draw.canvas.height/2 + 100);
	context.lineTo(Draw.canvas.width/2 - 100, Draw.canvas.height/2 + 45);
	context.stroke();
	if (callback) {
		callback(context);
	}
}

function createColorList(context) {
	for (var x = 0; x < 10; x++) {
		context.fillStyle = Draw.colorList[x];
		context.fillRect(x * Draw.canvas.width/10, Draw.canvas.height - Draw.canvas.height/10, Draw.canvas.width/10, Draw.canvas.height);
	}
}

function createMouse(context){
	context.strokeStyle = Draw.selectedColor;
	context.arc(Draw.mousePosition.x, Draw.mousePosition.y, 10,0,Math.PI*2,true); // Outer circle
	context.fill();
}

function keyCheck() {
	if (!Draw.keysOnCooldown()) {
		
	}
}

function increment() {
	if (Draw.undoCooldownTimer < Draw.undoCooldown) {
		Draw.undoCooldownTimer++;
	}
}