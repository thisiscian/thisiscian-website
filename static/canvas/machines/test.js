


var test={
	scaling:1.4,
	angle:0
};
var s=1
var si=0
var ss=0
test.initialise=function(canvas) {
	test.count=Math.floor(test.canvas.width/test.size)-2;
	test.context.strokeStyle="rgb(0,0,255)";
	test.context.fillStyle="rgb(125,0,0)";
	test.context.lineWidth="1";
};


test.draw=function() {
	var w=window.innerWidth
	var h=window.innerHeight
	test.context.clearRect (0,0,w,h);
	quickCalc=function(angle,s) {
		var w=window.innerWidth
		var h=window.innerHeight
		var x,y
		if(angle<=Math.PI) {
			x=0.5*(w-s)-0.5*(w-3*s)*Math.cos(angle)
			y=s
		} else if(test.angle<=2*Math.PI) {
			x=w-2*s
			y=0.5*(h-s)+0.5*(h-3*s)*Math.cos(angle)
		} else if(test.angle<=3*Math.PI) {
			x=0.5*(w-s)+0.5*(w-3*s)*Math.cos(angle)
			y=h-2*s
		} else if(test.angle<=4*Math.PI) {
			x=s
			y=0.5*(h-s)-0.5*(h-3*s)*Math.cos(angle)
		}
		return [x,y]
	}

	var quickLine=function(a,b,c,d){
		test.context.beginPath()
			test.context.moveTo(a,b)
			test.context.lineTo(c,d)
		test.context.stroke()
		return
	}

	var strokeCircle=function(x,y,r) {
		test.context.beginPath()
			test.context.arc(x,y,r,0,2*Math.PI,false)
		test.context.fill()
	}
	s=1
	var doit=function() {
		var pos=quickCalc(test.angle,s)
		test.context.strokeStyle="rgb("+255-255*Math.pow(s-ss,2)/h+",0,"+255*s/h+")"
		test.context.strokeStyle="rgb("+Math.floor(255*(1-Math.pow(Math.abs(s-ss),4)/(s*h)))+",0,"+Math.floor(255*Math.pow(s/h,0.3))+")"
		var npos=quickCalc(test.angle,test.scaling*s)
		test.context.lineWidth="1";
		quickLine(0,pos[1],w,pos[1])
		quickLine(0,pos[1]+s,w,pos[1]+s)
		quickLine(pos[0],0,pos[0],h)
		quickLine(pos[0]+s,0,pos[0]+s,h)
		test.context.lineWidth="4";
		test.context.strokeRect(pos[0],pos[1],s,s)
		quickLine(pos[0],pos[1],npos[0],npos[1])
		quickLine(pos[0]+s,pos[1],npos[0]+test.scaling*s,npos[1])
		quickLine(pos[0],pos[1]+s,npos[0],npos[1]+test.scaling*s)
		quickLine(pos[0]+s,pos[1]+s,npos[0]+test.scaling*s,npos[1]+test.scaling*s)
		s*=test.scaling	}
	while(s<=ss) {
		doit()	
	}
	var mys=quickCalc(test.angle,ss)
	strokeCircle(mys[0]+ss/2,mys[1]+ss/2,ss/16)
	while(s<h) {
		doit()
	}
	doit()
}

test.increment=function() {
	si+=0.15
	ss=window.innerHeight-Math.pow(test.scaling,si)
	if(ss<0) { si=1.6; ss=0 }
	test.angle+=Math.PI/(4*18)
		while(test.angle>4*Math.PI) {
				test.angle-=4*Math.PI
		}
	test.draw()
}




Machine.add("beam", new Beam())
