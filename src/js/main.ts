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

vec3 white = vec3(1.);

int remain(int numerator, int denominator) {
  int ans = numerator / denominator;
  return numerator - ans * denominator;
}

vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix( vec3(1.0), rgb, c.y);
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
  
  vec2 c = rst - vec2(0.5);
  float angle = atan(c.y, c.x);
  float radius = distance(rst, center);
  float h = 1.- pow(sin((TWO_PI / 2.) * (angle / TWO_PI  - 1.5) / 2. ), 1.5);
  vec3 colorA = hsb2rgb(vec3( h, radius * 2., 1.0 ));
  
  vec3 background = mix(colorA, white, step(0.45, radius));
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
