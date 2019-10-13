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

    private _gl: WebGLRenderingContext;
    private _canvas: HTMLCanvasElement;
    private _shaderPrograms: ShaderPrograms;

    constructor(canvas: HTMLCanvasElement, gl: WebGLRenderingContext, shaderPairs: ShaderPairs) {
        this._canvas = canvas;
        this._gl = gl;
        this._shaderPrograms = shaderPairs.pairs.reduce((acc: ShaderPrograms, sp: ShaderPair) => {
            acc.set(sp.name, utils.initShaderProgram(this._gl, sp.vShader, sp.fShader));
            return acc;
        }, (new Map() as ShaderPrograms));
    }

    getShader(shaderName: string): WebGLProgram {
        return this._shaderPrograms.get(shaderName);
    }

    useProgram(program: WebGLProgram): void {
        this._gl.useProgram(program);
    }

    canvasSize(): {width: number, height: number} {
        return {
            width: this._canvas.width,
            height: this._canvas.height,
        }
    }

    bindBufferData(vertices: Float32Array): WebGLBuffer {
        const vertexBuffer = this._gl.createBuffer();
        if (!vertexBuffer) {
            console.error('Failed to create the buffer object');
            return;
        }
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, vertexBuffer);
        this._gl.bufferData(this._gl.ARRAY_BUFFER, vertices, this._gl.STATIC_DRAW);
        return vertexBuffer;
    }
    deleteBuffer(buffer: WebGLBuffer): void {
        this._gl.deleteBuffer(buffer);
    }
    enableVertexAttribArray(program: WebGLProgram, name: string): GLuint {
        const aAttribPosition = this._gl.getAttribLocation(program, name);
        if (aAttribPosition < 0) {
            console.error('Failed to get the storage location of a_Position');
            return;
        }
        this._gl.vertexAttribPointer(aAttribPosition, 2, this._gl.FLOAT, false, 0, 0);
        this._gl.enableVertexAttribArray(aAttribPosition);
        return aAttribPosition;
    }
    disableVertexAttribArray(index: GLuint): void {
        this._gl.disableVertexAttribArray(index);
    }

    drawArrays(first: number, count: number) {
        this._gl.drawArrays(this._gl.TRIANGLE_STRIP, first, count);
    }

    clearBackgroundColor(): void {
        this._gl.clearColor(0.5, 0.5, 0.5, 1.0);
        this._gl.clear(this._gl.COLOR_BUFFER_BIT);
    }
}
