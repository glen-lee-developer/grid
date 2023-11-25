import * as THREE from "three";

export function addLights(scene: THREE.Scene): void {
  // const directionalLight = new THREE.DirectionalLight("gray");
  // directionalLight.position.set(1, 1, 1);
  // scene.add(directionalLight);
  // const ambientLight = new THREE.AmbientLight("gray");
  // scene.add(ambientLight);
  const pointLight = new THREE.PointLight(0xffffff);
  pointLight.intensity = 1;
  pointLight.position.x = 1;
  pointLight.position.z = 2;
  scene.add(pointLight);

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
  scene.add(hemiLight);
}
