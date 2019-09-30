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
#define TWO_PI 6.28318530718
uniform vec2 uResolution;
uniform vec2 uFirstPos;
uniform vec2 uSecondPos;

float fill(vec2 tl, vec2 br, vec2 p) {
  if (tl.x <= p.x && p.x <= br.x && br.y <= p.y && p.y <= tl.y) {
    return 1.;
  }
  return 0.;
}

float sc(float left, float b, float t, vec2 p) {
  const float width = 0.02;
  vec2 tl = vec2(left, t);
  vec2 br = vec2(left + width, b);
  return fill(tl, br, p);
}

float strokeR(float b, float l, float r, vec2 p) {
  const float width = 0.02;
  vec2 top = vec2(l, b + width);
  vec2 bottom = vec2(r, b);
  return fill(top, bottom, p);
}

void main() {
  const vec2 center = vec2(0.5);

  // Map coordinate to specified rectangle
  float minX = min(uFirstPos.x, uSecondPos.x);
  float maxX = max(uFirstPos.x, uSecondPos.x);
  float minY = min(uFirstPos.y, uSecondPos.y);
  float maxY = max(uFirstPos.y, uSecondPos.y);
  float width = abs(minX - maxX);
  float height = abs(minY - maxY);
  vec2 rst = vec2(gl_FragCoord.x - minX,  gl_FragCoord.y - minY) / vec2(width, height);
  
  vec3 background = vec3(1.);
  // Colors
  background = mix(background, vec3(1., 0., 0.), fill(vec2(0., 1.), vec2(0.25, 0.75), rst));
  background = mix(background, vec3(1., 1., 0.), fill(vec2(0.95, 1.), vec2(1., 0.75), rst));
  background = mix(background, vec3(0., 0., 1.), fill(vec2(0.8, 0.15), vec2(1., 0.), rst));
  
  // Columns
  background = mix(background, vec3(0.), sc(0.25, 0., 1., rst));
  background = mix(background, vec3(0.), sc(0.1, 0.75, 1.0, rst));
  background = mix(background, vec3(0.), sc(0.8, 0., 1.0, rst));
  background = mix(background, vec3(0.), sc(0.95, 0., 1.0, rst));
  // Rows
  background = mix(background, vec3(0.), strokeR(0.15, 0.25, 1., rst));
  background = mix(background, vec3(0.), strokeR(0.75, 0., 1., rst));
  background = mix(background, vec3(0.), strokeR(0.9, 0., 1., rst));
  
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
  gl.clearColor(0.5, 0.5, 0.5, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  const uResolutionPosition = gl.getUniformLocation(shaderProgram, 'uResolution');
  gl.uniform2f(uResolutionPosition, canvas.width, canvas.height);
  // Register an click handler
  canvas.onclick = (ev) => drawPoints(ev, gl, canvas as HTMLCanvasElement, shaderProgram);
}

window.addEventListener('DOMContentLoaded', () => {{
  main();
}});
