import * as THREE from "three";
import { createCamera } from "./camera";
import { addLights } from "./lights";
import { setupControls } from "./controls";
import { setupResize } from "./resize";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass";

function init(): void {
  const height = window.innerHeight;
  const width = window.innerWidth;
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const scene = new THREE.Scene();
  const camera = createCamera();
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
  renderer.setClearColor(0x000000, 1);

  addLights(scene);
  setupControls(camera, renderer);
  setupResize(camera, renderer);

  //  Postprocessing
  const composer = new EffectComposer(renderer);
  const ssaoPass = new SSAOPass(scene, camera, width, height);
  ssaoPass.kernelRadius = 0.25;
  ssaoPass.minDistance = 0.00001;
  ssaoPass.maxDistance = 0.01;
  ssaoPass.output = SSAOPass.OUTPUT.Default;
  composer.addPass(ssaoPass);

  const boxGroup = new THREE.Group();
  scene.add(boxGroup);

  const startPos = {
    x: -2,
    y: -2,
  };

  const geometry = new THREE.BoxGeometry();
  function getBox({
    hex = 0xff0000,
    size = 1,
    x = 0,
    y = 0,
    z = 0,
  }): THREE.Mesh {
    const color = new THREE.Color(hex);
    color.offsetHSL(0.6, 0, 0);
    const material = new THREE.MeshStandardMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.x = startPos.x + x;
    mesh.position.y = startPos.y + y;

    mesh.position.z = z + Math.random() * 0.001; //  Prevent z-fighting
    mesh.rotation.z = Math.PI * 0.25;
    mesh.scale.setScalar(size);

    return mesh;
  }

  function getBoxLayer({ z = 0, useRandomSize = false }): void {
    const palette = [0x2b2d42, 0x8d99ae, 0xedf2f4, 0xef233c, 0xd90429];
    const gridSize = 5;
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        const randomIndex = Math.floor(Math.random() * palette.length);
        const hex = palette[randomIndex];
        const size = useRandomSize ? Math.random() * 1.5 + 0.25 : 1.5;

        const box = getBox({ hex, size, x, y, z });
        boxGroup.add(box);
      }
    }
  }
  getBoxLayer({ z: 0 });
  getBoxLayer({ z: 1, useRandomSize: true });

  //  Animate
  function animateFrame(): void {
    requestAnimationFrame(animateFrame);
    composer.render();
  }
  animateFrame();
}
init();
