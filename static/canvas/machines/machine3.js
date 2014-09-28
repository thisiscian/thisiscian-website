// parse arguments like python
function pyarg(args, argument) {
	var i=0, fields=[], pyargs={}
	for (var key in args) {
		fields.push(key)
	}
	for (var arg in argument) {
		split=typeof argument[arg] != typeof {} ? argument[arg].split("=") : []
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


function last(list) {
	return list[list.length-1]
}

CanvasRenderingContext2D.prototype.strokeLine=function(a,b,c,d) {
	this.beginPath()
	this.moveTo(a,b)
	this.lineTo(c,d)
	this.stroke()
}

CanvasRenderingContext2D.prototype.strokeCircle=function(a,b,c) {
	this.beginPath()
	this.arc(a,b,c,0,2*Math.PI)
	this.stroke()
}

var Machine={
	"dt":0,
	"iteration":0,
	"_names":{},
	"length":0,
	"types":{},
	"children":[],
	"byIndex":function(n){
		return n < Machine.length ?
			Machine.children[Machine._names[n]] :
			undefined
	},
	"byName":function(name){return Machine.children[name]},
}

Machine.Err=function() {
	var pa=pyarg({"message":undefined}, arguments)
	console.log("[Machine] Error: "+pa["message"])
}

Machine.adjust=function(name,value) {
	var splitName=name.split("-")
	Machine.children[splitName[1].split(":")[1]][splitName[2]]=parseFloat(value)
}

Machine.add=function() {
	var pa=pyarg({"machineName":undefined, "variables":undefined}, arguments)
	if (!pa["machineName"]) {
		this.Err("Machine.add(machineName) needs to have a defined machineName")
		return
	}
	Machine._names[Machine.length]=pa["machineName"]
	Machine.children.push(new Machine.types[pa["machineName"]]())
	var child=Machine.children[Machine.length]
	child.container=last(document.getElementsByTagName("script")).parentNode;
	child.canvas=document.createElement("canvas");
	child.container.appendChild(child.canvas)
	child.context=child.canvas.getContext('2d')
	child.canvas.width=child.container.offsetWidth
	child.canvas.height=child.container.offsetHeight
	child.w=child.canvas.width
	child.h=child.canvas.height
	child.L=Math.max(child.h,child.w)
	if(pa["variables"]) {
		for(variable in pa["variables"]) {
			if(child.adjustable[variable]) {
				child.adjustable[variable]=pa["variables"][variable]
			}
		}
	}

	child.initialise()

	adjustableDiv=document.getElementById("Machine-adjustable")
	if(adjustableDiv) {
		adjustableForm=document.createElement("form")
		adjustableDiv.appendChild(adjustableForm)
		for(variable in child.adjustable) {
			var adjustableInput=document.createElement("input")
			adjustableForm.innerHTML+="<br/>"+pa["machineName"]+":"+Machine.length+"-"+variable
			for (attribute in child.adjustable[variable]) {
				adjustableInput.setAttribute(attribute, child.adjustable[variable][attribute])
			}
			adjustableInput.name="machine-"+pa["machineName"]+":"+Machine.length+"-"+variable
			
			if(child.adjustable[variable].value) {
				child[variable]=child.adjustable[variable].value
			} else {
				adjustableInput.value=child[variable]
			}
			adjustableInput.setAttribute("onchange",'Machine.adjust(this.name,this.value)')
			adjustableForm.appendChild(adjustableInput)
		}
	}
	Machine.length++
}

Machine.update=function() {
	for (var i=0; i<Machine.length; i++) {
		child=Machine.children[i]
		child.canvas.width=child.container.offsetWidth
		child.canvas.height=child.container.offsetHeight
		child.w=child.canvas.width
		child.h=child.canvas.height
		child.update(Machine.iteration)
		child.draw()
	}
	Machine.iteration++
}

window.setInterval(Machine.update,20)
