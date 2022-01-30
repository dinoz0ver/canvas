SIZE = 512;
var MAX_ITER = 32;

var god_x = -2;
var god_y = -1.5;
var god_a = 3;

function zoom_in() {
  god_x += god_a/4;
  god_y += god_a/4;
  god_a = god_a/2;
  fill_in_parameters_from_code();
  take_it_away_mandelbrot();
}

function zoom_out() {
  god_x -= god_a/2;
  god_y -= god_a/2;
  god_a = god_a*2;
  fill_in_parameters_from_code();
  take_it_away_mandelbrot();
}

function move_left() {
  god_x -= god_a/10;
  fill_in_parameters_from_code();
  take_it_away_mandelbrot();
}

function move_right() {
  god_x += god_a/10;
  fill_in_parameters_from_code();
  take_it_away_mandelbrot();
}

function move_down() {
  god_y += god_a/10;
  fill_in_parameters_from_code();
  take_it_away_mandelbrot();
}

function move_up() {
  god_y -= god_a/10;
  fill_in_parameters_from_code();
  take_it_away_mandelbrot();
}

function multiply_iterations() {
  MAX_ITER *= 2;
  fill_in_parameters_from_code();
  take_it_away_mandelbrot();
}

function divide_iterations() {
  MAX_ITER /= 2;
  MAX_ITER = Math.floor(MAX_ITER);
  fill_in_parameters_from_code();
  take_it_away_mandelbrot();
}

function multiply_resolution() {
  SIZE *= 2;
  resize_canvas();
  fill_in_parameters_from_code();
  take_it_away_mandelbrot();
}

function divide_resolution() {
  SIZE /= 2;
  SIZE = Math.floor(SIZE);
  resize_canvas();
  fill_in_parameters_from_code();
  take_it_away_mandelbrot();
}
var foo = undefined;
function getCursorPosition(ev) {
  rect = canvas.getBoundingClientRect();
  console.log(ev);
  foo=ev;
  return [ev.clientX-rect.left, ev.clientY-rect.top];
}

// canvas.addEventListener("touchstart", zoom_by_clicking, false);

function zoom_by_clicking(ev) {
  // p = document.createElement("p");
  a = getCursorPosition(ev);
  click_col = a[0];
  click_row = a[1];
  center_col = Math.floor(SIZE/2);
  center_row = Math.floor(SIZE/2);
  pixel_vec_rows = click_row-center_row;
  pixel_vec_cols = click_col-center_col;
  scale = (god_a / SIZE);
  real_vec_rows = pixel_vec_rows * scale;
  real_vec_cols = pixel_vec_cols * scale;
  god_x += real_vec_cols;
  god_y += real_vec_rows;
  zoom_in();
  // fill_in_parameters_from_code();
  // take_it_away_mandelbrot();

  // p.innerHTML = `your position is ${a}`;
  // document.querySelector("#mainbody").appendChild(p);
}

function resize_canvas() {

  canvas.height = SIZE;
  canvas.width = SIZE;

  ctx = canvas.getContext("2d");
  id = ctx.createImageData(SIZE, SIZE);
  data = id.data;
}

function fill_in_parameters_from_code() {
  el = document.getElementById("iterations");
  el.value = `${MAX_ITER}`;
  el = document.getElementById("resolution");
  el.value = `${SIZE}`;
  el = document.getElementById("x");
  el.value = `${god_x}`;
  el = document.getElementById("y");
  el.value = `${god_y}`;
  el = document.getElementById("side_length");
  el.value = `${god_a}`;

}

function fill_in_parameters_mandelbrot() {
  el = document.getElementById("iterations");
  MAX_ITER = parseInt(el.value);
  el = document.getElementById("resolution");
  SIZE = parseInt(el.value);
  canvas.height = SIZE;
  canvas.width = SIZE;

  el = document.getElementById("x");
  god_x = parseFloat(el.value);
  el = document.getElementById("y");
  god_y = parseFloat(el.value);
  el = document.getElementById("side_length");
  god_a = parseFloat(el.value);

  ctx = canvas.getContext("2d");
  id = ctx.createImageData(SIZE, SIZE);
  data = id.data;
  take_it_away_mandelbrot();
}

