function main() {
    const canvas = document.getElementById("renderCanvas");
    const engine = new BABYLON.Engine(canvas, false, {depth: true, stencil: true});

    const createScene = () => {
        const scene = new BABYLON.Scene(engine);

        const camera = new BABYLON.UniversalCamera("Camera", new BABYLON.Vector3(0, 20, 0), scene);
        camera.setTarget(BABYLON.Vector3.Zero());

        // Light
        const light1 = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(100, 1000, 1000), scene);

        // Shape
        const ground = BABYLON.MeshBuilder.CreateGround("ground1", {width: 100, height: 100}, scene);
        ground.material = new BABYLON.StandardMaterial('groundMat', scene);
        ground.material.diffuseColor = new BABYLON.Color3(0.9, 0.5, 0.5);
        ground.material.alpha = 0.0;

        let leftTopClicked = null;
        let rectCount = 0;
        scene.onPointerDown = (evt, pickInfo) => {
            if (leftTopClicked) {
                const rightBottomClicked = pickInfo.pickedPoint;
                const width = Math.abs(rightBottomClicked.x - leftTopClicked.x);
                const height = Math.abs(rightBottomClicked.z - leftTopClicked.z);

                const drawing = BABYLON.MeshBuilder.CreateGround(`rect${rectCount}`, {width, height}, scene);
                drawing.material = new BABYLON.StandardMaterial(`rect${rectCount}Mat`, scene);
                drawing.material.diffuseColor = new BABYLON.Color3(0.9, 0.2, 0.2);
                drawing.position = leftTopClicked.add(rightBottomClicked).divide(new BABYLON.Vector3(2, 2, 2));
                rectCount += 1;
                leftTopClicked = null;
            } else {
                leftTopClicked = pickInfo.pickedPoint;
            }
        };

        let rect;
        scene.onPointerMove = () => {
            const pInfo = scene.pick(scene.pointerX, scene.pointerY);
            if (pInfo.hit && leftTopClicked) {
                if (rect) {
                    rect.dispose();
                }
                const rightBottomClicked = pInfo.pickedPoint;
                const width = Math.abs(rightBottomClicked.x - leftTopClicked.x);
                const height = Math.abs(rightBottomClicked.z - leftTopClicked.z);

                rect = BABYLON.MeshBuilder.CreateGround('disc', {width, height}, scene);
                rect.material = new BABYLON.StandardMaterial('discMat', scene);
                rect.material.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.9);
                rect.position = leftTopClicked.add(rightBottomClicked).divide(new BABYLON.Vector3(2, 2, 2));
            }
        };

        return scene;
    };

    const scene = createScene();
    engine.runRenderLoop(() => {
        scene.render();
    });

    window.addEventListener('resize', () => {
        engine.resize();
    });
}

window.addEventListener('DOMContentLoaded', () => {{
    main();
}});
