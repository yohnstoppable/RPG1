Draw = {
	mousePosition : {x:0,y:0},
	clickX : new Array(),
	clickY : new Array(),
	clickDrag : new Array(),
	paint : false,
	canvas : document.getElementById('drawCanvas'),
	ctx : document.getElementById("drawCanvas").getContext("2d"),
	
	gameLoop : function() {
		
		createStickMan(Draw.ctx);
		
//				********************	Update items on canvas	**********************			

		update(Draw.ctx);
		
		requestAnimationFrame(Draw.gameLoop);
	}
}

function update(context) {
	context.lineJoin = "round";
	context.lineWidth = 10;
		
	for(var i=0; i < Draw.clickX.length; i++) {		
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
	if (e.type === "touchstart" || e.type === 'mousedown') {
		Draw.paint = true;
		addClick(Draw.mousePosition.x, Draw.mousePosition.y, false);
	} else if ((e.type === "touchmove"|| e.type === 'mousemove') && Draw.paint) {
		addClick(Draw.mousePosition.x, Draw.mousePosition.y, true);
	} else if (e.type === 'mouseup' || e.type === 'touchend') {
		Draw.paint = false;
	}
}

function addClick(x,y,dragging) {
	Draw.clickX.push(x);
	Draw.clickY.push(y);
	Draw.clickDrag.push(dragging);
}

function getGeneratedSVG() {
	var img = new Image();
	img.src = Draw.canvas.toDataURL("image/png");;
	Game.player.img = img;
}

function drawReset() {
	Draw.clickDrag = [];
	Draw.clickX = [];
	Draw.clickY = [];
}

function createStickMan(context) {
	context.fillStyle = "#fff";
	context.clearRect(0, 0, Draw.canvas.width, Draw.canvas.height);
	
	context.strokeStyle = "#989898";
	context.beginPath();
	context.moveTo(Draw.canvas.width/2, Draw.canvas.height/2 + 30);
	context.lineTo(Draw.canvas.width/2, Draw.canvas.height/2 + 150);
	context.stroke();
	context.beginPath();
	context.moveTo(Draw.canvas.width/2, Draw.canvas.height/2 + 145);
	context.lineTo(Draw.canvas.width/2 + 50, Draw.canvas.height/2 + 200);
	context.stroke();
	context.beginPath();
	context.moveTo(Draw.canvas.width/2, Draw.canvas.height/2 + 145);
	context.lineTo(Draw.canvas.width/2 - 50, Draw.canvas.height/2 + 200);
	context.stroke();
	
	context.beginPath();
	context.moveTo(Draw.canvas.width/2, Draw.canvas.height/2 + 100);
	context.lineTo(Draw.canvas.width/2 + 50, Draw.canvas.height/2 + 45);
	context.stroke();
	context.beginPath();
	context.moveTo(Draw.canvas.width/2, Draw.canvas.height/2 + 100);
	context.lineTo(Draw.canvas.width/2 - 50, Draw.canvas.height/2 + 45);
	context.stroke();
	
	context.strokeStyle = "#000";
	context.beginPath();
	context.arc(Draw.canvas.width/2,Draw.canvas.height/4 + 30,Draw.canvas.width/4,0,Math.PI*2,true); // Outer circle
	context.fill();
	context.stroke();
}