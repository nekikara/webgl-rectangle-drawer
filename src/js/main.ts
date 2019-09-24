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
varying vec4 vColor;
void main() {
  gl_FragColor = vColor;
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

  const shaderProgram = initShaderProgram(gl, VSHADER_SOURCE, FSHADER_SOURCE);
  if (!shaderProgram) {
    console.error('Failed to initialize shaders.');
    return;
  }

  gl.useProgram(shaderProgram);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Register an click handler
  canvas.onclick = (ev) => drawPoints(ev, gl, canvas as HTMLCanvasElement, shaderProgram);
}

window.addEventListener('DOMContentLoaded', () => {{
  main();
}});

const positions: number[] = [];
const drawPoints = (ev: MouseEvent, gl: WebGLRenderingContext, canvas: HTMLCanvasElement, program: WebGLProgram) => {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  const rect = canvas.getBoundingClientRect() as DOMRect;
  const glX = ((ev.clientX - rect.x) - (rect.width / 2)) / (rect.width / 2);
  const glY = -((ev.clientY - rect.y) - (rect.height / 2)) / (rect.height / 2);
  positions.push(glX);
  positions.push(glY);
  const vertices = new Float32Array(positions);
  const vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.error('Failed to create the buffer object');
    return;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const a_Position = gl.getAttribLocation(program, 'aVertexPosition');
  if (a_Position < 0) {
    console.error('Failed to get the storage location of a_Position');
    return;
  }
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);
  gl.drawArrays(gl.TRIANGLES, 0, positions.length / 2);
};

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
