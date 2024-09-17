import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { mod } from 'three/webgpu';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add ambient light
const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
scene.add( directionalLight );
directionalLight.position.set(-1,1,1)
const light = new THREE.AmbientLight(0xffffff, 0.2); // soft white light
scene.add(light);

// Set camera position
camera.position.z = 2.3;
const loader = new GLTFLoader();
let model;
loader.load(
	'ordiAxro.glb',

	function ( gltf ) {
        model = gltf.scene;
        model.traverse((object) => {
            if (object.isMesh) {
                // Replace the material with a custom one
                object.material = new THREE.MeshStandardMaterial({
                    color: 0x00ff00, // Red color for the mesh
                    metalness: 0.5,
                    roughness: 0.5
                });
            }
        });

        scene.add(model);
        animate();
	},
	// called while loading is progressing
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}
    
);
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    if (model) {
        model.rotation.y +=0.005;
    }
}