// Coding Train 
// Oscillating Attraction

// Oscillator initial variables
let m = [];
let m2;
let g_const = 1;
let startTime = Date.now();
let data = [];

// Fourier series initial values
let time = 0;
let wave = [];

let slider_n;
let slider_r;

let height = 500;

let gridx;
let gridy;

function setup() {
    createCanvas(900, 800);
    console.log(startTime);

    button = createButton('stop');
    button.position(400, 25);
    button.mousePressed(stop);
    button = createButton('start');
    button.position(450, 25);
    button.mousePressed(start);

    for (let i = 0; i < num_masses; i++) {
        m.push(new OscilAttractee(random(.1, 5), random(width), random(height), random(1)));
        lineChartData.labels.push(i);
    }

    m2 = new Attractor(50, width / 2, height / 2, 0, g_const);

    return startTime;
}

function draw() {
    background(85, 80, 92);
    m2.go();
    m2.clicked(mouseX, mouseY);
    m2.rollingover(mouseX, mouseY);

    for (let i = 0; i < m.length; i++) {
        let f = m2.attract(m[i], g_const);
        m[i].applyForce(f);
        m[i].update();
        yvalues.push(m[i].velocity.mag());
        document.getElementById(`m[${i}]`).innerHTML = m[i].velocity.mag();
        document.getElementById(`m[${i}].acceleration`).innerHTML = m[i].acceleration.mag();
        document.getElementById(`m[${i}].history`).innerHTML = m[i].history.length;
        let elapsed = m[i].end - startTime; // note that it continues counting even clicking stop button
        document.getElementById(`m[${i}].time`).innerHTML = elapsed / 1000;
        m[i].edges();
        m[i].display();

    }

    m2.stopDragging();

}

// let sketch_oscil = function (sketch) {
//     sketch.setup = function () {
//         let cnv_oscil = sketch.createCanvas(sketch.windowWidth, 800 * 0.5);
//         cnv_oscil.position(0, 800 * 0.5)

//         let buttonStop = sketch.createButton('stop');
//         buttonStop.position(400, 25);
//         buttonStop.mousePressed(stop);
//         let buttonStart = sketch.createButton('start');
//         buttonStart.position(450, 25);
//         buttonStart.mousePressed(start);

//         for (let i = 0; i < num_masses; i++) {
//             m.push(new OscilAttractee(sketch.random(.1, 5), sketch.random(sketch.width), sketch.random(sketch.height), sketch.random(1)));
//             lineChartData.labels.push(i);
//         }

//         m2 = new Attractor(50, width / 2, height / 2, 0, g_const);

//         return startTime;
//     }

//     sketch.draw = function () {
//         background(85, 80, 92);
//         m2.go();
//         m2.clicked(mouseX, mouseY);
//         m2.rollingover(mouseX, mouseY);

//         for (let i = 0; i < m.length; i++) {
//             let f = m2.attract(m[i], g_const);
//             m[i].applyForce(f);
//             m[i].update();
//             yvalues.push(m[i].velocity.mag());
//             document.getElementById(`m[${i}]`).innerHTML = m[i].velocity.mag();
//             document.getElementById(`m[${i}].acceleration`).innerHTML = m[i].acceleration.mag();
//             document.getElementById(`m[${i}].history`).innerHTML = m[i].history.length;
//             let elapsed = m[i].end - startTime; // note that it continues counting even clicking stop button
//             document.getElementById(`m[${i}].time`).innerHTML = elapsed / 1000;
//             m[i].edges();
//             m[i].display();

//         }

//         m2.stopDragging();

//     }
// };

// // New instance of p5 and pass in the function for oscillator sketch
// new p5(sketch_oscil);

// let sketch_fourier = function (sketch) {
//     sketch.setup = function () {
//         let cnv_fourier = sketch.createCanvas((sketch.windowWidth), sketch.widowHeight * 0.5);
//         cnv_fourier.position(0, 0)
//         background(252);
//         // slider_n = createSlider(1, 20, 1);
//         // slider_r = createSlider(10, height * .35, 100);
//     }

//     sketch.draw = function () {
//         background(252);

//         // Make graph grid
//         for (var gridx = 0; gridx < (windowWidth * .75); gridx += (windowWidth * .75) / 10) {
//             for (var gridy = 0; gridy < height; gridy += height / 6) {
//                 fill(85, 80, 92);
//                 stroke(0);
//                 strokeWeight(.1);
//                 line(gridx, 0, gridx, height);
//                 line(0, gridy, (windowWidth * .75), gridy);
//             }
//         }

//         translate((windowWidth * .75) * .75, 250);
//         strokeWeight(3);

//         let x = 0;
//         let y = 0;

//         for (let i = 0; i < slider_n.value(); i++) {
//             let prevx = x;
//             let prevy = y;

//             let n = i * 2 + 1;
//             let radius = slider_r.value() * (4 / (n * PI));
//             x += radius * cos(n * time);
//             y += radius * sin(n * time);


//             stroke(194, 1, 20);
//             noFill();
//             ellipse(prevx, prevy, radius * 2);

//             stroke(194, 1, 20);
//             line(prevx, prevy, x, y);

//         }

//         document.getElementById("num").innerHTML = slider_n.value();
//         document.getElementById("radius").innerHTML = slider_r.value();

//         translate(-200, 0);
//         line(x + 200, y, 0, wave[0]);


//         wave.unshift(y);

//         beginShape();
//         fill(194, 1, 20);
//         for (let i = 0; i < wave.length; i++) {
//             // Determine direction of graph
//             // -i -> right to left, i -> left to right
//             point(-i, wave[i]);
//         }
//         endShape();

//         // Determine direction of rotation (- -> counter clockwise, + clockwise)
//         time += 0.025;

//         if (wave.length > 1000) {
//             wave.pop();
//         }

//     }
// };

// // New instance of p5 and pass in the function for oscillator sketch
// new p5(sketch_fourier);


// var globalVars = {
//     len: m.length
// };

function stop() {
    noLoop();
}

function start() {
    loop();
}