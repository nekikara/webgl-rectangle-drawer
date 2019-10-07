import { GraphicsContext } from "../graphicsContext";
import { Position } from "../position";

export class Pin {
    static default(position: Position): Pin {
        return new Pin(position);
    }

    private readonly _shaderName: string;
    private readonly _topCenter: Position;

    constructor(position: Position) {
        this._shaderName = 'triangle-fulfill';
        this._topCenter = position;
    }

    get shaderName(): string {
        return this._shaderName;
    }

    get centerX(): number {
        return this._topCenter.x;
    }
    get centerY(): number {
        return this._topCenter.y;
    }
    get leftX(): number {
        return this._topCenter.x - 12.5;
    }
    get rightX(): number {
        return this._topCenter.x + 12.5;
    }
    get bottomY(): number {
        return this._topCenter.y - 25;
    }

    private positionsOnGL(canvasSize: {width: number, height: number}): number[] {
        const w = canvasSize.width;
        const h = canvasSize.height;
        const cX = (this.centerX - (w / 2)) / (w / 2);
        const cY = (this.centerY - (h / 2)) / (h / 2);
        const lglX = (this.leftX - (w / 2)) / (w / 2);
        const lglY = (this.bottomY - (h / 2)) / (h / 2);
        const rglX = (this.rightX - (w / 2)) / (w / 2);
        const rglY = (this.bottomY - (h / 2)) / (h / 2);
        return [
            cX, cY,
            lglX, lglY,
            rglX, rglY,
        ];
    }

    draw(gc: GraphicsContext): void {
        const shaderProgram = gc.getShader(this.shaderName);
        gc.useProgram(shaderProgram);
        const pos = this.positionsOnGL(gc.canvasSize());
        const buffer = gc.bindBufferData(new Float32Array(pos));
        const posIndex = gc.enableVertexAttribArray(shaderProgram, 'aVertexPosition');
        gc.drawArrays(0, 3);
        gc.deleteBuffer(buffer);
        gc.disableVertexAttribArray(posIndex);
    }
}

