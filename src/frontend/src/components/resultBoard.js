import Board from "@/components/board";

export default function ResultBoard({
    board,
    exit,
}) {
    const grid = board.board;
    const rows = grid.length;
    const cols = grid[0].length;
    const cars = board.cars;
    const primaryPiece = 'P';

    const pieces = [];
    cars.forEach((car, _) => {
        // console.log("Car: ", car);
        const orient = car.direction === "X" ? "horizontal" : "vertical";
        const piece = {
            id: car.symbol,
            x: car.start.X,
            y: car.start.Y,
            orientation: orient,
            length: orient === "horizontal" ? car.end.X - car.start.X + 1 : car.end.Y - car.start.Y + 1,
        };
        pieces.push(piece);
    });
    // console.log("Pieces: ", pieces);
    // check for horizontal pieces
    return (
        <Board
            rows={rows + 2}
            cols={cols + 2}
            pieces={pieces}
            primaryPiece={primaryPiece}
            exit={exit}
            disableDrag={true}
        />
    );
}