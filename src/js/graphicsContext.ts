import {utils} from "./utils";
import {Beam} from "./building-blocks/beam";

type Position = {
    x: number,
    y: number
};
type Vertices = Float32Array;
const toRectPositions = (pos: Position[]): Vertices => {
    const first = pos[0];
    const second = pos[1];
    const v = [first.x, first.y];
    v.push(first.x);
    v.push(second.y);
    v.push(second.x);
    v.push(first.y);
    v.push(second.x);
    v.push(second.y);
    return new Float32Array(v);
};
export class GraphicsContext {
    static create(canvas: HTMLCanvasElement): GraphicsContext {
        // Get the rendering context for WebGL
        const gl = utils.getWebGLContext(canvas);
        if (!gl) {
            console.log('Failed to get the rendering context for WebGL');
            return;
        }
        return new GraphicsContext(canvas, gl);
    }

    private _gl: WebGLRenderingContext;
    private _canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement, gl: WebGLRenderingContext) {
        this._canvas = canvas;
        this._gl = gl;
    }

    draw(beam: Beam): void {
        this.clearBackgroundColor();
        const shaderProgram = utils.initShaderProgram(this._gl, beam.vShader, beam.fShader);
        if (!shaderProgram) {
            console.error('Failed to initialize shaders.');
            return;
        }
        this._gl.useProgram(shaderProgram);

        const uResolutionPosition = this._gl.getUniformLocation(shaderProgram, 'uResolution');
        this._gl.uniform2f(uResolutionPosition, this._canvas.width, this._canvas.height);

        const vertexBuffer = this._gl.createBuffer();
        if (!vertexBuffer) {
            console.error('Failed to create the buffer object');
            return;
        }
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, vertexBuffer);
        const vertices = this.mapToVertices(beam);
        this._gl.bufferData(this._gl.ARRAY_BUFFER, vertices, this._gl.STATIC_DRAW);

        const a_Position = this._gl.getAttribLocation(shaderProgram, 'aVertexPosition');
        if (a_Position < 0) {
            console.error('Failed to get the storage location of a_Position');
            return;
        }
        this._gl.vertexAttribPointer(a_Position, 2, this._gl.FLOAT, false, 0, 0);
        this._gl.enableVertexAttribArray(a_Position);

        this._gl.drawArrays(this._gl.TRIANGLE_STRIP, 0, 4);
    }

    clearBackgroundColor(): void {
        this._gl.clearColor(0.5, 0.5, 0.5, 1.0);
        this._gl.clear(this._gl.COLOR_BUFFER_BIT);
    }
    private mapToVertices(beam: Beam): Vertices {
        const rect = this._canvas.getBoundingClientRect() as DOMRect;
        const lglX = (beam.leftX - (rect.width / 2)) / (rect.width / 2);
        const lglY = (beam.leftY - (rect.height / 2)) / (rect.height / 2);
        const leftPosition: Position = {x: lglX, y: lglY};
        const rglX = (beam.rightX - (rect.width / 2)) / (rect.width / 2);
        const rglY = (beam.rightY - (rect.height / 2)) / (rect.height / 2);
        const rightPosition: Position = {x: rglX, y: rglY};
        return toRectPositions([leftPosition, rightPosition]);
    }
}
