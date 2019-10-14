import { Display } from "../display";
import {Point} from "../glField";
import {Canvas} from "../canvas";

export class Roller {
    private readonly _centerGLX: Point;
    private readonly _centerGLY: Point;
    private readonly _bottomGLY: Point;
    private readonly _leftGLX: Point;
    private readonly _rightGLX: Point;
    private readonly _rollerTopGLY: Point;
    private readonly _rollerBottomGLY: Point;

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
        this._rollerTopGLY = this._bottomGLY - (this._centerGLY - this._bottomGLY) * 0.1;
        this._rollerBottomGLY = this._rollerTopGLY - (this._centerGLY - this._bottomGLY) * 0.15;

    }
    shaderName(): string {
        return 'fulfill';
    }
    vertices(): number[] {
        return [
            this._centerGLX, this._centerGLY,
            this._leftGLX, this._bottomGLY,
            this._rightGLX, this._bottomGLY,
            this._leftGLX, this._rollerTopGLY,
            this._leftGLX, this._rollerBottomGLY,
            this._rightGLX, this._rollerTopGLY,
            this._rightGLX, this._rollerBottomGLY,
        ];
    }
    indices(): number[] {
        return [
            0, 1, 2,
            3, 4, 5,
            5, 4, 6,
        ];
    }
}

