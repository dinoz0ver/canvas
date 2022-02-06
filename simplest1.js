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

var CANVAS_CTX = CANVAS.getContext("2d");
var IMAGE_DATA = CANVAS_CTX.createImageData(WIDTH, HEIGHT);

function div(a,b) {
    return Math.floor(a/b);
}
