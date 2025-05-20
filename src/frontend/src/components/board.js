"use client"
import { useEffect, useRef } from "react";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import Square from "@/components/square";
import Piece from "@/components/piece";

export default function Board({ 
    rows, 
    cols, 
    pieces,
    setPieces,
    occupiedCells,
    setOccupiedCells, 
    primaryPiece,
    exit, 
    setExit,
    disableDrag = false,
}) {
    const sizeRef = useRef({rows, cols});
    const occupiedCellsRef = useRef(occupiedCells);

    // Reset exit when rows or cols change
    useEffect(() => {
        if (disableDrag) return;
        setExit({ exitRow: 1, exitCol: Number(cols) + 1 });
        sizeRef.current = { rows: Number(rows) + 2, cols: Number(cols) + 2 };
    }, [rows, cols]);

    useEffect(() => {
        occupiedCellsRef.current = occupiedCells;
    }, [occupiedCells]);

    function renderPieces() {
        return pieces.map(piece => {
            const pieceRow = Number(piece.y) + 2;
            const pieceCol = Number(piece.x) + 2;
            const spanRow = piece.orientation === "horizontal" ? 1 : piece.length;
            const spanCol = piece.orientation === "horizontal" ? piece.length : 1;
            const isPrimary = piece.id === primaryPiece;
            // console.log("Primary Piece: ", primaryPiece);
            return (
                <Piece 
                    key={piece.id}
                    row={pieceRow}
                    col={pieceCol}
                    spanRow={spanRow}
                    spanCol={spanCol}
                    id={piece.id}
                    isPrimary={isPrimary}
                    disableDrag={disableDrag}
                    // onDragStart={handleDragStart}
                />
            );
        });
    };
    
    function renderCells() {
        const canPlacePiece = (piece, targetRow, targetCol) => {
            if (disableDrag) return false;
            const currentOccupied = occupiedCellsRef.current;
            const pieceLength = Math.max(piece.spanRow, piece.spanCol);
            const orientation = piece.spanCol > 1 ? "horizontal" : "vertical";
            const newRows = sizeRef.current.rows;
            const newCols = sizeRef.current.cols;
            // Disallow placing on edge cells
            // console.log("Target: ", { targetRow, targetCol });
            // console.log("New Rows: ", newRows, "New Cols: ", newCols);
            if (
                targetRow < 0 ||
                targetCol < 0 ||
                targetRow > newRows - 1 ||
                targetCol > newCols - 1
            ) return false;
            // Boundary checks
            if (orientation === "horizontal") {
                if (targetCol + pieceLength > newCols - 2) return false;
                if (targetRow >= newRows - 2) return false;
            } else {
                if (targetRow + pieceLength > newRows - 2) return false;
                if (targetCol >= newCols - 2) return false;
            }

            // Collision check with latest occupiedCells
            for (let i = 0; i < pieceLength; i++) {
                const checkX = orientation === "horizontal" ? targetCol + i : targetCol;
                const checkY = orientation === "vertical" ? targetRow + i : targetRow;
                // console.log("Check: ", { checkX, checkY });
                // console.log("Occupied Cells: ", currentOccupied);
                if (currentOccupied.some(cell => 
                    cell.x === checkX && 
                    cell.y === checkY &&
                    cell.pieceId !== piece.id
                )) {
                    return false;
                }
            }
            return true;
        }


        function handleDrop(piece, targetRow, targetCol) {
            if (disableDrag) return;
            if (!canPlacePiece(piece, targetRow, targetCol)) return;
            
            // Update piece position
            setPieces(prevPieces => 
                prevPieces.map(p => 
                p.id === piece.id 
                    ? { ...p, x: targetCol, y: targetRow } 
                    : p
                )
            );
            
            // setOccupiedCells(prevCells => {
            setOccupiedCells(prevCells => {
                // Remove previous cells occupied by this piece
                const filteredCells = prevCells.filter(cell => cell.pieceId !== piece.id);

                // Add new cells for the moved piece
                const orientation = piece.spanCol > 1 ? "horizontal" : "vertical";
                const length = Math.max(piece.spanRow, piece.spanCol);
                const newCells = Array.from({ length }, (_, i) => ({
                    x: orientation === "horizontal" ? targetCol + i : targetCol,
                    y: orientation === "vertical" ? targetRow + i : targetRow,
                    pieceId: piece.id,
                }));

                return [...filteredCells, ...newCells];
            });
        }

        const Squares = [];
        const newRows = sizeRef.current.rows;
        const newCols = sizeRef.current.cols;
        for (let index = 0; index < newRows * newCols; index++) {
            let className = "w-full dynamic-grid-item aspect-square rounded-md transition-all bg-blue-500 flex items-center justify-center text-center ";
            let content = "";
            const exitRow = exit.exitRow, exitCol = exit.exitCol;
            const row = Math.floor(index / newCols);
            const col = index % newCols;

            const isCorner =
                (row === 0 && col === 0) ||                                // top-left
                (row === 0 && col === newCols - 1) ||                      // top-right
                (row === newRows - 1 && col === 0) ||                      // bottom-left
                (row === newRows - 1 && col === newCols - 1);              // bottom-right

            const isExit = index === newCols * exitRow + exitCol; 

            const isEdge =
                !isCorner && (
                    row === 0 ||                         // top
                    row === newRows - 1 ||               // bottom
                    col === 0 ||                         // left
                    col === newCols - 1                  // right
                );

            if (isExit) {
                className += "bg-red-500 text-black font-bold";
                content = "Exit";
            } else if (isCorner) {
                className += "bg-purple-400 text-white opacity-0";
            } else if (isEdge) {
                className += "bg-blue-400 text-white opacity-50 hover:bg-blue-600";
            } else {
                className += "bg-gray-200 text-black";
            }
            Squares.push(
                <Square
                    key={`row-${row}-col-${col}`}
                    style={className}
                    row={row}
                    col={col}
                    setExit={setExit}
                    onDrop={handleDrop}
                    canPlacePiece={canPlacePiece}
                    isEdge={isEdge}
                    disableDrag={disableDrag}
                >
                    {content}
                </Square>
            );
        }
        return Squares;
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div 
                key={primaryPiece} // force re-render when primaryPiece changes
                className={`
                    w-1/6
                    grid
                    [grid-template-columns:repeat(${sizeRef.current.cols},1fr)]
                    [grid-template-rows:repeat(${sizeRef.current.rows},1fr)]
                    gap-1
                `}
            >
                {renderPieces()}
                {renderCells()}
            </div>
        </DndProvider>
    )
}