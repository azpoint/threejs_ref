import * as THREE from "three";
import gsap from "gsap"

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
    width: 800,
    height: 600,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

//Animation

//Time
// let time = Date.now()

// const frame = () => {
//     // Current Time
//     const currentTime = Date.now()
//     const deltaTime = currentTime - time
//     time = currentTime

//     // Update Objects
//     mesh.rotation.y += deltaTime * 0.0005

//     //Render
//     renderer.render(scene, camera);

//     window.requestAnimationFrame(frame);
// };

// frame();



//Clock Animation

// Clock
// const clock = new THREE.Clock()

// const frame = () => {
//     // Clock
//     const elapseTime = clock.getElapsedTime()

//     // console.log(elapseTime)

//     camera.position.y = Math.sin(elapseTime)
//     camera.position.x = -Math.cos(elapseTime)
//     // mesh.rotation.y = elapseTime * Math.PI * 2

//     camera.lookAt(mesh.position)

//     renderer.render(scene, camera)
//     window.requestAnimationFrame(frame)
// }

// frame()

// gsap Animation
gsap.to(mesh.position, { duration: 1, delay: 1, x: 1})
gsap.to(mesh.position, { duration: 1, delay: 2, x: 0})

const frame = () => {
    // Render
    renderer.render(scene, camera)

    // Call frame on the next frame
    window.requestAnimationFrame(frame)
}

frame()