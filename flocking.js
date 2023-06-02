let flock = [];
let startTime = Date.now();

let cnvWidth;
let cnvHeight;
let cnvX;
let cnvY;
let sliderX;

let perceptionSlider, alignSlider, cohesionSlider, separationSlider;
let maxForceSlider, maxSpeedSlider;

function setup() {
    cnvWidth = windowWidth * 0.95;
    cnvHeight = windowHeight;
    cnvX = 0;
    cnvY = 0;
    sliderX = windowWidth * 0;
    sliderSeparation = .04;

    let cnv = createCanvas(cnvWidth, cnvHeight);
    cnv.position(cnvX, cnvY)
    resetSketch();
    console.log(startTime);

    maxForceSlider = createSlider(0, 5, 1.34, .02);
    maxForceSlider.position(sliderX, windowHeight * sliderSeparation * 1);
    maxSpeedSlider = createSlider(0, 100, 5, 5);
    maxSpeedSlider.position(sliderX, windowHeight * sliderSeparation * 2)
    perceptionSlider = createSlider(0, 100, 90, 10);
    perceptionSlider.position(sliderX, windowHeight * sliderSeparation * 3)
    alignSlider = createSlider(0, 10, 8, .25);
    alignSlider.position(sliderX, windowHeight * sliderSeparation * 4)
    cohesionSlider = createSlider(0, 10, 2, .25);
    cohesionSlider.position(sliderX, windowHeight * sliderSeparation * 5)
    separationSlider = createSlider(0, 5, 2.5, .5);
    separationSlider.position(sliderX, windowHeight * sliderSeparation * 6)

    buttonStop = createButton('stop');
    buttonStop.position(windowWidth * .2, maxForceSlider.y);
    buttonStop.mousePressed(stopFlock);
    buttonStart = createButton('start');
    buttonStart.position(windowWidth * .25, maxForceSlider.y);
    buttonStart.mousePressed(startFlock);
    buttonReset = createButton('reset');
    buttonReset.position(windowWidth * .3, maxForceSlider.y);
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

    // text(`Max force: ${maxForceSlider.value()}`, maxForceSlider.x * 2 + maxForceSlider.width, maxForceSliderY);
    text(`Max force: ${maxForceSlider.value()}`, maxForceSlider.x * 2 + maxForceSlider.width, maxForceSlider.y + 5);
    text(`Max speed: ${maxSpeedSlider.value()}`, maxSpeedSlider.x * 2 + maxSpeedSlider.width, maxSpeedSlider.y + 5);
    text(`Perception radius: ${perceptionSlider.value()}`, perceptionSlider.x * 2 + perceptionSlider.width, perceptionSlider.y + 5);
    text(`Alignment: ${alignSlider.value()}`, alignSlider.x * 2 + alignSlider.width, alignSlider.y + 5);
    text(`Cohesion: ${cohesionSlider.value()}`, cohesionSlider.x * 2 + cohesionSlider.width, cohesionSlider.y + 5);
    text(`Separation: ${separationSlider.value()}`, separationSlider.x * 2 + separationSlider.width, separationSlider.y + 5);
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
    if (maxForceSlider.x * 2 + maxForceSlider.width < mouseX && mouseY > separationSlider.y) {
        console.log('1st (', maxForceSlider, ', ', separationSlider.y, ')');
        console.log(mouseX, mouseY);
        for (let i = 0; i < 5; i++) {
            flock.push(new Boid());
        };
    } else if (mouseX > buttonReset.x * 1.2) {
        console.log('2n')
        for (let i = 0; i < 5; i++) {
            flock.push(new Boid());
        };
    } else if (mouseX > maxForceSlider.x * 2 + maxForceSlider.width && mouseX < buttonReset.x * 2 && mouseY > buttonReset.y * 2) {
        console.log('yes', buttonReset.y, mouseY);

        for (let i = 0; i < 5; i++) {
            flock.push(new Boid());
        };
    } else {
        console.log(buttonReset.x, buttonReset.y, mouseX, mouseY);
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