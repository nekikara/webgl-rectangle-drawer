import {utils} from "./utils";
import {ShaderPairs} from "./shaderPairs";
import {ShaderPair} from "./shaderPair";

type ShaderPrograms = Map<string, WebGLProgram>;
export class GraphicsContext {
    static create(canvas: HTMLCanvasElement, shaderPairs: ShaderPairs): GraphicsContext {
        // Get the rendering context for WebGL
        const gl = utils.getWebGLContext(canvas);
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        if (!gl) {
            console.log('Failed to get the rendering context for WebGL');
            return;
        }
        return new GraphicsContext(canvas, gl, shaderPairs);
    }

    readonly gl: WebGLRenderingContext;
    private _shaderPrograms: ShaderPrograms;

    constructor(canvas: HTMLCanvasElement, gl: WebGLRenderingContext, shaderPairs: ShaderPairs) {
        this.gl = gl;
        this._shaderPrograms = shaderPairs.pairs.reduce((acc: ShaderPrograms, sp: ShaderPair) => {
            acc.set(sp.name, utils.initShaderProgram(this.gl, sp.vShader, sp.fShader));
            return acc;
        }, (new Map() as ShaderPrograms));
    }
    getShader(shaderName: string): WebGLProgram {
        return this._shaderPrograms.get(shaderName);
    }

    useProgram(program: WebGLProgram): void {
        this.gl.useProgram(program);
    }
    createBuffer(): WebGLBuffer {
        const buffer = this.gl.createBuffer();
        if (!buffer) {
            console.error('Failed to create the index buffer object');
            return;
        }
        return buffer;
    }
    enableVertexAttribArray(program: WebGLProgram, name: string): GLuint {
        const aAttribPosition = this.gl.getAttribLocation(program, name);
        if (aAttribPosition < 0) {
            console.error('Failed to get the storage location of a_Position');
            return;
        }
        this.gl.vertexAttribPointer(aAttribPosition, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(aAttribPosition);
        return aAttribPosition;
    }
    drawElements(n: number, offset: number) {
        this.gl.drawElements(this.gl.TRIANGLES, n, this.gl.UNSIGNED_BYTE, offset);
    }
    clearBackgroundColor(): void {
        this.gl.clearColor(0.5, 0.5, 0.5, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }
}
