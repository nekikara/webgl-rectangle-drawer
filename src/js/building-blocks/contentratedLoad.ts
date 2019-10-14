import { GraphicsContext } from "../graphicsContext";
import { Position } from "../display";

export class ContentratedLoad {
    static default(position: Position): ContentratedLoad {
        return new ContentratedLoad(position);
    }

    private readonly _shaderName: string;
    private readonly _actionPosition: Position;

    constructor(position: Position) {
        this._shaderName = 'fulfill';
        this._actionPosition = position;
    }

    get shaderName(): string {
        return this._shaderName;
    }

    get centerX(): number {
        return this._actionPosition.x;
    }
    get centerY(): number {
        return this._actionPosition.y;
    }
    get headLeftX(): number {
        return this._actionPosition.x - 6.5;
    }
    get headRightX(): number {
        return this._actionPosition.x + 6.5;
    }
    get headY(): number {
        return this._actionPosition.y + 11;
    }
    get shaftLeftX(): number {
        return this._actionPosition.x - 2.0;
    }
    get shaftRightX(): number {
        return this._actionPosition.x + 2.0;
    }
    get shaftTailY(): number {
        return this.headY + 70;
    }

    private positionsOnGL(canvasSize: {width: number, height: number}): number[] {
        const w = canvasSize.width;
        const h = canvasSize.height;
        const cX = (this.centerX - (w / 2)) / (w / 2);
        const cY = (this.centerY - (h / 2)) / (h / 2);

        const hlX = (this.headLeftX - (w / 2)) / (w / 2);
        const hrX = (this.headRightX - (w / 2)) / (w / 2);
        const hY = (this.headY - (h / 2)) / (h / 2);

        const slX = (this.shaftLeftX - (w / 2)) / (w / 2);
        const srX = (this.shaftRightX - (w / 2)) / (w / 2);
        const sY = (this.shaftTailY - (h / 2)) / (h /2 );

        return [
            cX, cY,
            hlX, hY,
            hrX, hY,
            slX, hY,
            slX, sY,
            srX, hY,
            srX, sY,
        ];
    }

    draw(gc: GraphicsContext): void {
        const shaderProgram = gc.getShader(this.shaderName);
        gc.useProgram(shaderProgram);
        const pos = this.positionsOnGL(gc.canvasSize());
        const buffer = gc.bindBufferData(new Float32Array(pos));
        const posIndex = gc.enableVertexAttribArray(shaderProgram, 'aVertexPosition');
        gc.drawArrays(0, 3);
        gc.drawArrays(3, 4);
        gc.deleteBuffer(buffer);
        gc.disableVertexAttribArray(posIndex);
    }
}

