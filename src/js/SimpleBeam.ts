import { GraphicsContext } from "./graphicsContext";
import { Beam } from "./building-blocks/beam";

export class SimpleBeam {
    static draw(canvas: HTMLCanvasElement): void {
        const gc = GraphicsContext.create(canvas);
        const beam = Beam.default();
        gc.draw(beam);
    }
}
