import * as ShaderPair from "./shaderPair";

type ShaderPairName = string;
export class ShaderPairs {
    static select(shaderNames: ShaderPairName[]): ShaderPairs {
        const pairs = [
            ShaderPair.fulfillPair(),
        ].filter((shaderPair: ShaderPair.ShaderPair) => {
            const result = shaderNames.indexOf(shaderPair.name);
            return result !== -1;
        });
        return new ShaderPairs(pairs);
    }

    private _pairs: ShaderPair.ShaderPair[];

    constructor(shaderPairs: ShaderPair.ShaderPair[]) {
        this._pairs = shaderPairs;
    }
    get pairs(): ShaderPair.ShaderPair[] {
        return this._pairs;
    }
}
