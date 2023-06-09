import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()



/**
 * Base
 */
// Debug
const gui = new dat.GUI()

const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Test sphere
 */
// const testSphere = new THREE.Mesh(
//     new THREE.SphereGeometry(1, 32, 32),
//     new THREE.MeshStandardMaterial()
// )
// scene.add(testSphere)

/**
 * Update all Materials
 */
const updateAllMaterials = () => {
    scene.traverse((child) => {
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            // child.material.envMap = environmentMap
            child.material.envMapIntensity = debugObject.envMapIntensity
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}


/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
    '/textures/environmentMaps/2/px.jpg',
    '/textures/environmentMaps/2/nx.jpg',
    '/textures/environmentMaps/2/py.jpg',
    '/textures/environmentMaps/2/ny.jpg',
    '/textures/environmentMaps/2/pz.jpg',
    '/textures/environmentMaps/2/nz.jpg'
])
environmentMap.encoding = THREE.sRGBEncoding
scene.background = environmentMap
scene.environment = environmentMap

debugObject.envMapIntensity = 3
gui.add(debugObject, 'envMapIntensity', 0, 20, 0.1).onChange(updateAllMaterials)


/**
 * Models
 */
gltfLoader.load("/models/FlightHelmet/glTF/FlightHelmet.gltf", (gltf) => {
    gltf.scene.scale.set(10, 10, 10)
    gltf.scene.position.set(0, -4, 0)
    gltf.scene.rotation.y = Math.PI * 0.5
    scene.add(gltf.scene)

    gui.add(gltf.scene.rotation, 'y').min(- Math.PI).max(Math.PI).step(0.1).name("rotation")

    updateAllMaterials()
})


/**
 * Lights
 */
const dirLight = new THREE.DirectionalLight('#fff', 3)
dirLight.position.set(0.25, 3, -2.25)
dirLight.castShadow = true
dirLight.shadow.camera.far = 10
dirLight.shadow.mapSize.set(1024,1024)
// dirLight.shadow.normalBias = 0.02
scene.add(dirLight)

// const dirLightCameraHelper = new THREE.CameraHelper(dirLight.shadow.camera)
// scene.add(dirLightCameraHelper)

gui.add(dirLight, 'intensity').min(0).max(10).step(0.05).name("Dir Light")
gui.add(dirLight.position, 'x', -5, 5, 0.05).name("Light X")
gui.add(dirLight.position, 'y', -5, 5, 0.05).name("Light Y")
gui.add(dirLight.position, 'z', -5, 5, 0.05).name("Light Z")


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
camera.position.set(4, 1, - 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//Set physically correct lights
renderer.physicallyCorrectLights = true

renderer.outputEncoding = THREE.sRGBEncoding

//Tone Mapping
renderer.toneMapping = THREE.NoToneMapping
// renderer.toneMapping = THREE.LinearToneMapping
// renderer.toneMapping = THREE.ReinhardToneMapping
// renderer.toneMapping = THREE.CineonToneMapping
// renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 3

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap

gui.add(renderer, 'toneMapping', {
    None: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping
})

gui.add(renderer, 'toneMappingExposure', 0, 10, 0.1).name('toneMapExp')




/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()