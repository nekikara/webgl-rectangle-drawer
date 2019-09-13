function main() {
    const canvas = document.getElementById("renderCanvas");
    const engine = new BABYLON.Engine(canvas, true);

    const createScene = () => {
        const scene = new BABYLON.Scene(engine);

        const camera = new BABYLON.UniversalCamera("Camera", new BABYLON.Vector3(0, 10, 0), scene);
        camera.setTarget(BABYLON.Vector3.Zero());


        // Light
        const light1 = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(100, 1000, 1000), scene);

        // Shape
        const ground = BABYLON.MeshBuilder.CreateGround("ground1", {width: 10, height: 5}, scene);
        ground.material = new BABYLON.StandardMaterial('groundMat', scene);
        ground.material.diffuseColor = new BABYLON.Color3(0.9, 0.5, 0.5);

        scene.onPointerMove = (evt, pickInfo, type) => {
            console.log(scene.pointerX, scene.pointerY);
            const pInfo = scene.pick(scene.pointerX, scene.pointerY);
            console.log(pInfo);
        };
        console.log('camera', camera.getWorldMatrix());

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
