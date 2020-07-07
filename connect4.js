$(document).ready(function () {  //Initializes JQuery
    //TODO: Draw a Grid & pass to selector HTML 'connect4'
    //main.js is running the Connect4 object, Passing the selector, 
  //Connect4 class is grabbing the selector/DIV & adding HTML to that DIV 
  const connect4 = new Connect4("#connect4");  
                             
  connect4.onPlayerMove = function () {
    $("#player").text(connect4.player);
  };

  $("#restart").click(function () {
    connect4.restart();
  });
});


class Connect4 { //Declare a class & constructor connect to main.js
    constructor(selector) {
      this.ROWS = 6; //Rows
      this.COLS = 7; //Columns
      this.player = 'red';
      this.selector = selector; 
      this.isGameOver = false;
      this.onPlayerMove = function() {};
      this.createGrid(); //Object that builds grid call great.grid
      this.setupEventListeners(); //Call the Event Listeners
    }
//Loop over every row and create grid.Inside every row, we append 7 different columns and use css style to make it look like a connect4 grid
    createGrid() { //Method to build 6x7 grid. Build a bunch of Divs 
        const $board = $(this.selector); //DOM element of Board
        $board.empty();
        this.isGameOver = false;
        this.player = 'red';
        for (let row = 0; row < this.ROWS; row++) { //For Loop of 6 rows using this.ROWS
          const $row = $('<div>')                   //$ used to identify jQuery object
            .addClass('row');
          for (let col = 0; col < this.COLS; col++) { //For loop of 7 columns using this.columns
            const $col = $('<div>')
              .addClass('col empty')  //style col empty for color of token
              .attr('data-col', col)  //pass the attribute I want to add (column index)
              .attr('data-row', row);  //pass the row index
            $row.append($col);
          }
          $board.append($row);   //Rows are nested inside of each other
        }
      }
   
      setupEventListeners() { // create an indicator showing WHERE the piece will drop
        const $board = $(this.selector);
        const that = this;
    
        function findLastEmptyCell(col) {
          const cells = $(`.col[data-col='${col}']`); //Grab all of the cells in the column we selected. 
          for (let i = cells.length - 1; i >= 0; i--) {  //Backwards loop of the columns 
             const $cell = $(cells[i]);  //Grab all columns with same attribute 'data-col' equal to the column index passed in. This will return an array of hovered objects
            if ($cell.hasClass('empty')) { //If the cell has a class of 'empty' then RETURN that cell
              return $cell;
            }
          }
          return null;
        }

        $board.on('mouseenter', '.col.empty', function() { //Jquery method where you pass the event you want to listen to(mouse enter) and the selector (col.empty)
            if (that.isGameOver) return;
            const col = $(this).data('col');  //Prints out the column index. We need to grab all of the cells in the column until we find an empty one.
            const $lastEmptyCell = findLastEmptyCell(col); //As you hover over these cells you want to get the last empty cell in that column
            $lastEmptyCell.addClass(`next-${that.player}`);//add Class lastemptycell being equal to CSS 'next' style
          });
      
          $board.on('mouseleave', '.col', function() {  //Event listener that removes findLastEmptyCell class function
            $('.col').removeClass(`next-${that.player}`);  //Remove all the classes that have 'next' style
          });
      
          $board.on('click', '.col.empty', function() {
            if (that.isGameOver) return;
            const col = $(this).data('col');
            const $lastEmptyCell = findLastEmptyCell(col);
            $lastEmptyCell.removeClass(`empty next-${that.player}`);
            $lastEmptyCell.addClass(that.player);
            $lastEmptyCell.data('player', that.player);
      
            const winner = that.checkForWinner(
                $lastEmptyCell.data('row'), 
                $lastEmptyCell.data('col')
              )
              if (winner) {
                that.isGameOver = true;
                alert(`Game Over! Player ${that.player} has won!`);
                $('.col.empty').removeClass('empty');
                return;
              }
        
              that.player = (that.player === 'red') ? 'blue' : 'red';
              that.onPlayerMove();
              $(this).trigger('mouseenter');
            });
          }
        
          checkForWinner(row, col) {
            const that = this;

            function $getCell(i, j) {
                return $(`.col[data-row='${i}'][data-col='${j}']`);
              }

              function checkDirection(direction) {
                let total = 0;
                let i = row + direction.i;
                let j = col + direction.j;
                let $next = $getCell(i, j);
                while (i >= 0 &&
                  i < that.ROWS &&
                  j >= 0 &&
                  j < that.COLS && 
                  $next.data('player') === that.player
                ) {
                  total++;
                  i += direction.i;
                  j += direction.j;
                  $next = $getCell(i, j);
                }
                return total;
              }

              function checkWin(directionA, directionB) {
                const total = 1 +
                  checkDirection(directionA) +
                  checkDirection(directionB);
                if (total >= 4) {
                  return that.player;
                } else {
                  return null;
                }
              }
          
              function checkDiagonalBLtoTR() {
                return checkWin({i: 1, j: -1}, {i: 1, j: 1});
              }
          
              function checkDiagonalTLtoBR() {
                return checkWin({i: 1, j: 1}, {i: -1, j: -1});
              }
          
              function checkVerticals() {
                return checkWin({i: -1, j: 0}, {i: 1, j: 0});
              }
          
              function checkHorizontals() {
                return checkWin({i: 0, j: -1}, {i: 0, j: 1});
              }
          
              return checkVerticals() || 
                checkHorizontals() || 
                checkDiagonalBLtoTR() ||
                checkDiagonalTLtoBR();
            }
          
            restart () {
              this.createGrid();
              this.onPlayerMove();
            }
          }