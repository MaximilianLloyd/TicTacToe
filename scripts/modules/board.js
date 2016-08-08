class Board {
  constructor(x, o) {
    console.log('Initializing board');
    this.moveCount    = 0;
    this.playing      = true;
    this.won          = false;
    this.boardElement = document.querySelector('.board');
    this.wonElement   = document.querySelector('.won');
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
    document.querySelectorAll('.cell').forEach((gridElement, index) => {
      if(index < 3) this.gridElements[0].push(gridElement);
      if(index < 6 && index > 2) this.gridElements[1].push(gridElement);
      if(index < 9 && index > 5) this.gridElements[2].push(gridElement);
      gridElement.innerHTML = '_';
      gridElement.addEventListener('click', event => this.movePlayer(event));
    });
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
        }
      }
  }

  hasWon() {
    // Check row
    let player = this.turn.type;
    for (let row = 0; row < this.grid.length; row++) {
      let cell;
      for (cell = 0; cell < this.grid[row].length; cell++) {
        if(this.grid[row][cell] != player) {
          break;
        }
      }
      if(cell === this.grid[row].length) {
        this.won = true;
        this.playing = false;
      }
    }

    // Check column
    for (let column = 0; column < 3; column++) {
      let row;
      for (row = 0; row < 3; row++) {
        if(this.grid[row][column] != player) {
          break;
        }
      }
      if(row === 3) {
        this.won = true;
        this.playing = false;
      }
    }


    // Check #1 diagonal
    for (let i = 0; i < 3; i++) {
      if(this.grid[i][i] != player) {
        break;
      }

      if(i === 2) {
        this.won = true;
        this.playing = false;
      }
    }

    // Check #2 diagonal
    for (let i = 0; i < 3; i++) {
      if(this.grid[i][(3-1)-i] != player) {
        break;
      }

      if(i === 2) {
        this.won = true;
        this.playing = false;
      }
    }

    let dialog = (message) => {
      this.boardElement.classList.add('fadeOut');
      setTimeout(() => {
        this.boardElement.style.display = 'none';
        let won                         = document.querySelector('.won');
        let wonMessage                  = document.querySelector('.won--message');

        wonMessage.innerHTML            = message;
        won.style.display               = 'block';
        won.classList.remove('fadeOut');
        won.classList.add('bounceInUp');
      }, 200);
    };

    if(this.won)                         dialog(`${player} has won.`);
    if(!this.won && this.moveCount >= 9) dialog(`It's a tie`);


  }

  restart () {
    console.log('calling restart ');
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

    document.querySelectorAll('.cell').forEach((gridElement, index) => {
      if(index < 3) this.gridElements[0].push(gridElement);
      if(index < 6 && index > 2) this.gridElements[1].push(gridElement);
      if(index < 9 && index > 5) this.gridElements[2].push(gridElement);
      gridElement.innerHTML = '_';
    });


    setTimeout(() => {
      this.wonElement.classList.remove('bounceInUp');
      this.wonElement.classList.add('fadeOut');
      this.wonElement.style.display = 'none';
      this.boardElement.style.display = 'block';
      this.boardElement.classList.remove('fadeOut');
      this.boardElement.classList.add('fadeIn');
    }, 200);
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

        console.log(row.children);
        for (let j = 0; j < row.children.length; j++) {
            let cell = row.children[j];
            console.log(cell);
            cell.style.width  = cell.style.height = cell.style.lineHeight = `${windowWidth / 3}px`;
      }
      }
    } else {
      this.boardElement.classList.remove('board-mobile');
    }
  }
}

module.exports = Board;
