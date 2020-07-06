class Connect4 {
    constructor(selector) {
      this.ROWS = 6;
      this.COLS = 7;
      this.player = 'red';
      this.selector = selector;
      this.isGameOver = false;
      this.onPlayerMove = function() {};
      this.createGrid();
      this.setupEventListeners();
    }

    createGrid() {
        const $board = $(this.selector);
        $board.empty();
        this.isGameOver = false;
        this.player = 'red';
        for (let row = 0; row < this.ROWS; row++) {
          const $row = $('<div>')
            .addClass('row');
          for (let col = 0; col < this.COLS; col++) {
            const $col = $('<div>')
              .addClass('col empty')
              .attr('data-col', col)
              .attr('data-row', row);
            $row.append($col);
          }
          $board.append($row);
        }
      }
   
      setupEventListeners() {
        const $board = $(this.selector);
        const that = this;
    
        function findLastEmptyCell(col) {
          const cells = $(`.col[data-col='${col}']`);
          for (let i = cells.length - 1; i >= 0; i--) {
            const $cell = $(cells[i]);
            if ($cell.hasClass('empty')) {
              return $cell;
            }
          }
          return null;
        }

        $board.on('mouseenter', '.col.empty', function() {
            if (that.isGameOver) return;
            const col = $(this).data('col');
            const $lastEmptyCell = findLastEmptyCell(col);
            $lastEmptyCell.addClass(`next-${that.player}`);
          });
      
          $board.on('mouseleave', '.col', function() {
            $('.col').removeClass(`next-${that.player}`);
          });
      
          $board.on('click', '.col.empty', function() {
            if (that.isGameOver) return;
            const col = $(this).data('col');
            const $lastEmptyCell = findLastEmptyCell(col);
            $lastEmptyCell.removeClass(`empty next-${that.player}`);
            $lastEmptyCell.addClass(that.player);
            $lastEmptyCell.data('player', that.player);
      