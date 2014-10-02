/**
 * @constructor
 */

var fairCircles={size:100, grid:[]};

fairCircles.initialise=function(canvas) {
	fairCircles.canvas=canvas;
	fairCircles.context=fairCircles.canvas.getContext('2d');
	fairCircles.count=Math.floor(fairCircles.canvas.width/fairCircles.size)-2;
	fairCircles.context.strokeStyle="#fff";
	for(var i=0; i<=fairCircles.count; i++) {
		fairCircles.grid[i]=[];
		for(var j=0; j<=fairCircles.count; j++) {
			fairCircles.grid[i][j]={
				x: i-fairCircles.count/2,
				y: j-fairCircles.count/2
			};		
		}
	}
};

fairCircles.action=function() {
	var t=new Date().getTime();
	fairCircles.context.clearRect(-fairCircles.canvas.width/2,-fairCircles.canvas.height/2,fairCircles.canvas.width,fairCircles.canvas.height)
	for(var i=0; i<=fairCircles.count; i++) {
		for(var j=0; j<=fairCircles.count; j++) {
			var p=fairCircles.grid[i][j];
			var dist=Math.floor(cutil.dist(p.x,p.y));
			var col=255-Math.floor(510*(dist-1)/fairCircles.count);
			fairCircles.context.strokeStyle="rgb("+col+","+col+","+col+")";
			fairCircles.context.beginPath();
			fairCircles.context.arc(
				fairCircles.size*p.x,
				fairCircles.size*p.y, 
				fairCircles.size/2, 
				0,
				Math.PI*Math.sin(new Date().getTime()/25000+(Math.abs(p.x*fairCircles.count)+Math.abs(p.y))*Math.sin(new Date().getTime()/10000))+Math.PI,
				Math.PI*Math.cos(new Date().getTime()/22133+(Math.abs(p.x*fairCircles.count)+Math.abs(+p.y))*Math.sin(new Date().getTime()/10500))+Math.PI
			);
			fairCircles.context.stroke();
		}
	}
}

fairCircles.complexity=function(command) {
	if(command=="decrease") {
		fairCircles.size++;
		fairCircles.size=Math.min(200,fairCircles.size);
		fairCircles.initialise(fairCircles.canvas);
	} else if (command=="increase") {
		fairCircles.size--;	
		fairCircles.size=Math.max(5,fairCircles.size);
		fairCircles.initialise(fairCircles.canvas);
	}
}

Machine("fairCircles", 60, fairCircles.initialise, fairCircles.action, fairCircles.complexity);
