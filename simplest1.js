var WIDTH;
var HEIGHT;
var SIZE;
var MULTIPLIER;

SIZE  = 32;
WIDTH = SIZE;
HEIGHT = SIZE;
MULTIPLIER = 16;

let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

var CANVAS = document.getElementById('main');
CANVAS.setAttribute("width", `${WIDTH}`);
CANVAS.setAttribute("height", `${HEIGHT}`);
CANVAS.style.width = `${WIDTH*MULTIPLIER}px`;
CANVAS.style.height = `${HEIGHT*MULTIPLIER}px`;

var RECORDING_CANVAS = document.createElement("canvas");
var RECORDING_CTX = RECORDING_CANVAS.getContext("2d");
RECORDING_CANVAS.setAttribute("width", `${WIDTH*MULTIPLIER}`);
RECORDING_CANVAS.setAttribute("height", `${HEIGHT*MULTIPLIER}`);
RECORDING_CTX.imageSmoothingEnabled = false;

var CANVAS_CTX = CANVAS.getContext("2d");
var IMAGE_DATA = CANVAS_CTX.createImageData(WIDTH, HEIGHT);

let videoStream = RECORDING_CANVAS.captureStream(25);

var RECORDER = new MediaRecorder(videoStream);

let chunks = [];
RECORDER.ondataavailable = function(e) {
  console.log("recorded data");
  chunks.push(e.data);
};

RECORDER.onerror = function(e) {
  console.log("Recorder error:", e);
}

var RECORDING_STARTED = false;
RECORDER.onstart = function(e) {
  RECORDING_STARTED = true;
  // RECORDING_CTX.drawImage(CANVAS, 0, 0, WIDTH, HEIGHT, 0, 0, WIDTH*MULTIPLIER, HEIGHT*MULTIPLIER);
  console.log("Recording started");
}

RECORDER.onstop = function(e) {
  if (!RECORDING_STARTED) {
    console.log("Recording was not started");
    return;
  }
  console.log("recording ended, ", chunks.length, "chunks");
  RECORDING_STARTED = false;
  let blob = new Blob(chunks, {
    type: 'video/webm'
  });
  let url = URL.createObjectURL(blob);
  let a = document.createElement('a');
  document.body.appendChild(a);
  a.style = 'display: none';
  a.href = url;
  a.download = 'test.webm';
  a.click();
  window.URL.revokeObjectURL(url);
  chunks = [];
};

function div(a,b) {
    return Math.floor(a/b);
}
