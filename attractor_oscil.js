// Attractor class for vectors.js

class Attractor {
    constructor(m, x, y, v, g) {
        this.mass = m;
        this.position = new createVector(x, y);
        this.velocity = new createVector(v, v);
        this.g_const = g;
        this.dragOffset = createVector(0, 0);
        this.dragging = false;
        this.rollover = false;
    }

    go() {
        this.render();
        this.drag();
    }

    attract(object) {
        // Calculate force direction
        let dir = p5.Vector.sub(this.position, object.position);
        // Distance between bodies squared
        let d = dir.magSq();
        // Return direction of vector
        dir.normalize();
        let force = (this.g_const * this.mass * object.mass) / (d);
        // Force vector
        dir.mult(force);
        return dir;
    }

    render() {
        ellipseMode(CENTER);
        stroke(0, 125);
        if (this.dragging) fill(103, 170, 249);
        else if (this.rollover) fill(194, 1, 20);
        else fill(252);
        ellipse(this.position.x, this.position.y, this.mass * 2, this.mass * 2);
    }

    // For mouse interactions
    clicked(mx, my) {
        let d = dist(mx, my, this.position.x, this.position.y);
        if (d < this.mass) {
            this.dragging = true;
            this.dragOffset.x = this.position.x - mx;
            this.dragOffset.y = this.position.y - my;
        }
    }

    rollingover(mx, my) {
        let d = dist(mx, my, this.position.x, this.position.y);
        if (d < this.mass) {
            this.rollover = true;
        } else {
            this.rollover = false;
        }
    }

    stopDragging() {
        this.dragging = false;
    }

    drag() {
        if (this.dragging) {
            this.position.x = mouseX + this.dragOffset.x;
            this.position.y = mouseY + this.dragOffset.y;
        }
    }
}