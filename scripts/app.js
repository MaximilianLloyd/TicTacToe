const Board   = require('./modules/board'),
      Player = require('./modules/player');


class App {
  constructor() {
    this.board = new Board(new Player('x'), new Player('o'));
    let restartButton = document.querySelector('.won--restart');
    restartButton.addEventListener('click', this.board.restart.bind(this.board));
    window.addEventListener('resize', this.board.fit.bind(this.board));
  }
}

module.exports = App;
