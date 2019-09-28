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

void main() {
  vec3 colors[5];
  colors[0] = colorA;
  colors[1] = colorB;
  colors[2] = colorC;
  colors[3] = colorD;
  colors[4] = white;

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
  vec3 background = white;
  background = mix(background, colorG, desk(0.3, 0.33, dis));
  background = mix(background, colorF, desk(0.33, 0.36, dis));
  background = mix(background, colorE, desk(0.36, 0.39, dis));
  background = mix(background, colorD, desk(0.39, 0.42, dis));
  background = mix(background, colorC, desk(0.42, 0.45, dis));
  background = mix(background, colorB, desk(0.45, 0.48, dis));
  background = mix(background, colorA, desk(0.48, 0.51, dis));
  background = mix(white, background, step(center.y, rst.y));
  
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
