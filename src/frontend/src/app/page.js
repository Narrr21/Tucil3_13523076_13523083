"use client"

import Board from "@/components/board";
import SizeForm from "@/components/sizeForm";
import { useEffect, useState } from "react";
import PieceSpawner from "@/components/pieceSpawner";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import ResultModal from "@/components/resultModal";
import TextFileUploadForm from "@/components/fileUpload";
import AlgorithmSelector from "@/components/algoSelect";

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [grids, setGrids] = useState([[[]]]);
  const showResult = searchParams.get("showResult");
  const [gridSize, setGridSize] = useState({rows: 3, cols: 3});
  const [refresh, setRefresh] = useState(false);
  const [primaryPiece, setPrimaryPiece] = useState();
  const [pieces, setPieces] = useState([]);
  const [occupiedCells, setOccupiedCells] = useState([]);
  const [orientation, setOrientation] = useState("horizontal");
  const [exit, setExit] = useState({exitRow: 1, exitCol: Number(gridSize.cols) + 1});
  const [loading, setLoading] = useState(false);
  
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

  useEffect(() => {
    if (refresh) {
      setPieces([]);
      setOccupiedCells([]);
      setPrimaryPiece(undefined);
      setExit({exitRow: 1, exitCol: Number(gridSize.cols) + 1});
      setRefresh(false);
    }
  }, [refresh]);

  const handleAddPiece = (e) => {
    e.preventDefault();
    const length = Number(e.target.length.value);
    let idIndex = pieces.length - 1;
    if (idIndex >= 10) idIndex++; // Skip 'K'
    if (idIndex >= 15) idIndex++; // Skip 'P'
    if (pieces.length === 0 || primaryPiece === undefined) {
      setPrimaryPiece(true);
      idIndex = 15;
    }
    const id = String.fromCharCode(65 + idIndex);
    let newPiece = { id: id, length: length, orientation: orientation, x: 0, y: 0 };
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

  const submitBoard = async (selectedHeuristic) => {
    if (!primaryPiece) {
      alert("Board must contain a primary piece");
      return;
    }
    setLoading(true);
    const formattedExit = {
      exitRow: exit.exitRow - 1,
      exitCol: exit.exitCol - 1,
    };
    const boardState = {
      gridSize,
      primaryPiece,
      occupiedCells,
      exit: formattedExit,
      heuristics: selectedHeuristic,
    };
    const boardStateJson = JSON.stringify(boardState, null, 2);
    console.log(boardStateJson);
    try {
      const response = await axios.post(`${baseUrl}/board`, boardState, {
        timeout: 30000,
      });
      if (response.data && response.data.boards) {
        router.push("?showResult=true");
        console.log("Solution found!");
        console.log("Response data:", response.data.boards);
        setGrids(response.data.boards);
      } else {
        alert("Solution not found!");
      }
    } catch (error) {
      if (error.code === "ECONNABORTED") {
        console.error("Request timed out");
      } else {
        console.error("Error solving puzzle:", error);
      }
    } finally {
      setLoading(false);
    }
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
        <SizeForm setGridSize={setGridSize} setRefresh={setRefresh}/>
        <PieceSpawner handleOnSubmit={handleAddPiece} orientation={orientation} setOrientation={setOrientation}/>
        <TextFileUploadForm
          setGridSize={setGridSize}
          setPieces={setPieces}
          setOccupiedCells={setOccupiedCells}
          setPrimaryPiece={setPrimaryPiece}
          setExit={setExit}
        />
        <AlgorithmSelector 
          submitBoard={submitBoard}
        />
      </div>
      <>
        {loading && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            role="dialog"
            aria-modal="true"
            aria-label="Solving puzzle"
          >
            <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
              <span className="text-lg font-semibold mb-4">Solving, please wait...</span>
              <div className="w-12 h-12 border-4 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
            </div>
          </div>
        )}

        {showResult && (
          <ResultModal
            boards={grids}
            exit={exit}
          />
        )}
      </>
    </div>
  );
}
