export class Point {
  constructor(date, origPos, destPos) {
    this.date = date;
    this.origPos = {
      x: origPos.x,
      y: origPos.y,
    };
    this.destPos = {
      x: destPos.x + randomRange(-fieldSize.w / 2, fieldSize.w / 2), // variation
      y: destPos.y + randomRange(-fieldSize.h, 1), // variation
    };
    this.velocity = randomRange(0.3, 1);
    this.currentPos = { ...origPos }; // clone object
  }
  lerp() {
    this.diff = {
      x: this.destPos.x - this.origPos.x,
      y: this.destPos.y - this.origPos.y,
    };
    if (this.currentPos.y < this.destPos.y) {
      this.currentPos.x =
        (this.diff.x / movePerSecond / 2) * this.velocity + this.currentPos.x;
      this.currentPos.y =
        (this.diff.y / movePerSecond / 2) * this.velocity + this.currentPos.y;
    }
  }
}
