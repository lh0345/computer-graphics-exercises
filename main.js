import * as THREE from 'three';

const scene = new THREE.Scene(); //scene constructor
scene.background = new THREE.Color(0x202020);

const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth/window.innerHeight, 0.1, 1000
);

camera.position.z = 10;

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);


const x = 0, y = 0;

const heartShape = new THREE.Shape();
heartShape.moveTo( x + 5, y + 5 );
heartShape.bezierCurveTo( x + 5, y + 5, x + 4, y, x, y );
heartShape.bezierCurveTo( x - 6, y, x - 6, y + 7,x - 6, y + 7 );
heartShape.bezierCurveTo( x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19 );
heartShape.bezierCurveTo( x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7 );
heartShape.bezierCurveTo( x + 16, y + 7, x + 16, y, x + 10, y );
heartShape.bezierCurveTo( x + 7, y, x + 5, y + 5, x + 5, y + 5 );
// const cubeMesh = new THREE.Mesh(geometry, material);
// scene.add(cubeMesh);

const light = new THREE.DirectionalLight(0xffffff,1);
light.position.set(2,2,5);
scene.add(light);

//Moving objects: x, y and z
// cubeMesh.position.x = 0.7
// cubeMesh.position.y = -0.6
// cubeMesh.position.z = 1
//console.log(cubeMesh.position.distanceTo(camera.position))
//cubeMesh.position.set(0.7, -0.6, 1);

//Axes Helper
const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper); //y-green, x-red, z-is blue but hidden because it is aligned with the camera

//Scaling objects
// cubeMesh.scale.x = 2
// cubeMesh.scale.y = 0.25
// cubeMesh.scale.z  = 0.5

//Rotation
// cubeMesh.rotation.x = Math.PI * 0.25
// cubeMesh.rotation.y = Math.PI * 0.25

//Combining transformations
// cubeMesh.position.x = 0.7
// cubeMesh.position.y = -0.6
// cubeMesh.position.z = 1
// cubeMesh.scale.x = 2
// cubeMesh.scale.y = 0.25
// cubeMesh.scale.z = 0.5
// cubeMesh.rotation.x = Math.PI * 0.25
// cubeMesh.rotation.y = Math.PI * 0.25

//Scene graph
const group = new THREE.Group();
group.scale.y = 2
group.rotation.y = 0.2
scene.add(group);

//Heart 1
const heartGeometry = new THREE.ExtrudeGeometry(heartShape, {
    depth: 2,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 2,
    bevelSize: 1,
    bevelThickness: 1
});

const heartShape1 = new THREE.Mesh(
    heartGeometry,
    new THREE.MeshStandardMaterial({color:0xff0000})
);
heartShape1.position.x = -1.5
group.add(heartShape1)

//Heart 2
const heartShape2 = new THREE.Mesh(
    heartGeometry.clone(),
    new THREE.MeshStandardMaterial({color:0xff0000})
);
heartShape2.position.x = 0
group.add(heartShape2)

//Heart 3
const heartShape3 = new THREE.Mesh(
    heartGeometry.clone(),
    new THREE.MeshStandardMaterial({color:0xff0000})
);
heartShape3.position.x = 1.5
group.add(heartShape3)


function animate(){
    requestAnimationFrame(animate);
    // Rotate the entire group of hearts
    group.rotation.x += 0.01;
    group.rotation.y += 0.01;
    renderer.render(scene,camera);
}

animate();