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
	this_.T=0
	this_.t=0
	this_.i=0
	this_.petalCount=18
	this_.petal=[]
	this_.stopRecord=0
	this_.record=[]
	var fact=[0,1]//,3,7,15,31]
	var a=100
	this_.initialise=function() {
		this_.container.style.backgroundColor="white"
		this_.context.strokeStyle="black"
		this_.context.fillStyle="black"
		this_.context.lineWidth="10px"
		for(var i=0; i<this_.petalCount; i++) {
			this_.petal[i]=[]
			var j=0
			while(this_.L>fact[j]*2*a && j<fact.length) {
				var x=a*fact[j]
				var y=a*fact[j+1]
				this_.petal[i][j]=new bezierCurve([x,x],[(y+x)/2,x],[(y+x)/2,y],[y,y])
				j++
			}
		}
	}
	this_.update=function() {
		this_.i+=1
		this_.T=0.01*this_.i
		if(this_.T>=1) { this_.T=this_.T%1; this_.i=0; this_.stopRecord=1; }
		this_.t=2*Math.pow(this_.T,2)-Math.pow(this_.T,4)
	}
	function LovelyBezier(i) {
		for(var j=0; j<this_.petal[i].length; j++) {
			this_.petal[i][j].path(this_.context)
			this_.petal[i][j].partPath(this_.context,this_.t)
			this_.petal[i][j].partPath(this_.context,1-this_.t)
			this_.petal[i][j].rpartPath(this_.context,this_.t)
			this_.petal[i][j].rpartPath(this_.context,1-this_.t)
		}
	}
	this_.draw=function() {
		if(this_.stopRecord==1) {
			this_.context.putImageData(this_.record[this_.i],0,0)
			return 0
		}
		this_.context.translate(this_.w/2,this_.h/2)
		this_.context.rotate(Math.PI*this_.T)
		this_.context.beginPath()
		for(var i=0; i<this_.petalCount; i++) {
			LovelyBezier(i)
			this_.context.rotate(2*Math.PI/this_.petalCount)
		}
		this_.context.stroke()
		this_.context.strokeCircle(0,0,141)
		this_.context.strokeCircle(0,0,3*141)
		this_.record[this_.i]=this_.context.getImageData(0,0,this_.w,this_.h)
	}
	
}

Machine.types["flower"]=flower
