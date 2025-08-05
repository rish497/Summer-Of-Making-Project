const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});

camera.position.setZ(30);

// Add a spinning torus
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0x00ffff });
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

// Add light
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(20, 20, 20);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Add stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const color = new THREE.Color(`hsl(${Math.random() * 360}, 100%, 70%)`);
  const material = new THREE.MeshStandardMaterial({ color });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
}
scene.children.forEach(obj => {
  if (obj.isMesh && obj.geometry.type === 'SphereGeometry') {
    obj.material.emissiveIntensity = 0.5 + 0.5 * Math.sin(Date.now() * 0.001 + obj.position.x);
  }
});


// Animation
function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  renderer.render(scene, camera);
}
animate();
