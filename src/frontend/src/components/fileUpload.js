'use client';

import { useRef } from 'react';

export default function TextFileUploadForm(
    {
        setExit,
        setPieces,
        setOccupiedCells,
        setPrimaryPiece,
        setGridSize,
    }
) {
    const fileInputRef = useRef(null);

    const processTextContent = (text) => {
        // Split text into lines, handling both \r\n (Windows) and \n (Unix) line endings
        try {
            const lines = text.split(/\r?\n/);
            console.log("Lines: ", lines);
            const gridSize = lines[0].split(' ').map(Number);
            console.log("Grid Size: ", gridSize);
            const rows = gridSize[0];
            const cols = gridSize[1];
            let exit = undefined;
            if (lines.length === rows + 3) {
                if (lines[2].includes('K')) {
                    exit = { exitRow: 0, exitCol: lines[2].indexOf('K') + 1};
                } else if (lines[lines.length - 1].includes('K')) {
                    exit = { exitRow: rows + 1, exitCol: lines[lines.length - 1].indexOf('K') + 1};
                }
            }
            else if (lines.length < rows + 2) {
                throw new Error("Invalid number of lines in input file.");
            }

            const pieces = [];
            const occupiedCells = [];
            const pieceIdMap = new Map();
            let primaryPiece = undefined;
            const rowSkip = (lines[2].includes('K')) ? 3 : 2;
            // scan through the horizontal pieces
            for (let i = rowSkip; i < rows + rowSkip; i++) {
                if (!exit && lines[i].includes('K')) {
                    exit = ({ exitRow: i - 1, exitCol: (lines[i].indexOf('K') === 0) ? 0 : (lines[i].indexOf('K') + 1)});
                }
                for (let j = 0; j < lines[i].length; j++) {
                    if (lines[i].length !== cols && lines[i].length !== cols + 1) {
                        console.log("Invalid number of columns in input file. Got: ", lines[i].length, "Expected: ", cols);
                        throw new Error("Invalid number of columns in input file.");
                    }
                    const cell = lines[i].charAt(j);
                    if (cell === '.' || cell === 'K' || cell === ' ' || cell === '\r') {
                        continue;
                    }
                    let currentJ = j;
                    do {
                        j++;
                    } while(j < lines[i].length && lines[i].charAt(j) === cell);
                    const length = j - currentJ;
                    j--;
                    if (length < 2) {
                        continue;
                    }
                    if (pieceIdMap.has(cell) ) { // if exists, throw error
                        throw new Error(`Duplicate piece ID found: ${cell}`);
                    }
                    pieceIdMap.set(cell, true);
                    const piece = {
                        id: cell,
                        x: currentJ,
                        y: i - rowSkip,
                        orientation: 'horizontal',
                        length: length,
                    };
                    pieces.push(piece);
                    if (cell === 'P') {
                        primaryPiece = true;
                    }

                    for (let k = 0; k < length; k++) {
                        occupiedCells.push({
                            x: currentJ + k,
                            y: i - rowSkip,
                            pieceId: cell,
                        });
                    }
                }
            }
            const extraCol = exit?.exitCol === 0 ? 1 : 0;
            for (let j = 0; j < cols + extraCol; j++) {
                for (let i = rowSkip; i < rows + rowSkip; i++) {
                    const cell = lines[i].charAt(j);
                    if (cell === '.' || cell === 'K' || cell === ' ' || cell === '\r') {
                        continue;
                    }
                    let currentI = i;
                    do {
                        i++;
                    } while(i < lines.length && lines[i].charAt(j) === cell);
                    const length = i - currentI;
                    i--;
                    if (length < 2) {
                        continue;
                    }
                    if (pieceIdMap.has(cell)) { // if exists, throw error
                        throw new Error(`Duplicate piece ID found: ${cell}`);
                    }
                    pieceIdMap.set(cell, true);
                    const piece = {
                        id: cell,
                        x: j,
                        y: currentI - rowSkip,
                        orientation: 'vertical',
                        length: length,
                    };
                    if (cell === 'P') {
                        primaryPiece = true;
                    }
                    pieces.push(piece);
                    for (let k = 0; k < length; k++) {
                        occupiedCells.push({
                            x: j,
                            y: currentI + k - rowSkip,
                            pieceId: cell,
                        });
                    }
                }
            }
            // Check if lines[1] can be converted to a number
            const expectedPieces = Number(lines[1]);
            if (isNaN(expectedPieces)) {
                throw new Error("Invalid number of pieces in input file.");
            }
            if (pieces.length !== expectedPieces) {
                throw new Error(`Expected ${expectedPieces} pieces, but found ${pieces.length}.`);
            }
            // Ensure piece IDs are sorted and only valid IDs (A, B, C, ...) are present
            const mapIds = Array.from(pieceIdMap.keys()).filter(id => id !== 'P' && id !== 'K' && id !== ' ');
            mapIds.sort();
            // Generate valid IDs, skipping 'K'
            const validIds = [];
            let charCode = 'A'.charCodeAt(0);
            while (validIds.length < mapIds.length) {
                if (String.fromCharCode(charCode) !== 'K') {
                    validIds.push(String.fromCharCode(charCode));
                }
                charCode++;
            }
            if (JSON.stringify(mapIds) !== JSON.stringify(validIds)) {
                throw new Error(`Piece IDs must be consecutive letters starting from 'A' (skipping 'K'). Found: ${mapIds.join(', ')}`);
            }
            
            console.log("Pieces: ", pieces);
            console.log("Occupied Cells: ", occupiedCells);
            console.log("Exit: ", exit);
            console.log("Grid Size: ", { rows: rows, cols: cols });
            console.log("Primary Piece: ", primaryPiece);


            setGridSize({ rows: rows, cols: cols });
            if (primaryPiece) setPrimaryPiece(primaryPiece);
            if (exit) setExit(exit);
            setPieces(pieces);
            setOccupiedCells(occupiedCells);
        } catch (error) {
            console.log("Error processing text content:", error);
            alert("Error processing file: " + error.message);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const file = fileInputRef.current.files[0];
        if (!file) {
            alert("Please select a file.");
            return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target.result;
            processTextContent(text);
        };
        reader.readAsText(file);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="p-6 max-w-md mx-auto bg-white rounded-lg shadow space-y-6 my-2"
        >
            <div>
                <label
                    htmlFor="file-upload"
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    Load from a .txt file
                </label>
                <input
                    id="file-upload"
                    type="file"
                    accept=".txt"
                    ref={fileInputRef}
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                />
            </div>
            <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
                Submit
            </button>
        </form>
    );
}
