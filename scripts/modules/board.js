const Ai = require('./ai'),
      autoBind = require('auto-bind');

class Board {
  constructor(x, o) {
    this.moveCount    = 0;
    this.playing      = true;
    this.won          = false;
    this.boardElement = document.querySelector('.board');
    this.wonElement   = document.querySelector('.won');
    this.ai           = new Ai();
    this.players      = {};
    this.players.x    = x;
    this.players.o    = o;
    this.turn         = this.players.x;
    this.grid         = [['', '', ''],
                        ['', '', ''],
                        ['', '', '']];

    this.gridElements = [[],
                        [],
                        []];

    this.fit();
    let gridElements = document.querySelectorAll('.cell');

    for (let index = 0; index < gridElements.length; index++) {
      let gridElement = gridElements[index];

      if(index < 3) this.gridElements[0].push(gridElement);
      if(index < 6 && index > 2) this.gridElements[1].push(gridElement);
      if(index < 9 && index > 5) this.gridElements[2].push(gridElement);
      gridElement.innerHTML = '_';
      gridElement.addEventListener('click', event => this.movePlayer(event));
    }


    let buttonModePlayer = document.querySelector('.mode-player');
    let buttonModeMachine = document.querySelector('.mode-machine');
    this.buttonModeContainer = document.querySelector('.mode');

    let playerFirst         = document.querySelector('.player-first');
    let machineFirst        = document.querySelector('.machine-first');
    let firstContainer      = document.querySelector('.first-select');

    let showBoard = (cb) => {
      this.buttonModeContainer.classList.add('fadeOut');
      setTimeout(() => {
        this.buttonModeContainer.style.display = 'none';
        this.buttonModeContainer.classList.remove('fadeOut');
        this.boardElement.style.display = 'block';
        this.boardElement.classList.add('fadeIn');
        if(cb) cb();
      }, 200);
    };

    buttonModePlayer.addEventListener('click', () => {
      this.mode = 'player';
      showBoard();
    });

    buttonModeMachine.addEventListener('click', () => {
      this.mode = 'machine';
      this.buttonModeContainer.classList.add('fadeOut');
      setTimeout(() => {
        this.buttonModeContainer.style.display = 'none';
        this.buttonModeContainer.classList.remove('fadeOut');
        firstContainer.style.display = 'block';
        firstContainer.classList.add('fadeIn');
      }, 200);
    });

    playerFirst.addEventListener('click', () => {
      firstContainer.classList.add('fadeOut');
      setTimeout(() => {
        firstContainer.style.display = 'none';
        firstContainer.classList.remove('fadeOut');
        showBoard();
      }, 200);
    });

    machineFirst.addEventListener('click', () => {
      firstContainer.classList.add('fadeOut');
      setTimeout(() => {
        firstContainer.style.display = 'none';
        firstContainer.classList.remove('fadeOut');
        showBoard(this.moveMachine);
      }, 200);
    });

  autoBind(this);
}

  moveMachine() {
    let coordinates =  this.ai.predict(this.grid, this.turn, this.turn.type === 'x' ? 'o' : 'x');
    this.grid[coordinates.row][coordinates.column]                     = this.turn.type;
    this.gridElements[coordinates.row][coordinates.column].textContent = this.turn.type;
    this.moveCount++;
    this.hasWon();
    this.turn = this.turn.type === this.players.x.type ? this.players.o : this.players.x;
    console.log(this.moveCount);
  }

  movePlayer(event) {
    if(this.playing && !this.won) {
      let row    = event.target.getAttribute('data-row');
      let column = event.target.getAttribute('data-column');

      if(this.grid[row][column] === '') {
          this.grid[row][column]                      = this.turn.type;
          this.gridElements[row][column].textContent  = this.turn.type;
          this.moveCount++;
          this.hasWon();
          this.turn = this.turn.type === this.players.x.type ? this.players.o : this.players.x;
          let audio = new Audio('/sounds/select.wav');
          audio.play();

          if(!this.won && this.mode === 'machine') {
            this.moveMachine();
          }
        }
      }
  }

