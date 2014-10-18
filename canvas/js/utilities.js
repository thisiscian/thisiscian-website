if(typeof thisiscian_utils === 'undefined' ) {
	var thisiscian_utils=true
	Math.TAU=2*Math.PI

	function pyarg(args, argument) {
		var i=0, fields=[], pyargs={}
		for (var key in args) {
			fields.push(key)
		}
		for (var arg in argument) {
			split=typeof argument[arg] != typeof {} && typeof argument[arg] != typeof [] ? (""+argument[arg]).split("=") : []
			// if arg is definite, i.e. "field=value", and the field is recognised
			// and the field hasn't already been defined, then define it, and
			// prevent indefinite arguments
			if (split.length > 1 && split[0] in args && !pyargs[split[0]]) {
				pyargs[split[0]]=split[1]
				i=-1
			}
			// if we can use indefinite arguments, and we haven't defined all  
			// valid fields, define the next field
			else if (i>=0 && fields.length > i) {
				pyargs[fields[i++]]=argument[arg]
			}
		}
		for (var arg in args) {
			if(args[arg] && !pyargs[arg]) {
				pyargs[arg]=args[arg]
			}
		}
		return pyargs
	}

	function invertColor(hexTripletColor) {
    var color = hexTripletColor.substring(1);
    color = parseInt(color, 16);          // convert to integer
    color = 0xFFFFFF ^ color;             // invert three bytes
    color = color.toString(16);           // convert to hex
    color = ("000000" + color).slice(-6); // pad with leading zeros
    color = "#" + color;                  // prepend #
    return color;
	} 

	function last(list) { return list[list.length-1] }
	function checkDefined(x,props) {
		for(var index in props) {
			var prop=props[index]
			if(typeof x[prop] === 'undefined') return false
		}
		return true
	}


	CanvasRenderingContext2D.prototype.strokeLine=function() {
		var pA=pyarg({"a":undefined,"b":undefined,"c":undefined,"d":undefined},arguments)
		if (checkDefined(pA,["a","b"]) && ! checkDefined(pA,["c","d"])) {
			var a=pA["a"][0]
			var b=pA["a"][1]
			var c=pA["b"][0]
			var d=pA["b"][1]	
		} else if(checkDefined(pA,["a","b","c","d"])) {
			var a=pA["a"]
			var b=pA["b"]
			var c=pA["c"]
			var d=pA["d"]
		} else {
				console.log(pA, checkDefined(pA,["a","b"]), ! checkDefined(pA,["c","d"]))
				clearInterval(Machine.interval)
				throw "Error with strokeLine"
		}
		this.beginPath()
		this.moveTo(a,b)
		this.lineTo(c,d)
		this.stroke()
	}

	CanvasRenderingContext2D.prototype.fillCircle=function(a,b,c) {
		this.beginPath()
		this.arc(a,b,c,0,Math.TAU)
		this.fill()
	}

	CanvasRenderingContext2D.prototype.strokeCircle=function(a,b,c) {
		this.beginPath()
		this.arc(a,b,c,0,Math.TAU)
		this.stroke()
	}
	
	function setCanvasDetails(child) {
		child.container=last(document.getElementsByTagName("script")).parentNode;
		child.canvas=document.createElement("canvas");
		child.container.appendChild(child.canvas)
		child.context=child.canvas.getContext('2d')
		child.canvas.width=child.container.offsetWidth
		child.canvas.height=child.container.offsetHeight
		child.w=child.canvas.width
		child.h=child.canvas.height
		child.s=[child.w,child.h]
		child.l=Math.min(child.h,child.w)
		child.L=Math.max(child.h,child.w)
	}	
	function updateCanvasDetails(child) {
		child.canvas.width=child.container.offsetWidth
		child.canvas.height=child.container.offsetHeight
		child.w=child.canvas.width
		child.h=child.canvas.height
		child.s=[child.w,child.h]
		child.l=Math.min(child.h,child.w)
		child.L=Math.max(child.h,child.w)
	}
}
