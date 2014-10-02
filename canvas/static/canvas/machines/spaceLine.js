/**
 * @constructor
 */
function Grid(x,y, r) {
  this.x=x;
  this.y=y;
  this.r=r;
  this.col="#fff";
  this.draw=function(context) {
    context.fillStyle=this.col;
		context.shadowColor=this.col;
    context.fillRect(r*(x-0.5),r*(y-0.5),Math.random()*r,Math.random()*r); 
  };
  return this;
}

var spaceLine={divide:150, grid:[], width:0, last:null};

spaceLine.strokeText=function(text, offset) {		
	spaceLine.fillStyle="#fff";
	spaceLine.context.fillText(
		text, 
		(-spaceLine.context.measureText(text).width)/2,
		(+1.2*offset*spaceLine.textSize)/2+spaceLine.textSize/4
	);
}

spaceLine.initialise=function(canvas) {
	spaceLine.canvas=canvas;
	spaceLine.context=canvas.getContext('2d');
	spaceLine.context.shadowBlur=0;
	spaceLine.context.strokeStyle="rgba(0,0,0,0)";
	spaceLine.context.fillStyle="rgba(0,0,0,0.1)";
	spaceLine.context.fillRect(-spaceLine.canvas.width/2,-spaceLine.canvas.height/2, spaceLine.canvas.width, spaceLine.canvas.height);
	spaceLine.context.shadowBlur=5;
	spaceLine.context.strokeStyle="#fff";
	spaceLine.textSize=spaceLine.width*10;
	spaceLine.width=Math.floor(spaceLine.canvas.width/spaceLine.divide);
	spaceLine.context.strokeStyle="rgba(255,255,255,0.05)";

	spaceLine.width=canvas.width/spaceLine.divide;
	spaceLine.grid=[];
	for(var i=0; i<=spaceLine.divide; i++) {
		spaceLine.grid[i]=[];
		for(var j=0; j<=spaceLine.divide; j++) {
			spaceLine.grid[i][j]=new Grid(i-spaceLine.divide/2,j-spaceLine.divide/2,spaceLine.width);
			spaceLine.grid[i][j].col="#fff";
		}
	}
}

spaceLine.action=function(){
		var tempCanvas = document.createElement("canvas"),
    tempCtx = tempCanvas.getContext("2d");
		tempCanvas.width = canvas.width;
		tempCanvas.height = canvas.height;
		var speed=0.001;
		tempCtx.drawImage(canvas, speed*canvas.width, speed*canvas.height, (1-2*speed)*canvas.width, (1-2*speed)*canvas.height);

    spaceLine.context.shadowColor="#000";
		tempCtx.fillStyle="rgba(0,0,0,0.1)";
		tempCtx.fillRect(0,0, spaceLine.canvas.width, spaceLine.canvas.height);
		spaceLine.context.fillStyle="#000";
		spaceLine.context.fillRect(-spaceLine.canvas.width/2,-spaceLine.canvas.height/2, spaceLine.canvas.width, spaceLine.canvas.height);
		spaceLine.context.rotate(Math.PI/100000);
		spaceLine.context.drawImage(tempCanvas,-tempCanvas.width/2,-tempCanvas.height/2);

    var i=Math.floor(Math.random()*(spaceLine.divide-2))+1;
    var j=Math.floor(Math.random()*(spaceLine.divide-2))+1;
    spaceLine.grid[i][j].draw(spaceLine.context);

		if(spaceLine.last != null) {
			spaceLine.context.beginPath();
				spaceLine.context.moveTo(spaceLine.last.x*spaceLine.width, spaceLine.last.y*spaceLine.width);
				spaceLine.context.lineTo(spaceLine.grid[i][j].x*spaceLine.width, spaceLine.grid[i][j].y*spaceLine.width);
			spaceLine.context.stroke();
		} 
		spaceLine.last=spaceLine.grid[i][j];
}

spaceLine.complexity=function(command) {
	if(command=="decrease") {
		spaceLine.divide--;
		spaceLine.divide=Math.max(1,spaceLine.divide);
	} else if (command=="increase") {
		spaceLine.divide++;
	}
}

Machine("spaceLine", 60, spaceLine.initialise, spaceLine.action, spaceLine.complexity);

