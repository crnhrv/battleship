export class Ship {
  constructor({ length }) {
    this.sections = Array.from({ length }, () => true);
    this.coordinates = [];
    this.id;
  }

  get length() {
    return this.sections.length;
  }

  hit(section) {
    this.sections[section] = false;
  }

  isHit(section) {
    return this.sections[section] === false;
  }

  isSunk() {
    return this.sections.every((section) => !section);
  }
}
