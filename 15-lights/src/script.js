import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

//Rectangle Area Light Helper
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper";

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
 * Lights
 */

//Ambient Light
const ambientLight = new THREE.AmbientLight();
ambientLight.color = new THREE.Color("#ffffff");
ambientLight.intensity = 0.2;
scene.add(ambientLight);

gui.add(ambientLight, "intensity", 0, 1, 0.1).name("Ambient Light");
gui.addColor(ambientLight, "color").name("AmbientLight Color");
gui.add(ambientLight, "isLight").name("AmbientLight On/Off");

//Directional Light
const directionalLight = new THREE.DirectionalLight("rgb(255, 240, 179)", 0.3);
directionalLight.position.set(1, 0.25, 0);
scene.add(directionalLight);

gui.add(directionalLight, "intensity", 0, 1, 0.1).name("Directional Light");
gui.addColor(directionalLight, "color").name("Dir.Light Color");
gui.add(directionalLight, "isLight").name("Dir.Light On/Off");

const directionalLightHelper = new THREE.DirectionalLightHelper(
    directionalLight,
    0.2
);
scene.add(directionalLightHelper);

//Hemisphere Light
const hemisphereLight = new THREE.HemisphereLight(
    "rgb(122, 155, 255)",
    "rgb(99, 38, 0)",
    0.3
);
scene.add(hemisphereLight);

gui.add(hemisphereLight, "intensity", 0, 1, 0.1).name("Hemisphere Light");
gui.addColor(hemisphereLight, "color").name("Hemisphere Color");
gui.addColor(hemisphereLight, "groundColor").name("Hemisphere groundColor");
gui.add(hemisphereLight, "isLight").name("Hemisphere On/Off");

const hemisphereLightHelper = new THREE.HemisphereLightHelper(
    hemisphereLight,
    0.2
);
scene.add(hemisphereLightHelper);

//Point Light
const pointLight = new THREE.PointLight("rgb(255, 227, 46)", 0.5, 5);
pointLight.position.set(1, 1, 1);
scene.add(pointLight);

gui.add(pointLight, "intensity", 0, 2, 0.1).name("PointLight");
gui.add(pointLight, "decay", 0, 10, 0.1).name("PointLight Decay");
gui.add(pointLight, "isLight").name("PointLight On/Off");

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
scene.add(pointLightHelper);

//Rectangular Area Light
const rectangularAreaLight = new THREE.RectAreaLight("#1d4eff", 2, 3, 3);
scene.add(rectangularAreaLight);

gui.add(rectangularAreaLight, "intensity", 0, 10, 0.1).name("RectArea Light");
gui.addColor(rectangularAreaLight, "color").name("RectArea Light Color");
gui.add(rectangularAreaLight, "isLight").name("RectArea Light On/Off");

rectangularAreaLight.position.set(-1.5, 0, 1.5);
rectangularAreaLight.lookAt(new THREE.Vector3());

const rectAreaLightHelper = new RectAreaLightHelper(rectangularAreaLight)
scene.add(rectAreaLightHelper)

//Spot Light
const spotLight = new THREE.SpotLight("#ff49ce", 1, 10, Math.PI * 0.1, 0.25, 1);
spotLight.position.set(0, 2, 3);
scene.add(spotLight, spotLight.target);

spotLight.position.x = 2;
spotLight.target.position.x = 0.5;

gui.add(spotLight, "intensity", 0, 5, 0.1).name("spotLight");
gui.add(spotLight, "distance", 0, 20, 0.25).name("spotLight Distance");
gui.add(spotLight, "angle", 0, Math.PI, 0.1).name("spotLight Angle");
gui.add(spotLight, "penumbra", 0, 1, 0.1).name("spotLight Penumbra");
gui.add(spotLight, "decay", 0, 10, 0.2).name("spotLight Decay");
gui.addColor(spotLight, "color").name("spotLight Color");
gui.add(spotLight, "isLight").name("spotLight On/Off");

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
);
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, torus, plane);

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
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
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
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime;
    cube.rotation.y = 0.1 * elapsedTime;
    torus.rotation.y = 0.1 * elapsedTime;

    sphere.rotation.x = 0.15 * elapsedTime;
    cube.rotation.x = 0.15 * elapsedTime;
    torus.rotation.x = 0.15 * elapsedTime;

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
