package com.tucil3.backend.lib;
public class Coor {
    public int X;
    public int Y;

    public Coor(int Y, int X) {
        this.X = X;
        this.Y = Y;
    }

    public Coor copy() {
        return new Coor(Y, X);
    }
    
    public boolean equal(Coor c) {
        return this.X == c.X && this.Y == c.Y;
    }

    public void debugCoor() {
        System.out.println("Coord: (" + X + ", " + Y + ")");
    }
}
