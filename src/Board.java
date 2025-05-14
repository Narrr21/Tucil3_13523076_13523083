import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Board {
    private final char[][] board;
    private final int width;
    private final int height;
    private final Coor exit;
    private final int totalCost;
    private final Board parent;

    public Board(char[][] board, int width, int height, int totalCost, Board parent, Coor exit) {
        this.board = new char[height][width];
        for (int i = 0; i < 6; i++) {
            this.board[i] = Arrays.copyOf(board[i], 6);
        }
        this.width = width;
        this.height = height;
        this.totalCost = totalCost;
        this.parent = parent;
        this.exit = exit;
    }

    public char[][] getBoard() {
        return board;
    }

    public int getCost() {
        return totalCost;
    }

    public Board getParent() {
        return parent;
    }

    public boolean isGoal() {
        return board[exit.X][exit.Y] == 'X';
    }

    public List<Board> generateChild() {
        List<Board> children = new ArrayList<>();
        return children;
    }

    private Board copy() {
        char[][] newBoard = new char[height][width];
        for (int i = 0; i < 6; i++) {
            newBoard[i] = Arrays.copyOf(this.board[i], width);
        }
        return new Board(board, width, height, totalCost, parent, exit.copy());
    }

    public boolean equal(Board b) {
        if (b == null) return false;
        for (int i = 0; i < 6; i++) {
            if (!Arrays.equals(this.board[i], b.board[i])) return false;
        }
        return this.totalCost == b.totalCost && this.exit.equals(exit);
    }

    public void debugBoard() {
        System.out.println("Board:");
        for (int i = 0; i < 6; i++) {
            System.out.println(Arrays.toString(board[i]));
        }
        System.out.println("Cost: " + totalCost);
        System.out.println("Exit: (" + exit.X + ", " + exit.Y + ")");
    }
}