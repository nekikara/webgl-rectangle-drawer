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

float chooseMin(float a, float b) {
  if (a <= b) {
    return a;
  }
  return b;
}

float chooseMax(float a, float b) {
  if (a <= b) {
    return b;
  }
  return a;
}

void main() {
  float minX = chooseMin(uFirstPos.x, uSecondPos.x);
  float maxX = chooseMax(uFirstPos.x, uSecondPos.x);
  float minY = chooseMin(uFirstPos.y, uSecondPos.y);
  float maxY = chooseMax(uFirstPos.y, uSecondPos.y);
  float width = abs(minX - maxX);
  float height = abs(minY - maxY);
  vec2 rst = vec2(gl_FragCoord.x - minX,  gl_FragCoord.y - (uResolution.y - maxY)) / vec2(width, height);

  gl_FragColor = vec4(rst.r, rst.g, 0., 1.0);
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
