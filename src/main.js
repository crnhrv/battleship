import { GameController } from './classes/gamecontroller.js';
import { Player } from './classes/player.js';
import { Computer } from './classes/computer.js';
import { Gameboard } from './classes/gameboard.js';
import { Renderer } from './classes/renderer.js';
import { SHIPS } from './constants/ships.js';
import { Observer } from './classes/observer.js';

const initializeGame = (
  shipPlacement,
  mainRenderer,
  playerBoard,
  randomPlacement,
  observer
) => {
  if (!randomPlacement) playerBoard = new Gameboard(observer);
  const player_gb = playerBoard;
  const computer_gb = new Gameboard(observer);
  if (!randomPlacement) {
    player_gb.createShips(shipPlacement);
  }
  computer_gb.createRandomGrid();
  const computer = new Computer({ gameboard: player_gb });
  const player = new Player({ gameboard: computer_gb });

  const cgRenderer = new Renderer({
    entryPoint: document.getElementById('cGrid'),
    gameboard: computer_gb,
  });
  const pgRenderer = new Renderer({
    entryPoint: document.getElementById('pGrid'),
    listeners: false,
    gameboard: player_gb,
  });

  const battleships = new GameController({
    player,
    computer,
    cgRenderer,
    pgRenderer,
    mainRenderer,
    observer,
  });

  battleships.runGame();
};

const preGameSetup = (randomPlacement = false) => {
  const startBtn = document.getElementById('startBtn');
  const resetBtn = document.getElementById('resetBtn');
  const observer = new Observer();
  const setupBoard = new Gameboard(observer);
  if (randomPlacement) {
    setupBoard.createRandomGrid();
    startBtn.style.display = 'block';
    resetBtn.style.display = 'block';
  }
  const mainRenderer = new Renderer({
    entryPoint: document.getElementById('preGrid'),
    gameboard: setupBoard,
  });

  mainRenderer.renderBoard(setupBoard.grid, 'selection');
  if (!randomPlacement) mainRenderer.createShips(SHIPS);
  resetBtn.addEventListener('click', () => location.reload());
  startBtn.addEventListener('click', () => {
    const preGridWrapper = document.querySelector('.pre-grid-wrapper');
    preGridWrapper.innerHTML = '';
    preGridWrapper.style.display = 'none';
    if (!randomPlacement) setupBoard = null;
    initializeGame(
      mainRenderer.shipPlacement,
      mainRenderer,
      setupBoard,
      randomPlacement,
      observer
    );
  });
};

const randomBtn = document.getElementById('randomBtn');
randomBtn.addEventListener('click', () => {
  const preGrid = document.getElementById('preGrid');
  const ships = document.getElementById('ships');
  preGrid.innerHTML = '';
  ships.innerHTML = `<button id="startBtn" class="btn start">Start Game</button>
  <button id="resetBtn" class="btn reset">Reset</button>`;
  preGameSetup(true);
});

preGameSetup();
