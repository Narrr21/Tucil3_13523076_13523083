import { useDrag } from "react-dnd";
import * as motion from "motion/react-client"

export default function Piece({ id, row, col, spanRow, spanCol, disableDrag}) {
    const isPrimary = id === 'P';
    const bg_color = isPrimary ? "bg-orange-400" : "bg-blue-500";
    if (disableDrag) {
        return (
            <div
                className={`z-10 ${bg_color} dynamic-grid-item rounded-md flex items-center justify-center text-center`}
                style={{
                    "--row": row,
                    "--column": col,
                    "--row-span": spanRow,
                    "--column-span": spanCol,
                }}
            >
                {id}
            </div>
        );
    }

    const [{ isDragging }, drag] = useDrag(() => ({
        type: "piece",
        item: { id, row, col, spanRow, spanCol},
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <motion.div 
            ref={drag}
            className={`z-10 ${bg_color} dynamic-grid-item rounded-md flex items-center justify-center text-center`}
            style={{
                "--row": row,
                "--column": col,
                "--row-span": spanRow,
                "--column-span": spanCol,
            }}
            whileHover={{ scale: 0.75, cursor: "grab" }}
            whileTap={{ scale: 0.75, cursor: "grabbing" }}
            whileDrag={{ scale: 0.75, rotate: 10, cursor: "grabbing" }}
        >
            {id}
        </motion.div>
    );
};