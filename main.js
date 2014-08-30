'use strict';

// safer initialization of object
// if an object with the same name already exists in global scope,
// we'll only be adding properties instead of overwriting the whole thing
var c4 = c4 || {};

// begin when DOM is ready
$(document).ready(function () {
  c4.init();
//  c4.test();
});

// place to share data within our object
c4.data = {
  board: {
    columns: 7,
    rows: 6,
    matrix: []
  },
  players: [
    {
      name: ''
    },
    {
      name: ''
    }
  ],
  selectors: {
    board: '.board',
    message_box: '.controls .messages',
    first_message_class: 'message'
  }
}

// this structure represents the board
// will contain an array of arrays
// player number is 1 or 2, 0 is placeholder for empty positions
// decided to use placeholder for a few reasons
//  - makes dynamic allocation of board size easier, especially if two-way binding to DOM later
//  - eliminates the need for a lot of array bound checks
//  - fits conveniently with player 1/2 numbering convention
// this makes a few lookups funky, have to -1 to get back to  array index 0 convention
// but there's a benefit in not having to convert meaningful player numbers for text, CSS classes, etc
c4.data.matrix = [];

// entrance
c4.init = function () {
  c4.current_player = 1;
  c4.initMatrix();
  c4.buildBoard();
  c4.bindControls();
  c4.requestPlayerNames();
}

// dynamically allocate arrays to track positions
// JS can supprt different board sizes (CSS isn't set up to support it though)
c4.initMatrix = function () {
  var x = c4.data.board.columns;
  var y = c4.data.board.rows;
  var i, j;
  var inner_array = [];
  var outer_array = [];

  for (j=0; j<y; j++) {
    inner_array.push(0);
  }
  for (i=0; i<x; i++) {
    // slice makes a copy get pushed instead of a reference
    outer_array.push(inner_array.slice(0));
  }
  c4.data.matrix = outer_array;
}

// build the board dynamically
// one reason I did this and the matrix dynamically
// is so I can modify the board as needed during JS development
// without having to do a bunch of manual edits to a static HTML grid
c4.buildBoard = function () {
  var x = c4.data.board.columns;
  var y = c4.data.board.rows;
  var board = $(c4.data.selectors.board);
  var column;
  var i, j;

  for (i=0; i<x; i++) {
    board.append('<div class="column column-inactive c' + i + '" data-column="' + i + '"></div>');
    column = $('.c' + i);
    // number rows descending to emulate the real world game
    for (j=y-1; j>=0; j--) {
      column.append(
        '<div class="cell" data-cell="' + j + '"></div>');
    }
  }
}

// all the events not related to game play
c4.bindControls = function () {
  $('.main-content')
    .on('names_ready', function () {
      c4.bindBoard();
      c4.writeMessage('Game in progress.');
      c4.writeCurrentPlayer();
      c4.data.ready = true;
    })
    .on('names_not_ready', function () {
      c4.data.ready = false;
      c4.unbindBoard();
      c4.writeMessage('Please input names for both players.');
    })
    .trigger('names_not_ready');

  $('.player input').on('change', function () {
    // copy the entry from the input to the data structure
    c4.data.players[$(this).attr('data-player') - 1].name = $(this).val();

    // proceed when both names are completed
    // names can be edited mid-play, but if name is removed, this will kick back in
    if (c4.data.players[0].name && c4.data.players[1].name) {
      // TODO: maybe check names aren't identical?
      // TODO: maybe shouldn't allow edits after game is won
      // ready flag prevents re-binding due to multiple edits
      if (c4.data.ready === false) {
        $('.main-content').trigger('names_ready');
      }
    } else {
      $('.main-content').trigger('names_not_ready');
    }
  });
}

c4.requestPlayerNames = function () {
  // initial message different than subsequent edits
  c4.writeMessage('To begin, please input names for both players.');
}

// bind game play functions to the board
// binding after elements are inserted into DOM has better performance
// could happen inside buildBoard
// but better to decouple, separation of concerns
c4.bindBoard = function () {
  var x = c4.data.board.columns;
  var i, x;

  // highlight columns on hover
  for (i=0; i<x; i++) {
    $('.c' + i).on('mouseenter mouseleave', function () {
      $(this).toggleClass('column-hover');
    }).on('click', function () {
      // on click, send column number to be played
      x = $(this).attr('data-column');
      c4.playColumn(x);
    }).removeClass('column-inactive');
  }
}

// deactivate column
c4.unbindColumn = function (x) {
  $('.c' + x).removeClass('column-hover')
    .addClass('column-inactive')
    .off();
}

// deactivate all columns
c4.unbindBoard = function () {
  var columns = c4.data.board.rows;
  var i;

  for (i=0; i<=columns; i++) {
    c4.unbindColumn(i);
  }
}

