package com.tucil3.backend.controller;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.tucil3.backend.lib.Board;
import com.tucil3.backend.lib.Coor;
import com.tucil3.backend.lib.Solver;

@RestController
@CrossOrigin(origins = "*")
public class SolveController {
    public static class GridSize {
        public int rows;
        public int cols;
    }

    public static class OccupiedCells {
        public char pieceId;
        public int x;
        public int y;
    }

    public static class Exit {
        public int exitCol;
        public int exitRow;
    }

    public static class Heuristic {
        public int heur;
        public String pathfinding;
    }

    public static class RequestPayload {
        public GridSize gridSize;
        public List<OccupiedCells> occupiedCells;
        public Exit exit;
        public Heuristic heuristics;
    }

    public static class ResponsePayload {
        public List<Board> boards;
        public int executionTime;
        public int moveCount;

        public ResponsePayload(List<Board> boards, int executionTime, int moveCount) {
            this.boards = boards;
            this.executionTime = executionTime;
            this.moveCount = moveCount;
        }
    }

    @PostMapping("/api/board")
    public ResponseEntity<?> solveBoard(@RequestBody RequestPayload payload) {
        // Convert the request payload to the format needed by the solver
        int width = payload.gridSize.cols;
        int height = payload.gridSize.rows;
        System.out.println("Width: " + width);
        System.out.println("Height: " + height);

        char[][] grid = new char[height][width];

        for (int i = 0; i < height; i++) {
            Arrays.fill(grid[i], '.');
        }

        for (OccupiedCells cell : payload.occupiedCells) {
            grid[cell.y][cell.x] = cell.pieceId;
        }

        for (int i = 0; i < height; i++) {
            for (int j = 0; j < width; j++) {
                System.out.print(grid[i][j]);
            }
            System.out.println();
        }
        int exitX = payload.exit.exitCol;
        int exitY = payload.exit.exitRow;
        Coor exitCoor = new Coor(exitY, exitX);
        System.out.println("Exit: (" + exitCoor.X + ", " + exitCoor.Y + ")");
        Board board = new Board(grid, exitCoor);

        // Solve the board
        Solver solver = new Solver(board);
        List<Board> resultBoards = solver.solving("A*", 1);
        if (resultBoards == null) {
            System.out.println("No solution found!");
            return ResponseEntity.ok("Solution not found!");
        }
        for (Board b : resultBoards) {
            b.debugBoard();
        }
        // Return the result
        return ResponseEntity.ok(new ResponsePayload(resultBoards, solver.executionTime, solver.moveCount));
    }

    @GetMapping("/api/hello")
    public Map<String, String> sayHello() {
        return Map.of(
                "message", "Hello, World!"
        );
    }
}