function main() {
    const canvas = document.getElementById("glCanvas");
    canvas.width = 640;
    canvas.height = 480;
    const canvasRect = canvas.getBoundingClientRect();
    const halfCanvasX = canvas.width / 2;
    const halfCanvasY = canvas.height / 2;

    // Add the event listener for mousemove
    canvas.addEventListener('mousemove', e => {
        const canvasX = e.clientX - canvasRect.x;
        const canvasY = e.clientY - canvasRect.y;

        const glX = (canvasX - halfCanvasX) / halfCanvasX;
        const glY = -1 * (canvasY - halfCanvasY) / halfCanvasY;
    });

    const gl = canvas.getContext('webgl');

    if (gl === null) {
        alert("Unable to initialize WebGL.");
        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 0.3);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

main();