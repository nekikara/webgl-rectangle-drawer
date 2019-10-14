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

    get width(): number {
        return this._canvas.width;
    }
    get height(): number {
        return this._canvas.height;
    }
    get gl(): WebGLRenderingContext {
        return this._gl;
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
        return this.bindBuffer(this._gl.ARRAY_BUFFER, vertices);
    }
    bindIndexBufferData(indices: Uint8Array): WebGLBuffer  {
        return this.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, indices);
    }
    bindBuffer(type: number, data: Float32Array | Uint8Array | null): WebGLBuffer | null {
        const buffer = this.createBuffer();
        if (buffer) {
            this._gl.bindBuffer(type, buffer);
            this._gl.bufferData(type, data, this._gl.STATIC_DRAW);
            return buffer;
        }
        return null;
    }
    createBuffer(): WebGLBuffer {
        const buffer = this._gl.createBuffer();
        if (!buffer) {
            console.error('Failed to create the index buffer object');
            return;
        }
        return buffer;
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
    drawElements(n: number, offset: number) {
        this._gl.drawElements(this._gl.TRIANGLES, n, this._gl.UNSIGNED_BYTE, offset);
    }
    clearBackgroundColor(): void {
        this._gl.clearColor(0.5, 0.5, 0.5, 1.0);
        this._gl.clear(this._gl.COLOR_BUFFER_BIT);
    }
}
