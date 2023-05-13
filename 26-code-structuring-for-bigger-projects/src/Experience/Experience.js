import * as THREE from "three"

//Setup
import Sizes from "./Utils/Sizes"
import Time from "./Utils/Time"
import Renderer from "./Renderer"
import sources from "./sources"
import Debug from "./Utils/Debug"

//Cameras
import Camera from "./Camera"

//World
import World from "./World/World"
import Resources from "./Utils/Resources"



let instance = null



export default class Experience {
    constructor(canvas) {

        if(instance) {
            return instance
        }

        instance = this

        //Global Access
        window.experience = this

        //Options
        this.canvas = canvas

        /**
         * Setup
         */
        this.debug = new Debug()
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.resources = new Resources(sources)
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.world = new World()


        //Sizes resize event
        this.sizes.on("resize", () => {
            this.resize()
        })

        //Time tick event
        this.time.on("tick", () => {
            this.update()
        })


        
    }

    resize() {
        this.camera.resize()
        this.renderer.resize()
    }

    update() {
        this.camera.update()
        this.world.update()
        this.renderer.update()
    }


    //Better a destroy method on every class
    destroy() {
        this.sizes.off("resize")
        this.time.off("tick")

        //Traverse Scene
        this.scene.traverse((child) => {
            if(child instanceof THREE.Mesh){
                child.geometry.dispose()

                for(const key in child.material) {
                    const value = child.material[key]

                    if(value && typeof value.dispose === "function") {
                        value.dispose()
                    }
                }
            }
        })

        this.camera.controls.dispose()
        this.renderer.instance.dispose()

        if(this.debug.active){
            this.debug.ui.destroy()
        }
    }

}