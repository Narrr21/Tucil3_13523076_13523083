export default function SizeForm({ setGridSize, setRefresh }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        const rows = Number(e.target.rows.value);
        const cols = Number(e.target.cols.value);
        setGridSize({rows, cols});
        setRefresh(true);
    }   

    return (
        <form
            onSubmit={handleSubmit} 
            className="flex flex-col gap-4 bg-white text-black p-2 rounded-lg shadow-md"
        >
            <div className="flex flex-row gap-2 w-full">
                <label className="text-sm font-medium">Rows</label>
                <input
                    type="number"
                    name="rows"
                    defaultValue={3}
                    className="w-1/2 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                />
                <label className="text-sm font-medium">Columns</label>
                <input
                    type="number"
                    name="cols"
                    defaultValue={3}
                    className="w-1/2 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                />
            </div>
            <button
                type="submit"
                className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 transition duration-200"
            >
                Initialize Board
            </button>
        </form>
    )
}