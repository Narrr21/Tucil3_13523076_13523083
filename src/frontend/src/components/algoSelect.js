"use client";

export default function AlgorithmSelector({ submitBoard }) {
    const handleSubmit = async (e) => {
        e.preventDefault();
        const pathfindingIdx = Number(e.target.pathfinding.value);
        const pathfinding = [
            "A*",
            "GBFS",
            "UCS",
            "SA",
        ]
        const pathfindingType = pathfinding[pathfindingIdx];
        const selectedHeuristic = {
            heur: Number(e.target.heuristic.value),
            pathfinding: pathfindingType,
        };
        submitBoard(selectedHeuristic);
    };

    const pathfinding = [
        "A*",
        "Greedy Best First Search",
        "Uniform Cost Search",
        "Simulated Annealing",
    ];
    const heuristics = [1, 2, 3];

    return (
        <form
            className="flex flex-col items-center bg-white shadow rounded-lg p-4 max-w-md mx-auto"
            onSubmit={handleSubmit}
        >
            <h2 className="text-lg font-semibold mb-4 text-blue-700">Algorithm Selector</h2>
            <div className="flex flex-row gap-4 w-full justify-center">
                <div className="flex flex-col gap-1 flex-1">
                    <label
                        htmlFor="pathfinding"
                        className="mb-1 text-sm font-medium text-gray-700"
                    >
                        Pathfinding
                    </label>
                    <select
                        id="pathfinding"
                        name="pathfinding"
                        className="p-2 border border-gray-300 rounded text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm"
                    >
                        {pathfinding.map((algo, idx) => (
                            <option key={idx} value={idx}>
                                {algo}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col gap-1 flex-1">
                    <label
                        htmlFor="heuristic"
                        className="mb-1 text-sm font-medium text-gray-700"
                    >
                        Heuristic
                    </label>
                    <select
                        id="heuristic"
                        name="heuristic"
                        className="p-2 border border-gray-300 rounded text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm"
                    >
                        {heuristics.map((h, idx) => (
                            <option key={idx} value={h}>
                                {`Heuristic ${h}`}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <button
                type="submit"
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded font-medium shadow hover:bg-blue-700 transition text-sm"
            >
                Solve
            </button>
        </form>
    );
}