function init(){
	function Ant (id,x,y) {
		this.id = id;
		this.x = x;
		this.y = y;
	}

	function Cell (food) {
		this.food = food;
		this.pher = 0.0;
	}

	var size = 500;
	var paper = new Raphael('maindiv', size);
	var mapsize = size/10;
	var tilesize = 10;
	var map = new Array(mapsize);
	for (var i=0; i < mapsize; i++) {
		map[i] = new Array(mapsize);
		for (var j=0; j < mapsize; j++) {
			map[i][j] = new Cell(Math.random < 0.05 ? 1 : 0);
			console.log(map[i][j])
		}
	}

	setInterval(function(){
		var a = 1;
	},1/5);
}
