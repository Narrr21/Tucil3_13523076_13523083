class Car {
  constructor(symbol, start, end) {
    this.symbol = symbol;
    this.start = start;
    this.end = end;
    this.direction = start.X === end.X ? "Y" : "X";
    this.len =
      this.direction === "X"
        ? Math.abs(end.X - start.X)
        : Math.abs(end.Y - start.Y);
  }

  move(step) {
    if (this.direction === "X") {
      this.start.X += step;
      this.end.X += step;
    } else {
      this.start.Y += step;
      this.end.Y += step;
    }
  }
}
