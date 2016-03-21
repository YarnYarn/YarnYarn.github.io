//DEGREES DEGREES DEGREES DEGREES!!!!!!!!!!!!!!!!!
//backbone and node 
//all about origin

function Vector3(x,y,z){ //scale rotate translate
	this.x = x;
	this.y = y;
	this.z = z;
	this.projection_mode = "ORTHOGONAL";
	this.scale = function(x,y,z){
		this.x *= x;
		this.y *= y;
		this.z *= z;
	}
	this.rotate = function(x,y,z){
		var tempx,tempy,tempz;
		//x
		//this.x = this.x;
		tempy = this.y;
		tempz = this.z;
		this.y = tempy*Math.cos(x) + tempz*Math.sin(x);
		this.z = -tempy*Math.sin(x) + tempz*Math.cos(x);
		//y
		tempx = this.x;
		tempz = this.z;
		this.x = tempx*Math.cos(y) - tempz*Math.sin(y);
		//this.y = this.y;
		this.z = tempx*Math.sin(y) + tempz*Math.cos(y);
		//z
		tempx = this.x;
		tempy = this.y;
		this.x = tempx*Math.cos(z) + tempy*Math.sin(z);
		this.y = -tempx*Math.sin(z) + tempy*Math.cos(z);
		//this.z = this.z;
	}
	this.translate = function(x,y,z){
		this.x += x;
		this.y += y;
		this.z += z;
	}
	this.getProjection = function(){
		if (this.projection_mode == "ORTHOGONAL"){
			return [this.x,this.y];
		}
	}
	this.toStr = function(){
		return this.x.toString()+","+this.y.toString()+","+this.z.toString();
	};
}

function Renderer(screen,width,height){
	this.width = width;
	this.height = height;
	this.vectors = [];
	this.scale = function(x,y,z){
		for (var i=0;i<this.vectors.length;i++){
			this.vectors[i].scale(x,y,z);
		}
	}
	this.rotate = function(x,y,z){
		for (var i=0;i<this.vectors.length;i++){
			this.vectors[i].rotate(x,y,z);
		}
	}
	this.translate = function(x,y,z){
		for (var i=0;i<this.vectors.length;i++){
			this.vectors[i].translate(x,y,z);
		}
	}
	this.addVector = function(vector){
		this.vectors[this.vectors.length] = vector;
	}
	this.drawLines = function(){
		screen.clear();
		for (var i=0;i<this.vectors.length-1;i++){
			screen.path("M"+(this.vectors[i].getProjection()[0]+this.width/2).toString()+" "+
				(this.vectors[i].getProjection()[1]+this.height/2).toString()+"L"+
				(this.vectors[i+1].getProjection()[0]+this.width/2).toString()+" "+
				(this.vectors[i+1].getProjection()[1]+this.height/2).toString()).attr({stroke:'#ffffff'});
		}
	}
}
