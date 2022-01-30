
var modes = [
  "animate",
  "static",
  "draw_it_yourself",
  "animate_it_yourself"
];

var drawing_mode = 3;

var green = [0,255,0];
var red = [255,0,0];
var blue = [0,0,255];
var white = [255,255,255];
var black = [0,0,0];

init_scenes();

///////////////////////////////////

var static = [
  white_noise_static,
  smooth_gradient_static,
  cross
]

var animate = [
  smooth_gradient
];

// для рисования руками, без цикла

var draw_it_yourself = [
  // prime_lines,
  draw_circle
];

// для анимирования руками, без цикла

var animate_it_yourself = [
  trace(function(a,b,c){}, scene1),
  trace(act1, scene1),
  trace(act2, scene1),
  trace(act3, scene1),
  // random,
  plot_primes
];


//////////////////////////////////////////

var resizeFunc;
var hasResized = false;
resizeFunc = function() {
  hasResized = true;
};

// функции генерации

// белый шум

function white_noise_static(row, col) {
  return white_noise(row, col, 0);
}

function white_noise(row, col, step) {
  return [Math.random()*256,Math.random()*256,Math.random()*256];
}

// красивый градиент

function smooth_gradient_static(row, col) {
  return smooth_gradient(row, col, 0);
}

function smooth_gradient(row, col, step) {
  let r = Math.floor((row / HEIGHT) * 255);
  let g = Math.floor((col / WIDTH) * 255);
  let b = (Math.floor(step/256) % 2) == 0 ? step % 256: 255 - step % 256;
  return [r, g, b];
}

// дебажный крест

function cross(row, col) {
  let mid_col = Math.floor(WIDTH/2);
  let mid_row = Math.floor(HEIGHT/2);
  let size = 10;
  if (Math.abs(row-mid_row) < size) {
    if (Math.abs(col-mid_col) < size) {
      return green;
    }
    return red;
  }

  if (Math.abs(col-mid_col) < size) {
    return blue;
  }

  return white;
}

function white(image) {
  for (row = 0; row < HEIGHT; row++) {
    for (col = 0; col < WIDTH; col++) {
      draw_pixel(image, row, col, [255,255,255]);
    }
  }
}

// простые числа

function is_prime(n) {
  if (n == 1) {
    return false;
  }
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i == 0) {
      return false;
    }
  }

  return true;
}

function prime_lines(image) {
  init_erat();
  let mid_row = Math.floor(HEIGHT / 2);
  let mid_col = Math.floor(WIDTH / 2);
  let heading = 0;
  let curr_row = mid_row;
  let curr_col = mid_col;
  let i = 1;
  let headings = [
    [-1, 0],
    [0,-1],
    [1,0],
    [0,1]
  ];
  let all_steps = 1;
  let n_steps = 1;
  let curr_erat_pos = 0;
  // while (curr_col > 0 && curr_col < WIDTH && curr_row > 0 && curr_row < HEIGHT) {
  while (i < WIDTH*WIDTH+10) {
    if (i == ERAT_AR[curr_erat_pos]) {
      if (i == 1) {
        draw_pixel(image, curr_row, curr_col, green);
      } else {
        draw_pixel(image, curr_row, curr_col, red);
      }
      curr_erat_pos++;
    } else {
      draw_pixel(image, curr_row, curr_col, white);
    }

    let ar = headings[heading];
    curr_row += ar[0];
    curr_col += ar[1];

    n_steps--;
    if (n_steps == 0) {
      heading = (heading+1)%4;
      if (heading % 2 == 0) {
        all_steps++;
      }
      n_steps = all_steps;
    }

    // console.log(`${i}`);
    // if (i == 10000000) {
    //   break;
    // }
    i++;
  }
}

// полярные координаты (графики)
var INITIAL_VIEWPORT_WIDTH;
var INITIAL_VIEWPORT_HEIGHT;
var MID_COL;
var MID_ROW;
var VIEWPORT_WIDTH;
var VIEWPORT_HEIGHT;
var STEP;
var STEPX;
var STEPY;

