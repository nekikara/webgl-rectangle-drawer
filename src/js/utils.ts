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

export const utils = {
  initShaderProgram,
  getWebGLContext
};
