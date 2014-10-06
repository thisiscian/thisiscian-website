/**
 * @constructor
 */
function worm() {
	var this_=this;
	this_.adjustable={
	}
	this_.scale=[0.8,0.8]
	this_.segments=[]
	this_.segmentAngles=[]
	this_.segmentCount=10
	for(var i=0;i<this_.segmentCount;i++) {
		this_.segments[i]=[i/this_.segmentCount,0.5+0.25*Math.cos(2*Math.PI*i/this_.segmentCount)]
	}
	this_.segments[0][2]=0
	this_.segments[0][3]=0
	last(this_.segments)[2]=0
	last(this_.segments)[4]=0
	function cartToRad(a,b) {
		var c=[b[0]-a[0],b[1]-a[1]]
		var mult=1
		var val=0
		if(c[0] < 0) { val-=Math.PI; mult=-1 }
		if(c[0]==0) { return mult*Math.PI/2 }
		val=Math.atan(c[1]/c[0])
		return val
	}

	for(var i=1;i<this_.segmentCount-1;i++) {
		var now=this_.segments[i+0]
		var pre=this_.segments[i-1]
		var nex=this_.segments[i+1]
		this_.segments[i][2]=cartToRad(now,pre)
		this_.segments[i][3]=cartToRad(now,nex)
	}
	this_.initialise=function() {
		this_.container.style.backgroundColor="white"
		this_.context.strokeStyle="black"
		this_.context.lineWidth="10px"
	}
	this_.update=function() {
	}
	this_.draw=function() {
		function getAbsPos(size,scale,position) {
			return [
				size[0]*(0.5+scale[0]*(position[0]-0.5)),
				size[1]*(0.5+scale[1]*(position[1]-0.5))
			]
		}
		function drawWormEnd(x,y,r,a,d) {
			this_.context.beginPath()
			this_.context.arc(x,y,r,a,a+Math.PI)
			this_.context.lineTo(x,y-r)
			this_.context.lineTo(x+d/2*Math.sin(a),y-r)
			this_.context.lineTo(x+d/2*Math.sin(a),y+r)
			this_.context.lineTo(x,y+r)
			this_.context.fill()
		}
		function averageSeg(i,j) {
			var av=[]
			for(var k=0;k<2;k++) {
				av[k]=(this_.segments[i][k]+this_.segments[j][k])/2	
			}
			av=getAbsPos(this_.s,this_.scale,av)
			av[2]=(this_.segments[i][2]+this_.segments[j][3])/2+Math.PI/2
			return av
		}

		function drawWormMiddle(i,l) {
			var now=getAbsPos(this_.s,this_.scale,this_.segments[i])
			var pre=getAbsPos(this_.s,this_.scale,this_.segments[i-1])
			var nex=getAbsPos(this_.s,this_.scale,this_.segments[i+1])
			var avgPre=averageSeg(i,i-1)
			var avgNex=averageSeg(i+1,i)
			var avgA=(this_.segments[i][3]+this_.segments[i][2])/2+Math.PI/2
			this_.context.strokeStyle="red"
			this_.context.beginPath()
				this_.context.moveTo(avgPre[0]-l*Math.cos(avgPre[2]), avgPre[1]-l*Math.sin(avgPre[2]))	
				this_.context.lineTo(avgPre[0]+l*Math.cos(avgPre[2]), avgPre[1]+l*Math.sin(avgPre[2]))	
				this_.context.quadraticCurveTo(
					now[0]+l*Math.cos(avgA), now[1]+l*Math.sin(avgA),
					avgNex[0]+l*Math.cos(avgNex[2]), avgNex[1]+l*Math.sin(avgNex[2]))	
				this_.context.lineTo(avgNex[0]-l*Math.cos(avgNex[2]), avgNex[1]-l*Math.sin(avgNex[2]))	
				this_.context.quadraticCurveTo(
					now[0]-l*Math.cos(avgA), now[1]-l*Math.sin(avgA),
					avgPre[0]-l*Math.cos(avgPre[2]), avgPre[1]-l*Math.sin(avgPre[2]))	
			this_.context.fill()
			this_.context.strokeStyle="black"
		}
		function drawWorm() {
			var i=0
			var centerFirst=getAbsPos(this_.s,this_.scale,this_.segments[0])
			var centerSecond=getAbsPos(this_.s,this_.scale,this_.segments[1])
			var centerLast=getAbsPos(this_.s,this_.scale,last(this_.segments))
			var dist=centerSecond[0]-centerFirst[0]
			var width=this_.L/30
			this_.context.fillStyle="#555577"
			drawWormEnd(centerFirst[0],centerFirst[1],width,Math.PI/2,dist)
			this_.context.fillStyle="#557755"
			for(var index=1;index<this_.segments.length-1;index++) {
				segment=this_.segments[index]
				segmentNext=this_.segments[index+1]
				var center=getAbsPos(this_.s,this_.scale,segment)
				var centerNext=getAbsPos(this_.s,this_.scale,segmentNext)
				drawWormMiddle(index,width)
				if(i++%2==1) {
					this_.context.fillStyle="#557755"
				} else {
					this_.context.fillStyle="#555577"
				}	
			}
			drawWormEnd(centerLast[0],centerLast[1],width,3*Math.PI/2,dist)
		}
		drawWorm()
	}
}

Machine.types["worm"]=worm