function resizeGraph(scaleFactor) {
  INITIAL_VIEWPORT_WIDTH = WIDTH;
  INITIAL_VIEWPORT_HEIGHT = HEIGHT;
  MID_COL = Math.floor(WIDTH / 2);
  MID_ROW = Math.floor(HEIGHT / 2);
  VIEWPORT_WIDTH = INITIAL_VIEWPORT_WIDTH*scaleFactor;
  VIEWPORT_HEIGHT = INITIAL_VIEWPORT_HEIGHT*scaleFactor;

  let debug = true;

  if (debug) {
    console.log("--- graph resized ---");

    console.log(`MID_COL ${MID_COL}`);
    console.log(`MID_ROW ${MID_ROW}`);
    console.log(`VIEWPORT_WIDTH ${VIEWPORT_WIDTH}`);
    console.log(`VIEWPORT_HEIGHT ${VIEWPORT_HEIGHT}`);
    console.log(`INITIAL_VIEWPORT_WIDTH ${INITIAL_VIEWPORT_WIDTH}`);
    console.log(`INITIAL_VIEWPORT_HEIGHT ${INITIAL_VIEWPORT_HEIGHT}`);
  }
}

function initialize_graph(width, height) {
  INITIAL_VIEWPORT_WIDTH = width;
  INITIAL_VIEWPORT_HEIGHT = height;

  MID_COL = Math.floor(WIDTH / 2);
  MID_ROW = Math.floor(HEIGHT / 2);
  VIEWPORT_WIDTH = INITIAL_VIEWPORT_WIDTH;
  VIEWPORT_HEIGHT = INITIAL_VIEWPORT_HEIGHT;
  STEP = VIEWPORT_WIDTH/SIZE;
  STEPX = VIEWPORT_WIDTH/WIDTH;
  STEPY = VIEWPORT_HEIGHT/HEIGHT;

  let debug = true;

  if (debug) {
    console.log("--- graph inited ---");

    console.log(`INITIAL_VIEWPORT_WIDTH ${INITIAL_VIEWPORT_WIDTH}`);
    console.log(`INITIAL_VIEWPORT_HEIGHT ${INITIAL_VIEWPORT_HEIGHT}`);
    console.log(`MID_COL ${MID_COL}`);
    console.log(`MID_ROW ${MID_ROW}`);
    console.log(`VIEWPORT_WIDTH ${VIEWPORT_WIDTH}`);
    console.log(`VIEWPORT_HEIGHT ${VIEWPORT_HEIGHT}`);
    console.log(`STEP ${STEP}`);
    console.log(`STEPX ${STEPX}`);
    console.log(`STEPY ${STEPY}`);
  }

}

function draw_xy(image,x,y,color) {
  // console.log(`x=${x}, y=${y}`)
  col = Math.floor(x/STEPX)+MID_COL;
  row = Math.floor(y/STEPY)+MID_ROW;
  // console.log(`col=${col}, row=${row}`)
  draw_pixel(image,row,col,color);
}

function draw_xy_with_size(image,x,y,color,size,middle=true) {
  // console.log(`x=${x}, y=${y}`)
  let col;
  let row;
  if (middle) {
    col = Math.floor(x/STEPX)+MID_COL;
    row = Math.floor(y/STEPY)+MID_ROW;
  } else {
    col = Math.floor(x/STEPX);
    row = Math.floor(y/STEPY);
    row = HEIGHT - row;
  }
  // console.log(`col=${col}, row=${row}`);
  let half = Math.floor(size/2);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      let c = col + (i-half);
      let r = row + (j-half);
      draw_pixel(image,r,c,color);
    } 
  }
}

function draw_polar(image,r,phi,color) {
  // console.log(`r=${r}, cos=${Math.cos(phi)}, r*cos=${r*Math.cos(phi)}`);
  draw_xy(image,r*Math.cos(phi), r*Math.sin(phi), color);
}

