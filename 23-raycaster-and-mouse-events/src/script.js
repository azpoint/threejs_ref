import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object1.position.x = -2;

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: "#ff0000" })
);

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object3.position.x = 2;

scene.add(object1, object2, object3);

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster();

// const rayOrigin = new THREE.Vector3(-3, 0, 0)
// const rayDirection = new THREE.Vector3(10, 0, 0)
// rayDirection.normalize()

// raycaster.set(rayOrigin,rayDirection)

// const intersect = raycaster.intersectObject(object2)
// const intersects = raycaster.intersectObjects([object1, object2, object3])

// console.log(intersects)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Mouse Position
 */
const mouse = new THREE.Vector2();

window.addEventListener("mousemove", (e) => {
    mouse.x = (e.clientX / sizes.width) * 2 - 1;
    mouse.y = -((e.clientY / sizes.height) * 2 - 1);
});

window.addEventListener("click", () => {
    if (currentIntersect) {
        if (currentIntersect.object === object1) {
            console.log("click on object 1");
        } else if (currentIntersect.object === object2) {
            console.log("click on object 2");
        } else if (currentIntersect.object === object3) {
            console.log("click on object 3");
        }
    }
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Model
 */
const gltfLoader = new GLTFLoader();

let duckModel = null;

gltfLoader.load("/models/Duck/glTF-Binary/Duck.glb", (gltf) => {
    duckModel = gltf.scene;
    duckModel.position.y = -1.2;
    scene.add(duckModel);
});

/**
 * Lights
 */

const ambientLight = new THREE.AmbientLight("#fff", 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight("#fff", 0.8);
dirLight.position.set(1, 2, 3);
scene.add(dirLight);

/**
 * Animate
 */
const clock = new THREE.Clock();

let currentIntersect = null;

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    //Animate Objects
    object1.position.y = Math.sin(elapsedTime * 3);
    object2.position.y = Math.sin(elapsedTime * 2.8);
    object3.position.y = Math.sin(elapsedTime * 2.4);

    //Cast a ray
    //Cast ray from camera
    raycaster.setFromCamera(mouse, camera);

    // const rayOrigin = new THREE.Vector3(-3, 0, 0)
    // const rayDirection = new THREE.Vector3(1, 0, 0)
    // rayDirection.normalize()

    // raycaster.set(rayOrigin, rayDirection)

    const objectsToTest = [object1, object2, object3];
    const intersects = raycaster.intersectObjects(objectsToTest);

    for (const object of objectsToTest) {
        object.material.color.set("#e92e2e");
    }

    for (const intersect of intersects) {
        intersect.object.material.color.set("#252acb");
    }

    if (intersects.length) {
        if (currentIntersect === null) {
            console.log("mouse enter");
        }

        currentIntersect = intersects[0];
    } else {
        if (currentIntersect) {
            console.log("mouse leave");
        }

        currentIntersect = null;
    }

    //Intersect Model
    if (duckModel) {
        const modelIntersects = raycaster.intersectObject(duckModel);

        if(modelIntersects.length) {
            duckModel.scale.set(1.2,1.2,1.2)
        } else {
            duckModel.scale.set(1,1,1)
        }
    }

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
