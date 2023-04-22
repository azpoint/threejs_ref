import * as THREE from 'three'
import * as dat from 'lil-gui'
import gsap from 'gsap'


/**
 * Debug
 */
const gui = new dat.GUI()

const parameters = {
    materialColor: '#69b5cc'
}

gui
    .addColor(parameters, 'materialColor')
    .onChange(() => {
        meshMaterial.color.set(parameters.materialColor)
    })

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')
gradientTexture.magFilter = THREE.NearestFilter


/**
 * Materials
 */
const meshMaterial = new THREE.MeshToonMaterial({
    color: parameters.materialColor,
    gradientMap: gradientTexture
})


/**
 * Meshes
 */
const objectDistance = 4
const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    meshMaterial
)

const mesh2 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    meshMaterial
)

const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    meshMaterial
)

mesh1.position.y = - objectDistance * 0
mesh2.position.y = - objectDistance * 1
mesh3.position.y = - objectDistance * 2

mesh1.position.x = 2
mesh2.position.x = -2
mesh3.position.x = 2


scene.add(mesh1, mesh2, mesh3)

const sectionMeshes = [mesh1, mesh2, mesh3]


/**
 * Particles
 */
const particlesCount = 200
const positions = new Float32Array(particlesCount * 3)

for(let i = 0; i < particlesCount; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = objectDistance * 0.5 - Math.random() * objectDistance * sectionMeshes.length
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

//Particles Material
const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation: true,
    size: 0.02
})

//Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)



/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#fff',0.85)
directionalLight.position.set(1,1,0)
scene.add(directionalLight)



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
//Camera Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)



// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,

})
//Set alpha value of the background renderer
renderer.setClearAlpha(0)
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


/**
 * Scroll
 */
let scrollValue = window.scrollY
let currentSection = 0

window.addEventListener('scroll', () => {
    scrollValue = window.scrollY

    const newSection = Math.round(scrollY / sizes.height)  

    if(newSection != currentSection) {
        currentSection = newSection
    }

    gsap.to(
        sectionMeshes[currentSection].rotation, {
            duration: 1.5,
            ease: 'power2.inOut',
            x: '+=6',
            y: '+=3'
        }
    )
})

/**
 * Cursor
 */
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width
    cursor.y = event.clientY / sizes.height
})


/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    //Animate Camera
    camera.position.y = - scrollValue / sizes.height * objectDistance

    const parallaxX = cursor.x
    const parallaxY = - cursor.y

    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * 0.1
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * 0.1

    //Animate meshes
    for(const mesh of sectionMeshes) {
        mesh.rotation.x += deltaTime * 0.1
        mesh.rotation.y += deltaTime * 0.15
    }



    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()