package lib;
import java.util.*;

public class Solver {
    private Board initialBoard;
    private List<Board> visitedBoard;
    private Random random = new Random();
    public int heuristik = 1;

    public Solver(Board initialBoard) {
        this.initialBoard = initialBoard;
        this.visitedBoard = new ArrayList<>();
    }

    public List<Board> solving(String method) {
        if (method.equalsIgnoreCase("SA")) {
            return simulatedAnnealing();
        }

        PriorityQueue<Board> q;
        if (method.equalsIgnoreCase("UCS")) {
            q = new PriorityQueue<>(Comparator.comparingInt(Board::getCost));
        } else if (method.equalsIgnoreCase("A*")) {
            switch (heuristik) {
                case 1 -> q = new PriorityQueue<>(Comparator.comparingInt(b -> b.getCost() + b.heuristik()));
                case 2 -> q = new PriorityQueue<>(Comparator.comparingInt(b -> b.getCost() + b.heuristik_2()));
                case 3 -> q = new PriorityQueue<>(Comparator.comparingInt(b -> b.getCost() + b.heuristik_3()));
                default -> {
                    System.out.println("Unknown heuristic for A*.");
                    return null;
                }
            }
        } else if (method.equalsIgnoreCase("GBFS")) {
            switch (heuristik) {
                case 1 -> q = new PriorityQueue<>(Comparator.comparingInt(Board::heuristik));
                case 2 -> q = new PriorityQueue<>(Comparator.comparingInt(Board::heuristik_2));
                case 3 -> q = new PriorityQueue<>(Comparator.comparingInt(Board::heuristik_3));
                default -> {
                    System.out.println("Unknown heuristic for GBFS.");
                    return null;
                }
            }
        } else {
            System.out.println("Unknown method: " + method);
            return null;
        }

        q.add(initialBoard);

        while (!q.isEmpty()) {
            Board current = q.poll();

            if (isVisited(current)) continue;
            visitedBoard.add(current);

            if (current.isGoal()) {
                System.out.println("Solution found!");
                return buildPath(current);
            }

            for (Board child : current.generateChild()) {
                if (!isVisited(child)) {
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

    private List<Board> simulatedAnnealing() {
        Board current = initialBoard;
        double temperature = 1000.0;
        double coolingRate = 0.003;

        while (temperature > 1e-3) {
            if (current.isGoal()) {
                System.out.println("Solution found with Simulated Annealing!");
                return buildPath(current);
            }

            List<Board> children = current.generateChild();
            if (children.isEmpty()) break;

            Board next = randomChild(children);
            int delta;
            switch (heuristik) {
                case 1 -> delta = current.heuristik() - next.heuristik();
                case 2 -> delta = current.heuristik() - next.heuristik_2();
                case 3 -> delta = current.heuristik() - next.heuristik_3();
                default -> {
                    System.out.println("Unknown heuristic for SA.");
                    return null;
                }
            }

            if (delta > 0) {
                current = next;
            } else {
                double probability = Math.exp(delta / temperature);
                if (random.nextDouble() < probability) {
                    current = next;
                }
            }

            temperature *= (1 - coolingRate); // cooling
        }

        System.out.println("No solution found using Simulated Annealing.");
        return null;
    }

    private Board randomChild(List<Board> children) {
        return children.get(random.nextInt(children.size()));
    }
}