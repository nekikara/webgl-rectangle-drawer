import { drawPoints } from './handlers';
import { utils } from './utils';
import '../scss/main.scss';

const VSHADER_SOURCE = `
attribute vec4 aVertexPosition;
void main() {
  gl_Position = aVertexPosition;
}
`;

const FSHADER_SOURCE = `
precision mediump float;
uniform vec2 uResolution;
uniform vec2 uFirstPos;
uniform vec2 uSecondPos;

float desk(float min, float max, float x) {
  if (min <= x && x <= max) {
    return 1.;
  }
  return 0.;
}

vec3 colorA = vec3(255., 0., 0.) / 255.0;
vec3 colorB = vec3(255., 127., 0.) / 255.0;
vec3 colorC = vec3(255., 255., 0.) / 255.0;
vec3 colorD = vec3(0., 255., 0.) / 255.0;
vec3 colorE = vec3(0., 0., 255.) / 255.0;
vec3 colorF = vec3(75., 0., 130.) / 255.0;
vec3 colorG = vec3(148., 0., 211.) / 255.0;
vec3 white = vec3(1.);

vec3 selectColor(int index) {
  if (index == 0) {
    return colorA;
  } else if (index == 1) {
    return colorB;
  } else if (index == 2) {
    return colorC;
  } else if (index == 3) {
    return colorD;
  } else if (index == 4) {
    return colorE;
  } else if (index == 5) {
    return colorF;
  } else if (index == 6) {
    return colorG;
  } else {
    return white;
  }
}

int remain(int numerator, int denominator) {
  int ans = numerator / denominator;
  return numerator - ans * denominator;
}

void main() {
  vec3 colors[8];
  colors[0] = colorA;
  colors[1] = colorB;
  colors[2] = colorC;
  colors[3] = colorD;
  colors[4] = colorE;
  colors[5] = colorF;
  colors[6] = colorG;
  colors[7] = white;

  const vec2 center = vec2(0.5, 0.3);

  // Map coordinate to specified rectangle
  float minX = min(uFirstPos.x, uSecondPos.x);
  float maxX = max(uFirstPos.x, uSecondPos.x);
  float minY = min(uFirstPos.y, uSecondPos.y);
  float maxY = max(uFirstPos.y, uSecondPos.y);
  float width = abs(minX - maxX);
  float height = abs(minY - maxY);
  vec2 rst = vec2(gl_FragCoord.x - minX,  gl_FragCoord.y - minY) / vec2(width, height);

  float dis = distance(rst, center);
  vec3 background = vec3(0.);
  // X axis
  float stp = 1.0 / 8.0;
  float indexX = 0.;
  for (int i=0; i<8; i++) {
    indexX += step(stp * float(i + 1), rst.x);
  }
  float indexY = 0.;
  for (int i=0; i<8; i++) {
    indexY += step(stp * float(i + 1), rst.y);
  }
  
  background = selectColor(remain(int(indexX + indexY), 8));
  
  gl_FragColor = vec4(background, 1.);
}
`;

function main() {
  // Retrieve <canvas> element
  const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;

  // Get the rendering context for WebGL
  const gl = utils.getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  const shaderProgram = utils.initShaderProgram(gl, VSHADER_SOURCE, FSHADER_SOURCE);
  if (!shaderProgram) {
    console.error('Failed to initialize shaders.');
    return;
  }

  gl.useProgram(shaderProgram);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  const uResolutionPosition = gl.getUniformLocation(shaderProgram, 'uResolution');
  gl.uniform2f(uResolutionPosition, canvas.width, canvas.height);
  // Register an click handler
  canvas.onclick = (ev) => drawPoints(ev, gl, canvas as HTMLCanvasElement, shaderProgram);
}

window.addEventListener('DOMContentLoaded', () => {{
  main();
}});
