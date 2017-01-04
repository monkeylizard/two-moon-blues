function Game() {
  this.set_up_game = function() {
    this.paddles = new Paddles;
    this.score = 0;
    this.meteorite_count = 0;
    this.meteorites = [];
    this.counter = new Score();
    this.not_over = true;
    this.speed = 1700;
    this.newgame_txt;
  }

  this.increment = function() {
    this.counter.increment();
    this.score += 1;
  }

  this.make_new_game_text = function() {
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
    this.newgame_txt = this.make_new_game_text();
  }

  this.hide_button = function() {
    this.newgame_txt.remove();
  }

  this.set_up_game();
}
