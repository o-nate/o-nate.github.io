// Coding Train 
// Oscillating attraction

class Oscillator {
    constructor(r) {
        this.theta = 0;
        this.amplitude = r;
    }

    update(thetaVel) {
        this.theta += thetaVel;
    }

    display(pos) {
        let x = map(cos(this.theta), -1, 1, 0, this.amplitude);
        stroke(0);
        fill(252, 125);
        strokeWeight(2);
        line(0, 0, x, 0);
        ellipse(x, 0, 8, 8);
    }
}