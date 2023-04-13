import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from "lil-gui"


/**
 * GUI
 */
const panel = new dat.GUI()

/**
 * Textures
 */

const textureLoader = new THREE.TextureLoader()
const envLoader = new THREE.CubeTextureLoader()

const doorColorTexture = textureLoader.load("/textures/door/color.jpg")
const doorTexture = textureLoader.load("/textures/door/color.jpg")
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg")
const doorAmbientOcclusionTexture = textureLoader.load("/textures/door/ambientOcclusion.jpg")
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg")
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg")
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg")
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg")

const matcapTexture = textureLoader.load("/textures/matcaps/1.png")
const gradientTexture = textureLoader.load("/textures/gradients/5.jpg")

const envMapTexture = envLoader.load([
    "/textures/environmentMaps/0/px.jpg",
    "/textures/environmentMaps/0/nx.jpg",
    "/textures/environmentMaps/0/py.jpg",
    "/textures/environmentMaps/0/ny.jpg",
    "/textures/environmentMaps/0/pz.jpg",
    "/textures/environmentMaps/0/nz.jpg",
])


/**
 * Material
 */

//Mesh Basic Material

// const basicMaterial = new THREE.MeshBasicMaterial({
//     map: doorColorTexture
// })
const basicMaterial = new THREE.MeshBasicMaterial()
basicMaterial.map = doorColorTexture
basicMaterial.color.set("#882bad")
basicMaterial.wireframe = false
basicMaterial.opacity = 1
basicMaterial.transparent = true
basicMaterial.alphaMap = doorAlphaTexture
basicMaterial.side = THREE.DoubleSide


//Mesh Normal Material
const normalMaterial = new THREE.MeshNormalMaterial()
normalMaterial.wireframe = false
normalMaterial.flatShading = false

//Mesh Matcap Material
const matcapMaterial = new THREE.MeshMatcapMaterial()
matcapMaterial.matcap = matcapTexture
matcapMaterial.side = THREE.DoubleSide

//Mesh Depth Material
const depthMaterial = new THREE.MeshDepthMaterial()

//Mesh Lambert Material
const lambertMaterial = new THREE.MeshLambertMaterial()

//Mesh Phong Material
const phongMaterial = new THREE.MeshPhongMaterial()
phongMaterial.shininess = 1000
phongMaterial.specular = new THREE.Color(0xff0000)

//Mesh Toon Material
const toonMaterial = new THREE.MeshToonMaterial()
gradientTexture.magFilter = THREE.NearestFilter
gradientTexture.generateMipmaps = false
toonMaterial.gradientMap = gradientTexture

//Mesh Standar Material
// const standarMaterial = new THREE.MeshStandardMaterial()
// standarMaterial.wireframe = false
// standarMaterial.metalness = 0
// standarMaterial.roughness = 1
// standarMaterial.map = doorColorTexture
// standarMaterial.side = THREE.DoubleSide
// standarMaterial.aoMap = doorAmbientOcclusionTexture
// standarMaterial.aoMapIntensity = 1
// standarMaterial.displacementMap = doorHeightTexture
// standarMaterial.displacementScale = 0.1
// standarMaterial.metalnessMap = doorMetalnessTexture
// standarMaterial.roughnessMap = doorRoughnessTexture
// standarMaterial.normalMap = doorNormalTexture
// standarMaterial.normalScale.set(0.4, 0.4)
// standarMaterial.alphaMap = doorAlphaTexture
// standarMaterial.transparent = true

const standarMaterial = new THREE.MeshStandardMaterial()
standarMaterial.wireframe = false
standarMaterial.metalness = 0.7
standarMaterial.roughness = 0.2
standarMaterial.envMap = envMapTexture

panel.add(standarMaterial, "metalness", 0, 1, 0.05)
panel.add(standarMaterial, "roughness", 0, 1, 0.05)
panel.add(standarMaterial, "side", 0, 2, 1)
panel.add(standarMaterial, "aoMapIntensity", 0, 1, 0.1)
panel.add(standarMaterial, "wireframe")
panel.add(standarMaterial, "displacementScale", 0, 2, 0.02)
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5,32,32),
    standarMaterial
)

sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array,2))
sphere.position.x = -1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1,1, 100, 100),
    standarMaterial
)
plane.geometry.setAttribute("uv2", new THREE.BufferAttribute(plane.geometry.attributes.uv.array,2))

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.4,0.1,32,64),
    standarMaterial
)
torus.position.x = 1.5

torus.geometry.setAttribute("uv2", new THREE.BufferAttribute(torus.geometry.attributes.uv.array,2))

scene.add(sphere, plane, torus)

console.log(plane)


/**
 * Lights
 */

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.4)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //Update Objects
    sphere.rotation.y = 0.1 * elapsedTime
    plane.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime
    
    // sphere.rotation.x = 0.15 * elapsedTime
    // plane.rotation.x = 0.15 * elapsedTime
    // torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()