const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.setZ(30);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// 🌌 Generate Galaxy
function generateGalaxy() {
  const geometry = new THREE.BufferGeometry();
  const count = 10000;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  const insideColor = new THREE.Color('#ff6030');
  const outsideColor = new THREE.Color('#1b3984');

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const radius = Math.random() * 50;
    const spinAngle = radius * 0.1;
    const branchAngle = ((i % 5) / 5) * Math.PI * 2;

    const randomX = Math.pow(Math.random(), 2) * (Math.random() < 0.5 ? 1 : -1);
    const randomY = Math.pow(Math.random(), 2) * (Math.random() < 0.5 ? 1 : -1);
    const randomZ = Math.pow(Math.random(), 2) * (Math.random() < 0.5 ? 1 : -1);

    positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    positions[i3 + 1] = randomY * 5;
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

    const mixedColor = insideColor.clone();
    mixedColor.lerp(outsideColor, radius / 50);
    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.05,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);
}
generateGalaxy(); // ✅ Must call it!

// 🌀 Add spinning torus
const torusGeometry = new THREE.TorusGeometry(10, 3, 16, 100);
const torusMaterial = new THREE.MeshStandardMaterial({ color: 0x00ffff });
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
scene.add(torus);

// 💡 Lighting
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(20, 20, 20);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// 🌟 Add stars
const stars = [];
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const color = new THREE.Color(`hsl(${Math.random() * 360}, 100%, 70%)`);
  const material = new THREE.MeshStandardMaterial({ color });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
  stars.push(star);
}
Array(200).fill().forEach(addStar);

// 🌀 Animation
function animate() {
  requestAnimationFrame(animate);

  // Torus rotation
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  // Twinkling stars
  stars.forEach((star) => {
    const t = Date.now() * 0.001 + star.position.x;
    const intensity = 0.5 + 0.5 * Math.sin(t);
    star.material.emissive = star.material.color.clone().multiplyScalar(intensity);
  });

  renderer.render(scene, camera);
}
animate();
