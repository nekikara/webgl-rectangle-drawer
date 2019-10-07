import { GraphicsContext } from "./graphicsContext";
import { Beam } from "./building-blocks/beam";
import { ShaderPairs } from "./shaderPairs";
import {Pin} from "./building-blocks/pin";

export class SimpleBeam {
    static draw(canvas: HTMLCanvasElement): void {
        const shaderPairs = ShaderPairs.select(['fulfil', 'triangle-fulfill']);
        const gc = GraphicsContext.create(canvas, shaderPairs);
        gc.clearBackgroundColor();
        const beam = Beam.default();
        beam.draw(gc);

        const pin = Pin.default(beam.leftBottom);
        pin.draw(gc);
    }
}
