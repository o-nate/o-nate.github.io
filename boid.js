class Boid {
    constructor() {
        this.position = createVector(mouseX, mouseY);
        this.velocity = createVector(
            randomGaussian(5, 1.5), // * (mouseX / 100),
            randomGaussian(5, 1.5), // * (mouseY / 100),
            10
        );
        this.velocity.setMag(random(5, 10));
        // this.velocity = p5.constructor.Vector.random2d();
        this.acceleration = createVector();
        this.maxForce = maxForceSlider.value();
        this.maxSpeed = maxSpeedSlider.value();
        this.perceptionRadius = perceptionSlider.value();
        this.history = [];
    }

    edges() {
        if (this.position.x > width) {
            this.position.x = 0;
        } else if (this.position.x < 0) {
            this.position.x = width;
        }
        if (this.position.y > height) {
            this.position.y = 0;
        } else if (this.position.y < 0) {
            this.position.y = height;
        }
    }

    // algin velocity vector of boid to average's with perception radius
    align(boids) {
        let perceptionRadius = this.perceptionRadius;
        let steering = createVector();
        let total = 0;
        for (let other of boids) {
            let d = dist(
                this.position.x,
                this.position.y,
                other.position.x,
                other.position.y
            );
            if (other != this && d < perceptionRadius) {
                steering.add(other.velocity);
                total++;
            }
        }
        if (total > 0) {
            // steer boid towards desired velocity
            steering.div(total);
            steering.setMag(this.maxSpeed);
            // steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;

    }

    // steer boid in direction of the average position of flock
    cohesion(boids) {
        let perceptionRadius = this.perceptionRadius;
        let steering = createVector();
        let total = 0;
        for (let other of boids) {
            let d = dist(
                this.position.x,
                this.position.y,
                other.position.x,
                other.position.y
            );
            if (other != this && d < perceptionRadius) {
                steering.add(other.position);
                total++;
            }
        }
        if (total > 0) {
            steering.div(total);
            // steer boid towards average location 
            // (i.e. avg position - individual boid's position)
            steering.sub(this.position);
            steering.setMag(this.maxSpeed);
            // steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;

    }

    // steer boid to avoid occupying same position as flockmate
    separation(boids) {
        let perceptionRadius = this.perceptionRadius;
        let steering = createVector();
        let total = 0;
        for (let other of boids) {
            let d = dist(
                this.position.x,
                this.position.y,
                other.position.x,
                other.position.y
            );
            if (other != this && d < perceptionRadius) {
                let diff = p5.Vector.sub(this.position, other.position);
                diff.div(d);
                steering.add(diff);
                total++;
            }
        }
        if (total > 0) {
            steering.div(total);
            steering.setMag(this.maxSpeed);
            // steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;

    }

    formFlock(boids) {
        let alignment = this.align(boids);
        let cohesion = this.cohesion(boids);
        let separation = this.separation(boids);

        alignment.mult(alignSlider.value());
        cohesion.mult(cohesionSlider.value());
        separation.mult(separationSlider.value());

        this.acceleration.add(separation);
        this.acceleration.add(alignment);
        this.acceleration.add(cohesion);
    }

    update() {
        // let boidVector = createVector(this.position.x, this.position.y);
        this.history.push(this.position.copy());

        if (this.history.length > 10) {
            this.history.splice(0, 1);
        }

        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.acceleration.mult(0);
    }

    show() {
        strokeWeight(5);
        stroke(194, 1, 20);
        point(this.position.x, this.position.y);


        for (var i = 0; i < this.history.length; i++) {
            let boidPos = this.history[i];
            stroke(194, 1, 20);
            ellipse(boidPos.x, boidPos.y, i, i);
        }

        fill(252);
        this.history;
    }
}