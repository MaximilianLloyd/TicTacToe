/*

Win:
If you have two in a row, you can place a third to get three in a row.

Block:
If the opponent has two in a row, you must play the third to block the opponent.

Fork:
Create an opportunity where you have two threats to win (two non-blocked lines of 2).

Blocking an opponent's fork:
If there is a configuration where the opponent can fork, you must block that fork.

Center:
You play the center if open.

Opposite corner:
If the opponent is in the corner, you play the opposite corner.

Empty corner:
You play in a corner square.

Empty side:
You play in a middle square on any of the 4 sides.

*/



class AI {
  constructor () {

  }

  predict(grid, player, opponent) {
    // #1: WIN

    for (let row = 0; row < 3; row++) {
      let cell;
      let cellIndex = null;
      let cellCount = 0;

      for (cell = 0; cell < 3; cell++) {
        if(grid[row][cell] === player.type) {
          cellCount++;
        } else {
          if(!grid[row][cell]) cellIndex = cell;
        }
      }
      if(cellCount === 2 && cellIndex) {
        return {row: row, column: cellIndex};
      }
    }

    // Check column
    for (let column = 0; column < 3; column++) {
      let row;
      let cellIndex = null;
      let cellCount = 0;

      for (row = 0; row < 3; row++) {
        if(grid[row][column] === player.type) {
          cellCount++;
        } else {
          if(!grid[row][column]) cellIndex = row;
        }
      }
      if(cellCount === 2 && cellIndex) {
        return {row: cellIndex, column: column};
      }
    }


    // #2: BLOCK OPPONENT
    for (let row = 0; row < 3; row++) {
      let column;
      let cellCount = 0;
      let cellIndex = null;
      for (column = 0; column < 3; column++) {
        if(grid[row][column] === opponent) {
          cellCount++;
        } else {
          if(!grid[row][column]) cellIndex = column;
        }
      }
      if(cellCount === 2 && cellIndex) {
        return {row: row, column: cellIndex};
      }
    }

    // Check column
    for (let column = 0; column < 3; column++) {
      let row;
      let cellCount = 0;
      let cellIndex = null;
      for (row = 0; row < 3; row++) {
        if(grid[row][column] === opponent) {
          cellCount++;
        } else {
          if(!grid[row][column]) cellIndex = row;
        }
      }
      if(cellCount === 2 && cellIndex) {
        return {row: cellIndex, column: column};
      }
    }


    // #5 Center:
    if(!grid[1][1]) return {row: 1, column: 1};


    // #6 Opposite corner:
    if(grid[0][0] === opponent && !grid[2][2]) return {row: 2, column: 2};
    if(grid[0][2] === opponent && !grid[2][0]) return {row: 2, column: 0};
    if(grid[2][0] === opponent && !grid[0][2]) return {row: 0, column: 2};
    if(grid[2][2] === opponent && !grid[0][0]) return {row: 0, column: 0};



    // #7 Empty corner:
    if(!grid[0][0]) return {row: 0, column: 0};
    if(!grid[0][2]) return {row: 0, column: 2};
    if(!grid[2][0]) return {row: 2, column: 0};
    if(!grid[2][2]) return {row: 2, column: 2};


    // #8 Empty side:
    if(!grid[0][1]) return {row: 0, column: 1};
    if(!grid[1][2]) return {row: 1, column: 2};
    if(!grid[2][1]) return {row: 2, column: 1};
    if(!grid[1][0]) return {row: 1, column: 0};


  }
}

module.exports = AI;
