import { GraphicsContext } from "./graphicsContext";
import { Beam } from "./building-blocks/beam";
import { ShaderPairs } from "./shaderPairs";
import {Pin} from "./building-blocks/pin";
import { Roller } from "./building-blocks/roller";
import {ContentratedLoad} from "./building-blocks/contentratedLoad";

export class SimpleBeam {
    static draw(canvas: HTMLCanvasElement): void {
        const shaderPairs = ShaderPairs.select(['fulfill']);
        const gc = GraphicsContext.create(canvas, shaderPairs);
        gc.clearBackgroundColor();
        const beam = Beam.default();
        beam.draw(gc);

        const pin = Pin.default(beam.leftBottom);
        pin.draw(gc);

        const roller = Roller.default(beam.rightBottom);
        roller.draw(gc);

        const load = ContentratedLoad.default(beam.centerTop);
        load.draw(gc);
        requestAnimationFrame(() => {this.draw(canvas)});
    }
}
