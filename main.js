function init(){
	function mod (x,y) {
		return Math.floor(x - y * Math.floor(x / y));
	}

	function Ant (id,x,y,ms,m,dire) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.deviate_coeff = 0.04;
		this.ms = ms; //mapsize
		this.m = m; //ref to map
		this.direction = dire; //0 is right, counterclockwise 0-7
	}

	Ant.prototype.forward = function() {
		if (this.direction == 7 || this.direction == 0 || this.direction == 1) {
			this.x = mod((this.x + 1),this.ms);
		} else if (this.direction == 3 || this.direction == 4 || this.direction == 5) {
			this.x = mod((this.x - 1),this.ms);
		}
		if (this.direction == 1 || this.direction == 2 || this.direction == 3) {
			this.y = mod((this.y + 1),this.ms);
		} else if (this.direction == 5 || this.direction == 6 || this.direction == 7) {
			this.y = mod((this.y - 1),this.ms);
		}
	}

	Ant.prototype.step = function() {
		if (this.m[this.x][this.y].home == true) {
			this.forward();
		} else {
			if (Math.random() < this.deviate_coeff) {
				this.direction = Math.floor(Math.random()*8);
			} else {
				this.forward(); //temp
			}
		}
		this.m[this.x][this.y].pher = Math.min((this.m[this.x][this.y].pher + 0.05), 0.99);
	}

	function Cell (food) {
		this.food = food;
		this.pher = 0.0;
		this.home = false;
	}

	function similar(a,b) {
		if (a*1.1 >= b && a*0.9 <= b) return true;
		return false;
	}

	var size = 500;
	var paper = new Raphael('maindiv', size, size);
	var mapsize = size/10;
	var tilesize = 10;
	var midpoint = Math.floor(mapsize/2);
	var map = new Array(mapsize);
	var number_of_ants = 5;
	var pher_decay_rate = 0.9998;
	for (var i=0; i < mapsize; i++) {
		map[i] = new Array(mapsize);
		for (var j=0; j < mapsize; j++) {
			map[i][j] = new Cell(Math.random() < 0.0025 ? 1 : 0);
		}
	}
	map[midpoint-1][midpoint-1].home = true; map[midpoint-1][midpoint].home = true; map[midpoint-1][midpoint+1].home = true;
	map[midpoint  ][midpoint-1].home = true; map[midpoint  ][midpoint].home = true; map[midpoint  ][midpoint+1].home = true;
	map[midpoint+1][midpoint-1].home = true; map[midpoint+1][midpoint].home = true; map[midpoint+1][midpoint+1].home = true;

	function wew (x) {return Math.min(Math.floor(255*x),255)}


	var ants = new Array(number_of_ants);
	for (var i=0; i < number_of_ants; i++) {
		ants[i] = new Ant(i,midpoint,midpoint,mapsize,map,Math.floor(Math.random()*8));
	}


/*
	setInterval(function(){
		paper.clear()
		for (var i=0; i < mapsize; i++) {
			for (var j=0; j < mapsize; j++) {
				map[i][j].pher *= pher_decay_rate;
				if (map[i][j].home == true) {
					paper.rect(i*tilesize, j*tilesize, tilesize, tilesize).attr({"fill":"white","stroke-width":"0"});
				} else if (map[i][j].food > 0.0) {
					paper.rect(i*tilesize, j*tilesize, tilesize, tilesize).attr({"fill":"yellow","stroke-width":"0"});
				} else {
					paper.rect(i*tilesize, j*tilesize, tilesize, tilesize).attr({"fill":"#00"+wew(map[i][j].pher).toString()+"00","stroke-width":"0"});
				}
			}
		}
		for (var i=0; i < number_of_ants; i++) {
			ants[i].step();
		}
	},0.5);
}
*/

for (var x=0; x < 200; x++) {
		for (var i=0; i < mapsize; i++) {
			for (var j=0; j < mapsize; j++) {
				map[i][j].pher *= pher_decay_rate;
			}
		}
		for (var i=0; i < number_of_ants; i++) {
			ants[i].step();
		}
}

paper.clear();
for (var i=0; i < mapsize; i++) {
	for (var j=0; j < mapsize; j++) {
		if (map[i][j].home == true) {
			paper.rect(i*tilesize, j*tilesize, tilesize, tilesize).attr({"fill":"white","stroke-width":"0"});
		} else if (map[i][j].food > 0.0) {
			paper.rect(i*tilesize, j*tilesize, tilesize, tilesize).attr({"fill":"yellow","stroke-width":"0"});
		} else {
			paper.rect(i*tilesize, j*tilesize, tilesize, tilesize).attr({"fill":"#00"+wew(map[i][j].pher).toString()+"00","stroke-width":"0"});
		}
	}
}}