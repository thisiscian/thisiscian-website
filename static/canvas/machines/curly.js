function curlyInitialise() {
  this.j=0;
  this.o=50;
  this.size=[this.canvas.width,this.canvas.height];
  this.period=1313; 
  this.r=3*this.size[1]*5;
  this.context.fillStyle="rgba(0,0,0,0.06)";
  this.canvas.style.backgroundColor="#000";
};

function curlyAction() {
  var bendAmount=this.r*(Math.sin(Machine.TAU*this.j/this.period)+1);
  var inc=1/this.o;
  this.context.fillRect(-this.size[0]/2,-this.size[1]/2, this.size[0],this.size[1]);
  for(var i=0; i<=1; i+=inc) {
    var t=new Date().getTime();
    var h=Math.floor(t/150)%255, s=50, l=i*100, a=0.5;
    var angle=Machine.TAU*i;
    var bend=bendAmount*Math.sin(angle);
    var pos=Machine.radialScale(this.size, angle);
    this.context.rotate(Machine.TAU*0.01/this.period);
    this.context.strokeStyle="hsla("+h+","+s+"%,"+l+"%,"+a+")";
    this.context.beginPath();
      this.context.moveTo(this.size[0]/2,this.size[1]/2);
      this.context.quadraticCurveTo(this.size[0]/2+bend,this.size[1]/2+bend,this.size[0]/2+pos[0],this.size[1]/2*pos[1]);
    this.context.stroke();
  }
  this.j++;
};

curlyComplexity=function(command) {
	if(command=="decrease") {
    this.o--;
    this.o=Math.max(this.o,0);
	} else if (command=="increase") {
    this.o++;
	}
};

Machine.add("curly", 60, curlyInitialise, curlyAction, curlyComplexity);
