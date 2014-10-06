/**
 * @constructor
 */
function backlit() {
	var this_=this;
	this_.adjustable={
	}
	this_.scale=1
	this_.speed=Math.PI/(6)
	this_.position=0
	this_.randomScale=5
	this_.arcCount=8
	this_.arcSpread=Math.PI/12
	this_.arcEcho=10
	this_.arcs=[]
	for(var i=0; i<this_.arcCount; i++) {
		var angle=Math.TAU*i/this_.arcCount
		this_.arcs[i]=[angle,angle+this_.arcSpread]
	}
	this_.stepDist=1.2*Math.PI/42
	this_.initialise=function() {
		this_.container.style.backgroundColor="black"
	}
	this_.update=function() {
		this_.position+=this_.speed
		var change=Math.cos(this_.position)/2
		for(var index in this_.arcs) {
			var arc=this_.arcs[index]
			var randomMod=this_.randomScale*(Math.random()-0.5)+1
			arc[0]-=this_.stepDist*randomMod*(change>0?change:0)
			arc[1]-=this_.stepDist*randomMod*(change<0?change:0)
		}
	}
	this_.draw=function() {
		function toCart(r,a,x,y) { return [r*Math.cos(a)+x,r*Math.sin(a)+y] }
		function drawArc(a1,a2,r1,r2) {
			var ca1=toCart(r1,a1,this_.w/2,this_.h/2)
			var cr1=toCart(r2,a1,this_.w/2,this_.h/2)
			var ca2=toCart(r1,a2,this_.w/2,this_.h/2)
			var cr2=toCart(r2,a2,this_.w/2,this_.h/2)
			this_.context.beginPath()
				this_.context.moveTo(ca1[0],ca1[1])
				this_.context.bezierCurveTo(
					cr1[0],cr1[1],
					cr2[0],cr2[1],
					ca2[0],ca2[1]
				)
			this_.context.fill()
		}
		function invertCircle(r,x,y) {
			var imageData=this_.context.getImageData(x-r,y-r,2*r,2*r);
			var data=imageData.data
			var data2=[data.length]
			for(var h=0;h<data.length;h+=4) {
				var i=Math.floor(h/(8*r))
				var j=(h/4)%(2*r)
				if(Math.pow(i-r,2)+Math.pow(j-r,2)<Math.pow(r,2)) {
					data[(data.length-3)-(h+2)]=Math.min(255,2*data[h+2])
					data[(data.length-3)-(h+1)]=Math.min(255,2*data[h+1])
					data[(data.length-3)-(h+0)]=Math.min(255,2*data[h])
					data[h+1]=0//255-data[h+1]
					data[h+0]=0//255-data[h+2]

				}
				for(var k=0;k<4;k++) {
					data2[4*(2*r*(r-i)+j)+k]=data[h+k]
				}
			}
			imageData.data=data2.slice(0)
			this_.context.putImageData(imageData,x-r,y-r)
		}

		var lineWidth=this_.scale*this_.L/100
		var circleRadius=this_.scale*this_.L/10

		this_.context.strokeStyle="#000000"
		this_.context.lineWidth=lineWidth
		for(var index in this_.arcs) {
			var arc=this_.arcs[index]
			for(var i=0; i<this_.arcEcho; i++) {
				var col=Math.floor((i)*255/this_.arcEcho)
				this_.context.fillStyle="rgba("+col+","+col+","+col+",0.01)"
				drawArc(arc[0],arc[1],circleRadius,circleRadius*(1+i/(2*this_.archEcho)))
				this_.context.fillStyle="rgba(0,0,55,0.5)"
				drawArc(arc[0],arc[1], circleRadius, circleRadius*(1+2*this_.archEcho))
			}
		}
		this_.context.strokeCircle(this_.w/2,this_.h/2,this_.L/10)
		//invertCircle(this_.L/10,this_.w/2,this_.h/2)
	}
}

Machine.types["backlit"]=backlit
