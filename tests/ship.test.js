import { Ship } from '../src/classes/ship';

let ship;

beforeEach(() => {
  ship = new Ship({ length: 3 });
});

it('has a length', () => {
  expect(ship.length).toBe(3);
});

it('starts with all sections intact', () => {
  expect(ship.sections.every((section) => section === true)).toBe(true);
});

it('can be hit', () => {
  ship.hit(1);
  expect(ship.sections[1]).toBe(false);
});

it('can be sunk', () => {
  for (let i = 0; i < ship.length; i++) {
    ship.hit(i);
  }
  expect(ship.isSunk()).toBe(true);
});
