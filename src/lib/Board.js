class Board {
  constructor(board, width, height, totalCost, parent, exit, cars) {
    this.board = board.map((row) => [...row]); // Deep copy
    this.width = width;
    this.height = height;
    this.totalCost = totalCost;
    this.parent = parent;
    this.exit = exit; // Coor object
    this.cars = cars; // Array of Car objects
  }

  getBoard() {
    return this.board;
  }

  getCost() {
    return this.totalCost;
  }

  getParent() {
    return this.parent;
  }

  isGoal() {
    return this.board[this.exit.X][this.exit.Y] === "X";
  }

  cloneBoard() {
    return this.board.map((row) => [...row]);
  }

  cloneCars() {
    return this.cars.map((car) => ({
      id: car.id,
      direction: car.direction,
      start: new Coor(car.start.X, car.start.Y),
      end: new Coor(car.end.X, car.end.Y),
    }));
  }

  generateChild() {
    const children = [];
    const border = maximum(this.width, this.height);
    for (const car of this.cars) {
      var maxStep = border - car.len;
      for (const step of [-maxStep, maxStep]) {
        if (step === 0) continue;
        if (canMove(car, step)) {
          const newBoard = cloneBoard();
          const newCars = cloneCars();

          const movedCar = newCars.find((c) => c.symbol === car.symbol);
          movedCar.move(step);

          updateBoard(newBoard, car, movedCar);

          children.push(
            new Board(
              newBoard,
              this.width,
              this.height,
              this.totalCost + 1,
              this,
              this.exit,
              newCars
            )
          );
        }
      }
    }

    return children;
  }

  canMove(car, step) {
    const { start, end, direction } = car;

    if (direction === "X") {
      const newX = step === -1 ? start.X - 1 : end.X + 1;
      if (newX < 0 || newX >= this.height) return false;

      const y = start.Y;
      return this.board[newX][y] === ".";
    } else {
      const newY = step === -1 ? start.Y - 1 : end.Y + 1;
      if (newY < 0 || newY >= this.width) return false;

      const x = start.X;
      return this.board[x][newY] === ".";
    }
  }

  equals(b) {
    if (!b) return false;
    for (let i = 0; i < 6; i++) {
      if (this.board[i].join("") !== b.board[i].join("")) return false;
    }
    return this.totalCost === b.totalCost && this.exit.equals(b.exit);
  }

  debugBoard() {
    console.log("Board:");
    for (let i = 0; i < 6; i++) {
      console.log(this.board[i]);
    }
    console.log("Cost:", this.totalCost);
    console.log("Exit: (" + this.exit.X + ", " + this.exit.Y + ")");
  }
}
