export class Observer {
  constructor() {
    this.playerTurn = true;
  }

  change() {
    this.playerTurn = !this.playerTurn;
  }
}
