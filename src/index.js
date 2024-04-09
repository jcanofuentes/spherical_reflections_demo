import * as THREE from 'three';

class CameraControls {
    constructor(camera, renderDomElement) {
        this.camera = camera;
        this.domElement = renderDomElement;

        // Initial state
        this.targetRotationX = 0;
        this.targetRotationY = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.rotationX = 0;
        this.rotationY = 0;
        this.initialCameraPosition = camera.position.clone();

        // Constants for control
        this.rotationFactor = 0.04;
        this.inertiaFactor = 0.005;

        // Binding this context
        this.onMouseMove = this.onMouseMove.bind(this);

        // Adding event listeners
        this.addEventListeners();
    }

    addEventListeners() {
        this.domElement.addEventListener('mousemove', this.onMouseMove, false);
    }

    onMouseMove(event) {
        this.mouseX = (event.clientX - window.innerWidth / 2);
        this.mouseY = (event.clientY - window.innerHeight / 2);
    }

    update() {
        const targetRotationX = this.mouseX * this.rotationFactor - this.rotationX;
        const targetRotationY = this.mouseY * this.rotationFactor - this.rotationY;

        this.rotationX += targetRotationX * this.inertiaFactor;
        this.rotationY += targetRotationY * this.inertiaFactor;

        // Apply the calculated rotation to the camera
        this.camera.position.x = this.initialCameraPosition.x + this.rotationX;
        this.camera.position.y = this.initialCameraPosition.y - this.rotationY; // Inverting Y-axis movement
        this.camera.lookAt(new THREE.Vector3()); // Ensure the camera is still looking at the center
    }
}

// Assuming these imports are correctly configured in your Webpack setup
const posx = require('./textures/cube/city/posx.jpg');
const negx = require('./textures/cube/city/negx.jpg');
const posy = require('./textures/cube/city/posy.jpg');
const negy = require('./textures/cube/city/negy.jpg');
const posz = require('./textures/cube/city/posz.jpg');
const negz = require('./textures/cube/city/negz.jpg');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Instantiate camera controls
const cameraControls = new CameraControls(camera, renderer.domElement);

camera.position.z = 2.5;

// Load the cube map, then create and add the sphere
loadCubeMapFromJPG().then(cubeTexture => {
    createLitReflectiveSphere(cubeTexture);
    animate();
});

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);


function animate() {
    requestAnimationFrame(animate);
    cameraControls.update(); // Update camera position based on mouse movement 
    renderer.render(scene, camera);
}

animate();


// Adjusted function to return a Promise that resolves with the cube texture
function loadCubeMapFromJPG() {
    console.log("HDR Loading reflection map");
    const urls = [posx, negx, posy, negy, posz, negz];
    
    return new Promise((resolve, reject) => {
        new THREE.CubeTextureLoader().load(urls, (cubeTexture) => {
            console.log("Reflection Cube Loaded");
            resolve(cubeTexture);
        });
    });
}

// Lights setup
const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(1, 1, -1);
scene.add(directionalLight);

// Function to create a sphere with a reflective and lit material
function createLitReflectiveSphere(cubeTexture) {
    const sphereGeometry = new THREE.SphereGeometry(2, 128, 128);
    const sphereMaterial = new THREE.MeshPhongMaterial({
        color: 0xff0000,
        emissive: 0x001100,
        specular: 0x555555,
        shininess: 255,
        envMap: cubeTexture, // Cube map for reflections
        combine: THREE.AddOperation, // How the envMap and texture color are combined
        reflectivity: 0.75 // Adjust the strength of the reflection
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);
}
