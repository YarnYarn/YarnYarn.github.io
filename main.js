function init(){ //make food decay, make food pop up
	var homefood = 0;
	function mod (x,y) {
		return Math.floor(x - y * Math.floor(x / y));
	}

	function Ant (id,x,y,ms,m,dire) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.deviate_coeff = 0.5;
		this.deviate_with_food = 10;
		this.ms = ms; //mapsize
		this.m = m; //ref to map
		this.away_pher_drop = 0.05;
		this.home_pher_drop = 0.1;
		this.withfoodjittercoeff = 1.0;
		this.withfoodnorminfluence = 1.0;
		this.withfoodnormaldropcoeff = 0.0;
		this.jitter = 0.2;
		//this.foodpher = 0.05;
		this.has_food = false;
		this.forward_preference = 1.0; //lower i think is more pref
		this.direction = dire; //0 is right, counterclockwise 0-7
	}

	Ant.prototype.getforward = function() {
		var xt = this.x;
		var yt = this.y;
		if (this.direction == 7 || this.direction == 0 || this.direction == 1) {
			xt = mod((this.x + 1),this.ms);
		} else if (this.direction == 3 || this.direction == 4 || this.direction == 5) {
			xt = mod((this.x - 1),this.ms);	
		}
		if (this.direction == 1 || this.direction == 2 || this.direction == 3) {
			yt = mod((this.y + 1),this.ms);
		} else if (this.direction == 5 || this.direction == 6 || this.direction == 7) {
			yt = mod((this.y - 1),this.ms);
		}
		return [xt, yt];
	}

	Ant.prototype.modDir = function(x) {
		this.direction = mod (this.direction + x, 8);
	}

	Ant.prototype.step = function() { //what do they do when the deposit food? turn? keep going other side?
		//first look at tiles;
		var ct,ft,lt,rt;
		var t;
		ct = this.m[this.x][this.y];

		this.modDir(-1);
		t = this.getforward();
		lt = this.m[t[0]][t[1]];

		this.modDir(1);
		t = this.getforward();
		ft = this.m[t[0]][t[1]];

		this.modDir(1);
		t = this.getforward();
		rt = this.m[t[0]][t[1]];

		this.modDir(-1); //reset
		//*******************make decisions**************************************
		if (this.has_food) { ///HAS FOOD?
			if (ct.home) {
				this.modDir(4);
				this.has_food = false;
				var t = this.getforward();
				this.x = t[0]; this.y = t[1];
			} else {
				var ljitter = Math.random() * this.jitter * this.withfoodjittercoeff;
				var rjitter = Math.random() * this.jitter * this.withfoodjittercoeff;
				ct.homepher += this.home_pher_drop;
				ct.pher += this.away_pher_drop * this.withfoodnormaldropcoeff; // ?
				if (lt.homepher+ljitter + lt.pher*this.withfoodnorminfluence > ft.homepher + ft.pher*this.withfoodnorminfluence && 
					lt.homepher+ljitter + lt.pher*this.withfoodnorminfluence > rt.homepher+rjitter + rt.pher*this.withfoodnorminfluence) {
					this.modDir(1);
				} else if (rt.homepher+rjitter + rt.pher*this.withfoodnorminfluence > ft.homepher + ft.pher*this.withfoodnorminfluence && 
					rt.homepher+rjitter + rt.pher*this.withfoodnorminfluence > lt.homepher+ljitter + lt.pher*this.withfoodnorminfluence) {
					this.modDir(-1);
				}
				var t = this.getforward();
				this.x = t[0]; this.y = t[1];
			}
		} else { ///DONT HAVE FOOD?
			if (ct.home) {
				var t = this.getforward();
				this.x = t[0]; this.y = t[1];
			} else {
				var ljitter = Math.random() * this.jitter;
				var rjitter = Math.random() * this.jitter;
				ct.pher += this.away_pher_drop;
				if (ct.food || lt.food || rt.food || ft.food) {
					this.has_food = true;
					//ct.homepher += this.home_pher_drop;
					this.modDir(4);
				} else {
					if (lt.pher+ljitter > ft.pher && lt.pher+ljitter > rt.pher+rjitter) {
						this.modDir(1);
					} else if (rt.pher+rjitter > ft.pher && rt.pher+rjitter > lt.pher+ljitter) {
						this.modDir(-1);
					}
				}
				var t = this.getforward();
				this.x = t[0]; this.y = t[1];
			}
		}//************************************************************************
	}

	function Cell (food) {
		this.food = food;
		this.pher = 0.0;
		this.homepher = 0.0;
		this.home = false;
	}

	function similar(a,b) {
		if (a*1.1 >= b && a*0.9 <= b) return true;
		return false;
	}

	var size = 500;
	var paper = new Raphael('maindiv', size, size);
	var tilesize = 10;
	var mapsize = size/tilesize;

	var midpoint = Math.floor(mapsize/2);
	var map = new Array(mapsize);
	var number_of_ants = 30;
	var pher_decay_rate = 0.97;
	for (var i=0; i < mapsize; i++) {
		map[i] = new Array(mapsize);
		for (var j=0; j < mapsize; j++) {
			map[i][j] = new Cell(0); //FOOD SPAWN
		}
	}
	var number_of_foods = 10;
	for (var i=0; i< number_of_foods; i++) {
		var x=0,y=0;
		do {
			x = Math.floor(Math.random()*mapsize);
		} while (x<midpoint+3 && x> midpoint-3) 
		do {
			y = Math.floor(Math.random()*mapsize);
		} while (y<midpoint+3 && y> midpoint-3)
		map[x][y].food = 1;
	}


	map[midpoint-1][midpoint-1].home = true; map[midpoint-1][midpoint].home = true; map[midpoint-1][midpoint+1].home = true;
	map[midpoint  ][midpoint-1].home = true; map[midpoint  ][midpoint].home = true; map[midpoint  ][midpoint+1].home = true;
	map[midpoint+1][midpoint-1].home = true; map[midpoint+1][midpoint].home = true; map[midpoint+1][midpoint+1].home = true;

	function wew (x) {
		if (x < 0.001) return 16;
		return Math.max(Math.min(Math.floor(255*x*5),255),16).toString(16);
	}

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
					paper.rect(i*tilesize, j*tilesize, tilesize, tilesize).attr({"fill":"#" +wew(map[i][j].pher).toString()++wew(map[i][j].pher).toString()+"00","stroke-width":"0"});
				}
			}
		}
		for (var i=0; i < number_of_ants; i++) {
			ants[i].step();
		}
	},0.5);
}
*/

	
	setInterval(function(){
		for (var x=0; x < 1; x++) {
				for (var i=0; i < mapsize; i++) {
					for (var j=0; j < mapsize; j++) {
						map[i][j].pher *= pher_decay_rate;
						map[i][j].homepher *= pher_decay_rate;
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
					paper.rect(i*tilesize, j*tilesize, tilesize, tilesize).attr({"fill":"#ff00ff","stroke-width":"0"});
				} else {
					console.log("#"+wew(map[i][j].homepher).toString()+wew(map[i][j].pher).toString()+"00");
					paper.rect(i*tilesize, j*tilesize, tilesize, tilesize).attr({"fill":"#"+wew(map[i][j].homepher).toString()+wew(map[i][j].pher).toString()+"00","stroke-width":"0"});
				}
			}
		}
		for (var i=0; i < number_of_ants; i++) {
			if (ants[i].has_food)
			{
				paper.rect(ants[i].x*tilesize, ants[i].y*tilesize, tilesize, tilesize).attr({"fill":"#7777ff","stroke-width":"0"});
			} else {
				paper.rect(ants[i].x*tilesize, ants[i].y*tilesize, tilesize, tilesize).attr({"fill":"#0000ff","stroke-width":"0"});
			}
		}
		//console.log(homefood);
	},1);
}
/*
	for (var x=0; x < 10000; x++) {
			for (var i=0; i < mapsize; i++) {
				for (var j=0; j < mapsize; j++) {
					map[i][j].pher *= pher_decay_rate;
					map[i][j].homepher *= pher_decay_rate;
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
				paper.rect(i*tilesize, j*tilesize, tilesize, tilesize).attr({"fill":"#ff00ff","stroke-width":"0"});
			} else {
				paper.rect(i*tilesize, j*tilesize, tilesize, tilesize).attr({"fill":"#"+wew(map[i][j].homepher).toString()+wew(map[i][j].pher).toString()+"00","stroke-width":"0"});
			}
		}
	}
	
	for (var i=0; i < number_of_ants; i++) {
		if (ants[i].has_food)
		{
			paper.rect(ants[i].x*tilesize, ants[i].y*tilesize, tilesize, tilesize).attr({"fill":"#7777ff","stroke-width":"0"});
		} else {
			paper.rect(ants[i].x*tilesize, ants[i].y*tilesize, tilesize, tilesize).attr({"fill":"#0000ff","stroke-width":"0"});
		}
	}
	
}*/
//console.log(homefood);