/**
 * @constructor
 */
function Machine(name, FPS, initialise, action, complexity) {
	this.name=name;
	this.action=action;
	this.complexity=complexity;
	this.initialise=initialise;
	this.FPS={
		iteration:0,
		target:FPS,
		starts:[],
		stops:[],
		memory:5,
		startTime:new Date().getTime(),
		start:function() {
			var now=new Date().getTime();
			this.starts[this.iteration%this.memory]=now-this.startTime;
			this.startTime=now;
		},
		stop:function() {
			this.stops[this.iteration%this.memory]=new Date().getTime()-this.startTime;
			this.iteration++;
		},
		framerate:function() {
			var start=0;
			for(var i=0; i<this.starts.length; i++) {
				start+=this.starts[i];
			}
			return 1000*this.starts.length/start;
		},
		action:function() {
			var stop=0;
			for(var i=0; i<this.stops.length; i++) {
				stop+=this.stops[i];
			}
			return 1000*this.stops.length/stop;
		}
	}

	this.iterate=function(){
		this.FPS.start();	
		this.action();
		this.FPS.stop();
		if( this.FPS.action() > 1.3*this.FPS.target && this.FPS.framerate() > 0.9 * this.FPS.target) {
			this.complexity("increase");
		} else if ( this.FPS.action() < 0.5*this.FPS.framerate() ) {
			this.complexity("decrease");
		}
	};


	/** inject canvas **/
  var scripts = document.getElementsByTagName("script");
  var selfScript = scripts[scripts.length-1];
  var parentOfScript=selfScript.parentNode;
  this.canvas=document.createElement("canvas");
  this.canvas.id=this.name;
  this.canvas.width= Math.min(parentOfScript.offsetWidth, Math.min(window.innerHeight,window.innerWidth));
  this.canvas.height=Math.min(parentOfScript.offsetWidth, Math.min(window.innerHeight,window.innerWidth));
  this.canvas.style.backgroundColor="#000"
  this.canvas.innerHTML="sorry, this canvas element needs to be viewed in a html5 compatible browser";
  parentOfScript.appendChild(canvas);
	/** end of inject canvas **/

	this.canvas.getContext('2d').translate(this.canvas.width/2,this.canvas.height/2);
	this.initialise(this.canvas);
	setInterval(this.iterate,1000/this.FPS.target);
}

function positionCamera(camera) {
	var a={x:camera[3], y:camera[4], z:camera[5]};
	var c={x:Math.cos(a.x), y:Math.cos(a.y), z:Math.cos(a.z)};
	var s={x:Math.sin(a.x), y:Math.sin(a.y), z:Math.sin(a.z)};
	return function(x,y,z) {
    var e={x:x-camera[0], y:y-camera[1], z:z-camera[2]};
    var d={
      x:c.y*(s.z*e.y+c.z*e.x)-s.y*e.z,
      y:s.x*(c.y*e.z+s.y*(s.z*e.y+c.z*e.x))+c.x*(c.z*e.y-s.z*e.x),
      z:c.x*(c.y*e.z+s.y*(s.z*e.y+c.z*e.x))-s.x*(c.z*e.y-s.z*e.x)
    };
    var b={
      x:e.z*d.x*d.z+e.x, 
      y:e.z*d.y*d.z+e.y
    };
    if(d.z==0) {b.x=+e.x,b.y=+e.y}; 
    return b;
	}
}

