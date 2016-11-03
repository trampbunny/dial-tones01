var upWaves = [];
var numWaves = 25;
var source;

var currentVis;
var visSelector = 0;
function setup() {
  // Set up the visualization to fill the entire window
  createCanvas(window.innerWidth, window.innerHeight);
  // Create an audio input node, start the inputnd connect the ouput (audio out through the speakers)
  source = new p5.AudioIn();
  source.start();
  // Comment out the line below to stop sound output through speakers
  // source.connect();

  // Create a fast Fourier transform to analyze audio signal
  fft = new p5.FFT();
  fft.setInput(source);

  // Set up peak detection (beat)
  peakDetect = new p5.PeakDetect();
  peakDetect.onPeak(beatCapture);

  colorMode(HSB, numWaves, 255, 255);
}

var steps = 0;
function draw() {
   waves();

  fft.analyze();
  peakDetect.update(fft);
}

// This can be optimized
function waves() {
  background(0, 5);
  var wave = fft.waveform(source);
  // line with waveform
  // noFill();
  strokeWeight(2);
  strokeCap(SQUARE);
  strokeJoin(ROUND);
  for (j = 0; j < numWaves; j++) {
    stroke(numWaves - j, 255, 255);
    fill(numWaves - j, 255, 255);
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
}

function beatCapture() {
  console.log("capture");
  steps++;
}

function bubbles() {
  background(255, 1);
  var freq = fft.analyze(source);
  var wave = fft.waveform(source);
  noStroke();
  fill(source.getLevel()/ 1 * 255, 255, 255);
  for (i = 0; i < freq.length; i++) {
    ellipse(i / freq.length / width + width / 2, random(height), freq[i]);
  }
}
// window.setTimeout(function () {
//   clear();
//   visSelector = 1;
// }, 10000);

// Resize the canvas when the window is resized
window.onresize = resized;
function resized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}
