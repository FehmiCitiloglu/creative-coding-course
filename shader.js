// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");


// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const Random = require('canvas-sketch-util/random')
const canvasSketch = require("canvas-sketch");
const glsl = require('glslify')

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
  renderer.setClearColor("#fff", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(0, 0, -4);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  // const geometry = new THREE.TorusGeometry(1, 0.5, 32, 16);
  const geometry = new THREE.SphereGeometry(1, 32, 16);

  const baseGeom = new THREE.IcosahedronGeometry(1, 1);

  const points = baseGeom.vertices;


  const vertexShader = /* glsl */`
    varying vec2 vUv;
    varying vec3 vPosition;
    void main () {
      vPosition = position;
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz, 1.0);
    }
  `

  const fragmentShader = glsl( /* glsl */`
      #define PI 3.14
 
      #pragma glslify: noise = require('glsl-noise/simplex/3d');
      varying vec2 vUv;
      uniform vec3 color;
      uniform float time;
      varying vec3 vPosition;

      uniform vec3 points[POINT_COUNT];

      void main() {
        float dist = 10000.0;

        for(int i = 0; i < POINT_COUNT; İ++){
          vec3 p = points[i];
          float d = distance(vPosition, p);
          dist = min(d, dist);
        }

        gl_FragColor = vec4(vec3(dist), 1.0);
      }
  `)

  console.log("points", points)
  // Setup a material
  const material = new THREE.ShaderMaterial({
    defines: {
      POINT_COUNT: points.length || 0,
    },
    uniforms: {
      points: { value: points },
      time: { value: 20 },
      color: {
        value: new THREE.Color("tomato")
      },
    },
    vertexShader,
    fragmentShader
  });

  // Setup a mesh with geometry + material
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

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
      material.uniforms.time.value = time;
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
