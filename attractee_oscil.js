// Attractee class

class OscilAttractee {
    constructor() {
        this.mass = random(8, 16);
        this.position = new createVector(random(width), random(height));
        this.velocity = new createVector(random(-1, 1), random(-1, 1));
        this.acceleration = new createVector();
        this.osc = new Oscillator(this.mass * 2);
        this.history = [];
        this.end = 0;
    }

    applyForce(force) {
        let f = force.copy();
        f.div(this.mass);
        this.acceleration.add(f);
    }

    update() {
        // With force function
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
        this.osc.update(this.velocity.mag() / 10);
        this.end = Date.now();
        this.history.push(this.velocity.mag());
    }

    edges() {
        if (this.position.x > width) {
            this.position.x = width;
            this.velocity.x *= -1;
        } else if (this.position.x < 0) {
            this.velocity.x *= -1;
            this.position.x = 0;
        }
        if (this.position.y > height) {
            this.position.y = height;
            this.velocity.y *= -1;
        } else if (this.position.y < 0) {
            this.velocity.y *= -1;
            this.position.y *= 0;
        }
    }

    display() {
        let angle = this.velocity.heading();
        push();
        translate(this.position.x, this.position.y);
        rotate(angle);
        ellipseMode(CENTER);
        strokeWeight(0);
        stroke(0);
        fill(103, 170, 249, 125);
        ellipse(0, 0, this.mass * 2, this.mass * 2);
        this.osc.display(this.position);
        pop();
    }
}