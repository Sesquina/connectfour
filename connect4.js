$(document).ready(function () {
  //Initializes JQuery
  //TODO: Draw a Grid & pass to selector HTML 'connect4'
  //main.js is running the Connect4 object, Passing the selector,
  //Connect4 class is grabbing the selector/DIV & adding HTML to that DIV

  //JQuery is a javascript library(collection of class and methods).
  //When it is used in a web page it creates its own object. $ holds the referances of that object.
  //Later at any point of time we can use $ to use any jQuery method .
  const connect4 = new Connect4("#connect4"); //Use FCC video as a reference bulding this board.

  connect4.onMove = function () {
    $("#player").text(connect4.player);
  };

  $("#restart").click(function () {
    //calls DOM HTML restart button
    connect4.restart();
  });
});

class Connect4 {
  //Declare a class & constructor connect to HTML div
  constructor(selector) {
    this.ROWS = 6; //Rows
    this.COLS = 7; //Columns
    this.player = "Bitcoin"; //Start off as Bitcoin player
    this.selector = selector;
    this.isGameOver = false;
    this.onMove = function () {};
    this.createGrid(); //Object that builds grid call create.grid
    this.setupEventListeners(); //Call the Event Listeners
  }
  //Loop over every row and create grid.Inside every row, we append 7 different columns and use css style to make it look like a connect4 grid
  createGrid() {
    //Method to build 6x7 grid. Build a bunch of Divs
    const $board = $(this.selector); //DOM element of Board
    $board.empty();
    this.isGameOver = false;
    this.player = "Bitcoin";
    for (let row = 0; row < this.ROWS; row++) {
      //For Loop of 6 rows using this.ROWS
      const $row = $("<div>") //$ used to identify jQuery object
        .addClass("row");
      for (let col = 0; col < this.COLS; col++) {
        //For loop of 7 columns using this.columns
        const $col = $("<div>")
          .addClass("col empty") //style col empty for color of token
          .attr("data-col", col) //pass the attribute I want to add (column index)
          .attr("data-row", row); //pass the row index
        $row.append($col);
      }
      $board.append($row); //Rows are nested inside of each other
    }
  }

  setupEventListeners() {
    // Event listener showing WHERE the piece will drop
    const $board = $(this.selector);
    const that = this; //Retain access to the original .this attribute. Need access to the this EVENT function

    function findLastEmptyCell(col) {
      const cells = $(`.col[data-col='${col}']`); //Grab all of the cells in the column we selected.
      for (let i = cells.length - 1; i >= 0; i--) {
        //Backwards loop of the columns
        const $cell = $(cells[i]); //Grab all columns with same attribute 'data-col' equal to the column index passed in. This will return an array of hovered objects
        if ($cell.hasClass("empty")) {
          //If the cell has a class of 'empty' then RETURN that cell
          return $cell;
        }
      }
      return null;
    }

    $board.on("mouseenter", ".col.empty", function () {
      //Jquery method where you pass the event you want to listen to(mouse enter) and the selector (col.empty)
      if (that.isGameOver) return;
      const col = $(this).data("col"); //Prints out the column index. We need to grab all of the cells in the column until we find an empty one.
      const $lastEmptyCell = findLastEmptyCell(col); //As you hover over these cells you want to get the last empty cell in that column
      $lastEmptyCell.addClass(`next-${that.player}`); //add Class lastemptycell being equal to CSS 'next' style
    });

    $board.on("mouseleave", ".col", function () {
      //Event listener that removes findLastEmptyCell class function
      $(".col").removeClass(`next-${that.player}`); //Remove all the classes that have 'next' style
    });

    $board.on("click", ".col.empty", function () {
      //Event listener On mouse click, function is empty DOM element. Identify which column & row was clicked
      if (that.isGameOver) return;
      const col = $(this).data("col");
      const $lastEmptyCell = findLastEmptyCell(col); //
      $lastEmptyCell.removeClass(`empty next-${that.player}`);
      $lastEmptyCell.addClass(that.player);
      $lastEmptyCell.data("player", that.player);

      const winner = that.checkForWinner(
        //check the winner
        $lastEmptyCell.data("row"),
        $lastEmptyCell.data("col")
      );
      if (winner) {
        //If there is a winner, this will run
        that.isGameOver = true;
        alert(`Game Over! ${that.player} Player has won!`);
        $(".col.empty").removeClass("empty");
        return;
      }
      //$(this).trigger('mouseenter');---trigger doesn't work here //Method alternates between players
      that.player = that.player === "Bitcoin" ? "DashCoin" : "Bitcoin"; //If a player is already equal to Dashcoin, I will change it to Black otherwise it will be Dashcoin.
      that.onMove();
      $(this).trigger("mouseenter"); //Used for the Event mouseenter to trigger on the player's piece that is being placed.
    });
  }

  //Once I place these pieces, how do I know if a Player Wins when they connect 4?

  //create checkwinner function. Inside function has 2 parameters that will take last row/column that was last clicked
  //Check if there is a diagonal/vertical horizontal row or line that allows last piece to win
  //If that piece drops & wins, Winner will be alerted
  checkForWinner(row, col) {
    const that = this; //Keep track of player

    function $getCell(r, c) {
      //Fixes empty cell function
      return $(`.col[data-row='${r}'][data-col='${c}']`); //Function takes in row/column return using jquery, same row which matches it
    }

    function checkDirection(direction) {
      //Method to Increment in direction while still inside the grid. Check If the color that hit is a match to color looking for
      let total = 0;
      let r = row + direction.r;
      let c = col + direction.c;
      let $next = $getCell(r, c); //Function takes in row/column return using jquery, same row which mathes it
      while (
        r >= 0 &&
        r < that.ROWS &&
        c >= 0 &&
        c < that.COLS &&
        $next.data("player") === that.player //While the player we are currenly looking at is Equal to 'player' we dropped, We continue to increment
      ) {
        total++;
        r += direction.r;
        c += direction.c;
        $next = $getCell(r, c); //Get cell of column & row. the $.next() method allows us to search through the immediately following sibling of these elements in the DOM tree and construct a new jQuery object from the matching elements.
      }
      return total; //Bug to check vertical direction. Returns sum of While loop
    }

    function checkWin(directionA, directionB) {
      const total =
        1 + //Piece placed down is going to be equivalent to one, now we need to check in the u direction r:-1 ..down direction r:1 c:0
        checkDirection(directionA) +
        checkDirection(directionB);
      if (total >= 4) {
        //4 tokens match
        return that.player;
      } else {
        return null;
      }
    }

    function checkDiagonalBLtoTR() {
      //Bottom Left to top right
      return checkWin({ r: 1, c: -1 }, { r: 1, c: 1 });
    }

    function checkDiagonalTLtoBR() {
      //Top Left to Bottom right
      return checkWin({ r: 1, c: 1 }, { r: -1, c: -1 });
    }

    function checkVerticals() {
      //Return a function checkWin
      return checkWin({ r: -1, c: 0 }, { r: 1, c: 0 }); //This is the axis
    }

    function checkHorizontals() {
      return checkWin({ r: 0, c: -1 }, { r: 0, c: 1 });
    }

    return (
      //Return to check wins
      checkVerticals() ||
      checkHorizontals() ||
      checkDiagonalBLtoTR() ||
      checkDiagonalTLtoBR()
    );
  }

  restart() {
    //Restart the board
    this.createGrid();
    this.onMove();
  }
}

///I Learned how to use the jquery library. $board, DOM manipulation, selectors, $next data to pull data from specific areas
//$getcell allowed me to identify the circular/empty areas of the grid.