function simplistic(ctx) {
  ctx.fillStyle = 'rgb(200, 0, 0)';
  ctx.fillRect(10, 10, 50, 50);

  ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
  ctx.fillRect(30, 30, 50, 50);
}

function pixel_gradient(collection, n_pixels) {
  step = Math.floor(256/n_pixels);
  for (i = 0; i < n_pixels; i++) {
    collection.push(`rgb(${256-step*i}, 0, 0)`)
    // add_pixel(ctx, collection, step*i, 0, 0);
  }
}

function pixel_random(collection, n_pixels) {
  step = Math.floor(256/n_pixels);
  for (i = 0; i < n_pixels; i++) {
    r = Math.floor(Math.random()*256);
    g = Math.floor(Math.random()*256);
    b = Math.floor(Math.random()*256);
    collection.push(`rgb(${r}, ${g}, ${b})`)
    // add_pixel(ctx, collection, step*i, 0, 0);
  }
}

function linear_interpolation(vec1, vec2, n_points) {
  dx = Math.floor((vec2[0]-vec1[0])/n_points)
  dy = Math.floor((vec2[1]-vec1[1])/n_points)
  dz = Math.floor((vec2[2]-vec1[2])/n_points)
  points = []
  for (i = 0; i < n_points; i++) {
    points.push([
      vec1[0]+i*dx,
      vec1[1]+i*dy,
      vec1[2]+i*dz
    ])
  }
  return points
}

var grad_vec = [0,0,0];

function linear_continuation(vec1, vec2, coeff) {
    grad_vec[0] = Math.floor(vec1[0]+coeff*(vec2[0]-vec1[0]))
    grad_vec[1] = Math.floor(vec1[1]+coeff*(vec2[1]-vec1[1]))
    grad_vec[2] = Math.floor(vec1[2]+coeff*(vec2[2]-vec1[2]))
}

var thresholds = [0, 0.16, 0.42, 0.6425, 0.8575, 1];
var points = [
  [  0,   7, 100],
  [ 32, 107, 203],
  [237, 255, 255],
  [255, 170,   0],
  [  0,   2,   0],
  [  0,   2,   0]
]

function pretty_mandelbrot_gradient(position) {
  for (i = thresholds.length-1; i >= 0; i--) {
    if (position > thresholds[i]) {
      coeff = (position-thresholds[i])/(thresholds[i+1]-thresholds[i]);
      linear_continuation(points[i], points[i+1], coeff);
      return;
    }
  }
}

// var pixels = [];
// pretty_gradient(pixels, 16);

function draw_pixel(ctx, row, col, pos) {
  // ctx.fillStyle = pixels[n];
  // ctx.fillStyle = 'rgb(200, 0, 0)';
  // ctx.fillStyle = pretty_mandelbrot_gradient(pos)
  ctx.fillRect(col, row, 1, 1);
}

function add_pixel(ctx, collection, r, g, b) {
  var id = ctx.createImageData(1,1); // only do this once per page
  var d  = id.data;                  // only do this once per page
  d[0]   = r;
  d[1]   = g;
  d[2]   = b;
  d[3]   = 1;
  collection.push(id);
}

function fast_pixel(ctx, row, col, id) {
  ctx.putImageData( id, row, col );  
}

function grid_filter(row, col) {
  return row % 8 <= 4 && col % 8 <= 4;
}

function circle_filter(row, col) {
  z = SIZE/2;
  x = (col-z);
  y = (row-z);
  x=x/(z);
  y=y/(z);
  return x*x+y*y < 1;
}

// var MAX_ITER = 256;

var the_z = [0, 0];
var the_starting_point = [0,0];

function mandelbrot_set(x, y) {
  // c = x+iy
  // iterate:
  // z <- z^2+c
  // (x+iy)*(x+iy) = x**2-y**2+2*i*xy
  // if abs(z) > 2: done

  i = 0;
  the_z[0] = the_starting_point[0];
  the_z[1] = the_starting_point[1];
  while (the_z[0]*the_z[0]+the_z[1]*the_z[1] < 4 && i < MAX_ITER) {
    z0 = the_z[0];
    z1 = the_z[1];
    the_z[0] = (z0*z0-z1*z1)+x;
    the_z[1] = 2*z0*z1+y;
    i = i + 1;
  }

  return i;
}

