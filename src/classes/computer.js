import { Player } from './player.js';

export class Computer extends Player {
  constructor({ gameboard }) {
    super({ gameboard });
    this.difficulty = 1;
    this.name = 'Computer';
    this.previous_move = this.gameboard.generateRandomCoords();
    this.lastAttackHit = false;
  }

  takeTurn() {
    const coordinates = this.#pickValidCoords();
    if (this.gameboard.receiveAttack({ coordinates })) {
      this.previous_move = coordinates;
      this.lastAttackHit = true;
    } else {
      this.lastAttackHit = false;
    }
  }

  #pickValidCoords() {
    let [row, col] = this.gameboard.generateRandomCoords();

    if (this.difficulty && this.lastAttackHit) {
      [row, col] = this.#generateCloseCoords();
    }

    while (!this.validCoords(row, col)) {
      [row, col] = this.gameboard.generateRandomCoords();
    }
    return [row, col];
  }

  #generateCloseCoords() {
    const [initR, initC] = this.previous_move;
    let [row, col] = [initR, initC];

    const axis = Math.floor(Math.random() * 2) === 1 ? 'h' : 'v';
    let dir = Math.floor(Math.random() * 2) === 1 ? 1 : -1;
    for (let i = 0; i < this.difficulty; i++) {
      if ((col >= 9 && row > 0) || (row >= 9 && col > 0)) {
        dir = -1;
      } else if ((col <= 0 && row < 9) || (row <= 0 && col < 9)) {
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
