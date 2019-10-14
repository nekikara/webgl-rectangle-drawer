import { GraphicsContext } from "./graphicsContext";
import { Canvas } from "./canvas";
import { Beam } from "./building-blocks/beam";
import { ShaderPairs } from "./shaderPairs";
import {Pin} from "./building-blocks/pin";
import { Roller } from "./building-blocks/roller";

type RenderingData = {
    shaderSetName: string,
    vertexBuffer: WebGLBuffer,
    vertices: Float32Array,
    indexBuffer: WebGLBuffer,
    indices: Uint8Array
};
type Material = "beam" | "pin" | "roller" | "load";
type DB = Map<Material, RenderingData>;

export class SimpleBeam {
    static draw(canvas: HTMLCanvasElement): void {
        const simpleBeam = new SimpleBeam(canvas, 1, 5, 5);
        requestAnimationFrame((timestamp: number) => {simpleBeam.render(timestamp)});
    }

    private readonly _gc: GraphicsContext;
    private readonly _db: DB = new Map();
    private readonly _order: Material[];
    power: number;
    constructor(canvas: HTMLCanvasElement, power: number, l: number, r: number) {
        this.power = power;
        const cvs = new Canvas(canvas.width, canvas.height);
        const shaderPairs = ShaderPairs.select(['fulfill']);
        this._gc = GraphicsContext.create(canvas, shaderPairs);
        const beam = new Beam(cvs, l, r);
        const pin = new Pin(cvs, beam.leftEdge, 0.5, 3);
        const roller = new Roller(cvs, beam.rightEdge, 0.5, 3);

        this._db.set('beam', this.getRenderingData(beam));
        this._db.set('pin', this.getRenderingData(pin));
        this._db.set('roller', this.getRenderingData(roller));
        this._order = ['beam', 'pin', 'roller'];
    }

    draw(): void {
        this._gc.clearBackgroundColor();
        const gl = this._gc.gl;
        this._order.forEach((order: Material) => {
            const data = this._db.get(order);
            const shaderProgram = this._gc.getShader(data.shaderSetName);
            this._gc.useProgram(shaderProgram);
            // Bind vertices
            gl.bindBuffer(gl.ARRAY_BUFFER, data.vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, data.vertices, gl.STATIC_DRAW);
            // Bind indices
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, data.indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data.indices, gl.STATIC_DRAW);
            this._gc.enableVertexAttribArray(shaderProgram, 'aVertexPosition');
            this._gc.drawElements(data.indices.length, 0);
            // Unbind vertices and indices
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        });
    }

    render(timestamp: number): void {
        this.draw();
        requestAnimationFrame((x: number) => {this.render(x)});
    }

    private getRenderingData(building: any): RenderingData {
        return {
            shaderSetName: building.shaderName(),
            vertexBuffer: this._gc.createBuffer(),
            vertices: new Float32Array(building.vertices()),
            indexBuffer: this._gc.createBuffer(),
            indices: new Uint8Array(building.indices()),
        }
    }
}
