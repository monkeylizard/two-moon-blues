function Meteorite(left, phase, name, game, speed) {
  this.set_up_meteorite = function(left, phase, name, game, speed) {
    this.size = window.meteorite_size
    this.x = random(this.size * 2, Math.floor(w/2 - this.size * 2));
    if ( !left ) {
      this.x += Math.floor(w / 2);
    }
    this.y = -10;
    this.dx = 0;
    this.dy = speed;
    this.body = this.make_meteorite_body(left, phase, name, this.x, this.y, this.size);
    this.falling = false;
    this.game = game;
    this.left = left;
    this.phase = phase;
  }

  this.update_position = function() {
    this.x += this.dx;
    this.y += this.dy;
    this.body.transition()
      .duration(30)
      .attr("x", this.x)
      .attr("y", this.y);
  }

  this.matches = function() {
    if ( this.phase === "crescent" ) {
      return this.left === this.game.wax();
    } else {
      return this.left != this.game.wax();
    }
  }

  this.make_meteorite_body = function(left, phase, name, x, y, size) {
    if ( phase === "crescent") {
      img = "crescent.png";
    } else {
      img = "gibbous.png";
    }
    if ( !left ) {
      x += w/2;
    }
    body = svg.selectAll(name)
      .data([true])
      .enter()
      .append("image")
      .attr("xlink:href", img)
      .attr("height", window.meteorite_size)
      .attr("width", window.meteorite_size)
      .attr("x", x)
      .attr("y", -10);
    return body;
  }

  this.fall = function() {
    var meteorite = this;
    meteorite.falling = true;
    var fall_loop = setInterval( function() {
      meteorite.update_position();
      if ( meteorite.y >= h - 30 - meteorite.size) {
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

  this.set_up_meteorite(left, phase, name, game, speed);
}
