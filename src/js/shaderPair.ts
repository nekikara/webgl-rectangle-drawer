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
void main() {
  gl_FragColor = vec4(0., 0., 0., 1.);
}
        `
    }
};

export const triangleFulFillPair = (): ShaderPair => {
    return {
        name: 'triangle-fulfill',
        vShader: `
attribute vec4 aVertexPosition;
void main() {
  gl_Position = aVertexPosition;
}
        `,
        fShader: `
precision mediump float;
void main() {
  gl_FragColor = vec4(1., 0., 0., 1.);
}
        `
    }
};
