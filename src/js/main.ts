import { drawPoints } from './handlers';
import { utils } from './utils';
import '../scss/main.scss';

const VSHADER_SOURCE = `
attribute vec4 aVertexPosition;
varying vec4 vColor;
void main() {
  gl_Position = aVertexPosition;
  if ( gl_Position.x < 0.0 && gl_Position.y < 0.0 ) {
    vColor = vec4(1.0, 0.0, 0.0, 1.0);
  } else if ( 0.0 < gl_Position.x && 0.0 < gl_Position.y ) {
    vColor = vec4(0.0, 1.0, 0.0, 1.0);
  } else {
    vColor = vec4(1.0, 1.0, 1.0, 1.0);
  }
}
`;
const FSHADER_SOURCE = `
precision mediump float;
uniform vec2 uResolution;
varying vec4 vColor;

void main() {
  vec2 st = gl_FragCoord.xy / uResolution;
  gl_FragColor = vec4(st.r, st.g, 0.0, 1.0);
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
