package com.tucil3.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import com.tucil3.backend.lib.*;

import java.util.*;

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

    public static class RequestPayload {
        public GridSize gridSize;
        public List<OccupiedCells> occupiedCells;
        public Exit exit;
        public int primaryPiece;
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
            char id = (char) ((cell.pieceId - 1) + 'A');
            if (cell.pieceId == payload.primaryPiece) {
                id = 'P';
            } else {
                if (id >= 'K') {
                    id = (char) (id + 1);
                }
                if (id == 'P') {
                    id = (char) (payload.primaryPiece - 1 + 'A');
                }
            }
            grid[cell.y][cell.x] = id;
        }

        for (int i = 0; i < height; i++) {
            for (int j = 0; j < width; j++) {
                System.out.print(grid[i][j]);
            }
            System.out.println();
        }
        int exitX = payload.exit.exitCol;
        int exitY = payload.exit.exitRow;
        if (exitX == width + 1) {
            exitX = exitX - 2;
            exitY = exitY - 1;
        }
        else if (exitX == 0) {
            exitY = exitY - 1;
        }
        else if (exitY == height + 1) {
            exitY = exitY - 2;
            exitX = exitX - 1;
        }
        else if (exitY == 0) {
            exitX = exitX - 1;
        }
        Coor exitCoor = new Coor(exitY, exitX);
        System.out.println("Exit: (" + exitCoor.X + ", " + exitCoor.Y + ")");
        Board board = new Board(grid, exitCoor);

        // Solve the board
        Solver solver = new Solver(board);
        List<Board> resultBoards = solver.solving("A*");
        for (Board b : resultBoards) {
            b.debugBoard();
        }

        // Return the result
        return ResponseEntity.ok("Success!");
    }

    @GetMapping("/api/hello")
    public Map<String, String> sayHello() {
        return Map.of(
                "message", "Hello, World!"
        );
    }
}