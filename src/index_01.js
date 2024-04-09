import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

loadCubeMapFromJPG();

camera.position.z = 5;

function loadCubeMapFromJPG()
{
    console.log("HDR Cargando mapa de reflexion");
    const urls = [
        require('./textures/cube/city/posx.jpg'),
        require('./textures/cube/city/negx.jpg'),
        require('./textures/cube/city/posy.jpg'),
        require('./textures/cube/city/negy.jpg'),
        require('./textures/cube/city/posz.jpg'),
        require('./textures/cube/city/negz.jpg'),
    ];
    console.log(urls);
    const reflectionCube = new THREE.CubeTextureLoader().load( urls, function ()
    {
        console.log("Reflection Cube Loaded");
    } );
}

//import exampleTexture from './textures/PS_Albedo_1024.png';  // Import the texture
//const cube = createSimpleCube();
function createSimpleCube() {
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(exampleTexture); // Use the imported texture
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ /*color: 0x00ff00*/ map: texture });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    return cube;
}

function animate() {
    requestAnimationFrame(animate);
    /*     
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    */
    renderer.render(scene, camera);
}

animate();