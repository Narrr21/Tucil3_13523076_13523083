package com.tucil3.backend.lib;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.PriorityQueue;
import java.util.Random;

public class Solver {
    private final Board initialBoard;
    private List<Board> visitedBoard;
    private final Random random = new Random();
    public int heuristik = 1;
    public int moveCount = 0;
    public int executionTime = 0;
    

    public Solver(Board initialBoard) {
        this.initialBoard = initialBoard;
        this.visitedBoard = new ArrayList<>();
    }

    public List<Board> solving(String method, int heur) {
        long startTime = System.nanoTime();

        if (!validSetup()) {
            System.out.println("Invalid setup.");
            return null;
        }
        heuristik = heur;

        if (method.equalsIgnoreCase("SA")) {
            List<Board> result = simulatedAnnealing();
            executionTime = (int)((System.nanoTime() - startTime) / 1_000_000);
            System.out.println("Time taken: " + executionTime + " ms");
            return result;
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
            moveCount++;
            Board current = q.poll();

            if (isVisited(current)) continue;
            visitedBoard.add(current);

            // current.debugBoard();

            if (current.isGoal()) {
                System.out.println("Solution found!");
                System.out.println("Board visited: " + moveCount);

                executionTime = (int)((System.nanoTime() - startTime) / 1_000_000);
                System.out.println("Time taken: " + executionTime + " ms");
                return buildPath(current);
            }

            for (Board child : current.generateChild()) {
                if (!isVisited(child)) {
                    q.add(child);
                }
            }
        }

        System.out.println("No solution found.");
        System.out.println("Board visited: " + moveCount);

        executionTime = (int)((System.nanoTime() - startTime) / 1_000_000);
        System.out.println("Time taken: " + executionTime + " ms");
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

    public boolean validSetup() {
        Coor ex = initialBoard.getExit();
        Coor pr = null;
        char direction = ' ';
        for (Car car: initialBoard.getCars()) {
//            car.debugCar();
            if (car.getSymbol() == 'P') {
                pr = car.getStart();
                direction = car.getDirection();
                break;
            }
        }
        if (pr == null) {
            return false;
        }
        if (direction == 'X') {
            if (!(ex.X == -1 || ex.X == initialBoard.getWidth())) {
                return false;
            }
            if (!(ex.Y == pr.Y)) {
                return false;
            }
            ex.X += (ex.X == -1) ? 1 : -1;
            initialBoard.setExit(ex);
            return true;
        } else {
            if (!(ex.Y == -1 || ex.Y == initialBoard.getWidth())) {
                return false;
            }
            if (!(ex.X == pr.X)) {
                return false;
            }
            ex.Y += (ex.Y == -1) ? 1 : -1;
            initialBoard.setExit(ex);
            return true;
        }
    }

    private List<Board> buildPath(Board current) {
        List<Board> path = new ArrayList<>();
        while (current != null) {
            path.add(0, current);
            current = current.getParent();
        }
        path.add(path.get(path.size() - 1).withoutPrimary());
        return path;
    }

    private List<Board> simulatedAnnealing() {
        moveCount = 0;

        Board current = initialBoard;
        double temperature = 1000.0;
        double coolingRate = 0.003;

        while (temperature > 1e-9) {
            moveCount++;
            // current.debugBoard();
            if (!isVisited(current)) {
                visitedBoard.add(current);
            }
            if (current.isGoal()) {
                System.out.println("Solution found!");
                System.out.println("Board visited: " + moveCount);
                return buildPath(current);
            }

            List<Board> children = current.generateChild();
            if (children.isEmpty()) break;

            Board next = null;
            while (!children.isEmpty()) {
                next = randomChild(children);
                children.remove(next);

                if (!isVisited(next) && next.getCost() <= 900) {
                    break; // valid candidate
                }

                next = null; // reset so we can check later
            }

            // If no valid child was found, backtrack
            if (next == null) {
                if (current.getParent() == null) {
                    return null;
                }
                current = current.getParent();
                continue;
            }
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
            } 
            else {
                double probability = Math.exp(delta / temperature);
                if (random.nextDouble() < probability) {
                    current = next;
                }
            }

            temperature *= (1 - coolingRate); // cooling
        }

        System.out.println("No solution found.");
        System.out.println("Board visited: " + moveCount);
        return null;
    }

    private Board randomChild(List<Board> children) {
        if (children.isEmpty()) {return null;}
        return children.get(random.nextInt(children.size()));
    }
}