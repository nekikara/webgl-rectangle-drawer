import { GraphicsContext } from "./graphicsContext";
import { Canvas } from "./canvas";
import { Beam } from "./building-blocks/beam";
import { ShaderPairs } from "./shaderPairs";
import {Pin} from "./building-blocks/pin";
import { Roller } from "./building-blocks/roller";
import {ConcentratedLoad} from "./building-blocks/concentratedLoad";

type RenderingData = {
    shaderSetName: string,
    vertices: Float32Array,
    indices: Uint8Array,
    groupId: number,
};
type Material = "beam" | "pin" | "roller" | "load";
type DB = Map<Material, RenderingData>;

export class SimpleBeam {
    static draw(canvas: HTMLCanvasElement): void {
        const simpleBeam = new SimpleBeam(canvas, 1, 5, 5);
        requestAnimationFrame((timestamp: number) => {simpleBeam.listen(timestamp)});
    }

    private readonly _gc: GraphicsContext;
    private readonly _db: DB = new Map();
    private readonly _order: Material[];
    readonly texture: WebGLTexture;
    readonly renderbuffer: WebGLRenderbuffer;
    readonly framebuffer: WebGLFramebuffer;
    readonly offscreenLoc: WebGLUniformLocation;
    readonly pickingColorLoc: WebGLUniformLocation;
    readonly objectColorLoc: WebGLUniformLocation;
    readonly vertexBuffer: WebGLBuffer;
    readonly indexBuffer: WebGLBuffer;
    private _clicked: number | null;

    constructor(canvas: HTMLCanvasElement, power: number, l: number, r: number) {
        const cvs = new Canvas(canvas.width, canvas.height);
        const shaderPairs = ShaderPairs.select(['fulfill']);
        this._gc = GraphicsContext.create(canvas, shaderPairs);
        const gl = this._gc.gl;

        // Initialize buffers for vertex and indices
        this.vertexBuffer = this._gc.createBuffer();
        this.indexBuffer = this._gc.createBuffer();

        // Prepare for clickable building blocks
        const shader = this._gc.getShader('fulfill');
        gl.useProgram(shader);
        gl.clearDepth(100);
        gl.enable(gl.DEPTH_TEST);
        this.offscreenLoc = gl.getUniformLocation( shader, 'uOffscreen' );
        this.pickingColorLoc = gl.getUniformLocation( shader, 'uPickingColor' );
        this.objectColorLoc = gl.getUniformLocation( shader, 'uObjectColor' );

        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, cvs.width, cvs.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

        this.renderbuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderbuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, cvs.width, cvs.height);

        this.framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.renderbuffer);

        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        canvas.onmousedown = (e: MouseEvent) => {
            const readout = new Uint8Array(4);
            const pos = this.get2DCoords(e, canvas);
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
            gl.readPixels(pos.x, pos.y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, readout);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            this._clicked =  this.getRenderingID(readout);
        };

        // Initialize building blocks
        const beam = new Beam(cvs, l, r);
        const pin = new Pin(cvs, beam.leftEdge, 0.5, 3);
        const roller = new Roller(cvs, beam.rightEdge, 0.5, 3);
        const load = new ConcentratedLoad(cvs, power);

        // Set to rendering data
        this._db.set('beam', this.getRenderingData(beam, 1));
        this._db.set('pin', this.getRenderingData(pin, 1));
        this._db.set('roller', this.getRenderingData(roller, 1));
        this._db.set('load', this.getRenderingData(load, 2));
        this._order = ['beam', 'pin', 'roller', 'load'];
    }

    draw(): void {
        this._gc.clearBackgroundColor();

        const gl = this._gc.gl;
        this._order.forEach((order: Material, index: number) => {
            const data = this._db.get(order);
            const shaderProgram = this._gc.getShader(data.shaderSetName);
            this._gc.useProgram(shaderProgram);
            gl.uniform4fv(this.pickingColorLoc, this.extractGroupID(data.groupId));
            if ( data.groupId == this._clicked ) {
                gl.uniform4fv(this.objectColorLoc, [0.8, 0.8, 0.8, 1.0]);
            } else {
                gl.uniform4fv(this.objectColorLoc, [0, 0, 0, 1.0]);
            }
            // Bind vertices
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, data.vertices, gl.STATIC_DRAW);
            this._gc.enableVertexAttribArray(shaderProgram, 'aVertexPosition');
            // Bind indices
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data.indices, gl.STATIC_DRAW);
            this._gc.drawElements(data.indices.length, 0);
            // Unbind vertices and indices
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        });
    }

    render(): void {
        const gl = this._gc.gl;
        // Custom Framebuffer is set
        // Off-screen rendering
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        gl.uniform1i(this.offscreenLoc, 1);
        this.draw();

        // Default Framebuffer is set
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.uniform1i(this.offscreenLoc, 0);
        this.draw();
    }

    listen(t: number): void {
        this.render();
        requestAnimationFrame((x: number) => {this.listen(x)})
    }

    private getRenderingData(building: any, groupId: number): RenderingData {
        return {
            shaderSetName: building.shaderName(),
            vertices: new Float32Array(building.vertices()),
            indices: new Uint8Array(building.indices()),
            groupId
        }
    }
    private extractGroupID(groupId: number): number[] {
        let id = groupId;
        let color = [];
        for (let i=0; i < 4; i++) {
            color.unshift((id % 255) / 255);
            id = Math.floor(id / 255);
        }
        return color;

    }
    private get2DCoords(event: MouseEvent, canvasOrigin: HTMLCanvasElement) {
        let top = 0,
            left = 0,
            canvas = canvasOrigin as HTMLElement;

        while (canvas && canvas.tagName !== 'BODY') {
            top += canvas.offsetTop;
            left += canvas.offsetLeft;
            canvas = canvas.offsetParent as HTMLElement;
        }

        left += window.pageXOffset;
        top -= window.pageYOffset;

        return {
            x: event.clientX - left,
            y: canvasOrigin.height - (event.clientY - top)
        };
    }

    private getRenderingID(position: Uint8Array): number {
        return position[0] * Math.pow(255, 3) +
            position[1] * Math.pow(255, 2) +
            position[2] * Math.pow(255, 1) +
            position[3];
    }
}
