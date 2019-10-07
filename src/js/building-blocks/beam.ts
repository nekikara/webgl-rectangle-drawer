import { GraphicsContext } from "../graphicsContext";
import { Position } from "../position";

export class Beam {
    static default(): Beam {
        return new Beam();
    }
    static positions(lx: number, ly: number, rx: number, ry: number): number[] {
        return [
            lx, ly,
            lx, ry,
            rx, ly,
            rx, ry,
        ];
    };

    private readonly _shaderName: string;

    constructor() {
        this._shaderName = 'fulfill';
    }

    get shaderName(): string {
        return this._shaderName;
    }
    get leftX(): number {
        return 100.0;
    }
    get leftY(): number {
        return 210.0;
    }

    get leftBottom(): Position {
        return { x: this.leftX, y: this.rightY };
    }
    get rightX(): number {
        return 300.0;
    }
    get rightY(): number {
        return 190.0;
    }

    private positionsOnGL(canvasSize: {width: number, height: number}): number[] {
        const w = canvasSize.width;
        const h = canvasSize.height;
        const lglX = (this.leftX - (w / 2)) / (w / 2);
        const lglY = (this.leftY - (h / 2)) / (h / 2);
        const rglX = (this.rightX - (w / 2)) / (w / 2);
        const rglY = (this.rightY - (h / 2)) / (h / 2);
        return Beam.positions(lglX, lglY, rglX, rglY);
    }

    draw(gc: GraphicsContext): void {
        const shaderProgram = gc.getShader(this.shaderName);
        gc.useProgram(shaderProgram);
        const pos = this.positionsOnGL(gc.canvasSize());
        const buffer = gc.bindBufferData(new Float32Array(pos));
        const posIndex = gc.enableVertexAttribArray(shaderProgram, 'aVertexPosition');
        gc.drawArrays(0, 4);
        gc.deleteBuffer(buffer);
        gc.disableVertexAttribArray(posIndex);
    }
}

