"use client"

import { useDrop } from "react-dnd";

export default function Square({ pieceId, style, children, setExit, row, col, onDrop, canPlacePiece, isEdge }) {
    
    const onClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (isEdge) {
            setExit({ exitRow: row, exitCol: col });
        }
    };

    const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: 'piece',
        drop: (item, monitor) => onDrop(item, row - 1, col - 1),
        canDrop: (item, monitor) => canPlacePiece(item, row - 1, col - 1),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop(),
        }),
    }));

    const borderStyle = isOver && canDrop ? "border-2 border-green-500" : canDrop ? "border-2 border-blue-500" : "border-2 border-gray-300";

    return (
        <div className={`${style} ${borderStyle} ${pieceId ? 'occupied' : ''} z-0`} 
            ref={drop}
            onClick={onClick}
            style={{
                "--row": Number(row) + 1,
                "--column": Number(col) + 1,
                "--row-span": 1,
                "--column-span": 1,
            }}
        >
            
        {/* {pieceId && <span className="piece-id">{pieceId}</span>} */}
        {children}
        </div>
    );
};