function init(){
	var paper = new Raphael('maindiv',window.innerWidth,window.innerHeight);
	
	var renderer = new Renderer(paper,window.innerWidth,window.innerHeight);
	
	renderer.addVector(new Vector3(50,0,0));
	renderer.addVector(new Vector3(0,50,0));
	renderer.addVector(new Vector3(0,0,50));
	renderer.addVector(new Vector3(50,0,0));
	renderer.addVector(new Vector3(0,0,0));
	renderer.addVector(new Vector3(0,50,0));
	renderer.addVector(new Vector3(0,0,0));
	renderer.addVector(new Vector3(0,0,50));

	var lastTime = new Date().getTime();


	renderer.scale(4,4,4);
	renderer.translate(0,100,0);


	setInterval(function(){
		renderer.drawLines();
		var dt = new Date().getTime() - lastTime;
		lastTime = new Date().getTime();
		renderer.rotate(0.001*dt,-0.0005*dt,0.00025*dt);
	},1/20);
}
