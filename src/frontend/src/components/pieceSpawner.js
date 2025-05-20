"use client"

export default function PieceSpawner({ handleOnSubmit, orientation, setOrientation }) {
    return (
        <form
            onSubmit={handleOnSubmit}
            className="my-2 flex flex-col gap-4 bg-white text-black p-4 rounded-lg shadow-md"
        >
            <div className="flex flex-row gap-2 w-1/2">
                <label className="text-sm font-medium">Length</label>
                <input
                    type="number"
                    name="length"
                    min={2}
                    defaultValue={2}
                    required
                    className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="flex flex-row gap-4 items-center">
                <span className="text-sm font-medium">Orientation:</span>
                <label className="flex items-center gap-1">
                    <input
                        type="radio"
                        name="orientation"
                        value="horizontal"
                        checked={orientation === "horizontal"}
                        onChange={() => setOrientation("horizontal")}
                    />
                    Horizontal
                </label>
                <label className="flex items-center gap-1">
                    <input
                        type="radio"
                        name="orientation"
                        value="vertical"
                        checked={orientation === "vertical"}
                        onChange={() => setOrientation("vertical")}
                    />
                    Vertical
                </label>
            </div>
            <button
                type="submit"
                className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 transition duration-200"
            >
                Create Piece
            </button>
        </form>
    )
}