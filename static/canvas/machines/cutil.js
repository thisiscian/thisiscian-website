/**
 * @constructor
 */
function CUtil(){
	var this_=this;
	this_.projectFromAngle=function(camera,x,y,z) {
		var a={x:camera[3], y:camera[4], z:camera[5]};
		var c={x:Math.cos(a.x), y:Math.cos(a.y), z:Math.cos(a.z)};
		var s={x:Math.sin(a.x), y:Math.sin(a.y), z:Math.sin(a.z)};
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

	this_.projectPoint=function(cameraPos, cameraLook,point) {
		var a={x:this_.cart2Rad(cameraPos.x-cameraLook.x), y: this_.cart2Rad(cameraPos.y-cameraLook.y), z:this_.cart2rad(cameraPos.z-cameraLook.z)};
		var c={x:Math.cos(a.x), y:Math.cos(a.y), z:Math.cos(a.z)};
		var s={x:Math.sin(a.x), y:Math.sin(a.y), z:Math.sin(a.z)};
		var e={x:point.x-cameraPos.x, y:point.y-cameraPos.y, z:point.z-cameraPos.z};
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

	this_.dist=function(x,y) {
		return Math.sqrt(x*x+y*y);
	}

	this_.cart2Rad=function(x, y) {
		var len=Math.sqrt(x*x+y*y);
		if(y<0) {
			return -Math.acos(x/len);
		} else {
			return Math.acos(x/len);
		}
	}

	this_.rad2Cart=function(radius, angle) { 
		return {
			x: radius*Math.cos(angle),
			y: radius*Math.sin(angle)
		};
	}

	this_.rad2CartFunction=function(object, radius, angle) {
		return {
			x: function() {return radius(object)*Math.cos(angle(object)) },
			y: function() {return radius(object)*Math.sin(angle(object)) }
		}
	}

	this_.wrapLimits=function(value, lim1, lim2) {
		return value-Math.floor((value-lim1)/(lim2-lim1))*(lim2-lim1);
	}

	this_.hardLimits=function(value, lim1, lim2) {
		if(value<=lim1) {
			return lim1;
		} else if(value>=lim2) {
			return lim2;
		} else {
			return value;
		}
	}
	return this;
}

var cutil=CUtil();