function draw_polar_with_size(image,r,phi,color,size) {
  // console.log(`r=${r}, cos=${Math.cos(phi)}, r*cos=${r*Math.cos(phi)}`);
  draw_xy_with_size(image,r*Math.cos(phi), r*Math.sin(phi), color, size);
}

function draw_circle(image) {
  initialize_graph(10,10);
  clrScr();
  let phi_step = 0.01;
  let r = 3;
  let phi = 0;
  let i = 0;

  // draw_pixel(image,64,64,green);
  while (phi < 2*Math.PI) {
    draw_polar_with_size(image,r,phi,red,1);
    phi+=phi_step;
    // console.log(`phi=${phi}`)
    // if (i > 5) {
    //   break;
    // }
    i++;
  }
}

function eratosphenes(n) {
  let ar = [];
  for (let i = 0; i < n; i++) {
    ar.push(i);
  }

  for (let i = 2; i*2 < ar.length; i++) {
    let mult = ar[i];
    if (mult == 0) {
      continue;
    }
    for (let j = i+mult; j < ar.length; j += mult) {
      ar[j] = 0;
    }
  }
  let new_ar = [];

  for (let i = 0; i < ar.length; i++) {
    if (ar[i] != 0) {
      new_ar.push(ar[i]);
    }
  }

  return new_ar;
}

var ERAT_AR = [];

function init_erat() {
  if (ERAT_AR.length == 0) {
    ERAT_AR = eratosphenes(10000000);
  }
}

function recalculate(limitx, limity) {
  VIEWPORT_WIDTH = limitx;
  VIEWPORT_HEIGHT = limity;

  STEPX = VIEWPORT_WIDTH/WIDTH;
  STEPY = VIEWPORT_HEIGHT/HEIGHT;
  STEP = VIEWPORT_WIDTH/SIZE;
}

function plot_primes(image, step) {
  let scaleFactor = Math.pow(1.5,step/60);

  if (step == 0) {
    initialize_graph(WIDTH, HEIGHT);
  }

  if (hasResized) {
    resizeGraph(scaleFactor);
    hasResized = false;
  }

  init_erat();
  clrScr();

  let limitx = INITIAL_VIEWPORT_WIDTH*scaleFactor;
  let limity = INITIAL_VIEWPORT_HEIGHT*scaleFactor;

  recalculate(limitx, limity);

  let max_radius = Math.sqrt(limitx*limitx+limity*limity)/2;
  let i = 0;
  let size;
  if (max_radius > 200000) {
    size = 1;
  } else {
    size = 3;
  }
  var flag = 0;
  while (ERAT_AR[i] < max_radius) {
    if (max_radius > 2000000 && ERAT_AR[i] < 500000 && ERAT_AR[i] > 100000 && flag % 2 == 1) {
      // none
    } else if (max_radius > 2000000 && ERAT_AR[i] < 100000 && flag > 0) {
      // none
    } else {
      draw_polar_with_size(image, ERAT_AR[i], ERAT_AR[i], red, size);
    }
    i++;
    flag = (flag+1)%4;
  }
}

// 

function random(image, step) {
  if (step == 0) {
    initialize_graph(screen.width, screen.height);
  }

  // console.log("trace");

  for (let i = 0; i < 100; i++) {
    x = screen.width/2-Math.random()*screen.width;
    y = screen.height/2-Math.random()*screen.height;
    draw_xy(image,x,y,white);
  }
}

function sub(a1,a2) {
  return [a1[0]-a2[0],a1[1]-a2[1],a1[2]-a2[2]];
}

function add(a1,a2) {
  return [a1[0]+a2[0],a1[1]+a2[1],a1[2]+a2[2]];
}

function mult(a,v) {
  return [a*v[0],a*v[1],a*v[2]];
}

