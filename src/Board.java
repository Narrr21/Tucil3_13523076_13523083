import java.util.ArrayList;
import java.util.List;

public class Board {
    private char[][] board;
    private int width;
    private int height;
    private int totalCost;
    private Board parent;
    private Coor exit;
    private List<Car> cars;

    public Board(char[][] board, int width, int height, int totalCost, Board parent, Coor exit, List<Car> cars) {
        this.board = deepCopyBoard(board);
        this.width = width;
        this.height = height;
        this.totalCost = totalCost;
        this.parent = parent;
        this.exit = exit;
        this.cars = cars;
    }

    public char[][] getBoard() {
        return deepCopyBoard(board);
    }

    public int getCost() {
        return totalCost;
    }

    public Board getParent() {
        return parent;
    }

    public boolean isGoal() {
        return board[exit.Y][exit.X] == 'P';
    }

    private char[][] deepCopyBoard(char[][] original) {
        char[][] copy = new char[original.length][];
        for (int i = 0; i < original.length; i++) {
            copy[i] = original[i].clone();
        }
        return copy;
    }

    private List<Car> deepCopyCars(List<Car> original) {
        List<Car> copy = new ArrayList<>();
        for (Car car : original) {
            copy.add(new Car(
                car.getSymbol(),
                car.getStart().copy(),
                car.getEnd().copy()
            ));
        }
        return copy;
    }

    public int heuristik() {
        Car target = null;
        for (Car car : cars) {
            if (car.getSymbol() == 'P') {
                target = car;
                break;
            }
        }

        if (target == null) return Integer.MAX_VALUE;

        int blocking = 0;

        if (target.getDirection() == 'X') {
            int y = target.getStart().Y;
            int x = target.getEnd().X + 1;

            while (x < width) {
                if (board[y][x] != '.') {
                    blocking++;
                }
                if (x == exit.X && y == exit.Y) break;
                x++;
            }

            return (exit.X - target.getEnd().X) + blocking;

        } else { // direction == 'Y'
            int x = target.getStart().X;
            int y = target.getEnd().Y + 1;

            while (y < height) {
                if (board[y][x] != '.') {
                    blocking++;
                }
                if (x == exit.X && y == exit.Y) break;
                y++;
            }

            return (exit.Y - target.getEnd().Y) + blocking;
        }
    }

    public int heuristik_2() {
        // jumlah "berat" mobil yang menjadi penghalang, jika bisa digeser bernilai -1, jika tidak bernilai -3
        // TO BE IMPLEMENTED
        return 0;
    }

    public int heuristik_3() {
        // jumlah blocking 2 tingkat, blocking mobil primary + blocking mobil yang memblocking primary
        // TO BE IMPLEMENTED
        return 0;
    }

    public List<Board> generateChild() {
        List<Board> children = new ArrayList<>();
        int border = Math.max(width, height);

        for (Car car : cars) {
            // car.debugCar();
            int maxStep = border - car.length();
            // System.out.println(maxStep);

            for (int step = -maxStep; step <= maxStep; step++) {
                if (step == 0) continue; // Skip no movement

                if (!canMove(car, step)) continue;

                char[][] newBoard = deepCopyBoard(this.board);
                List<Car> newCars = deepCopyCars(this.cars);

                Car movedCar = null;
                Car oldCar = null;

                for (int i = 0; i < newCars.size(); i++) {
                    if (newCars.get(i).getSymbol() == car.getSymbol()) {
                        oldCar = newCars.get(i);
                        movedCar = new Car(oldCar.getSymbol(), oldCar.getStart().copy(), oldCar.getEnd().copy());
                        movedCar.move(step);
                        newCars.set(i, movedCar);
                        break;
                    }
                }

                updateBoard(newBoard, oldCar, movedCar);

                Board childBoard = new Board(newBoard, width, height, totalCost + 1, this, exit, newCars);
                children.add(childBoard);
            }
        }

        return children;
    }

    private void updateBoard(char[][] board, Car oldCar, Car newCar) {
        // Clear old car
        if (oldCar.getDirection() == 'X') {
            int y = oldCar.getStart().Y;
            for (int x = oldCar.getStart().X; x <= oldCar.getEnd().X; x++) {
                board[y][x] = '.';
            }
        } else {
            int x = oldCar.getStart().X;
            for (int y = oldCar.getStart().Y; y <= oldCar.getEnd().Y; y++) {
                board[y][x] = '.';
            }
        }

        // Draw new car
        if (newCar.getDirection() == 'X') {
            int y = newCar.getStart().Y;
            for (int x = newCar.getStart().X; x <= newCar.getEnd().X; x++) {
                board[y][x] = newCar.getSymbol();
            }
        } else {
            int x = newCar.getStart().X;
            for (int y = newCar.getStart().Y; y <= newCar.getEnd().Y; y++) {
                board[y][x] = newCar.getSymbol();
            }
        }
    }

    public boolean canMove(Car car, int step) {
        Coor start = car.getStart();
        Coor end = car.getEnd();
        char symbol = car.getSymbol();
        char direction = car.getDirection();

        if (direction == 'X') {
            int newStart = start.X + step;
            int newEnd = end.X + step;

            if (newStart < 0 || newEnd >= width) return false;

            int y = start.Y;
            int max = Math.max(newEnd, end.X);
            int min = Math.min(newStart, start.X);

            for (int i = min; i <= max; i++) {
                if (board[y][i] != '.' && board[y][i] != symbol) return false;
            }
            return true;

        } else if (direction == 'Y') {
            int newStart = start.Y + step;
            int newEnd = end.Y + step;

            if (newStart < 0 || newEnd >= height) return false;

            int x = start.X;
            int max = Math.max(newEnd, end.Y);
            int min = Math.min(newStart, start.Y);

            for (int i = min; i <= max; i++) {
                if (board[i][x] != '.' && board[i][x] != symbol) return false;
            }
            return true;
        }

        return false; // invalid direction
    }


    public boolean equals(Board b) {
        if (b == null) return false;

        for (int i = 0; i < height; i++) {
            if (!new String(this.board[i]).equals(new String(b.board[i]))) {
                return false;
            }
        }

        return this.totalCost <= b.totalCost;
    }

    public void debugBoard() {
        System.out.println("Board:");
        for (int i = 0; i < height; i++) {
            for (int j = 0; j < width; j++) {
                System.out.print(board[i][j] + " ");
            }
            System.out.println();
        }
        System.out.println("Cost: " + totalCost);
        System.out.println("Exit: (" + exit.X + ", " + exit.Y + ")");
    }
}