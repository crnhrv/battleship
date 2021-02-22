export class Player {
  constructor({ gameboard }) {
    this.gameboard = gameboard;
  }

  takeTurn({ coordinates }) {
    const [row, col] = coordinates;
    if (this.validCoords(row, col)) {
      this.gameboard.receiveAttack({ coordinates });
      return true;
    } else {
      return false;
    }
  }

  validCoords(row, col) {
    const square = this.gameboard.grid[row][col];
    if (square === null) {
      return true;
    } else if (square === false) {
      return false;
    } else {
      return square.ship[square.section];
    }
  }
}
