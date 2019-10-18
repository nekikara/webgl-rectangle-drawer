import {Canvas} from "./canvas";

test("Initialize a Canvas object", () => {
    const canvas = new Canvas(100, 100);
    expect(canvas.center).toEqual({x: 50, y: 50});
});

