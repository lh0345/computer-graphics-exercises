import * as THREE from 'https://unpkg.com/three@0.163.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.163.0/examples/jsm/controls/OrbitControls.js';
import GUI from 'https://unpkg.com/lil-gui@0.18.0/dist/lil-gui.esm.min.js';

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
document.body.appendChild(renderer.domElement);

// Scene + camera
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x20232a);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(6, 4, 8);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1, 0);
controls.update();

// Floor (plane)
const floorGeo = new THREE.PlaneGeometry(30, 30);
const floorMat = new THREE.MeshStandardMaterial({ color: 0x808080, roughness: 0.9, metalness: 0.05 });
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Geometries
const geometries = new THREE.Group();

// 1. Box - lambert (matte)
const boxGeo = new THREE.BoxGeometry(1.6, 1.6, 1.6);
const boxMat = new THREE.MeshLambertMaterial({ color: 0xd32f2f }); // red
const box = new THREE.Mesh(boxGeo, boxMat);
box.position.set(-3, 0.8, 0);
box.castShadow = true;
geometries.add(box);

// 2. Sphere - phong (shiny)
const sphereGeo = new THREE.SphereGeometry(0.95, 32, 24);
const sphereMat = new THREE.MeshPhongMaterial({ color: 0x1976d2, shininess: 80 }); // blue
const sphere = new THREE.Mesh(sphereGeo, sphereMat);
sphere.position.set(0, 0.95, -1.5);
sphere.castShadow = true;
geometries.add(sphere);

// 3. TorusKnot - standard (metallic)
const knotGeo = new THREE.TorusKnotGeometry(0.6, 0.18, 120, 16);
const knotMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32, metalness: 0.7, roughness: 0.25 }); // green
const knot = new THREE.Mesh(knotGeo, knotMat);
knot.position.set(2.5, 1.2, 1.5);
knot.castShadow = true;
geometries.add(knot);

scene.add(geometries);

// Lights
// 1. Directional light (sun-like)
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(5, 10, 7);
dirLight.castShadow = true;
dirLight.shadow.mapSize.set(1024, 1024);
dirLight.shadow.camera.left = -10;
dirLight.shadow.camera.right = 10;
dirLight.shadow.camera.top = 10;
dirLight.shadow.camera.bottom = -10;
scene.add(dirLight);

// 2. Point light (warm fill)
const pointLight = new THREE.PointLight(0xffcc88, 0.7, 25);
pointLight.position.set(-4, 5, -3);
scene.add(pointLight);

// Helper small ambient
const ambient = new THREE.AmbientLight(0x404040, 0.6);
scene.add(ambient);

// GUI controls
const gui = new GUI({ width: 300 });
const lightFolder = gui.addFolder('Lights');
const params = {
  directionalIntensity: dirLight.intensity,
  pointIntensity: pointLight.intensity,
  ambientIntensity: ambient.intensity,
  shadows: true,
  background: '#20232a'
};

lightFolder.add(params, 'directionalIntensity', 0, 2, 0.01).name('Directional').onChange(v => dirLight.intensity = v);
lightFolder.add(params, 'pointIntensity', 0, 2, 0.01).name('Point').onChange(v => pointLight.intensity = v);
lightFolder.add(params, 'ambientIntensity', 0, 2, 0.01).name('Ambient').onChange(v => ambient.intensity = v);
lightFolder.add(params, 'shadows').name('Shadows').onChange(enabled => {
  renderer.shadowMap.enabled = enabled;
  dirLight.castShadow = enabled;
  pointLight.castShadow = enabled;
  [box, sphere, knot].forEach(m => m.castShadow = enabled);
  floor.receiveShadow = enabled;
});
lightFolder.open();

gui.addColor(params, 'background').name('BG Color').onChange(hex => scene.background.set(hex));

// Shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Make lights cast shadows where relevant
dirLight.castShadow = true;
pointLight.castShadow = true;

// Simple animation loop
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();
  // rotate objects slowly
  box.rotation.y = 0.4 * t;
  sphere.position.y = 0.95 + Math.sin(t * 1.6) * 0.15;
  knot.rotation.x = 0.6 * t;

  renderer.render(scene, camera);
}

animate();

// Resize handling
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
