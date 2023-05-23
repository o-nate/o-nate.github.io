let time = 0;
let wave = [];

let slider_n;
let slider_r;

let height = 500;

let gridx;
let gridy;

function setup() {
    createCanvas((windowWidth * .75), height);
    background(252);
    slider_n = createSlider(1, 20, 1);
    slider_r = createSlider(10, height * .35, 100);
}

function draw() {
    background(252);

    // Make graph grid
    for (var gridx = 0; gridx < (windowWidth * .75); gridx += (windowWidth * .75) / 10) {
        for (var gridy = 0; gridy < height; gridy += height / 6) {
            fill(85, 80, 92);
            stroke(0);
            strokeWeight(.1);
            line(gridx, 0, gridx, height);
            line(0, gridy, (windowWidth * .75), gridy);
        }
    }

    translate((windowWidth * .75) * .75, 250);
    strokeWeight(3);

    let x = 0;
    let y = 0;

    for (let i = 0; i < slider_n.value(); i++) {
        let prevx = x;
        let prevy = y;

        let n = i * 2 + 1;
        let radius = slider_r.value() * (4 / (n * PI));
        x += radius * cos(n * time);
        y += radius * sin(n * time);


        stroke(194, 1, 20);
        noFill();
        ellipse(prevx, prevy, radius * 2);

        stroke(194, 1, 20);
        line(prevx, prevy, x, y);

    }

    document.getElementById("num").innerHTML = slider_n.value();
    document.getElementById("radius").innerHTML = slider_r.value();

    translate(-200, 0);
    line(x + 200, y, 0, wave[0]);


    wave.unshift(y);

    beginShape();
    fill(194, 1, 20);
    for (let i = 0; i < wave.length; i++) {
        // Determine direction of graph
        // -i -> right to left, i -> left to right
        point(-i, wave[i]);
    }
    endShape();

    // Determine direction of rotation (- -> counter clockwise, + clockwise)
    time += 0.025;

    if (wave.length > 1000) {
        wave.pop();
    }

}