import { Ship } from '../src/ship';

export class Gameboard {
  constructor() {
    this.grid = Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () => null)
    );
    this.ships = [];
  }

  addShip({ length, coordinates, direction }) {
    const [row, col] = coordinates;
    if (!this.#isAddable(row, col, length, direction)) {
      return false;
    }
    const ship = new Ship({ length });
    for (let i = 0; i < length; i++) {
      const gridCell = { ship, section: i };

      if (direction === 'h') {
        this.grid[row][col + i] = gridCell;
      } else {
        this.grid[row + i][col] = gridCell;
      }
    }
    this.ships.push(ship);
    return ship;
  }

  receiveAttack({ coordinates }) {
    const [row, col] = coordinates;
    const cell = this.grid[row][col];
    if (!cell) {
      this.grid[row][cell] = false;
      return false;
    } else {
      cell.ship.hit(cell.section);
      return true;
    }
  }

  allSunk() {
    return this.ships.every((ship) =>
      ship.sections.every((section) => !section)
    );
  }

  #isAddable(row, col, length, direction) {
    if (direction === 'h' && length + col > 10) {
      return false;
    } else if (direction === 'v' && length + row > 10) {
      return false;
    } else if (this.grid[row][col]) {
      return false;
    }
    return true;
  }
}