function scalar(a1,a2) {
  return a1[0]*a2[0]+a1[1]*a2[1]+a1[2]*a2[2];
}

function normsq(a) {
  return a[0]*a[0]+a[1]*a[1]+a[2]*a[2];
}

function vector(v1,v2) {
  let v1x = v1[0];
  let v1y = v1[1];
  let v1z = v1[2];
  let v2x = v2[0];
  let v2y = v2[1];
  let v2z = v2[2];
  return [v1y*v2z-v2y*v1z, v2x*v1z-v1x*v2z, v1x*v2y-v2x*v1y];
}

function intersect_sphere(line, sphere) {
  let v0 = sub(line.a0,sphere.a0);
  let sc = scalar(line.a,v0);
  let na = normsq(line.a);
  let nv0 = normsq(v0);
  let r2 = sphere.r*sphere.r;
  let D = sc*sc - na * (nv0-r2);
  if (D < 0) {
    return undefined;
  }
  let Dsq = Math.sqrt(D);
  let t = (-sc - Dsq)/na;
  if (t < 0) {
    return undefined;
  }
  return t;
  // return [
    // (-sc + Dsq)/na,
  // ];
}

function intersect_polygon(line, polygon, is_screen=false) {
  let n = vector(polygon.v1, polygon.v2);
  // console.log("norm vector n ", n);
  if (is_screen && scalar(n,line.a) > 0) {
    // не интересуют лучи, приходящие сзади
    // console.log("from backwards");
    return undefined;
  }
  let v0 = sub(line.a0, polygon.a0);
  let scna = scalar(n,line.a);
  if (Math.abs(scna) < 1e-10) {
    // parallel to the surface
    // console.log("parallel");
    return undefined;
  }
  let t = -scalar(n,v0)/scna;
  if (t < 0) {
    // в противоположном направлении
    // console.log("opposite");
    return undefined;
  }

  if (Math.abs(t) < 1e-10) {
    // луч стартовал с плоскости
    // console.log("from_the_surface");
    return undefined;
  }

  let v = [line.a[0]*t+v0[0], line.a[1]*t+v0[1], line.a[2]*t+v0[2]];
  if (normsq(v) < 1e-10) {
    if (is_screen) {
      return [0,0];
    }
    return t;
  }

  // console.log("v1.v = ", scalar(polygon.v1, v));
  // console.log("v2.v = ", scalar(polygon.v2, v));

  let alpha = scalar(polygon.v1, v)/normsq(polygon.v1);
  let beta = scalar(polygon.v2, v)/normsq(polygon.v2);

  if (is_screen) {
    if (alpha >= 0 && alpha <= 1 && beta >= 0 && beta <= 1) {
      return [alpha, beta];
    }
    // console.log("outside_alpha: ", [alpha, beta]);
    // console.log("||v1|| = ", Math.sqrt(normsq(polygon.v1)));
    // console.log("||v2|| = ", Math.sqrt(normsq(polygon.v2)));
    // console.log("v = ", v);
    return undefined;
  }

  let a = alpha+beta;
  let tt = alpha/a;

  if (a > 0 && a <= 1 && tt >= 0 && tt <= 1) {
    // существует точка пересечения с полигоном
    return t;
  }

  // console.log("outside_a and tt");
  return undefined;
}

function intersect_screen(line, screen) {
  return intersect_polygon(line, screen.polygon, true);
}

function test_intersect(line, scene) {
  let intersections = [];
  if (scene.spheres !== undefined) {
    for (let i = 0; i < scene.spheres.length; i++) {
      let t = intersect_sphere(line, scene.spheres[i]);
      if (t !== undefined) {
        intersections.push(t);
      }
    }
  }

  if (intersections.length > 0) {
    // поглощается луч
    return undefined;
  }

  let t = intersect_screen(line, scene.screen);
  return t;
}

