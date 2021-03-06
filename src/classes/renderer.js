export class Renderer {
  constructor({ entryPoint, gameboard = null, listeners = true }) {
    this.entryPoint = entryPoint;
    this.textEntry = document.querySelector('.gameInfo');
    this.gameboard = gameboard;
    this.shipPlacement = {};
    this.elements = [];
    this.listeners = listeners;
  }

  get allShipsSet() {
    return (
      document.querySelectorAll('.ship').length ===
      Object.keys(this.shipPlacement).length
    );
  }

  renderBoard(board, type) {
    this.#reset();
    const htmlBoard = this.createBoard(board, type);
    if (type !== 'selection') {
      const scoreDiv = this.createScoreDiv();
      this.entryPoint.appendChild(scoreDiv);
    }
    htmlBoard.forEach((ele) => this.entryPoint.appendChild(ele));
  }

  renderTurnPrompt() {
    this.textEntry.textContent = this.gameboard.observer.playerTurn
      ? "Player's Turn"
      : "Computer's Turn";
    this.textEntry.style.fontSize = '1.7rem';
    this.textEntry.style.color = this.gameboard.observer.playerTurn
      ? 'rgba(220, 20, 60, 0.623)'
      : 'rgba(118, 141, 243, 0.8)';
  }

  renderScore() {
    const score = this.entryPoint.querySelector('.score-text');
    score.textContent = `${this.gameboard.sunkShipCount} Ships Sunk / ${this.gameboard.activeShipCount} Remaining`;
  }

  renderGameOver(winner) {
    this.textEntry.textContent = `${winner.name} wins!`;
    this.textEntry.style.fontSize = '2rem';
    this.textEntry.style.color =
      winner.name === 'Player'
        ? 'rgba(220, 20, 60, 0.623)'
        : 'rgba(118, 141, 243, 0.8)';
  }

  createBoard(board, type) {
    const grid = [];
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        const htmlCell = document.createElement('div');
        const boardCell = board[row][col];
        htmlCell.classList.add('cell', type);
        if (type === 'selection' && boardCell) {
          htmlCell.classList.add(
            boardCell.section === 0 ? 'ship' : null,
            'part'
          );
        }
        if (boardCell === false) htmlCell.classList.add('mishit');
        if (boardCell) {
          if (boardCell.ship.isHit(boardCell.section)) {
            htmlCell.classList.add('hit');
          }

          if (boardCell.ship.isSunk()) {
            htmlCell.classList.add('sunk');
          }
        }
        if (this.listeners) {
          this.#addListeners(htmlCell, type, [row, col]);
        }
        grid.push(htmlCell);
      }
    }
    return grid;
  }

  createScoreDiv() {
    const div = document.createElement('div');
    const text = document.createElement('p');
    div.classList.add('score');
    text.classList.add('score-text');
    div.appendChild(text);
    return div;
  }

  createShips(ships) {
    const shipsGrid = document.getElementById('ships');

    for (let ship of ships) {
      for (let i = 0; i < ship.count; i++) {
        const shipContainer = document.createElement('div');
        for (let j = 0; j < ship.length; j++) {
          const section = this.#createSection(j);
          shipContainer.append(section);
        }
        this.#setUpShipContainer(shipContainer, ship, i);
        shipsGrid.append(shipContainer);
      }
    }
  }

  #reset() {
    this.entryPoint.innerHTML = '';
  }

  #setUpShipContainer = (cnt, ship, key) => {
    cnt.classList.add('ship');
    cnt.id = ship.id + String(key);
    cnt.draggable = true;
    cnt.addEventListener('dragstart', (e) => this.#dragShip(e));
    cnt.addEventListener('dragend', (e) => this.#placeShip(e.target));
  };

  #dragShip = (e) => {
    e.dataTransfer.setData('text/plain', e.target.id);
    const ship = e.target;
    const parts = ship.querySelectorAll('.part');

    parts.forEach((part) => {
      part.style.width = 'var(--cell-size)';
      part.style.height = 'var(--cell-size)';
    });
  };

  #placeShip(ship) {
    if (!this.shipPlacement[ship.id]) {
      ship.querySelectorAll('.part').forEach((part) => {
        part.style.width = `calc(var(--cell-size) / 2)`;
        part.style.height = `calc(var(--cell-size) / 2)`;
      });
    }

    if (this.allShipsSet) {
      const start = document.getElementById('startBtn');
      const reset = document.getElementById('resetBtn');
      start.style.display = 'Block';
      reset.style.display = 'Block';
    }
  }

  #createSection() {
    const shipSection = document.createElement('div');
    shipSection.classList.add('part');
    return shipSection;
  }

  #addListeners(ele, type, coordinates) {
    switch (type) {
      case 'computerGrid': {
        ele.addEventListener('click', () => {
          if (
            !this.gameboard.observer.playerTurn ||
            ele.classList.contains('hit') ||
            ele.classList.contains('mishit')
          ) {
            return;
          }
          if (this.gameboard.receiveAttack({ coordinates })) {
            ele.classList.add('hit');
          } else {
            ele.classList.add('mishit');
          }
        });
        break;
      }
      case 'selection': {
        ele.addEventListener('dragover', (e) => this.#showShip(e));
        ele.addEventListener('drop', (e) =>
          this.#updateShipRecord(coordinates, e, 'h')
        );
        break;
      }
    }
  }
  #showShip(e) {
    e.preventDefault();
  }

  #updateShipRecord(coords, e, dir) {
    const id = e.dataTransfer.getData('text');
    const ship = document.getElementById(id);
    const shiplength = ship.querySelectorAll('.part').length;
    const dropzone = e.target;
    if (this.shipPlacement[id]) {
      dir = this.shipPlacement[id].direction;
    }
    if (this.gameboard.isAddable(coords[0], coords[1], shiplength, dir)) {
      if (!this.shipPlacement[id]) {
        ship.addEventListener('click', () => this.#rotateShip(ship));
      }
      dropzone.appendChild(ship);
      this.shipPlacement[id] = {
        coordinates: coords,
        direction: dir,
        length: shiplength,
        id,
      };
      this.gameboard.removeShip(ship.id);
      this.gameboard.addShip(this.shipPlacement[id]);
    } else {
      this.#placeShip(ship);
    }
    e.dataTransfer.clearData();
  }

  #rotateShip(ship) {
    const shipData = this.shipPlacement[ship.id];
    const [row, col] = shipData.coordinates;
    const newDir = shipData.direction === 'h' ? 'v' : 'h';
    this.gameboard.removeShip(ship.id);
    if (this.gameboard.isAddable(row, col, shipData.length, newDir)) {
      ship.style.gridAutoFlow = newDir === 'h' ? 'column' : 'row';
      this.shipPlacement[ship.id] = {
        ...shipData,
        direction: newDir,
      };
      this.gameboard.addShip(this.shipPlacement[ship.id]);
    } else {
      this.gameboard.addShip(shipData);
    }
  }
}
