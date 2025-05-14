public class Coor {
    public int X;
    public int Y;

    public Coor(int X, int Y) {
        this.X = X;
        this.Y = Y;
    }

    public Coor copy() {
        return new Coor(X, Y);
    }
    
    public boolean equal(Coor c) {
        return this.X == c.X && this.Y == c.Y;
    }

    public void debugCoor() {
        System.out.println("Coord: (" + X + ", " + Y + ")");
    }
}
