import { Ship } from './ship.js';
import { SHIPS } from '../constants/ships.js';

export class Gameboard {
  constructor() {
    this.grid;
    this.ships = [];
    this.#createGrid();
  }

  createShips(shipData) {
    this.#createGrid();
    Object.values(shipData).forEach((ship) => {
      this.addShip(ship);
    });
  }

  createRandomGrid() {
    SHIPS.forEach((ship) => {
      for (let i = 1; i <= ship.count; i++) {
        const id = ship.id + i;
        const length = ship.length;
        const direction = Math.floor(Math.random() * 1) === 1 ? 'h' : 'v';
        let [row, col] = this.generateRandomCoords();
        while (!this.isAddable(row, col, length, direction)) {
          [row, col] = this.generateRandomCoords();
        }
        const coordinates = [row, col];
        this.addShip({ length, direction, coordinates, id });
      }
      console.log(this.grid);
    });
  }

  generateRandomCoords() {
    let row = Math.floor(Math.random() * 10);
    let col = Math.floor(Math.random() * 10);
    return [row, col];
  }

  #createGrid() {
    this.grid = Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () => null)
    );
    return this.grid;
  }

  addShip({ length, coordinates, direction, id }) {
    const [row, col] = coordinates;
    if (!this.isAddable(row, col, length, direction)) {
      return false;
    }
    const ship = new Ship({ length });
    const allCoords = [];
    for (let i = 0; i < length; i++) {
      const gridCell = { ship, section: i };

      if (direction === 'h') {
        this.grid[row][col + i] = gridCell;
        allCoords.push([row, col + i]);
      } else {
        this.grid[row + i][col] = gridCell;
        allCoords.push([row + i, col]);
      }
    }
    ship.coordinates = allCoords;
    ship.id = id;
    this.ships.push(ship);
    return ship;
  }

  removeShip(id) {
    const ship = this.ships.find((ship) => ship.id === id);
    if (!ship) {
      return;
    }
    for (let [row, col] of ship.coords) {
      this.grid[row][col] = null;
    }
    this.ships = this.ships.filter((ship) => ship.id !== id);
  }

  receiveAttack({ coordinates }) {
    const [row, col] = coordinates;
    const cell = this.grid[row][col];
    if (!cell) {
      this.grid[row][col] = false;
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

  isAddable(row, col, length, direction) {
    if (direction === 'h' && length + col > 10) {
      return false;
    } else if (direction === 'v' && length + row > 10) {
      return false;
    } else if (this.#spaceTaken(row, col, length, direction)) {
      return false;
    }
    return true;
  }

  #spaceTaken(row, col, length, dir) {
    for (let i = 0; i < length; i++) {
      if (dir === 'h' && this.grid[row][col + i]) {
        return true;
      } else if (dir === 'v' && this.grid[row + i][col]) {
        return true;
      }
    }
    return false;
  }
}
