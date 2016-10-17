Draw = {
	mousePosition : {x:0,y:0},
	clickX : new Array(),
	clickY : new Array(),
	clickDrag : new Array(),
	paint : false,
	canvas : document.getElementById('drawCanvas'),
	ctx : document.getElementById("drawCanvas").getContext("2d"),
	
	gameLoop : function() {

		Draw.ctx.clearRect(0, 0, Draw.canvas.width, Draw.canvas.height);
		
//				********************	Update items on canvas	**********************			

		Draw.update();
		
		
		
		requestAnimationFrame(Draw.gameLoop);
	},
	
	update : function() {
		document.getElementById("score").innerHTML = "clickX " + Draw.clickX.length;
		Draw.ctx.strokeStyle = "#df4b26";
		Draw.ctx.lineJoin = "round";
		Draw.ctx.lineWidth = 5;
			
		for(var i=0; i < Draw.clickX.length; i++) {		
			Draw.ctx.beginPath();
			if(Draw.clickDrag[i] && i){
				Draw.ctx.moveTo(Draw.clickX[i-1], Draw.clickY[i-1]);
			}else{
				Draw.ctx.moveTo(Draw.clickX[i]-1, Draw.clickY[i]);
			}
			Draw.ctx.lineTo(Draw.clickX[i], Draw.clickY[i]);
			Draw.ctx.closePath();
			Draw.ctx.stroke();
		}
	},
}

window.onload = function() {
	//Game.gameLoop();
	Draw.gameLoop()
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
//Draw.canvas.addEventListener("touchend", touchEndHandler, false);

function touchHandler(e) {
	e.preventDefault();
	console.log(e);
	if (e.type === "touchstart") {
		addClick(Draw.mousePosition.x, Draw.mousePosition.y, false);
	} else if (e.type === "touchmove") {
		addClick(Draw.mousePosition.x, Draw.mousePosition.y, true);
	}
}
function addClick(x,y,dragging) {
	Draw.clickX.push(x);
	Draw.clickY.push(y);
	Draw.clickDrag.push(dragging);
}