import { GraphicsContext } from "./graphicsContext";
import { Beam } from "./building-blocks/beam";
import { ShaderPairs } from "./shaderPairs";

export class SimpleBeam {
    static draw(canvas: HTMLCanvasElement): void {
        const shaderPairs = ShaderPairs.select(['fulfil']);
        const gc = GraphicsContext.create(canvas, shaderPairs);
        const beam = Beam.default();
        gc.draw(beam);
    }
}
