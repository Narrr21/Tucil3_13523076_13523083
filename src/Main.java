import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        int width = 6;
        int height = 6;
        char[][] grid = {
            {'A', 'A', 'B', '.', '.', 'F'},
            {'.', '.', 'B', 'C', 'D', 'F'},
            {'G', 'P', 'P', 'C', 'D', 'F'},
            {'G', 'H', 'I', 'I', 'I', '.'},
            {'G', 'H', 'J', '.', '.', '.'},
            {'L', 'L', 'J', 'M', 'M', '.'}
        };

        Coor exit = new Coor(2, 5); // baris 2, kolom 5

        List<Car> cars = new ArrayList<>();
        cars.add(new Car('P', new Coor(2, 1), new Coor(2, 2))); // horizontal (baris tetap)
        cars.add(new Car('A', new Coor(0, 0), new Coor(0, 1))); // horizontal
        cars.add(new Car('B', new Coor(0, 2), new Coor(1, 2))); // vertical
        cars.add(new Car('C', new Coor(1, 3), new Coor(2, 3))); // vertical
        cars.add(new Car('D', new Coor(1, 4), new Coor(2, 4))); // vertical
        cars.add(new Car('F', new Coor(0, 5), new Coor(2, 5))); // vertical
        cars.add(new Car('G', new Coor(2, 0), new Coor(4, 0))); // vertical
        cars.add(new Car('H', new Coor(3, 1), new Coor(4, 1))); // vertical
        cars.add(new Car('I', new Coor(3, 2), new Coor(3, 4))); // horizontal
        cars.add(new Car('J', new Coor(4, 2), new Coor(5, 2))); // vertical
        cars.add(new Car('L', new Coor(5, 0), new Coor(5, 1))); // horizontal
        cars.add(new Car('M', new Coor(5, 3), new Coor(5, 4))); // horizontal


        Board board = new Board(grid, width, height, 0, null, exit, cars);

        System.out.println("Initial Board:");
        board.debugBoard();

        System.out.println("Heuristic estimate to goal: " + board.heuristik());

        if (board.isGoal()) {
            System.out.println("Already at goal!");
        } else {
            System.out.println("Not at goal yet.");
        }

        Solver s = new Solver(board);
        List<Board> res = s.solving("UCS");
        // List<Board> res = s.solving("A*");
        // List<Board> res = s.solving("GBFS");
        if (res != null) {
            for (Board b : res) {
                b.debugBoard();
            }
        }
    }
}
