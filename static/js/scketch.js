function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

}

const url = "ws://localhost:8888/websocket";

var ws;

if ("WebSocket" in window) {
    ws = new WebSocket(url);
} else if ("MozWebSocket" in window) {
    ws = new MozWebSocket(url);
}

ws.onopen = function(){
	console.log("WebSocket opened");
}


var canvas = document.getElementById("mycanvas");

var context = canvas.getContext("2d");

window.addEventListener('resize', resizeCanvas, false);
resizeCanvas();

var down = false;

canvas.addEventListener('mousedown', function(e){
	down = true;
    context.beginPath();
    context.moveTo(e.clientX, e.clientY);
    ws.send(JSON.stringify({
    	act: "down",
    	x: e.clientX,
    	y: e.clientY
    }))
}, false);

window.addEventListener('mousemove', function(e){
	if(!down) return;

	context.lineTo(e.clientX, e.clientY);
	context.stroke();
	ws.send(JSON.stringify({
		act: "move",
		x: e.clientX,
		y: e.clientY
	}))

}, false);

window.addEventListener('mouseup', function(e){
	if(!down) return;
	context.lineTo(e.clientX, e.clientY);
	context.stroke();
	context.closePath();
	down=false;
	ws.send(JSON.stringify({
		act: "up",
		x: e.clientX,
		y: e.clientY
	}))
}, false);

var remote_down = false;

ws.onmessage = function(evt){	

	data = JSON.parse(evt.data);

	switch(data.act){
		case "down":
			console.log("down");
			remote_down = true;
			context.beginPath();
			context.moveTo(data.x, data.x);

		case "move":
			console.log("move");
			context.lineTo(data.x, data.y);
			context.stroke();

		case "up":
			console.log("up");
			if(!remote_down) return;
			context.lineTo(data.x, data.y);
			context.stroke();
			context.closePath();
			remote_down = false;
	}
};