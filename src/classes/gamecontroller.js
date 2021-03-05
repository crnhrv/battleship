export class GameController {
  constructor({
    player,
    computer,
    pgRenderer,
    cgRenderer,
    mainRenderer,
    observer,
  }) {
    this.player = player;
    this.computer = computer;
    this.pgRenderer = pgRenderer;
    this.cgRenderer = cgRenderer;
    this.mainRenderer = mainRenderer;
    this.observer = observer;
  }

  setUpGame() {}

  runGame() {
    let interval;
    this.#renderAll();

    interval = setInterval(() => {
      this.#checkWin(interval);
      if (!this.#gameOver && !this.observer.playerTurn) {
        this.computer.takeTurn();
        this.#renderAll();
      }
    }, 500);
  }

  #checkWin(interval) {
    if (this.#gameOver) {
      clearInterval(interval);
      return this.mainRenderer.gameOver(this.#winner);
    }
  }

  #renderAll() {
    this.pgRenderer.renderBoard(this.#computerGrid, 'playerGrid');
    this.cgRenderer.renderBoard(this.#playerGrid, 'computerGrid');
  }

  get #gameOver() {
    const player_win = this.computer.gameboard.allSunk();
    const ai_win = this.player.gameboard.allSunk();
    return player_win || ai_win || false;
  }

  get #winner() {
    if (this.player.gameboard.allSunk) {
      return this.player;
    } else {
      return this.computer;
    }
  }

  get #playerGrid() {
    return this.player.gameboard.grid;
  }

  get #computerGrid() {
    return this.computer.gameboard.grid;
  }
}
