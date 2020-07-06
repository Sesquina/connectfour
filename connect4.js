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