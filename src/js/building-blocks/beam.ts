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
  
  rst = rst * 2. - 1.;
  
  float r = .09;
  float len = length( max(abs(rst) - ( 0.99 - r ), 0.) );
  vec3 background = vec3( smoothstep(r - 0.02, r, len) * smoothstep(r + 0.02, r, len) );
  
  gl_FragColor = vec4(background, 1.);
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

