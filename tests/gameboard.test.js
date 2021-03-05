import { Gameboard } from '../src/classes/gameboard';

let gameboard;

beforeEach(() => {
  gameboard = new Gameboard();
});

it('creates a 10x10 grid', () => {
  expect(gameboard.grid.reduce((acc, curr) => acc + curr.length, 0)).toBe(100);
});

describe('addShip()', () => {
  it('can add a length-1 horizontal ship to the grid', () => {
    const ship = gameboard.addShip({
      length: 1,
      coordinates: [0, 0],
      direction: 'h',
    });
    expect(gameboard.grid[0][0].ship).toBe(ship);
  });

  it('can add a length-5 horizontal ship to the grid', () => {
    const ship = gameboard.addShip({
      length: 5,
      coordinates: [0, 0],
      direction: 'h',
    });
    expect(gameboard.grid[0][0].ship).toBe(ship);
    expect(gameboard.grid[0][4].ship).toBe(ship);
  });

  it('has the relative section for a horizontal ship in the grid', () => {
    const ship = gameboard.addShip({
      length: 5,
      coordinates: [0, 0],
      direction: 'h',
    });
    expect(gameboard.grid[0][0].section).toBe(0);
    expect(gameboard.grid[0][4].section).toBe(4);
  });

  it('can add a length-1 vertical ship to the grid', () => {
    const ship = gameboard.addShip({
      length: 1,
      coordinates: [0, 0],
      direction: 'v',
    });
    expect(gameboard.grid[0][0].ship).toBe(ship);
  });

  it('can add a length-5 vertical ship to the grid', () => {
    const ship = gameboard.addShip({
      length: 5,
      coordinates: [0, 0],
      direction: 'v',
    });
    expect(gameboard.grid[0][0].ship).toBe(ship);
    expect(gameboard.grid[4][0].ship).toBe(ship);
  });

  it('has the relative section for a vertical ship in the grid', () => {
    const ship = gameboard.addShip({
      length: 5,
      coordinates: [0, 0],
      direction: 'v',
    });
    expect(gameboard.grid[0][0].section).toBe(0);
    expect(gameboard.grid[4][0].section).toBe(4);
  });

  it('prevents ships being placed ontop of each other', () => {
    const ship = {
      length: 1,
      coordinates: [0, 0],
      direction: 'h',
    };
    gameboard.addShip(ship);
    expect(gameboard.addShip(ship)).toBe(false);
  });

  it('prevents horizontal ships being placed out of bounds', () => {
    const ship = {
      length: 1,
      coordinates: [0, 10],
      direction: 'h',
    };
    expect(gameboard.addShip(ship)).toBe(false);
  });

  it('prevents horizontal ships being placed out of bounds', () => {
    const ship = {
      length: 5,
      coordinates: [0, 6],
      direction: 'h',
    };
    expect(gameboard.addShip(ship)).toBe(false);
  });

  it('prevents vertical ships being placed out of bounds', () => {
    const ship = {
      length: 1,
      coordinates: [10, 0],
      direction: 'v',
    };
    expect(gameboard.addShip(ship)).toBe(false);
  });

  it('prevents vertical ships being placed out of bounds', () => {
    const ship = {
      length: 5,
      coordinates: [6, 0],
      direction: 'v',
    };
    expect(gameboard.addShip(ship)).toBe(false);
  });
});

describe('receiveAttack()', () => {
  it('successfully damages a ship with the correct coords', () => {
    const ship = gameboard.addShip({
      length: 1,
      coordinates: [0, 0],
      direction: 'h',
    });

    expect(gameboard.receiveAttack({ coordinates: [0, 0] })).toBe(true);
    expect(ship.sections[0]).toBe(false);
  });

  it('fails to damage a ship when the coords are incorrect', () => {
    const ship = gameboard.addShip({
      length: 1,
      coordinates: [0, 0],
      direction: 'h',
    });

    expect(gameboard.receiveAttack({ coordinates: [9, 0] })).toBe(false);
    expect(ship.sections[0]).toBe(true);
  });
});

describe('allSunk()', () => {
  it('returns true when all ships on the board are sunk', () => {
    const ship = gameboard.addShip({
      length: 1,
      coordinates: [0, 0],
      direction: 'h',
    });
    gameboard.receiveAttack({ coordinates: [0, 0] });
    expect(gameboard.allSunk()).toBe(true);
  });

  it('returns false when not all ships on the board are sunk', () => {
    const ship = gameboard.addShip({
      length: 1,
      coordinates: [0, 0],
      direction: 'h',
    });
    expect(gameboard.allSunk()).toBe(false);
  });
});
