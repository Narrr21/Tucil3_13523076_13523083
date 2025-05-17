import java.util.*;

public class Solver {
    private Board initialBoard;
    private List<Board> visitedBoard;

    public Solver(Board initialBoard) {
        this.initialBoard = initialBoard;
        this.visitedBoard = new ArrayList<>();
    }

    public List<Board> solving(String method) {
        PriorityQueue<Board> q;
        if (method.equalsIgnoreCase("UCS")) {
            q = new PriorityQueue<>(Comparator.comparingInt(Board::getCost));
        } else if (method.equalsIgnoreCase("A*")) {
            q = new PriorityQueue<>(Comparator.comparingInt(b -> b.getCost() + b.heuristik()));
        } else if (method.equalsIgnoreCase("GBFS")) {
            q = new PriorityQueue<>(Comparator.comparingInt(Board::heuristik));
        } else {
            System.out.println("Unknown method: " + method);
            return null;
        }
        q.add(initialBoard);

        while (!q.isEmpty()) {
            Board current = q.poll();

            if (isVisited(current)) continue;
            visitedBoard.add(current);
            // System.out.println("Curretnly visit : ");
            // current.debugBoard();

            if (current.isGoal()) {
                System.out.println("Solution found!");
                return buildPath(current);
            }

            for (Board child : current.generateChild()) {
                // System.out.println("Current child : ");
                // child.debugBoard();
                if (!isVisited(child)) {
                    // System.out.println("Child added");
                    q.add(child);
                }
            }
        }

        System.out.println("No solution found.");
        return null;
    }

    private boolean isVisited(Board curr) {
        for (Board b : visitedBoard) {
            if (b.equals(curr)) {
                return true;
            }
        }
        return false;
    }

    private List<Board> buildPath(Board current) {
        List<Board> path = new ArrayList<>();

        while (current != null) {
            path.add(0, current);
            current = current.getParent();
        }

        return path;
    }
}