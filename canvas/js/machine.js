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
	"byName":function(name){return Machine.children[name]}
}

Machine.Err=function() {
	var pa=pyarg({"message":undefined}, arguments)
	console.log("[Machine] Error: "+pa["message"])
}

Machine.adjust=function(name,value) {
	var splitName=name.split("-")
	Machine.children[splitName[1].split(":")[1]][splitName[2]]=parseFloat(value)
}
Machine.start=function() {
	var pa=pyarg({"machineName":undefined, "variables":undefined}, arguments)
	if (!pa["machineName"]) {
		this.Err("Machine.add(machineName) needs to have a defined machineName")
		return
	}
	Machine._names[Machine.length]=pa["machineName"]
	Machine.children.push(new Machine.types[pa["machineName"]]())
	var child=Machine.children[Machine.length]
	setCanvasDetails(child)
	child.i=0
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
		child.L=Math.max(child.w,child.h)
		child.l=Math.max(child.w,child.h)
		child.s=[child.w,child.h]
		child.draw()
		child.i++
		child.update(Machine.iteration)
	}
	Machine.iteration++
}

Machine.interval=window.setInterval(Machine.update,20)
