import { Computer } from '../src/classes/computer';
import { Gameboard } from '../src/classes/gameboard';

let gameboard;

beforeEach(() => {
  gameboard = new Gameboard();
});

it('can take a turn', () => {
  const computer = new Computer({ gameboard });
  const spy = jest.spyOn(gameboard, 'receiveAttack');
  computer.takeTurn();
  expect(spy).toHaveBeenCalled();
});
