
/**
 * @constructor
 */

function machineLog(msg) {
  console.log("[machine] "+ msg);
}

function Timer(fps) {
  var this_=this;
  this_.iteration=0;
  this_.target=fps;
  this_.starts=[];
  this_.stops=[];
  this_.memory=5;
  this_.startTime=new Date().getTime();
  this_.start=function() { var now=new Date().getTime(); this_.starts[this_.iteration%this_.memory]=now-this_.startTime; this_.startTime=now; };
  this_.stop=function() { this_.stops[this_.iteration++%this_.memory]=new Date().getTime()-this_.startTime; };
  this_.framerate=function() {
    var start=0;
    for(var i=0; i<this_.starts.length; i++) {
      start+=this_.starts[i];
    }
    return 1000*this_.starts.length/start;
  };
  this_.action=function() {
    var stop=0;
    for(var i=0; i<this_.stops.length; i++) {
      stop+=this.stops[i];
    }
    return 1000*this_.stops.length/stop;
  };
  return this_;
}

/**
 * @constructor
 */
function Machinelet(canvas, FPS, initialise, action, complexity) {
  var this_=this;
  this_.canvas=canvas;
  this_.context=this_.canvas.getContext('2d');
  this_.action=action;
	this_.complexity=complexity;
	this_.initialise=initialise;
  this_.timer=new Timer(FPS);
  this_.initialise();

  this_.iterate=function(logLevel){
    if(logLevel>=2) { machineLog("starting timer for "); }
    this_.timer.start();	
    if(logLevel>=2) { machineLog("executing action"); }
    this_.action();
    if(logLevel>=2) { machineLog("stopping timer"); }
    this_.timer.stop();
    if(logLevel>=2) { machineLog("deciding if complexity should be changed"); }
    if(this_.timer.action()>1.3*this_.timer.target && this_.timer.framerate()>0.9*this_.timer.target) {
      if(logLevel>=2) { machineLog("increasing complexity"); }
      this_.complexity("increase");
    } else if(this_.timer.action() < 0.5*this_.timer.framerate() ) {
      if(logLevel>=2) { machineLog("decreasing complexity"); }
      this_.complexity("decrease");
    }
  };
}

/**
 * @constructor
 */
function MachineBox() {
  var this_=this;
  this_.logLevel=0;
  this_.TAU=2*Math.PI;
  this_.objects={};
  this_.injectCanvas=function(name) {
    var sList=document.getElementsByTagName("script");
    var s=sList[sList.length-1];
    var sParent=s.parentNode;
    var canvas=document.createElement("canvas");
    var minAspect=Math.min(window.innerHeight,window.innerWidth);
    canvas.id=name;
    canvas.width=Math.min(sParent.offsetWidth, minAspect);
    canvas.height=Math.min(sParent.offsetWidth, minAspect);
    canvas.style.backgroundColor="#000";
    canvas.innerHTML="sorry, this canvas element needs to be viewed in a html5 compatible browser";
    sParent.appendChild(canvas);
    return canvas;
  };
  this_.add=function(name, fps, initialise, action, complexity) {
    if(this_.logLevel>=1) { machineLog("creating canvas called " + name); }
    var canvas=this_.injectCanvas(name);
    if(this_.logLevel>=1) { machineLog("repositioning canvas"); }
    canvas.getContext('2d').translate(canvas.width/2,canvas.height/2);
    if(this_.logLevel>=1) { machineLog("creating machine for " + name); }
    this_.objects[name]=new Machinelet(canvas, fps, initialise, action, complexity);
  };

  this_.radialScale=function(scale, angle) {
    if(!scale.length || scale.length < 2) {
      return [scale*Math.cos(angle),scale*Math.sin(angle)];
    } else {
    return [scale[0]*Math.cos(angle),scale[1]*Math.sin(angle)];
    }
  }

  setInterval(function() {
    for(var key in this_.objects) {
      if(this_.logLevel>=1) { machineLog("iterating on " + key); }
      this_.objects[key].iterate(this_.logLevel);
    }
  }, 1);
  return this_;
}

if(!Machine) { var Machine = new MachineBox(); machineLog("starting up the machine"); }
Machine.logLevel=1;
