import { Canvas } from "../canvas";
import {Point} from "../glField";

export class ConcentratedLoad {
    private readonly _arrowTopGLX: Point;
    private readonly _arrowTopGLY: Point;
    private readonly _arrowLeftGLX: Point;
    private readonly _arrowRightGLX: Point;
    private readonly _arrowBottomGLY: Point;
    private readonly _shaftBottomGLY: Point;
    private readonly _shaftLeftGLX: Point;
    private readonly _shaftRightGLX: Point;


    constructor(cvs: Canvas, power: number) {
        const arrowW = cvs.unitH;
        const actionPosition = cvs.center;
        const leftX = actionPosition.x - arrowW / 1.5;
        const rightX = actionPosition.x + arrowW / 1.5;
        const arrowBottomY = actionPosition.y + arrowW;
        const shaftBottomY = actionPosition.y + cvs.unitH * power * 5;
        const halfW = cvs.width / 2;
        const halfH = cvs.height / 2;
        this._arrowTopGLX = (actionPosition.x - halfW) / halfW;
        this._arrowTopGLY = (actionPosition.y - halfH) / halfH;
        this._arrowLeftGLX = (leftX - halfW) / halfW;
        this._arrowRightGLX = (rightX - halfW) / halfW;
        this._arrowBottomGLY = (arrowBottomY - halfH) / halfH;
        this._shaftLeftGLX = ((actionPosition.x - arrowW / 4) - halfW) / halfW;
        this._shaftRightGLX = ((actionPosition.x + arrowW / 4) - halfW) / halfW;
        this._shaftBottomGLY = (shaftBottomY - halfH) / halfH;
    }

    shaderName(): string {
        return 'fulfill';
    }
    vertices(): number[] {
        return [
            this._arrowTopGLX, this._arrowTopGLY, // 0
            this._arrowLeftGLX, this._arrowBottomGLY, // 1
            this._arrowRightGLX, this._arrowBottomGLY, // 2
            this._shaftLeftGLX, this._arrowBottomGLY, // 3
            this._shaftLeftGLX, this._shaftBottomGLY, // 4
            this._shaftRightGLX, this._arrowBottomGLY, // 5
            this._shaftRightGLX, this._shaftBottomGLY, // 6
        ];
    }
    indices(): number[] {
        return [
            0, 1, 2,
            3, 4, 5,
            5, 4, 6
        ];
    }
}

