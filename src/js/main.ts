import '../scss/main.scss';

const VSHADER_SOURCE = `
void main() {
  gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
  gl_PointSize = 100.0;
}
`;
const FSHADER_SOURCE = `
void main() {
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`;

function main() {
  // Retrieve <canvas> element
  const canvas: HTMLElement = document.getElementById('renderCanvas');

  // Get the rendering context for WebGL
  const gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  const shaderProgram = initShaderProgram(gl, VSHADER_SOURCE, FSHADER_SOURCE)
  if (!shaderProgram) {
    console.error('Failed to initialize shaders.');
    return;
  }
  gl.useProgram(shaderProgram);
  // Set clear color
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.POINTS, 0, 1);
}

window.addEventListener('DOMContentLoaded', () => {{
    main();
}});

// Util functions
const initShaderProgram = (gl: WebGLRenderingContext, vsSource: string, fsSource: string): WebGLProgram => {
  const vShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vShader);
  gl.attachShader(shaderProgram, fShader);
  gl.linkProgram(shaderProgram);

  const linked = gl.getProgramParameter(shaderProgram, gl.LINK_STATUS);
  if (!linked) {
    console.error(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`);
    return null;
  }
  gl.useProgram(shaderProgram);
  //gl.program = shaderProgram;
  return shaderProgram;
};

const loadShader = (gl: WebGLRenderingContext, type: GLenum, source: string): WebGLShader => {
  const shader = gl.createShader(type);

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(`An error occured compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
    gl.deleteShader(shader);
    return null;
  }
  return shader;
};

function getWebGLContext(canvas: HTMLElement) {
  // Get the rendering context for WebGL
  const gl = (canvas as HTMLCanvasElement).getContext('webgl');
  console.log(gl);
  return gl;
}
