import { Player } from '../src/player';
import { Gameboard } from '../src/gameboard';

let gameboard;

beforeEach(() => {
  gameboard = new Gameboard();
});

it('can take a turn', () => {
  const player = new Player({ gameboard });
  const spy = jest.spyOn(gameboard, 'receiveAttack');
  const move = { coordinates: [0, 0] };
  player.takeTurn(move);
  expect(spy).toHaveBeenCalledWith(move);
});
