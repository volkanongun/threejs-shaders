import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

import nebula from '../img/nebula.jpg';

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(10, 5, 10);
orbit.update();

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const uniforms = {
    u_time : {
        type: 'f',
        value: 0.0
    },
    u_resolution : {
        type: 'v2',
        value: new THREE.Vector2(window.innerWidth, window.innerHeight).multiplyScalar(window.devicePixelRatio)
    },
    u_mousePos : {
        type: 'v2',
        value: new THREE.Vector2(0,0)
    },
    image : {
        type: 't',
        value: new THREE.TextureLoader().load(nebula)
    }
}

window.addEventListener('mousemove', function(e){
    uniforms.u_mousePos.value.set(e.screenX / window.innerWidth,1-e.screenY/window.innerHeight)
})

const planeGeometry = new THREE.PlaneGeometry(10,10,30,30)
const planeMaterial = new THREE.ShaderMaterial({
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent,
    // wireframe: true,
    uniforms: uniforms
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(plane)
plane.rotation.x = -.5 * Math.PI
plane.receiveShadow = true

const pointLight = new THREE.PointLight(0xFFFFFF, 2, 300);
scene.add(pointLight);

const clock = new THREE.Clock()

function animate() {
    uniforms.u_time.value = clock.getElapsedTime()
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});