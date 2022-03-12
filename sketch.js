// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");

const settings = {

  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl"
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // WebGL background color
  renderer.setClearColor("black", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 500);
  camera.position.set(3, 3, -5);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  const geometry = new THREE.SphereGeometry(1, 32, 16);

  const loader = new THREE.TextureLoader()
  const texture = loader.load("earth.jpg")
  const moonTexture = loader.load("moon.jpg")
 

  // Setup a material
  const material = new THREE.MeshStandardMaterial({
    roughness: 1,
    metalness: 0,
    map: texture,
  });

  // Setup a mesh with geometry + material
  const mesh = new THREE.Mesh(geometry, material);
  // mesh.scale.setScalar(3958.8)
  scene.add(mesh);


const moonMaterial = new THREE.MeshStandardMaterial({
  roughness: 1,
  metalness: 0,
  map: moonTexture,
});

  const moonGroup = new THREE.Group();
  const moonMesh = new THREE.Mesh(geometry, moonMaterial)
  moonMesh.position.set(1, 1, 0)
  moonMesh.scale.setScalar(0.25)
  moonGroup.add(moonMesh)
  scene.add(moonGroup)

  const light = new THREE.PointLight("white", 2)
  light.position.set(2, 2, 0)
  moonGroup.add(light);

  scene.add(new THREE.GridHelper(5, 50,"blue", "red"))
  scene.add(new THREE.PointLightHelper(light, 0.15))

  const axesHelper = new THREE.AxesHelper()
  scene.add(axesHelper)
  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ time }) {
      mesh.rotation.y = time * 0.25;
      moonMesh.rotation.y = time * 0.075;
      moonGroup.rotation.y = time * 0.5;
      controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
