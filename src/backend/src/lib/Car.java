package lib;
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

    public int length() {
        if (direction == 'Y') {
            return end.Y - start.Y;
        } else {
            return end.X - start.X;
        }
    }

    public Coor getStart() {
        return start;
    }

    public Coor getEnd() {
        return end;
    }

    public char getDirection() {
        return direction;
    }

    public char getSymbol() {
        return symbol;
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

    public void debugCar() {
        System.out.println("Car: " + symbol);
        start.debugCoor();
        end.debugCoor();
        System.out.println("Direction: " + direction);
    }
}