// mark next open position (0) in column with player number (1 or 2)
c4.playColumn = function (x) {
  var rows = c4.data.board.rows;
  var column = c4.data.matrix[x];
  var player = c4.currentPlayer();
  var y;

  // for each row in this column (descending)...
  for (y=0; y<rows; y++) {
    // find the first empty row and mark it
    if (column[y] === 0) {
      column[y] = player;
      // if the DOM was bound to the matrix data structure,
      // wouldn't need markPosition here
      // better for testing
      c4.markPosition(x, y, player);

      if (c4.checkWin(x, y, player)) {
        c4.onWin();
        return;
      }
      // check if column is full
      if (y === rows - 1) {
        c4.unbindColumn(x);
      }
      break;
    }
  }
  c4.takeTurns();
}

// announce win and shut donw
c4.onWin = function () {
  c4.unbindBoard();
  c4.writeMessage('Winner: ' + c4.currentPlayerName());
  c4.writeMessage('', 'current-player');
}

// mark cell in DOM
c4.markPosition = function (x, y, p) {
  $('[data-column="' + x + '"] [data-cell="' + y + '"]').html('<span class="p' + p + '">' + p + '</span>');
}

// wrapper function
// calls inner, abstract function for every possible direction
c4.checkWin = function (x, y, player) {
  // represents compass points (minus N, as it's not possible)
  var directions = [
    [-1, 1],
    [-1, 0],
    [-1, -1],
    [0, -1],
    [1, 1],
    [1, 0],
    [1, -1],
  ];
  var i;

  for (i=0; i<7; i++) {
    if (c4.checkWinOneDirection(x, y, player, directions[i][0], directions[i][1])) {
      return true;
    }
  }
}

// this function calls itself recursively to evaluate possible connections.
// since the search behavior is slightly different based on direction,
// function argument 'win_counter' is overloaded.
// win_counter tracks how many contiguous pieces are in each connection,
// but it also serves as a flag to reverse the search direction,
// since the current piece may be in the middle of a connection.
// instead of this imperative behavior,
// the different searches could be returned dynamically from a factory
// but i'm not sure whether that would be more clear or concise
// and it would definitely be harder to write and debug
c4.checkWinOneDirection = function (x, y, player, x_direction, y_direction, win_counter) {
  var test_array;
  var win_counter = win_counter || 1;
  var copy_counter = (win_counter === 'reverse') ? 1 : win_counter;

  // fetching the array every time allows this function to operate
  // the same way for down (S) searches as for lateral (SE, E, NE etc)
  test_array = c4.fetchArray(x, (copy_counter * x_direction));
  // can ignore edge cases (literally!).
  if (!test_array) {
    return false;
  }

  // if there's a match....
  if (c4.checkArray(test_array, y, y_direction * copy_counter, player)) {
    // and we're checking the backwards case...
    if (win_counter === 'reverse') {
      // then it's a win
      return true;
    } else {
      win_counter++;
      if (win_counter === 4) {
        // ordinary win
        return true;
      }
    }
    // so this is not yet a win, keep searching
    if (c4.checkWinOneDirection(x, y, player, x_direction, y_direction, win_counter)) {
      return true;
    }
    // but if we found 3 in one direction, check to see if we're in the middle of a connection
    // since checkWin supplies all the coordinates, we only have to test one version of being in the middle
    // since the opposite will be a mirror image
    if (win_counter === 3 && x_direction != 0) {
      if (c4.checkWinOneDirection(x, y, player, x_direction * -1, y_direction * -1, 'reverse')) {
        return true;
      }
    }
  }
}

c4.fetchArray = function (x, offset) {
  // using unary operator (+) to cast strings to int before adding
  // not safe in all cases, ex. if we didn't control the value, but okay here
  return c4.data.matrix[+x + +offset];
}

// test if this position matches this player
c4.checkArray = function (test_array, y, offset, player) {
  if (test_array[y + offset] === player) {
    return true;
  } else {
    return false;
  }
}

// get or set current player
c4.currentPlayer = function (set) {
  if (set) {
    c4.current_player = set;
  }
  return c4.current_player;
}

// convenience function
c4.currentPlayerName = function () {
 return c4.data.players[c4.currentPlayer() - 1].name;
}

// convenience function
c4.writeCurrentPlayer = function () {
  c4.writeMessage('Current player is ' + c4.currentPlayerName(), 'current-player');
}

// alternate player number
c4.takeTurns = function () {
  c4.currentPlayer(
    (c4.currentPlayer() % 2) + 1
  );
  c4.writeCurrentPlayer();
}

// pseudo decoupled from markup
c4.writeMessage = function (message, location) {
  // shortcut just for clarity
  var s = c4.data.selectors;

  location = location || s.first_message_class;
  if (!$('.' + location).length) {
    $(s.message_box).append('<div class="' + location + '"></div>');
  }
  $('.' + location).text(message);
}

