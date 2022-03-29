var WIDTH;
var HEIGHT;
var SIZE;
var MULTIPLIER;

SIZE  = 128;
WIDTH = 190;
HEIGHT = 80;
MULTIPLIER = 5;

var FPS = 30;

let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

var CANVAS = document.getElementById('main');
var CANVAS_CTX = CANVAS.getContext("2d");
var CANVAS_DATA = CANVAS_CTX.createImageData(WIDTH, HEIGHT);
var EMPTY = CANVAS_CTX.createImageData(WIDTH, HEIGHT);
CANVAS.setAttribute("width", `${WIDTH}`);
CANVAS.setAttribute("height", `${HEIGHT}`);
CANVAS.style.width = `${WIDTH*MULTIPLIER}px`;
CANVAS.style.height = `${HEIGHT*MULTIPLIER}px`;

var TMP_CANVAS = document.createElement("canvas");
var TMP_CTX = TMP_CANVAS.getContext("2d");
TMP_CANVAS.setAttribute("width", `${WIDTH*MULTIPLIER}`);
TMP_CANVAS.setAttribute("height", `${HEIGHT*MULTIPLIER}`);
TMP_CTX.imageSmoothingEnabled = false;


function div(a,b) {
    return Math.floor(a/b);
}

function arraysEqual(a1,a2) {
    /* WARNING: arrays must not contain {objects} or behavior may be undefined */
    return JSON.stringify(a1)==JSON.stringify(a2);
}


// // Promise based timer
// function wait(ms) {
//   return new Promise(res => setTimeout(res, ms));
// }
// // implements a sub-optimal monkey-patch for requestPostAnimationFrame
// // see https://stackoverflow.com/a/57549862/3702797 for details
// // if (!window.requestPostAnimationFrame) {
// //   window.requestPostAnimationFrame = function monkey(fn) {
// //     const channel = new MessageChannel();
// //     channel.port2.onmessage = evt => fn(evt.data);
// //     requestAnimationFrame((t) => channel.port1.postMessage(t));
// //   };
// // }
// // Promisifies EventTarget.addEventListener
// function waitForEvent(target, type) {
//   return new Promise((res) => target.addEventListener(type, res, {
//     once: true
//   }));
// }


// let videoStream = RECORDING_CANVAS.captureStream(0);
// const TRACK = videoStream.getVideoTracks()[0];
// // Firefox still uses a non-standard CanvasCaptureMediaStream
// // instead of CanvasCaptureMediaStreamTrack
// if (!TRACK.requestFrame) {
//   TRACK.requestFrame = () => videoStream.requestFrame();
// }

// var RECORDER = new MediaRecorder(videoStream);

// let chunks = [];
// RECORDER.ondataavailable = function(e) {
//   console.log("recorded data");
//   chunks.push(e.data);
// };

// RECORDER.onerror = function(e) {
//   console.log("Recorder error:", e);
// }

// RECORDER.onstart = function(e) {
//   // RECORDING_CTX.drawImage(CANVAS, 0, 0, WIDTH, HEIGHT, 0, 0, WIDTH*MULTIPLIER, HEIGHT*MULTIPLIER);
//   console.log("Recording started");
//   RECORDER.pause();
// }

// RECORDER.onstop = function(e) {
//   console.log("recording ended, ", chunks.length, "chunks");
//   let blob = new Blob(chunks, {
//     type: 'video/webm'
//   });
//   let url = URL.createObjectURL(blob);
//   let a = document.createElement('a');
//   document.body.appendChild(a);
//   a.style = 'display: none';
//   a.href = url;
//   a.download = 'test.webm';
//   a.click();
//   window.URL.revokeObjectURL(url);
//   chunks = [];
// };
