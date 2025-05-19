"use client"

import Board from "@/components/board";
import SizeForm from "@/components/sizeForm";
import { useEffect, useState } from "react";
import PieceSpawner from "@/components/pieceSpawner";
import PrimarySelector from "@/components/primarySelector";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [gridSize, setGridSize] = useState({rows: 3, cols: 3});
  const [primaryPiece, setPrimaryPiece] = useState();
  const [pieces, setPieces] = useState([]);
  const [occupiedCells, setOccupiedCells] = useState([]);
  const [orientation, setOrientation] = useState("horizontal");
  const [exit, setExit] = useState({exitRow: 1, exitCol: Number(gridSize.cols) + 1});
  
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const length = Number(e.target.length.value);
    let newPiece = { id: pieces.length + 1, length: length, orientation: orientation, x: 0, y: 0 };
    // Check if the piece can be placed on the board
    let placed = false;
    for (let x = 0; x < gridSize.cols; x++) {
      for (let y = 0; y < gridSize.rows; y++) {
        // Check for out of bounds
        if (
          (orientation === "horizontal" && x + Number(length) > gridSize.cols) ||
          (orientation === "vertical" && y + Number(length) > gridSize.rows)
        ) {
          continue;
        }

        // Check for overlap with occupied cells
        let overlap = false;
        for (let i = 0; i < length; i++) {
          let checkX = orientation === "horizontal" ? x + i : x;
          let checkY = orientation === "vertical" ? y + i : y;
          if (occupiedCells.some(cell => cell.x === checkX && cell.y === checkY)) {
            overlap = true;
            break;
          }
        }

        if (!overlap) {
          placed = true;
          newPiece.x = x;
          newPiece.y = y;
          break;
        }
      }
      if (placed) break;
    }
    if (placed && pieces.length < 25) {
      setPieces([...pieces, newPiece]);
      setOccupiedCells([
        ...occupiedCells,
        ...Array.from({ length }, (_, i) => ({
          x: newPiece.x + (orientation === "horizontal" ? i : 0),
          y: newPiece.y + (orientation === "vertical" ? i : 0),
          pieceId: Number(newPiece.id),
        })),
      ]);
    }
    else if (pieces.length >= 25) {
      alert("Maximum number of pieces reached");
    } else {
      alert("Piece cannot be placed on the board");
    }
  };

  useEffect(() => {
    setPieces([]);
    setOccupiedCells([]);
  }, [gridSize]);

  const submitBoard = () => {
    if (!primaryPiece) {
      alert("Please select a primary piece before submitting the board.");
      return;
    }
    const boardState = {
      gridSize,
      primaryPiece,
      occupiedCells,
      exit,
    };
    const boardStateJson = JSON.stringify(boardState, null, 2);
    console.log(boardStateJson);
    // Send the board state to the server
    axios.post(`${baseUrl}/board`, boardState)
      .then(response => {
        console.log("Board state sent to server:", response.data);
        router.push("/solution");
      })
      .catch(error => {
        console.error("Error sending board state to server:", error);
      });

    console.log("url: ", baseUrl);
    alert("Board state compiled to JSON. Check the console for output.");
  };
  
  return (
    <div className = "flex flex-row justify-between">
      <div className="flex-auto w-full h-screen justify-center px-10 py-10">
        <Board 
          rows={gridSize.rows} 
          cols={gridSize.cols} 
          pieces={pieces}
          setPieces={setPieces}
          primaryPiece={primaryPiece}
          occupiedCells={occupiedCells}
          setOccupiedCells={setOccupiedCells}
          exit={exit}
          setExit={setExit}
        />
      </div>
      <div className="flex-col w-1/4 h-screen bg-gray-500 p-4">
        <SizeForm setGridSize={setGridSize}/>
        <PieceSpawner handleOnSubmit={handleOnSubmit} orientation={orientation} setOrientation={setOrientation}/>
        <PrimarySelector 
          key={primaryPiece ? primaryPiece.id : "selector"} // Force re-render when primaryPiece changes
          pieces={pieces} 
          setPrimaryPiece={setPrimaryPiece}
        />
        <button
          onClick={submitBoard}
          className="w-full bg-red-500 text-white rounded-lg p-2 hover:bg-red-600 transition duration-200"
        >
          Solve!
        </button>
      </div>
    </div>
  );
}
