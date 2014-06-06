$(document).ready(function() {
	var pad = 50;
	var h = $(window).height() - pad * 2;
	var w = h * 0.75;

	var svg = d3.select("#game")
		.append("svg")
		.attr("height", h)
		.attr("width", w)
		.attr("id", "svgMain")
		.style("background-color", "#B2E5DC");

	// make the paddles

	var make_paddle_body = function(phase) {
		name = phase + "_paddle";
		if ( phase === "crescent" ) {
			x = 2;
			color = "white";
		} else {
			x = w / 2 + 2;
			color = "black";
		}
		y = h - 50;
		var body = svg.selectAll(name)
			.data([true])
			.enter()
			.append("rect")
			.attr("height", 15)
			.attr("width", w / 2 - 4)
			.attr("x", x)
			.attr("y", y)
			.attr("fill", color);
		return body;
	}

	function Paddle(phase) {
		this.body = make_paddle_body(phase);
		if (phase === "crescent") {
			this.phase = "crescent";
			this.left = true;
		} else {
			this.phase = "gibbous";
			this.left = false;
		}

		this.flip = function() {
			if ( this.left ) {
				new_x = w / 2 + 2;
				this.left = false;
			} else {
				new_x = 2;
				this.left = true;
			}
			this.body.transition()
				.duration(100)
				.attr("x", new_x);
		}
		this.stats = function() {
			if ( this.left ) {
				bit = ": left";
			} else {
				bit = ": right";
			}
			console.log(this.phase + bit);
		}
	}

	function Paddles() {
		this.crescent = new Paddle("crescent");
		this.gibbous = new Paddle("gibbous");
		this.wax = true;
		this.swap = function() {
			if ( this.wax ) {
				this.wax = false;
			} else {
				this.wax = true;
			}
			this.crescent.flip();
			this.gibbous.flip();
		}
		this.stats = function() {
			this.crescent.stats();
			this.gibbous.stats();
		}
	}

	// make the meteorites

	var random = function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	var make_meteorite_body = function(left, phase, name, x, y, size) {
		if ( phase === "crescent") {
			color = "white";
		} else {
			color = "black";
		}
		if ( !left ) {
			x += w/2;
		}
		body = svg.selectAll(name)
			.data([true])
			.enter()
			.append("circle")
			.attr("r", size)
			.attr("cx", x)
			.attr("cy", -10)
			.attr("fill", color);
		return body;
	}

	function Meteorite(left, phase, name, game, speed) {
		this.size = 10
		this.x = random(this.size * 2, Math.floor(w/2 - this.size * 2));
		if ( !left ) {
			this.x += w / 2;
		}
		this.y = -10;
		this.dx = 0;
		this.dy = speed;
		this.body = make_meteorite_body(left, phase, name, this.x, this.y, this.size);
		this.falling = false;
		this.game = game;
		this.left = left;
		this.phase = phase;
		this.update_position = function() {
			this.x += this.dx;
			this.y += this.dy;
			//console.log("flying to", this.x, this.y);
			//console.log("differentials", this.dx, this.dy);
			this.body.transition()
				.duration(30)
				.attr("cx", this.x)
				.attr("cy", this.y);
		}
		this.matches = function() {
			if ( this.phase === "crescent" ) {
				return this.left === this.game.wax();
			} else {
				return this.left != this.game.wax();
			}
		}
		this.fall = function() {
			var meteorite = this;
			meteorite.falling = true;
			var fall_loop = setInterval( function() {
				meteorite.update_position();
				if ( meteorite.y >= h - 50 ) {
					clearInterval(fall_loop);
					meteorite.impact()
				}
			}, 30);
			this.fall_loop = fall_loop;
		}

		this.stop_fall = function() {
			if (this.fall_loop) {
				clearInterval(this.fall_loop);
			}
		}

		this.impact = function() {
			if ( this.matches() ) {
				this.game.increment();
				this.body.remove();
			} else {
				this.game.stop_game();
			}
		}	
	}

	// make the score counter

	var make_score_display = function() {
		var disp = svg.selectAll("score")
						.data([true])
						.enter()
						.append("text")
						.text("0")
						.attr("x", 15)
						.attr("y", 50)
						.attr("font-size", "3em");
		return disp;
	}

	function Score() {
		this.val = 0;
		this.banner;
		this.display = make_score_display();
		this.update_score = function() {
			this.display.transition()
				.duration(0)
				.text(this.val);
		}
		this.increment = function() {
			this.val += 1;
			this.update_score();
		}
		this.reset = function() {
			this.val = 0;
			this.update_score();
		}
		this.show_banner = function() {
			score_str = " pts"
			if ( this.val === 1 ) {
				score_str = " pt"
			}
			this.banner = svg.selectAll("banner")
							.data([true])
							.enter()
							.append("text")
							.text(this.val + score_str)
							.attr("font-size", "7em")
							.attr("text-anchor", "middle")
							.attr("x", w/2)
							.attr("y", h/2)
		}
		this.kill_banner = function() {
			this.banner.remove();
		}
	}	

	// make the game

	var make_new_game_text = function() {
		txt = svg.selectAll("newgame")
			.data([true])
			.enter()
			.append("text")
			.text("Press Enter For New Game")
			.attr("font-size", "2em")
			.attr("text-anchor", "middle")
			.attr("x", w/2)
			.attr("y", h/2 + 100)
			.attr("fill", "white")
			.attr("class", "newgame");
		return txt;
	}

	function Game() {
		this.paddles = new Paddles;
		this.score = 0;
		this.meteorite_count = 0;
		this.meteorites = [];
		this.counter = new Score();
		this.not_over = true;
		this.speed = 1700;
		this.newgame_txt;

		this.increment = function() {
			this.counter.increment();
			this.score += 1;
		}


		this.wax = function() {
			return this.paddles.wax;
		}
		this.make_meteorite = function() {
			if ( random(0,1) ) {
				left = true;
			} else {
				left = false;
			}
			if ( random(0,1) ) {
				phase = "crescent";
			} else {
				phase = "gibbous";
			}
			fall_speed = 3 + 5 - (5 * Math.pow(0.97, this.meteorite_count));
			console.log("falling at: " + fall_speed);
			if ( this.meteorite_count % 5 === 0 ) {
				this.speed *= 0.94
				this.change_speed(this.speed);
			}
			name = "m" + this.meteorite_count;
			this.meteorite_count += 1;
			return new Meteorite(left, phase, name, this, fall_speed);
		}
		this.start_game = function() {
			var game = this
			var meteor_storm = setInterval( function() {
				meteor = game.make_meteorite();
				game.meteorites.push(meteor);
				meteor.fall()
			}, this.speed);
			return meteor_storm;
		}

		this.change_speed = function(speed) {
			clearInterval(this.meteor_storm);
			this.meteor_storm = setInterval( function() {
				meteor = game.make_meteorite();
				game.meteorites.push(meteor);
				meteor.fall()
			}, speed);
		}

		this.meteor_storm = this.start_game();

		this.stop_game = function() {
			clearInterval(this.meteor_storm);
			for ( i = 0; i < this.meteorites.length; i++ ) {
				this.meteorites[i].stop_fall();
			}
			this.counter.show_banner();
			this.not_over = false;
			this.show_button();
		}

		this.blank = function() {
			this.hide_button();
			this.counter.kill_banner();
			this.counter.display.remove();
			this.paddles.crescent.body.remove();
			this.paddles.gibbous.body.remove();
			for ( i = 0; i < this.meteorites.length; i++ ) {
				this.meteorites[i].body.remove();
			}
		}

		this.show_button = function() {
			this.newgame_txt = make_new_game_text();
		}

		this.hide_button = function() {
			this.newgame_txt.remove();
		}

	}


	game = new Game;

	$(document).on('keydown', function( e ) {
		if ( game.not_over ) {
			game.paddles.swap();
		} else {
			if ( e.which === 13 ) {
				game.blank();
				game = new Game;
			}
		}
	});

});









