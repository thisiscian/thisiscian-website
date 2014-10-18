function initialise() { postMessage("thread is initialising") }
function update() { postMessage("thread is updating") }
function clear() { postMessage("thread is clearing") }
function createFrame() {}

onmessage = function (oEvent) {
	var data=oEvent.data
	switch(data.command) {
		case "initialise": initialise(data.args); break
		case "update": update(data.args); break
		case "clear": update(data.args); break
		case "createFrame": update(data.args); break
	}
};
