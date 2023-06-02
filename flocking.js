let flock = [];
let startTime = Date.now();

let cnvWidth;
let cnvHeight;
let cnvX;
let cnvY;

let perceptionSlider, alignSlider, cohesionSlider, separationSlider;
let maxForceSlider, maxSpeedSlider;

function setup() {
    cnvWidth = windowWidth * 0.6;
    cnvHeight = windowHeight;
    cnvX = 0;
    cnvY = windowHeight * .15;

    let cnv = createCanvas(cnvWidth, cnvHeight);
    cnv.position(cnvX, cnvY)
    resetSketch();
    console.log(startTime);

    button = createButton('stop');
    button.position(windowWidth * .2, windowHeight * .13);
    button.mousePressed(stopFlock);
    button = createButton('start');
    button.position(windowWidth * .25, windowHeight * .13);
    button.mousePressed(startFlock);
    button = createButton('reset');
    button.position(windowWidth * .3, windowHeight * .13);
    button.mousePressed(resetSketch);

    maxForceSlider = createSlider(0, 5, 1.34, .02);
    maxForceSlider.position(windowWidth * 0, windowHeight * 0.03)
    maxSpeedSlider = createSlider(0, 100, 5, 5);
    maxSpeedSlider.position(windowWidth * 0, windowHeight * 0.05)
    perceptionSlider = createSlider(0, 100, 90, 10);
    perceptionSlider.position(windowWidth * 0, windowHeight * 0.07)
    alignSlider = createSlider(0, 10, 8, .25);
    alignSlider.position(windowWidth * 0, windowHeight * 0.09)
    cohesionSlider = createSlider(0, 10, 2, .25);
    cohesionSlider.position(windowWidth * 0, windowHeight * 0.11)
    separationSlider = createSlider(0, 5, 2.5, .5);
    separationSlider.position(windowWidth * 0, windowHeight * 0.13)

    // // pre-determine number of boids
    // Generate initial flock
    for (let i = 0; i < 5; i++) {
        flock.push(new Boid());
        console.log(i);
    };

    return startTime;


    // mousePressed;

    // for (let i = 0; i < 20; i++) {
    //     flock.push(new Boid());
    // }
}

function draw() {
    background(51);

    for (let boid of flock) {
        boid.edges();
        boid.formFlock(flock);
        boid.update();
        // document.getElementById(`boid.velocity`).innerHTML = boid.velocity.mag();
        // document.getElementById(`boid.history`).innerHTML = boid.history.length;
        // let elapsed = boid.end - startTime; // note that it continues counting even clicking stop button
        // document.getElementById(`m[${i}].time`).innerHTML = elapsed / 1000;
        boid.show();
    }

    // document.getElementById(`boid.velocity`).innerHTML = boid.velocity.mag();
    // document.getElementById(`boid.history`).innerHTML = boid.history.length;
    document.getElementById('frc').innerHTML = maxForceSlider.value();
    document.getElementById('spd').innerHTML = maxSpeedSlider.value();
    document.getElementById('per').innerHTML = perceptionSlider.value();
    document.getElementById('aln').innerHTML = alignSlider.value();
    document.getElementById('coh').innerHTML = cohesionSlider.value();
    document.getElementById('sep').innerHTML = separationSlider.value();
}

function stopFlock() {
    noLoop();
}

function startFlock() {
    loop();
}

function mousePressed() {
    if (mouseX < cnvWidth && cnvY < mouseY) {
        console.log('(', cnvX, cnvWidth, ', ', cnvY, cnvHeight, ')');
        console.log(mouseX, mouseY);
        for (let i = 0; i < 5; i++) {
            flock.push(new Boid());
        };
    }
}

// function mouseDragged() {

// }

function resetSketch() {
    draw;
    mousePressed;
    console.log('hi');
    flock = [];
    console.log('hi again');
    history = [];
}