type Position = {
  x: number,
  y: number
}
const toRectPositions = (pos: Position[]): number[] => {
  const first = pos[0];
  const second = pos[1];
  const v = [first.x, first.y];
  v.push(first.x);
  v.push(second.y);
  v.push(second.x);
  v.push(first.y);
  v.push(second.x);
  v.push(second.y);
  return v;
};
let positions: Position[] = [];
let vs: number[] = [];
export const drawPoints = (ev: MouseEvent, gl: WebGLRenderingContext, canvas: HTMLCanvasElement, program: WebGLProgram) => {
  const rect = canvas.getBoundingClientRect() as DOMRect;
  const glX = ((ev.clientX - rect.x) - (rect.width / 2)) / (rect.width / 2);
  const glY = -((ev.clientY - rect.y) - (rect.height / 2)) / (rect.height / 2);
  positions.push({x: glX, y: glY});
  if (positions.length % 2 !== 0) {
    return;
  }
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  vs = vs.concat(toRectPositions(positions));
  positions = [];
  const vertices = new Float32Array(vs);
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

  for (let i=0; i < (vertices.length / 8); i++) {
    gl.drawArrays(gl.TRIANGLE_STRIP, i * 4, 4);
  }
};
