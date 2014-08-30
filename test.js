'use strict'

// pseudo TDD
// simulates a basic game
// now I can refactor and not worry about breaking changes
c4.test = function() {
  var i;
  var pf;

  $('[name="handle1"]').val('a').trigger('change');
  $('[name="handle2"]').val('b').trigger('change');

  for (i=0; i<8; i++) {
    $('.c' + i % 2).trigger('click');
  }
  if ($('.' + c4.data.selectors.first_message_class).text() === 'Winner: a') {
    pf = 'passed';
  } else {
    pf = 'failed';
  }
  console.log('test ' + pf);
}

  //
  //  test arrays
  //
  //  (values higher than 2 are for debugging convenience)
  //
  //  click column 5 as player 1
  //  simple win, heading SW
//  c4.matrix = [
//    [3, 3, 3, 3, 3, 9],
//    [3, 1, 3, 3, 3, 8],
//    [3, 3, 1, 3, 3, 7],
//    [3, 3, 3, 1, 3, 6],
//    [3, 3, 3, 3, 0, 0],
//    [3, 3, 3, 3, 3, 5],
//    [3, 3, 3, 3, 3, 4],
//  ];
  //  click column 3 as player 1
  //  simple win, heading SE
//  c4.matrix = [
//    [3, 3, 3, 3, 3, 9],
//    [3, 3, 3, 3, 0, 0],
//    [3, 3, 3, 1, 3, 8],
//    [3, 3, 1, 3, 3, 7],
//    [3, 1, 3, 3, 3, 6],
//    [3, 3, 3, 3, 3, 5],
//    [3, 3, 3, 3, 3, 4],
//  ];
  //  click column 3 as player 1
  //  simple win, heading W
//  c4.matrix = [
//    [3, 3, 3, 3, 3, 9],
//    [3, 3, 3, 3, 0, 0],
//    [3, 3, 3, 3, 1, 8],
//    [3, 3, 3, 3, 1, 7],
//    [3, 3, 3, 3, 1, 6],
//    [3, 3, 3, 3, 3, 5],
//    [3, 3, 3, 3, 3, 4],
//  ];
  //  click column 3 as player 1
  //  simple win, heading NE
//  c4.matrix = [
//    [3, 3, 3, 3, 3, 9],
//    [3, 3, 3, 3, 3, 8],
//    [0, 0, 0, 0, 0, 0],
//    [3, 1, 3, 3, 3, 7],
//    [3, 3, 1, 3, 3, 6],
//    [3, 3, 3, 1, 3, 5],
//    [3, 3, 3, 3, 3, 4],
//  ];
  //  click column 2 as player 1
  //  simple win, heading S
//  c4.matrix = [
//    [3, 3, 3, 3, 3, 9],
//    [3, 1, 1, 1, 0, 0],
//    [3, 3, 3, 3, 3, 8],
//    [3, 3, 3, 3, 3, 7],
//    [3, 3, 3, 3, 0, 0],
//    [3, 3, 3, 3, 3, 5],
//    [3, 3, 3, 3, 3, 4],
//  ];
  //  click column 4 as player 1
  //  mid-connection win
//  c4.matrix = [
//    [3, 3, 3, 3, 3, 9],
//    [3, 1, 3, 3, 3, 8],
//    [3, 3, 1, 3, 3, 7],
//    [3, 3, 3, 0, 0, 0],
//    [3, 3, 3, 3, 1, 6],
//    [3, 3, 3, 3, 3, 5],
//    [3, 3, 3, 3, 3, 4],
//  ];
