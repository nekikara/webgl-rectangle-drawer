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

void main() {
  gl_FragColor = vec4(0., 0., 0., 1.);
}
`;

export class Beam {
    static default(): Beam {
        return new Beam(VSHADER_SOURCE, FSHADER_SOURCE);
    }

    vShader: string;
    fShader: string;

    constructor(vShader: string, fShader: string) {
        this.vShader = vShader;
        this.fShader = fShader;
    }

    get leftX(): number {
        return 100.0;
    }
    get leftY(): number {
        return 210.0;
    }
    get rightX(): number {
        return 300.0;
    }
    get rightY(): number {
        return 190.0;
    }
}

