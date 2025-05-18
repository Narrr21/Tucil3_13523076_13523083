class Coor {
  constructor(X, Y) {
    this.X = X;
    this.Y = Y;
  }

  copy() {
    return new Coor(X, Y);
  }

  equal(c) {
    return this.X == c.X && this.Y == c.Y;
  }

  debugCoor() {
    System.out.println("Coord: (" + X + ", " + Y + ")");
  }
}
