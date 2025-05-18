export default function PrimarySelector({ pieces, setPrimaryPiece }) {
    const handleOnSubmit = (e) => {
        e.preventDefault();
        const pieceId = parseInt(e.target.primaryPiece.value, 10);
        setPrimaryPiece(pieceId);
    };

    const options = [];

    for (let i = 1; i <= pieces.length; i++) {
        options.push(
            <option key={i} value={i}>
                {i}
            </option>
        );
    }

    return (
        <form
            onSubmit={handleOnSubmit}
            className="my-10 flex flex-col gap-4"
        >
            <div className="flex flex-row gap-2">
                <label className="text-sm font-medium">Select Piece:</label>
                <select
                    name="primaryPiece"
                    defaultValue={pieces[0]?.id || ""}
                    required
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-400"
                >
                    {options}
                </select>
            </div>
            <div className="flex flex-row gap-2">
                <button
                    type="submit"
                    className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 transition duration-200 w-full"
                >
                    Set Primary Piece
                </button>
            </div>
        </form>
    )
};