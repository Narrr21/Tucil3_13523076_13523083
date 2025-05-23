"use client";

import React, { useEffect, useState } from "react";
import ResultBoard from "@/components/resultBoard";
import { useRouter } from "next/navigation";

export default function ResultModal({
    boards,
    exit,
    executionTime,
    moveCount,
}) {
    const router = useRouter();
    const [index, setIndex] = useState(0);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % boards.length);
        }, 500);
        return () => clearInterval(interval);
    }, [boards.length]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
            <div className="bg-white text-black rounded-lg p-6 shadow-lg min-w-[300px] relative">
                <button
                    onClick={(e) => {router.back();}}
                    className="absolute top-3 right-3 bg-transparent border-none text-2xl cursor-pointer"
                    aria-label="Close"
                >
                    &times;
                </button>
                <ResultBoard 
                    board={boards[index]}
                    exit={exit} 
                />
                <div className="mt-4 text-center">
                    <h2 className="text-lg font-semibold mb-2">Execution Time</h2>
                    <p>{executionTime} ms</p>
                    <h2 className="text-lg font-semibold mt-4 mb-2">Move Count</h2>
                    <p>{moveCount}</p>
                </div>
            </div>
        </div>
    );
}