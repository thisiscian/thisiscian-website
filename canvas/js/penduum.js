if(!Penduum) {
	var Penduum={
		"children":[],
		"canvas":{},
	}

	function PenduumChild(name) {
		this.type=new Penduum.canvas[name]()
		this.worker=new Worker("penduum/_worker."+name+".js")
		this.worker.onmessage=this.type.onmessage
		this.worker.onerror=this.type.onerror
		this.draw=this.type.draw
		this.initialise=this.type.initialise
		this.update=this.type.update
		this.keepUpdating=true
		this.frames=[]
		this.frameLimit=100
		this.direction=1
	}

	Penduum.start=function start(name) {
		if(! name in Penduum.canvas) { return }
		Penduum.children.push(new PenduumChild(name))
		var child=last(Penduum.children)
		setCanvasDetails(child)
		child.initialise()
	}
	Penduum.update=function(){
		for(var i=0; i<Penduum.children.length; i++) {
			updateCanvasDetails(Penduum.children[i])
			Penduum.children[i].draw()
			if(Penduum.children[i].keepUpdating) {
				Penduum.children[i].update()
			}
		}
	}
	Penduum.interval=window.setInterval(Penduum.update,20)
}
