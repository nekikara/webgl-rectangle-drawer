import { Display } from "./display";

export class Canvas {
    private _w: number;
    private _h: number;
    private _unitL: number;
    private _unitH: number;

    constructor(width: number, height: number) {
        this._w = width;
        this._h = height;
        this._unitL = this.calcUnitL();
        this._unitH = this.calcUnitH();
    }
    get center(): Display.Position {
        return {x: this._w / 2, y: this._h / 2};
    }
    get width(): number {
        return this._w;
    }
    get height(): number {
        return this._h;
    }
    get unitL(): number {
        return this._unitL;
    }
    get unitH(): number {
        return this._unitH;
    }
    private calcUnitL(): number {
        const tenLPre = 3 * this._w / 10;
        const tenL = tenLPre - (tenLPre % 10);
        return tenL / 10;
    }
    private calcUnitH(): number {
        const allUnitH = this._w / 100;
        return allUnitH - (allUnitH % 10);
    }
}
