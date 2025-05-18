export default function SizeForm({ setGridSize }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        const rows = e.target.rows.value;
        const cols = e.target.cols.value;
        setGridSize({rows, cols});
    }   

    return (
        <form
            onSubmit={handleSubmit} 
            className="flex flex-col gap-4"
        >
            <div className="flex flex-row gap-2 w-full">
                <label className="text-sm font-medium">Rows</label>
                <input
                    type="number"
                    name="rows"
                    placeholder={3}
                    className="w-1/2 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <label className="text-sm font-medium">Columns</label>
                <input
                    type="number"
                    name="cols"
                    placeholder={3}
                    className="w-1/2 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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