var freq;
var waves;
var numWaves = 25;
var source;

// For waves function
var count = 0;

// For bubbles function
var randomXY = [];

function setup() {
  // Set up the visualization to fill the entire window
  createCanvas(window.innerWidth, window.innerHeight);
  // Create an audio input node, start the inputnd connect the ouput (audio out through the speakers)
  source = new p5.AudioIn();
  source.start();
  // Comment out the line below to stop sound output through speakers
  source.connect();

  // Create a fast Fourier transform to analyze audio signal
  fft = new p5.FFT();
  fft.setInput(source);

  // For bubbles function
  for (i = 0; i < fft.analyze(source).length; i++) {
    randomXY[i] = [random(width), random(height)];
  }

  colorMode(HSB, numWaves + 1, 255, 255);
}

function draw() {
  freq = fft.analyze(source).slice(0,600);
  wave = fft.waveform(source).slice(0,600);
  visSwitcher[visSwitcherKeys[switchNumber]]();
}

var visSwitcher = {};
visSwitcher.waves = function() { return waves(); };
visSwitcher.bubbles = function() { return bubbles(); };
visSwitcher.lineDance = function() { return lineDance(); };
// visSwitcher.coder01 = function() { return coder01(); };
var visSwitcherKeys = Object.keys(visSwitcher);

var switchNumber = 0;
window.setInterval(function() {
  clear();
  switchNumber++;
  if (switchNumber > visSwitcherKeys.length - 1) { switchNumber = 0; }
}, 15000);

// This can be optimized
function waves() {
  if (count > numWaves) { count = 0; }
  background(0, 0.1);
  // line with waveform
  // noFill();
  strokeWeight(2);
  strokeCap(SQUARE);
  strokeJoin(ROUND);
  for (j = 0; j < numWaves; j++) {
    if (count === j) {
      stroke(j, 255, 0);
      fill(j, 255, 0);
    } else {
      stroke(numWaves - j, 255, 255);
      fill(numWaves - j, 255, 255);
    }
    //Top
    beginShape();
    for (i = 0; i < wave.length; i++) {
      if (wave[i] >= 0 ) {
        vertex(
          i / wave.length * j / numWaves * width +( width / 2 - j / numWaves * width / 2),
          height / 2 + j / numWaves * height / 2 + wave[i] * (numWaves * 2)
        );
      }
    }
    endShape();
    //Bottom
    beginShape();
    for (i = 0; i < wave.length; i++) {
      if (wave[i] >= 0 ) {
        vertex(
          i / wave.length * j / numWaves * width +( width / 2 - j / numWaves * width / 2),
          height / 2 - j / numWaves * height / 2 - wave[i] * (numWaves * 2)
        );
      }
    }
    endShape();
    //Right
    beginShape();
    for (i = 0; i < wave.length; i++) {
      if (wave[i] >= 0 ) {
        vertex(
          width / 2 - j / numWaves * width / 2 - wave[i] * (numWaves * 2),
          i / wave.length * j / numWaves * height +( height / 2 - j / numWaves * height / 2)
        );
      }
    }
    endShape();
    //Left
    beginShape();
    for (i = 0; i < wave.length; i++) {
      if (wave[i] >= 0 ) {
        vertex(
          width / 2 + j / numWaves * width / 2 + wave[i] * (numWaves * 2),
          i / wave.length * j / numWaves * height +( height / 2 - j / numWaves * height / 2)
        );
      }
    }
    endShape();
  }
  count++;
}

function bubbles() {
  background(0, 0.05);
  noStroke();
  // fill(source.getLevel()/ 1 * 255, 255, 255);
  for (i = 0; i < freq.length; i++) {
    fill(i / freq.length * numWaves, 255, 255, 127);
    ellipse(i / freq.length * width + random(-freq[i], freq[i]), randomXY[i][1] + random(-freq[i], freq[i]), freq[i] / 10);
  }
}


function lineDance() {
  bass = fft.getEnergy("bass");
  lowMid = fft.getEnergy("lowMid");
  mid = fft.getEnergy("mid");
  highMid = fft.getEnergy("highMid");
  treble = fft.getEnergy("treble");
  var ranges = [bass, lowMid, mid, highMid, treble];
  background(0, 1);
  noFill();
  beginShape();
    stroke(0, 255, 255, 127);
    strokeWeight(bass / 255 * 5);
    for (i = 0; i < wave.length; i++) {
      vertex(
        width / 2 + (width / 4 * sin(i * wave.length / (2 * PI))) + freq[i] * width,
        height / 2 + (height / 4 * cos(i * wave.length / (2 * PI))) + freq[i] * height
      );
    }
  endShape();
  beginShape();
    stroke(numWaves / 3, 255, 255, 127);
    strokeWeight(mid /255 * 5);
    for (i = 0; i < wave.length; i++) {
      vertex(
        width / 2 + (width / 4 * sin(i * wave.length / (2 * PI))) + freq[i] * width,
        height / 2 + (height / 4 * cos(i * wave.length / (2 * PI))) - freq[i] * height
      );
    }
  endShape();
  beginShape();
    stroke(numWaves * 2 / 3, 255, 255, 50);
    strokeWeight(highMid /255 * 5);
    for (i = 0; i < wave.length; i++) {
      vertex(
        width / 2 + (width / 4 * sin(i * wave.length / (2 * PI))) - freq[i] * width,
        height / 2 + (height / 4 * cos(i * wave.length / (2 * PI))) - freq[i] * height
      );
    }
    endShape();
    beginShape();
    stroke(numWaves -1, 255, 255, 50);
    strokeWeight(treble / 255 * 5);
    for (i = 0; i < wave.length; i++) {
      vertex(
        width / 2 + (width / 4 * sin(i * wave.length / (2 * PI))) - freq[i] * width,
        height / 2 + (height / 4 * cos(i * wave.length / (2 * PI))) + freq[i] * height
      );
    }
    endShape();
  // }
}

// Created by one of the participants in the DialTones workshop
function coder01() {
  background(0, 0.01);
  // Draw the waveform of the audio input horizontally across the middle of the screen
  function drawWave() {
    bass = fft.getEnergy("bass");
    lowMid = fft.getEnergy("lowMid");
    mid = fft.getEnergy("mid");
    highMid = fft.getEnergy("highMid");
    treble = fft.getEnergy("treble");

    noFill();
    stroke(255 - treble / 255, bass / 255, 255 - mid / 255);

    // stroke(bass / 255, mid / 255, treble / 255);
    drawRangeCircles();
    amplitudeCurve();

    beginShape();
    strokeWeight(bass / 255 * 5);
    for (i = 0; i < wave.length; i++) {
      vertex(
        i / wave.length * width,
        height / 2 - wave[i] / 1 * height / 2
      );
    }
    endShape();
  }

  // Draw circles on the screen with width representing the average amplitude of the five defined frequency ranges
  function drawRangeCircles() {
    var ranges = [bass, lowMid, mid, highMid, treble];
    for (i = 0; i < ranges.length; i++) {
      ellipse(((i + 1) / (ranges.length + 1) * width), height / 4, ranges[i] / 255 * height / 2, mid/2, bass/2);
      ellipse(((i + 1) / (ranges.length + 1) * width), height / 1.28, ranges[i] / 255 * height / 2, mid/2, bass/2);
    }
  }

  function amplitudeCurve() {
    var amp = source.getLevel();
    bezier(0, 0, amp * width, height - amp * height, width - amp * width, amp * height, width, height);
  }

  drawWave();
}

// Resize the canvas when the window is resized
window.onresize = resized;
function resized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}
