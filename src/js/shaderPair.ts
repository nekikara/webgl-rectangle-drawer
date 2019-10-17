export type ShaderPair = {
    name: string,
    vShader: string,
    fShader: string
};

export const fulfillPair = (): ShaderPair => {
    return {
        name: 'fulfill',
        vShader: `
attribute vec4 aVertexPosition;
void main() {
  gl_Position = aVertexPosition;
}
        `,
        fShader: `
precision mediump float;
uniform vec4 uPickingColor;
uniform vec4 uObjectColor;
uniform bool uOffscreen;
void main() {
  if (uOffscreen) {
    gl_FragColor = uPickingColor;
  } else {
    gl_FragColor = uObjectColor;
  }
}
        `
    }
};
