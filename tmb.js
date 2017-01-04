$(document).ready(function() {
  window.pad = 50;
  window.h = $(window).height() - pad * 2;
  window.w = Math.floor($("#game").width() - 30);
  window.svg = d3.select("#game")
    .append("svg")
    .attr("height", h)
    .attr("width", w)
    .attr("id", "svgMain");

  window.random = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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

  $(document).on('click', function() {
    if ( game.not_over ) {
      game.paddles.swap();
    } else {
      game.blank();
      game = new Game;
    }
  });

});
