function penduumTest() {
	this.onmessage=function(oEvent) { console.log(oEvent.data); }
	this.onerror=function(){console.log("ERROR with penduumTest")}
	this.initialise=function(){
		this.canvas.style.backgroundColor="white"
		this.worker.postMessage({"command":"initialise", "args":""})
	}
	this.draw=function(){
		this.context.strokeRect(50,50,50,50)
		this.context.strokeStyle="black"	
		this.context.strokeCircle(0,0,100)
	}
	this.update=function(){}	
	return this
}
Penduum.canvas["test"]=penduumTest