function create_ray_with_angles(scene, x_angle, z_angle) {

  let x = Math.cos(x_angle);
  let y = Math.sin(x_angle);
  let z = Math.sin(z_angle);

  return {
    a: [x,y,z],
    a0: scene.light_source.a0
  };
}

function create_ray(scene) {

  let x_angle = Math.random()*Math.PI*2;
  let z_angle = Math.random()*Math.PI*2;

  return create_ray_with_angles(scene, x_angle, z_angle);
}

var scene1;
var test_scene1;

function init_scenes() {
  scene1 = {
    spheres: [
      {
        a0: [0,0,0],
        r: 1
      }
    ],

    polygons: [

    ],

    screen: {
      polygon: {
        a0: [5,-5,-5],
        v1: [0,0,10],
        v2: [0,10,0]
      },
      width: 10,
      height: 10
    },

    light_source: {
      a0: [-3,0,0]
    }
  };

  test_scene1 = {
    light_source: {
      a0: [-2,1,1]
    },
    spheres: [
      {
        a0: [1,1,0],
        r: 1
      }
    ],
    screen: {
      polygon: {
        a0: [3,-3,-3],
        v1: [0,0,6],
        v2: [0,6,0]
      },
      width: 6,
      height: 6
    }
  };

}


function trace(action, orig_scene) {
  let scene = JSON.parse(JSON.stringify(orig_scene));
  return function(image, step) {
    if (step == 0) {
      initialize_graph(scene.screen.width, scene.screen.height);
    }

    // console.log("trace");

    action(image, scene, step);
    for (let i = 0; i < 100000; i++) {
      let line = create_ray(scene);
      let t = test_intersect(line, scene);
      if (t !== undefined) {
        // light has hit the screen!
        let y = t[0] * Math.sqrt(normsq(scene.screen.polygon.v1));
        let x = t[1] * Math.sqrt(normsq(scene.screen.polygon.v2));
        // console.log("t=", t);
        // console.log("x,y=", [x,y]);
        draw_xy_with_size(image, x, y, white, 1, false);
      }
    }
  }
}

function act1(image, scene, step) {
  clrScr(image);
  let sphere = scene.spheres[0];
  sphere.a0[0] -= 0.04;
}

function act2(image, scene, step) {
  clrScr(image);
  scene.light_source.a0 = [-3, 1*Math.cos(2*Math.PI*step/120), 1*Math.sin(2*Math.PI*step/120)];
}

function act3(image, scene, step) {
  clrScr(image);
  scene.light_source.a0[0] = -3 / Math.pow(2, step/60)-0.05;
  scene.light_source.a0[2] = 1;
  // scene.light_source.a0 = [-0.05, 0, 1];
}

function tests() {

  isPaused = true;
  console.log("Hello, world!");
  sphere = test_scene1.spheres[0];

  let line = create_ray_with_angles(test_scene1, 0, 0);
  let t = intersect_sphere(line, sphere);
  if (Math.abs(t-3) > 1e-10) {
    console.log("intersection test 1 failed: ", t);
    return;
  }
  console.log("test 1 passed");

  line.a = [3,0,-1];
  t = intersect_sphere(line, sphere);
  if (t === undefined) {
    console.log("intersection test 2 failed");
    return;
  }
  console.log("test 2 passed");

  line = create_ray_with_angles(test_scene1, 0, 2*Math.PI-Math.PI/2);
  t = intersect_sphere(line, sphere);
  if (t !== undefined) {
    let v = add(line.a0, mult(t, line.a));
    console.log("intersection test 3 failed: ", v);
    v = sub(v,sphere.a0);
    console.log("x2+y2+z2=", v[0]*v[0]+v[1]*v[1]+v[2]*v[2]);
    return;
  }
  console.log(`test 3 passed`);


  line = create_ray_with_angles(test_scene1, 0, 0);
  t = intersect_polygon(line, test_scene1.screen.polygon, true);
  if (t === undefined) {
    console.log("intersection test 4 failed");
    return;
  }
}

// setTimeout(tests, 50);
