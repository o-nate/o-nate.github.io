let flock = [];
let startTime = Date.now();

let cnvWidth;
let cnvHeight;
let cnvX;
let cnvY;
let sliderX;
let buttonX;
let sliderColor = '#67aaf9';

let perceptionSlider, alignSlider, cohesionSlider, separationSlider;
let maxForceSlider, maxSpeedSlider;

function setup() {
    pixelDensity(1)
    cnvWidth = windowWidth;
    cnvHeight = windowHeight;
    cnvX = 0;
    cnvY = 0;
    sliderX = windowWidth * 0;
    sliderSeparation = windowHeight * .04;
    buttonX = windowWidth * 0.0;

    let cnv = createCanvas(cnvWidth, cnvHeight);
    cnv.position(cnvX, cnvY)
    resetSketch();
    console.log(startTime);

    maxForceSlider = createSlider(0, 5, 1.34, .02);
    maxForceSlider.style("background", sliderColor);
    maxForceSlider.position(sliderX, sliderSeparation * 1);
    maxSpeedSlider = createSlider(0, 100, 5, 5);
    maxSpeedSlider.style("background", sliderColor);
    maxSpeedSlider.position(sliderX, sliderSeparation * 2)
    perceptionSlider = createSlider(0, 100, 90, 10);
    perceptionSlider.style("background", sliderColor);
    perceptionSlider.position(sliderX, sliderSeparation * 3)
    alignSlider = createSlider(0, 10, 8, .25);
    alignSlider.style("background", sliderColor);
    alignSlider.position(sliderX, sliderSeparation * 4)
    cohesionSlider = createSlider(0, 10, 2, .25);
    cohesionSlider.style("background", sliderColor);
    cohesionSlider.position(sliderX, sliderSeparation * 5)
    separationSlider = createSlider(0, 5, 2.5, .5);
    separationSlider.style("background", sliderColor);
    separationSlider.position(sliderX, sliderSeparation * 6)

    buttonStop = createButton('stop');
    buttonStop.position(buttonX, separationSlider.y * 1.15);
    buttonStop.mousePressed(stopFlock);
    buttonStart = createButton('start');
    buttonStart.position(buttonX + buttonStop.width, separationSlider.y * 1.15);
    buttonStart.mousePressed(startFlock);
    buttonReset = createButton('reset');
    buttonReset.position(buttonX + buttonStop.width + buttonStart.width, separationSlider.y * 1.15);
    buttonReset.mousePressed(resetSketch);

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
    background(38, 20, 71);

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

    fill(252);
    noStroke();
    text(`Max force: ${maxForceSlider.value()}`,
        maxForceSlider.x * 2 + maxForceSlider.width, maxForceSlider.y + 5);
    text(`Max speed: ${maxSpeedSlider.value()}`,
        maxSpeedSlider.x * 2 + maxSpeedSlider.width, maxSpeedSlider.y + 5);
    text(`Perception radius: ${perceptionSlider.value()}`,
        perceptionSlider.x * 2 + perceptionSlider.width, perceptionSlider.y + 5);
    text(`Alignment: ${alignSlider.value()}`,
        alignSlider.x * 2 + alignSlider.width, alignSlider.y + 5);
    text(`Cohesion: ${cohesionSlider.value()}`,
        cohesionSlider.x * 2 + cohesionSlider.width, cohesionSlider.y + 5);
    text(`Separation: ${separationSlider.value()}`,
        separationSlider.x * 2 + separationSlider.width, separationSlider.y + 5);
    // document.getElementById('frc').innerHTML = maxForceSlider.value();
    // document.getElementById('spd').innerHTML = maxSpeedSlider.value();
    // document.getElementById('per').innerHTML = perceptionSlider.value();
    // document.getElementById('aln').innerHTML = alignSlider.value();
    // document.getElementById('coh').innerHTML = cohesionSlider.value();
    // document.getElementById('sep').innerHTML = separationSlider.value();
}

function stopFlock() {
    noLoop();
}

function startFlock() {
    loop();
}

function mousePressed() {
    // if (mouseY > separationSlider.y * 1.5) {
    //     for (let i = 0; i < 5; i++) {
    //         flock.push(new Boid());
    //     };
    // } else if (maxForceSlider.x * 2 + maxForceSlider.width < mouseX &&
    //     mouseY > separationSlider.y) {
    //     for (let i = 0; i < 5; i++) {
    //         flock.push(new Boid());
    //     };
    // } else if (mouseX > buttonReset.x * 1.2) {
    //     for (let i = 0; i < 5; i++) {
    //         flock.push(new Boid());
    //     };
    // } else if (mouseX > maxForceSlider.x * 2 + maxForceSlider.width &&
    //     mouseX < buttonReset.x * 2 && mouseY > buttonReset.y * 2) {
    //     for (let i = 0; i < 5; i++) {
    //         flock.push(new Boid());
    //     };
    // } 
    if (mouseX > (maxForceSlider.x + maxForceSlider.width) * 1.2 ||
        mouseY > (buttonReset.y + buttonReset.width) * 1.1) {
        for (let i = 0; i < 5; i++) {
            flock.push(new Boid());
        };
    } else {
        return;
    }
}

// function mouseDragged() {

// }

function resetSketch() {
    draw;
    mousePressed;
    flock = [];
    history = [];
}