function generic_mandelbrot(x0,x1,y0,y1) {
  return function(row, col) {

    x_width = x1-x0
    y_width = y1-y0

    x = x0+(col/SIZE)*x_width
    y = y0+(row/SIZE)*y_width

    i = mandelbrot_set(x,y)
    return i/MAX_ITER;
  }
}

function mandelbrot_spirals() {
  x0=-0.34853774148008254
  x1=-0.34831493420245574
  y0=-0.6065922085831237
  y1=-0.606486596104741

  return generic_mandelbrot(x0,x1,y0,y1)
}

function boring_mandelbrot() {
  x0=-2
  x1=1
  y0=-1.5
  y1=1.5

  return generic_mandelbrot(x0,x1,y0,y1)
}

function beauty_one() {
  square_side = 0.01;

  x0=-0.567
  x1=x0+square_side
  y0=-0.647
  y1=y0+square_side
  MAX_ITER = 256

  return generic_mandelbrot(x0,x1,y0,y1)
}

function beauty_two() {
  square_side = 0.00025;
  // square_side = 3;

  // x0=-0.74561
  x0 = -0.74561537109375
  // x0=-2
  x1=x0+square_side
  // y0=-0.09676
  y0=-0.0967678125
  // y0=-1.5
  y1=y0+square_side
  // MAX_ITER = 8192

  console.log(`x0=${x0}`)
  console.log(`x1=${x1}`)
  console.log(`y0=${y0}`)
  console.log(`y1=${y1}`)

  return generic_mandelbrot(x0,x1,y0,y1)
}

function dynamic_mandelbrot() {

  x0 = god_x;
  y0 = god_y;
  x1=x0+god_a
  y1=y0+god_a

  return generic_mandelbrot(x0,x1,y0,y1)
}

function mandelbrot_filter(row, col) {
  x = (row/SIZE-2/3)*3;
  y = (col/SIZE-0.5)*3;
  i = mandelbrot_set(x,y);
  return i == MAX_ITER;
}

function mandelbrot_filter_with_distance(row, col) {
  x = (row/SIZE-2/3)*3;
  y = (col/SIZE-0.5)*3;
  i = mandelbrot_set(x,y);
  return i/MAX_ITER;
}

function mandelbrot_as_filter(generator, coord) {
  return function(row, col) {
      pos = generator(row, col);
      pretty_mandelbrot_gradient(pos);
      return grad_vec[coord];
  }
}

console.log("Loaded mandelbrot");

function take_it_away_mandelbrot() {

  fill_in_parameters_from_code();


  var generator = dynamic_mandelbrot();
  var row = 0;
  const split = 16;
  var rebuild_chrome_hack = true;

  step2 = function(ts) {
    console.log("Another Xs passed");

    for (; row < SIZE; row++) {
      for (col = 0; col < SIZE; col++) {
        pos = generator(row, col);
        pretty_mandelbrot_gradient(pos);
        idx = (row*SIZE+col)*4
        data[idx+0] = grad_vec[0];
        data[idx+1] = grad_vec[1];
        data[idx+2] = grad_vec[2];
        data[idx+3] = 255;
      }
      if (row % 32 == 0 && row > 0) {
        // console.log(grad_vec);
        window.requestAnimationFrame(step2);
        console.log(`Show part of image, row=${row}`);
        console.log(`Scheduling step function`);
        ctx.putImageData(id, 0, 0);
        rebuild_chrome_hack = !rebuild_chrome_hack;
        canvas.style.opacity =  rebuild_chrome_hack ? 1 : 0.999;
        console.log(`now opacity is ${canvas.style.opacity}`);
        // setTimeout(step, 1000);
        row++;
        return;
      }
    }
    // window.requestAnimationFrame(step);
    ctx.putImageData(id, 0, 0);
  }

  step2(0);
}