  hasWon() {
    // Check row
    let player = this.turn.type;
    console.log(this.grid);
    let wonCells = [];
    let cellCache = [];

    for (let row = 0; row < 3; row++) {
      let column;
      for (column = 0; column < this.grid[row].length; column++) {
        if(this.grid[row][column] != player) {
          cellCache = [];
          break;
        }
        cellCache.push(this.gridElements[row][column]);
      }

      if(column === 3) {
        this.won = true;
        this.playing = false;
        wonCells = this.gridElements[row];
      }
    }

    // Check column
    cellCache = [];
    for (let column = 0; column < 3; column++) {
      let row;
      for (row = 0; row < 3; row++) {
        if(this.grid[row][column] != player) {
          break;
        }
        cellCache.push(this.gridElements[row][column]);
      }
      if(row === 3) {
        wonCells = cellCache;
        this.won = true;
        this.playing = false;
      }
    }


    // Check #1 diagonal
    cellCache = [];
    for (let i = 0; i < 3; i++) {
      if(this.grid[i][i] != player) {
        break;
      }
      cellCache.push(this.gridElements[i][i]);
      if(i === 2) {
        this.won = true;
        this.playing = false;
        wonCells = cellCache;
      }
    }

    // Check #2 diagonal
    cellCache = [];
    for (let i = 0; i < 3; i++) {
      if(this.grid[i][2-i] != player) {
        break;
      }
      cellCache.push(this.gridElements[i][2 - i]);
      if(i === 2) {
        this.won = true;
        this.playing = false;
        wonCells = cellCache;
      }
    }

    let dialog = () => {
      this.boardElement.classList.add('fadeOut');
      setTimeout(() => {
        this.restart();
        this.boardElement.style.display = 'none';
        this.boardElement.classList.remove('fadeOut');
        this.buttonModeContainer.style.display = 'block';
        this.buttonModeContainer.classList.add('fadeIn');
      }, 200);
    };


      if(this.won) {
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            this.gridElements[i][j].style.pointerEvents = 'none';
          }
        }
        for (let i = 0; i < wonCells.length; i++) {
          wonCells[i].style.animation = 'blinker 600ms linear infinite';
        }
        setTimeout(() => {
          dialog();
          for (let i = 0; i < wonCells.length; i++) {
            wonCells[i].style.animation = '';
          }
          for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
              this.gridElements[i][j].style.pointerEvents = 'auto';
            }
          }
        }, 1800);
      }

      if(!this.won && this.moveCount >= 9) {
        this.boardElement.classList.add('fadeOut');
        setTimeout(() => {
          this.boardElement.style.display = 'none';
          let tieMessage = document.querySelector('.tie-message');
          tieMessage.classList.remove('fadeOut');
          tieMessage.style.display = 'block';
          tieMessage.classList.add('fadeIn');
          setTimeout(() => {
            tieMessage.classList.remove('fadeIn');
            tieMessage.classList.add('fadeOut');
            setTimeout(() => {
                tieMessage.style.display = 'none';
                dialog();
              }, 200);
            }, 1500);
        }, 200);
      }
      console.log(this.moveCount);


  }

  restart () {
    console.log('restart');
    this.playing      = true;
    this.won          = false;
    this.moveCount    = 0;
    this.gridElements = [[],
                        [],
                        []];
    this.grid         = [['', '', ''],
                        ['', '', ''],
                        ['', '', '']];
    this.turn = this.players.x;

    let gridElements = document.querySelectorAll('.cell');

    for (let index = 0; index < gridElements.length; index++) {
      let gridElement = gridElements[index];

      gridElement.innerHTML = '_';
      if(index < 3) this.gridElements[0].push(gridElement);
      if(index < 6 && index > 2) this.gridElements[1].push(gridElement);
      if(index < 9 && index > 5) this.gridElements[2].push(gridElement);
      gridElement.addEventListener('click', event => this.movePlayer(event));
    }
  }

  fit() {
    console.log('Fitting board to device...');
    let windowWidth = window.innerWidth;
    if(windowWidth < 660) {
      this.boardElement.style.width = `${windowWidth}px`;
      this.boardElement.classList.add('board-mobile');

      for (let i = 0; i < this.boardElement.children.length; i++) {
        let row = this.boardElement.children[i];
        row.style.width = `${windowWidth}px`;
        row.style.height = `${windowWidth / 3}px`;

        for (let j = 0; j < row.children.length; j++) {
            let cell = row.children[j];
            cell.style.width  = cell.style.height = cell.style.lineHeight = `${windowWidth / 3}px`;
      }
      }
    } else {
      this.boardElement.classList.remove('board-mobile');
    }
  }
}

module.exports = Board;
