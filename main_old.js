function Ant (id,x,y,ms,m,dire) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.deviate_coeff = 0.2;
		this.deviate_with_food = 10;
		this.ms = ms; //mapsize
		this.m = m; //ref to map
		this.nofoodpher = 0.02;
		this.foodpher = 0.05;
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

	Ant.prototype.step = function() { //what do they do when the deposit food? turn? keep going other side?
		if (this.m[this.x][this.y].home == true) {
			if (this.has_food) {
				homefood += 1;
				this.deviate_coeff *= this.deviate_with_food;
				this.has_food = false;
				this.direction = mod(this.direction +4, 8);
			}
			var t = this.getforward();
			this.x = t[0];
			this.y = t[1];
		} else {
			if (Math.random() < this.deviate_coeff && !this.has_food) {
				if (Math.random() > 0.5) { 
					this.direction = mod(this.direction - 1, 8);
				} else {
					this.direction = mod(this.direction + 1, 8);
				}
				var t = this.getforward();
				this.x = t[0];
				this.y = t[1];
			} else {//side range is +- 1, should forward have a weight of 2.0?
				var orig_dir = this.direction; //wont need this
				var lp,fp,rp;
				var f = 0;
				var t;
				
				//f
				t = this.getforward();
				fp = this.m[t[0]][t[1]].pher;
				f += this.m[t[0]][t[1]].food;
				if (this.has_food && this.m[t[0]][t[1]].home) fp += 1000;
				//r
				this.direction = mod(this.direction - 1, 8);
				t = this.getforward();
				lp = this.m[t[0]][t[1]].pher;
				f += this.m[t[0]][t[1]].food;
				if (this.has_food && this.m[t[0]][t[1]].home) lp += 1000;
				//l
				this.direction = mod(this.direction + 2, 8);
				t = this.getforward();
				rp = this.m[t[0]][t[1]].pher;
				f += this.m[t[0]][t[1]].food;
				if (this.has_food && this.m[t[0]][t[1]].home) rp += 1000;
				//wew
				if (f > 0.0 && !this.has_food) {
					this.m[this.x][this.y].pher += this.foodpher;
					this.direction = mod(orig_dir + 4, 8);
					this.has_food = true;
					this.deviate_coeff /= this.deviate_with_food;
				} else {
					this.direction = orig_dir;
					if (lp > rp && lp > fp) {
						this.direction = mod(this.direction - 1, 8);
					} else if (rp > lp && rp > fp) {
						this.direction = mod(this.direction + 1, 8);
					}
				}
				t = this.getforward();
				this.x = t[0];
				this.y = t[1];
				
			}
		}
		this.m[this.x][this.y].pher = this.m[this.x][this.y].pher + (this.has_food ? this.foodpher : this.nofoodpher); //before
		
	}