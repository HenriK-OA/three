import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const directionalLight = new THREE.DirectionalLight( 0xffffff, 100 );
scene.add( directionalLight );
directionalLight.position.set(-1,-0.5,1)
const light = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(light);
camera.position.z = 2.3;
const loader = new GLTFLoader();
let model;


loader.load(
	'ordiAxro.glb',

	function ( gltf ) {
        model = gltf.scene;
        model.traverse((object) => {
            if (object.isMesh) {
                object.material = new THREE.MeshStandardMaterial({
                    color: 0x00ff00, 
                    metalness: 1,
                    roughness: 0.1
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
    renderer.render(scene, camera);
    if (model) {
        model.rotation.y +=0.005;
    }
}


window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});