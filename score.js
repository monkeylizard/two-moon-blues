function Score() {
  this.set_up_score = function() {
    this.val = 0;
    this.banner;
    this.display = this.make_score_display();
  }

  this.make_score_display = function() {
    var disp = svg.selectAll("score")
            .data([true])
            .enter()
            .append("text")
            .text("0")
            .attr("x", 15)
            .attr("y", 50)
            .attr("fill", "#FFFD8C")
            .attr("font-size", "3em");
    return disp;
  }

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
            .attr("fill", "#FFFD8C");
  }
  this.kill_banner = function() {
    this.banner.remove();
  }

  this.set_up_score();
}  
