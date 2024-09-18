import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer, RenderPass, EffectPass } from "postprocessing";
import { ASCII } from '/ascii.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
	powerPreference: "high-performance",
	antialias: false,
	stencil: false,
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const asciiEffect = new ASCII({ 
    fontSize: 80, 
    cellSize: 5,
    invert: false, 
    color: "#00ff00", 
    characters: ` .-^=*+?0#X%WM@`
});

let composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new EffectPass(camera, asciiEffect));

const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
scene.add( directionalLight );
directionalLight.position.set(0,0,2)
const light = new THREE.AmbientLight(0xffffff, 2);
scene.add(light);
camera.position.z = 1.5;
const loader = new GLTFLoader();
let model;


loader.load(
	'ordiAxro.glb',

	function ( gltf ) {
        model = gltf.scene;
        model.traverse((object) => {
            if (object.isMesh) {
                object.material = new THREE.MeshStandardMaterial({
                    color: 0xffffff, 
                    metalness: 0.5,
                    roughness: 1
                });
            }
        });
        scene.add(model);
        animate();
	},
	function ( xhr ) {
		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
	},
	function ( error ) {
		console.log( 'An error happened' );
	}
    
);

function animate() {
    requestAnimationFrame(animate);
    composer.render(scene, camera);
    if (model) {
        model.rotation.z += 0.01
    }
}


window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    composer.setSize(window.innerWidth, window.innerHeight);
});