

// helper functions for recording

var RECORDER;

class FrameByFrameCanvasRecorder {
  constructor(source_canvas, width, height, multiplier, FPS = 25) {
  
    this.FPS = FPS;
    this.source = source_canvas;
    this.width = width;
    this.height = height;
    this.multiplier = multiplier;

    const canvas = source_canvas.cloneNode();
    canvas.setAttribute("width", `${width*multiplier}`);
    canvas.setAttribute("height", `${height*multiplier}`);

    const ctx = this.drawingContext = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // we need to draw something on our canvas
    ctx.drawImage(source_canvas, 0, 0);
    const stream = this.stream = canvas.captureStream(0);
    const track = this.track = stream.getVideoTracks()[0];
    // Firefox still uses a non-standard CanvasCaptureMediaStream
    // instead of CanvasCaptureMediaStreamTrack
    if (!track.requestFrame) {
      track.requestFrame = () => stream.requestFrame();
    }
    // prepare our MediaRecorder
    const rec = this.recorder = new MediaRecorder(stream);
    const chunks = this.chunks = [];
    rec.ondataavailable = (evt) => chunks.push(evt.data);
    rec.start();
    // we need to be in 'paused' state
    waitForEvent(rec, 'start')
      .then((evt) => rec.pause());
    // expose a Promise for when it's done
    this._init = waitForEvent(rec, 'pause');

  }
  async recordFrame() {

    await this._init; // we have to wait for the recorder to be paused
    const rec = this.recorder;
    const canvas = this.canvas;
    const source = this.source;
    const ctx = this.drawingContext;
    const width = this.width;
    const height = this.height;
    const multiplier = this.multiplier;

    function wait(ms) {
      return new Promise(res => setTimeout(res, ms));
    }

    // start our timer now so whatever happens between is not taken in account
    const timer = wait(1000 / this.FPS);

    // wake up the recorder
    rec.resume();
    await waitForEvent(rec, 'resume');

    // draw the current state of source on our internal canvas (triggers requestFrame in Chrome)
    ctx.clearRect(0, 0, width*multiplier, height*multiplier);
    ctx.drawImage(source, 0, 0, width, height, 0, 0, width*multiplier, height*multiplier);
    // force write the frame
    this.track.requestFrame();

    // wait until our frame-time elapsed
    await timer;

    // sleep recorder
    rec.pause();
    await waitForEvent(rec, 'pause');

  }
  async export () {

    this.recorder.stop();
    this.stream.getTracks().forEach((track) => track.stop());
    await waitForEvent(this.recorder, "stop");
    return new Blob(this.chunks);

  }
}

// Promise based timer
function wait(ms) {
  return new Promise(res => setTimeout(res, ms));
}
// implements a sub-optimal monkey-patch for requestPostAnimationFrame
// see https://stackoverflow.com/a/57549862/3702797 for details
if (!window.requestPostAnimationFrame) {
  window.requestPostAnimationFrame = function monkey(fn) {
    const channel = new MessageChannel();
    channel.port2.onmessage = evt => fn(evt.data);
    requestAnimationFrame((t) => channel.port1.postMessage(t));
  };
}
// Promisifies EventTarget.addEventListener
function waitForEvent(target, type) {
  return new Promise((res) => target.addEventListener(type, res, {
    once: true
  }));
}
// creates a downloadable anchor from url
function download(url, filename = "file.ext") {
  a = document.createElement('a');
  a.textContent = a.download = filename;
  a.href = url;
  document.body.append(a);
  return a;
}

async function start_recording() {
  RECORDER = new FrameByFrameCanvasRecorder(CANVAS, WIDTH, HEIGHT, MULTIPLIER, FPS);
}

async function add_frame() {
  console.log("new frame");
  await RECORDER.recordFrame();
}

async function stop_recording() {
  // now all the frames have been drawn
  const blob = await RECORDER.export(); // we can get our final video file
  let url = URL.createObjectURL(blob);
  let a = document.createElement('a');
  document.body.appendChild(a);
  a.style = 'display: none';
  a.href = url;
  a.download = 'movie.webm';
  a.click();
  window.URL.revokeObjectURL(url);
  chunks = [];
}