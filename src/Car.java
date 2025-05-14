public class Car {
    private final char symbol;
    private Coor start;
    private Coor end;
    private final char direction;

    public Car(char symbol, Coor start, Coor end) {
        this.symbol = symbol;
        this.start = start;
        this.end = end;
        if (start.X == end.X) {
            direction = 'Y';
        } else {
            direction = 'X';
        }
    }

    public void move(int step) {
        if (direction == 'X') {
            start.X += step;
            end.X += step;
        } else {
            start.Y += step;
            end.Y += step;
        }
    }
}
