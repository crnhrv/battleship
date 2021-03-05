export class Renderer {
  constructor({ entryPoint, gameboard = null, listeners = true }) {
    this.entryPoint = entryPoint;
    this.gameboard = gameboard;
    this.shipPlacement = {};
    this.elements = [];
    this.listeners = listeners;
  }

  get totalShipCount() {
    return document.querySelectorAll('.ship').length;
  }

  get allShipsSet() {
    return this.totalShipCount === Object.keys(this.shipPlacement).length;
  }

  renderBoard(board, type) {
    this.#reset();
    if (this.elements) {
      this.elements = this.createBoard(board, type);
    } else {
      null;
    }
    this.elements.forEach((ele) => this.entryPoint.appendChild(ele));
  }

  #reset() {
    this.entryPoint.innerHTML = '';
  }

  gameOver(winner) {
    const goEntry = document.getElementById('gameOver');
    goEntry.textContent = `${winner.name} wins!`;
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
        if (boardCell && boardCell.ship.isHit(boardCell.section)) {
          htmlCell.classList.add('hit');
        }
        if (this.listeners) {
          this.#addListeners(htmlCell, type, [row, col]);
        }
        grid.push(htmlCell);
      }
    }
    return grid;
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
      part.style.width = '60px';
      part.style.height = '60px';
    });
  };

  #placeShip(ship) {
    if (!this.shipPlacement[ship.id]) {
      ship.querySelectorAll('.part').forEach((part) => {
        part.style.width = '30px';
        part.style.height = '30px';
      });
    }

    if (this.allShipsSet) {
      const start = document.getElementById('startBtn');
      const reset = document.getElementById('resetBtn');
      start.style.display = 'Block';
      reset.style.display = 'Block';
    }
  }

  #createSection(idx) {
    const shipSection = document.createElement('div');
    shipSection.classList.add('part');
    return shipSection;
  }

  #addListeners(ele, type, coordinates) {
    switch (type) {
      case 'computerGrid': {
        ele.addEventListener(
          'click',
          () => {
            if (this.gameboard.receiveAttack({ coordinates })) {
              ele.classList.add('hit');
            } else {
              ele.classList.add('mishit');
            }
            console.log('ss');
          },
          { once: true }
        );
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
