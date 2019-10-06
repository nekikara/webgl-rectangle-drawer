export class Beam {
    static default(): Beam {
        return new Beam();
    }

    private _shaderName: string;
    constructor() {
        this._shaderName = 'fulfil';
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
    get rightX(): number {
        return 300.0;
    }
    get rightY(): number {
        return 190.0;
    }
}

