import { Player } from './player';

export class Computer extends Player {
  constructor({ gameboard }) {
    super({ gameboard });
    this.difficulty = 1;
    this.previous_move = this.#generateRandomCoords();
  }

  takeTurn() {
    const coordinates = this.#pickValidCoords();
    this.gameboard.receiveAttack({ coordinates });
    this.previous_move = coordinates;
  }

  #pickValidCoords() {
    let [row, col] = this.previous_move;

    if (this.difficulty) {
      [row, col] = this.#generateCloseCoords();
    }

    while (!this.validCoords(row, col)) {
      [row, col] = this.#generateRandomCoords();
    }
    return [row, col];
  }

  #generateRandomCoords() {
    let row = Math.floor(Math.random() * 10);
    let col = Math.floor(Math.random() * 10);
    return [row, col];
  }

  #generateCloseCoords() {
    const [initR, initC] = this.previous_move;
    let [row, col] = [initR, initC];

    const axis = Math.floor(Math.random() * 2) === 1 ? 'h' : 'v';
    let dir = Math.floor(Math.random() * 2) === 1 ? 1 : -1;

    for (let i = 0; i < this.difficulty; i++) {
      if (col >= 9 || row >= 9) {
        dir = -1;
      } else if (col <= 0 || row <= 0) {
        dir = 1;
      }

      if (axis === 'h') {
        col += dir;
      } else {
        row += dir;
      }

      if (this.gameboard.grid[row][col]) {
        break;
      }
    }
    return [row, col];
  }
}
