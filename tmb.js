$(document).ready(function() {
  window.pad = 50;
  window.h = $(window).height() - pad * 2;

  page_width = $(window).width() - pad * 2
  styled_width = Math.floor($('#game').width() - 30);

  window.w = Math.min(page_width, styled_width);
  window.svg = d3.select("#game")
    .append("svg")
    .attr("height", h)
    .attr("width", w)
    .attr("id", "svgMain");

  window.random = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  game = new Game;

  reset = function () {
    game.blank();
    game = new Game;
  }

  move = function () {
    if ( game.not_over ) {
      game.paddles.swap();
    } else {
      reset();
    }
  }

  $(document).on('keydown', move);
  $(document).on('click', move);
  $('#game').on('tap', move);
  $('#game').on('swipe', move);

});
