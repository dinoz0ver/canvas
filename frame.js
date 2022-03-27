class FrameCollector {
    constructor(fps = 30) {
        this.fps = fps;
        this.started = undefined;
        this.lastFrame = undefined;
    }

    async addFrame() {
        const frame_delta = 1000/this.fps;
        const frame_delta_delta = 5;
        let recorder = this;

        const myPromise = new Promise((resolve, reject) => {
          function timing(ts) {
            if (recorder.lastFrame === undefined || Math.abs(ts - recorder.lastFrame) > frame_delta || Math.abs((ts - recorder.lastFrame) - frame_delta) < frame_delta_delta) {
              resolve({ts: ts, last_frame: recorder.lastFrame});
              recorder.lastFrame = ts;
            } else {
              window.requestAnimationFrame(timing)
            }
          }

          window.requestAnimationFrame(timing)
        });

        return await myPromise;
    }
}

async function start_recording() {
  RECORDER = new FrameCollector(FPS);
}

async function add_frame() {
  CANVAS_CTX.putImageData(CANVAS_DATA, 0, 0);
  return await RECORDER.addFrame();
}

