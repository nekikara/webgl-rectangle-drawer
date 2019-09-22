import '../scss/main.scss';

function getWebGLContext(canvas: HTMLElement) {
  // Get the rendering context for WebGL
  const gl = (canvas as HTMLCanvasElement).getContext('webgl');
  console.log(gl);
  return gl;
}

function main() {
  // Retrieve <canvas> element
  const canvas: HTMLElement = document.getElementById('renderCanvas');

  // Get the rendering context for WebGL
  const gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Set clear color
  gl.clearColor(0.5, 0.5, 0.9, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}

window.addEventListener('DOMContentLoaded', () => {{
    main();
}});
