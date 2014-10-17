/**
 * @constructor
 */

function bezierCurve(start, control1, control2, end) {
	var this_=this;
	this_.p=[start,control1,control2,end]
	this_.x=[start[0],control1[0],control2[0],end[0]]
	this_.y=[start[1],control1[1],control2[1],end[1]]
	this_.rx=[end[0],control2[0],control1[0],start[0]]
	this_.ry=[end[1],control2[1],control1[1],start[1]]
	function cubic(z,t) {
		var T=1-t
		return z[0]*t*t*t+3*z[1]*t*t*T+3*z[2]*t*T*T+z[3]*T*T*T
	}
	this_.rget=function(t) {
		return [cubic(this_.rx,t),cubic(this_.ry,t)]
	}
	this_.get=function(t) {
		return [cubic(this_.x,t),cubic(this_.y,t)]
	}
	this_.path=function(c) {
		c.moveTo(this_.x[0],this_.y[0])
		c.bezierCurveTo(this_.x[1],this_.y[1],
										this_.x[2],this_.y[2],
										this_.x[3],this_.y[3]
		)
	}
	this_.partPath=function(c,t) {
		var p=this_.get(t)
		c.moveTo(this_.x[0],this_.y[0])
		c.bezierCurveTo(this_.x[1],this_.y[1],
										this_.x[2],this_.y[2],
										p[0],p[1]	
		)
	}
	this_.rpartPath=function(c,t) {
		var p=this_.rget(t)
		c.moveTo(this_.rx[0],this_.ry[0])
		c.bezierCurveTo(this_.rx[1],this_.ry[1],
										this_.rx[2],this_.ry[2],
										p[0],p[1]	
		)}
	return this_;
}

/**
 * @constructor
 */
function flower() {
	var this_=this;
	function layerRadius(depth) {
		var l=this_.__layerRadii.length
		while(l<=depth) {
			this_.__layerRadii[l]=this_.__layerRadii[l-1]+l
			l=this_.__layerRadii.length
		}
		return Math.sqrt(2)*this_.scale*this_.__layerRadii[depth]
	}
	this_.__layerRadii=[0,1]
	this_.petalCount=36
	this_.speed=0.003
	this_.scale=100
	this_.rotateSpeed=0.0002

	this_.recordingCanvas=true
	this_.frameData=[]
	this_.layers=0

	this_.t=0
	this_.petal=[]

	this_.initialise=function() {
		this_.container.style.backgroundColor="black"
		this_.context.strokeStyle="black"
		this_.context.fillStyle="black"
		this_.update()
		for(var i=0; i<this_.petalCount; i++) {
			this_.petal[i]=[]
			var j=0
			while(layerRadius(j)<=this_.l/2.5) {
				var r=layerRadius(j), R=layerRadius(j+1)
				this_.petal[i][j]=new bezierCurve([r,r],[(r+R)/2,r],[(r+R)/2,R],[R,R])
				j++
			}
			this_.layers=j
		}
	}

	this_.update=function() {
		if(this_.petal.length<this_.petalCount) {
		}

		if(this_.i*this_.speed > 1) { this_.recordingCanvas=false }
		var T=(this_.i*this_.speed)%1
		this_.t=2*Math.pow(T,2)-Math.pow(T,4)
	}

	this_.draw=function() {
		if(!this_.recordingCanvas) {
			this_.context.putImageData(this_.frameData[this_.i%this_.frameData.length],0,0)
			return 0
		}
		this_.context.translate(this_.w/2,this_.h/2)
		var grd=this_.context.createRadialGradient(0,0,0,0,0,this_.l/2.5);
		var dist=0.8*Math.abs(this_.t-0.5)
		var distinv=dist+0.05
		grd.addColorStop(0,"black");
		grd.addColorStop(dist,"#9da");
		grd.addColorStop(distinv,"#d9a");
		grd.addColorStop(0.55,"black")

		// Fill with gradient
		this_.context.fillStyle=grd;
		this_.context.fillRect(-this_.L/2,-this_.L/2,this_.L,this_.L);

		this_.context.rotate(Math.TAU*this_.i*this_.rotateSpeed)
		this_.context.beginPath()
		for(var i=0; i<this_.petalCount; i++) {
			for(var j=0; j<this_.petal[i].length; j++) {
				this_.petal[i][j].path(this_.context)
				this_.petal[i][j].partPath(this_.context,this_.t)
				this_.petal[i][j].partPath(this_.context,1-this_.t)
				this_.petal[i][j].rpartPath(this_.context,this_.t)
				this_.petal[i][j].rpartPath(this_.context,1-this_.t)
			}
			this_.context.rotate(Math.TAU/this_.petalCount)
		}
		this_.context.stroke()
		for(var i=1; i<this_.layers; i++) {
			this_.context.strokeCircle(0,0,layerRadius(i))
		}
		this_.frameData[this_.i]=this_.context.getImageData(0,0,this_.w,this_.h)
	}
	
}

Machine.types["flower"]=flower
