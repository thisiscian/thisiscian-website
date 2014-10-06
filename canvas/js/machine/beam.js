/**
 * @constructor
 */
function beam() {
	var this_=this;
	this_.adjustable={
		"scaling":    {"type":"range","min":1.1,"max":3,"step":0.1},
		"insideScale":{"type":"range","min":0,"max":1, "step":0.00001},
		"cameraSpeed":{"type":"range","min":-0.02,"max":0.02,"step":0.0001},
		"cameraPathScale":{"type":"range","min":0,"max":1, "step":0.00001},
		"darkScale":  {"type":"range","min":0,"max":1, "step":0.00001},
		"brightness": {"type":"range","min":0,"max":255},
		"pulseSpeed": {"type":"range","min":1,"max":3,"step":0.1},
		"pulseDelay": {"type":"range","min":0,"max":10,"step":0.1},
	}
	this_.pulsePosition=1
	this_.pulseBrightness=255
	this_.pulseSpeed=1.03
	this_.pulseDelay=2
	this_.scaling=1.2
	this_.insideScale=0.5
	this_.darkScale=0.5
	this_.brightness=200
	this_.cameraPosition=0
	this_.cameraSpeed=0.001
	this_.cameraPathScale=0.1
	this_.cameraPath=[ // move in a angular hour glass shape
		[-1,-1],
		[1,-1],
		[1,1],
		[-1,1],
	]
	this_.initialise=function() {
		this_.container.style.backgroundColor="#000000"
	}
	this_.update=function() {
		this_.pulsePosition*=this_.pulseSpeed
		if(this_.pulsePosition>=Math.pow(Math.max(this_.w,this_.h),this_.pulseDelay)){this_.pulsePosition=1}

		this_.cameraPosition+=this_.cameraSpeed
		while(this_.cameraPosition>1) { this_.cameraPosition-=1 }
		while(this_.cameraPosition<0) { this_.cameraPosition+=1 }
	}
	this_.draw=function() {
		this_.context.clearRect (0,0,this_.w,this_.h)
		var pathIndex=Math.floor(this_.cameraPosition*this_.cameraPath.length)
		var pathProgress=this_.cameraPosition*this_.cameraPath.length-pathIndex
			this_.context.lineWidth=1

		function getPos(size) {
			var b1=this_.cameraPath[pathIndex]
			var b2=pathIndex+1<this_.cameraPath.length ? this_.cameraPath[pathIndex+1]: this_.cameraPath[0]
			var x=size+0.5*(this_.w-3*size)*(this_.cameraPathScale*(b1[0]+pathProgress*(b2[0]-b1[0]))+1)
			var y=size+0.5*(this_.h-3*size)*(this_.cameraPathScale*(b1[1]+pathProgress*(b2[1]-b1[1]))+1)
			return [x,y]
		}

		len=Math.max(this_.h,this_.w)
		p1=getPos(0)
		p2=getPos(len)
		var size=1
		while(size<this_.h) {
			var pulseLight=Math.floor(this_.pulseBrightness*Math.pow(size/len,this_.darkScale/2)*Math.exp(-Math.pow(this_.darkScale*Math.log(this_.pulsePosition/size)/(Math.log(this_.scaling)),2)))
			var lightScale=Math.max(Math.floor(this_.brightness*Math.pow(size/len,this_.darkScale)),pulseLight)
			pos=getPos(size)
			this_.context.strokeStyle="rgb("+lightScale+",0,0)"
			this_.context.strokeRect(pos[0]+0.5*size*(1-this_.insideScale),pos[1]+0.5*size*(1-this_.insideScale),this_.insideScale*size,this_.insideScale*size)
			this_.context.strokeStyle="rgb(0,"+lightScale+",0)"
			this_.context.strokeLine(0,pos[1],this_.w,pos[1])
			this_.context.strokeLine(pos[0],0,pos[0],this_.h)
			this_.context.strokeLine(0,pos[1]+size,this_.w,pos[1]+size)
			this_.context.strokeLine(pos[0]+size,0,pos[0]+size,this_.h)
			this_.context.strokeStyle="rgb(0,0,"+lightScale+")"
			this_.context.strokeRect(pos[0],pos[1],size,size)
			size*=this_.scaling
		}
		size=1	
		var light=Math.floor(this_.brightness*(1-this_.darkScale))
		var pulseLight=Math.floor(this_.pulseBrightness*Math.exp(-Math.pow(Math.log(this_.pulsePosition/1)/(Math.log(this_.scaling)),2)))
//		lighte=Math.max(lighte,pulseLight)

		var redGradient=this_.context.createLinearGradient(p1[0],p1[1],p2[0],p2[1])
		redGradient.addColorStop(1,"rgb("+this_.brightness+",0,0)")
		redGradient.addColorStop(0,"rgb("+light+",0,0)")
		this_.context.strokeStyle=redGradient
		this_.context.strokeLine(p1[0],p1[1],p2[0]+0.5*len*(1-this_.insideScale),p2[1]+0.5*len*(1-this_.insideScale))
		this_.context.strokeLine(p1[0],p1[1],p2[0]+0.5*len*(1+this_.insideScale),p2[1]+0.5*len*(1-this_.insideScale))
		this_.context.strokeLine(p1[0],p1[1],p2[0]+0.5*len*(1+this_.insideScale),p2[1]+0.5*len*(1+this_.insideScale))
		this_.context.strokeLine(p1[0],p1[1],p2[0]+0.5*len*(1-this_.insideScale),p2[1]+0.5*len*(1+this_.insideScale))


		var blueGradient=this_.context.createLinearGradient(p1[0],p1[1],p2[0],p2[1])
		blueGradient.addColorStop(1,"rgb(0,0,"+this_.brightness+")")
		blueGradient.addColorStop(0,"rgb(0,0,"+light+")")
		this_.context.strokeStyle=blueGradient
		this_.context.strokeLine(p1[0],p1[1],p2[0],p2[1])
		this_.context.strokeLine(p1[0],p1[1],p2[0],p2[1]+len)
		this_.context.strokeLine(p1[0],p1[1],p2[0]+len,p2[1]+len)
		this_.context.strokeLine(p1[0],p1[1],p2[0]+len,p2[1])
	}
}

function beamInstall() {
	if(Machine===undefined) {
		setTimeout(beamInstall, 100)
	} else {
		Machine.types["beam"]=beam
	}
}

beamInstall()
