import { Canvas } from "../canvas";
import { Display } from "../display";
import { Point } from "../glField";

export class Beam {
    static positions(lx: number, ly: number, rx: number, ry: number): number[] {
        return [
            lx, ly,
            lx, ry,
            rx, ly,
            rx, ry,
        ];
    };

    private readonly _leftX: Display.Pixel;
    private readonly _rightX: Display.Pixel;
    private readonly _bottomY: Display.Pixel;

    private readonly _topGLY: Point;
    private readonly _bottomGLY: Point;
    private readonly _leftGLX: Point;
    private readonly _rightGLX: Point;

    constructor(cvs: Canvas, l: number, r: number) {
        this._leftX = cvs.center.x - (cvs.unitL * l);
        this._rightX = cvs.center.x + (cvs.unitL * r);
        this._bottomY = (cvs.center.y - cvs.unitH * 1.5);
        const halfW = cvs.width / 2;
        const halfH = cvs.height / 2;
        this._leftGLX = (this._leftX - halfW) / halfW;
        this._rightGLX = (this._rightX - halfW) / halfW;
        this._topGLY = (cvs.center.y - halfH) / halfH;
        this._bottomGLY = (this._bottomY - halfH) / halfH;
    }
    get leftEdge(): Display.Position {
        return {
            x: this._leftX,
            y: this._bottomY
        };
    }
    get rightEdge(): Display.Position {
        return {
            x: this._rightX,
            y: this._bottomY
        };
    }

    shaderName(): string {
        return 'fulfill';
    }
    vertices(): number[] {
        return Beam.positions(this._leftGLX, this._topGLY, this._rightGLX, this._bottomGLY);
    }
    indices(): number[] {
        return [0, 1, 2, 2, 1, 3];
    }
}

