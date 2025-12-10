// Setup
import * as THREE from 'three';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 1.5, 6);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(5, 10, 7);
scene.add(light);

// Create random cubes
const cubes = [];

for (let i = 0; i < 20; i++) {
    const width = Math.random() * 0.8 + 0.3;
    const height = Math.random() * 0.8 + 0.3;
    const depth = Math.random() * 0.8 + 0.3;

    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(Math.random(), Math.random(), Math.random())
    });

    const cube = new THREE.Mesh(geometry, material);

    cube.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 10
    );

    cube.userData.size = { width, height, depth };

    scene.add(cube);
    cubes.push(cube);
}

// Raycasting
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const infoPanel = document.getElementById("infoPanel");

let selectedCube = null;
let originalColor = null;

function onClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const hits = raycaster.intersectObjects(cubes);

    if (hits.length > 0) {
        const cube = hits[0].object;

        // revert previous
        if (selectedCube) selectedCube.material.color.set(originalColor);

        originalColor = cube.material.color.getHex();
        cube.material.color.set(0xffff00);
        selectedCube = cube;

        const pos = cube.position;
        const size = cube.userData.size;

        infoPanel.innerHTML = `
            <b>Cube Selected</b><br>
            Position:<br>
            x: ${pos.x.toFixed(2)}, y: ${pos.y.toFixed(2)}, z: ${pos.z.toFixed(2)}<br><br>
            Size:<br>
            w: ${size.width.toFixed(2)}, 
            h: ${size.height.toFixed(2)}, 
            d: ${size.depth.toFixed(2)}
        `;
    } else {
        if (selectedCube) selectedCube.material.color.set(originalColor);
        selectedCube = null;
        infoPanel.innerHTML = "No object selected.";
    }
}

window.addEventListener("click", onClick);

// Render loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
