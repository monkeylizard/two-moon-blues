function Paddles() {
  this.crescent = new Paddle("crescent");
  this.gibbous = new Paddle("gibbous");
  this.wax = true;
  this.swap = function() {
    this.wax = !this.wax;
    this.crescent.flip();
    this.gibbous.flip();
  }
  this.stats = function() {
    this.crescent.stats();
    this.gibbous.stats();
  }
}

function Paddle(phase) {

  this.set_up_paddle = function(phase) {
    this.body = this.make_paddle_body(phase);

    if (phase === "crescent") {
      this.phase = "crescent";
      this.left = true;
    } else {
      this.phase = "gibbous";
      this.left = false;
    }
  }

  this.make_paddle_body = function(phase) {
    name = phase + "_paddle";
    if ( phase === "crescent" ) {
      x = 2;
      color = "#84E888";
    } else {
      x = w / 2 + 2;
      color = "#8F3D8C";
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
  }

  this.set_up_paddle(phase);

}
