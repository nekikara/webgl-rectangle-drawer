import { Canvas } from "../canvas";
import { Point } from "../glField";
import { Display } from "../display";

export class Pin {
    private readonly _centerGLX: Point;
    private readonly _centerGLY: Point;
    private readonly _bottomGLY: Point;
    private readonly _leftGLX: Point;
    private readonly _rightGLX: Point;

    constructor(cvs: Canvas, center: Display.Position, rateW: number ,rateH: number) {
        const leftX = center.x - (cvs.unitL * rateW / 2);
        const rightX = center.x + (cvs.unitL * rateW / 2);
        const bottomY = (cvs.center.y - (cvs.unitH * rateH));
        const halfW = cvs.width / 2;
        const halfH = cvs.height / 2;
        this._centerGLX = (center.x - halfW) / halfW;
        this._centerGLY = (center.y - halfH) / halfH;
        this._bottomGLY = (bottomY - halfH) / halfH;
        this._leftGLX = (leftX - halfW) / halfW;
        this._rightGLX = (rightX - halfW) / halfW;

    }
    shaderName(): string {
        return 'fulfill';
    }
    vertices(): number[] {
        return [
            this._centerGLX, this._centerGLY,
            this._leftGLX, this._bottomGLY,
            this._rightGLX, this._bottomGLY,
        ];
    }
    indices(): number[] {
        return [0, 1, 2];
    }
}

