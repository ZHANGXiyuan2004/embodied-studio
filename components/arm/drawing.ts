import {
  ACESFilmicToneMapping,
  PMREMGenerator,
  VSMShadowMap,
  BoxGeometry,
  CircleGeometry,
  CanvasTexture,
  DirectionalLight,
  Group,
  HemisphereLight,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  OrthographicCamera,
  PCFShadowMap,
  Plane,
  PlaneGeometry,
  Quaternion,
  Raycaster,
  RingGeometry,
  Scene,
  ShadowMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export const aspect = 1.56;
export const cubeHalf = 0.027;
export const start = new Vector3(0.4, -0.16, cubeHalf);
export const second = new Vector3(0.55, 0.13, cubeHalf);
export const rest = new Vector3(0.385, -0.025, 0.28);

export async function createStage(
  canvas: HTMLCanvasElement,
  model: ArrayBuffer,
) {
  const { scene: robot } = await new GLTFLoader()
    .setMeshoptDecoder(MeshoptDecoder)
    .parseAsync(model, '');
  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'low-power',
  });
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.94;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = renderer.extensions.has('EXT_color_buffer_float')
    ? VSMShadowMap
    : PCFShadowMap;
  const scene = new Scene();
  const studio = new RoomEnvironment();
  // The light rig is Y-up; the robot and its work surface use Z-up.
  studio.rotation.x = Math.PI / 2;
  const pmrem = new PMREMGenerator(renderer);
  const reflection = pmrem.fromScene(studio, 0.035);
  scene.environment = reflection.texture;
  scene.environmentIntensity = 0.32;
  studio.dispose();
  pmrem.dispose();
  scene.add(robot);
  robot.traverse((o) => {
    if (o instanceof Mesh) {
      o.layers.enable(1);
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });

  const camera = new OrthographicCamera(
    -0.665,
    0.665,
    0.665 / aspect,
    -0.665 / aspect,
    0.1,
    8,
  );
  camera.up.set(0, 0, 1);
  camera.position.set(0.98, -2.55, 1.26);
  camera.lookAt(0.19, 0, 0.345);
  camera.updateMatrixWorld();
  scene.add(new HemisphereLight(0xe8f1ff, 0xb6ac9d, 0.38));
  const rim = new DirectionalLight(0xe5eeff, 0.8);
  rim.position.set(0.8, 1.4, 1.7);
  scene.add(rim);
  const light = new DirectionalLight(0xfff9f1, 2.1);
  light.position.set(-0.85, -1.55, 2.7);
  light.target.position.set(0.21, 0, 0);
  light.castShadow = true;
  Object.assign(light.shadow.camera, {
    left: -1,
    right: 1,
    top: 1,
    bottom: -1,
    near: 0.3,
    far: 5,
  });
  // Keep the receiving table out of the variance shadow pass.
  light.shadow.camera.layers.set(1);
  light.shadow.mapSize.set(512, 512);
  light.shadow.normalBias = 0.002;
  light.shadow.radius = 8;
  light.shadow.blurSamples = 8;
  scene.add(light, light.target);
  const ground = new Mesh(
    new PlaneGeometry(5, 5),
    new ShadowMaterial({ color: 0x373b40, opacity: 0.17, alphaTest: 0.004 }),
  );
  ground.receiveShadow = true;
  ground.position.z = -0.001;
  scene.add(ground);

  const cube = new Mesh(
    new BoxGeometry(cubeHalf * 2, cubeHalf * 2, cubeHalf * 2),
    new MeshStandardMaterial({ color: 0xd87543, roughness: 0.7 }),
  );
  cube.layers.enable(1);
  cube.castShadow = true;
  scene.add(cube);
  // Add a short contact shadow where the base or the workpiece meets the table.
  const stamp = document.createElement('canvas');
  stamp.width = stamp.height = 96;
  const paint = stamp.getContext('2d')!;
  const falloff = paint.createRadialGradient(48, 48, 3, 48, 48, 47);
  falloff.addColorStop(0, 'rgba(30,34,36,0.65)');
  falloff.addColorStop(0.48, 'rgba(30,34,36,0.32)');
  falloff.addColorStop(1, 'rgba(30,34,36,0)');
  paint.fillStyle = falloff;
  paint.fillRect(0, 0, 96, 96);
  const shadowMap = new CanvasTexture(stamp);
  const contact = new Mesh(
    new PlaneGeometry(1, 1),
    new MeshBasicMaterial({
      map: shadowMap,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
    }),
  );
  contact.position.set(-0.03, 0, 0.0004);
  contact.scale.set(0.35, 0.24, 1);
  const partShadow = new Mesh(contact.geometry, contact.material.clone());
  scene.add(contact, partShadow);
  const guide = new Group();
  const ring = new Mesh(
    new RingGeometry(0.037, 0.039, 48),
    new MeshBasicMaterial({ color: 0xa65b38 }),
  );
  const disc = new Mesh(
    new CircleGeometry(0.037, 48),
    new MeshBasicMaterial({
      color: 0xce845c,
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
    }),
  );
  guide.add(ring, disc);
  scene.add(guide);

  const joint = (name: string) => robot.getObjectByName(name)!;
  const axes = [1, 2, 3, 4, 5, 6, 7].map((n) => joint('link' + n));
  const offsets = axes.map((axis) => axis.quaternion.clone());
  const fingers = [joint('left_finger'), joint('right_finger')];
  const zAxis = new Vector3(0, 0, 1);
  const rotation = new Quaternion();
  const projected = new Vector3();
  const ray = new Raycaster();
  const table = new Plane(zAxis, -cubeHalf);
  const normalized = new Vector2();

  function draw(
    tip: Vector3,
    part: Vector3,
    grip: number,
    landing: Vector3 | null,
  ) {
    // The Panda model's link offsets and its downward hand reduce this pose to a planar two-link solve.
    const radial = Math.hypot(tip.x, tip.y) - 0.088;
    const vertical = tip.z + 0.107 + 0.103 - 0.333;
    const upper = Math.hypot(0.316, 0.0825),
      lower = Math.hypot(0.384, 0.0825);
    const elbow = Math.acos(
      MathUtils.clamp(
        (radial * radial +
          vertical * vertical -
          upper * upper -
          lower * lower) /
          (2 * upper * lower),
        -1,
        1,
      ),
    );
    const shoulder =
      Math.atan2(radial, vertical) -
      Math.atan2(lower * Math.sin(elbow), upper + lower * Math.cos(elbow)) -
      Math.atan2(0.0825, 0.316);
    const bend = -elbow - Math.atan2(0.0825, 0.316) - Math.atan2(0.0825, 0.384);
    const yaw = Math.atan2(tip.y, tip.x);
    const angles = [yaw, shoulder, 0, bend, 0, shoulder - bend, 2.15 + yaw];
    axes.forEach((axis, i) =>
      axis.quaternion
        .copy(offsets[i])
        .multiply(rotation.setFromAxisAngle(zAxis, angles[i])),
    );
    fingers[0].position.y = 0.04 - grip * (0.04 - cubeHalf);
    fingers[1].position.y = -fingers[0].position.y;
    cube.position.copy(part);
    const height = Math.max(0, part.z - cubeHalf);
    partShadow.position.set(part.x, part.y, 0.0005);
    partShadow.scale.setScalar(0.095 + height * 0.4);
    partShadow.material.opacity = 0.75 * Math.exp(-height * 11);
    guide.visible = !!landing;
    if (landing) guide.position.set(landing.x, landing.y, 0.001);
    renderer.render(scene, camera);
    projected.copy(part).project(camera);
    const panel = canvas.parentElement!;
    panel.style.setProperty('--cube-x', (projected.x + 1) * 50 + '%');
    panel.style.setProperty('--cube-y', (1 - projected.y) * 50 + '%');
  }
  function floorAt(event: MouseEvent) {
    const box = canvas.getBoundingClientRect();
    normalized.set(
      ((event.clientX - box.left) / box.width) * 2 - 1,
      1 - ((event.clientY - box.top) / box.height) * 2,
    );
    ray.setFromCamera(normalized, camera);
    const point = new Vector3();
    if (!ray.ray.intersectPlane(table, point)) return null;
    point.x = MathUtils.clamp(point.x, 0.3, 0.62);
    point.y = MathUtils.clamp(point.y, -0.24, 0.24);
    return point;
  }
  function resize() {
    const { width, height } = canvas.getBoundingClientRect();
    if (!width || !height) return;
    // The poster and the live scene share a vertical frame as the workbench widens.
    camera.right = camera.top * (width / height);
    camera.left = -camera.right;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(
      Math.min(Math.max((devicePixelRatio || 1) * 1.25, 1.5), 3, 2048 / width),
    );
    renderer.setSize(width, height, false);
  }
  function destroy() {
    const geometries = new Set<Mesh['geometry']>();
    const materials = new Set<import('three').Material>();
    scene.traverse((o: Object3D) => {
      if (!(o instanceof Mesh)) return;
      geometries.add(o.geometry);
      for (const m of Array.isArray(o.material) ? o.material : [o.material])
        materials.add(m);
    });
    geometries.forEach((g) => g.dispose());
    materials.forEach((m) => m.dispose());
    shadowMap.dispose();
    reflection.dispose();
    light.shadow.dispose();
    renderer.dispose();
  }
  return { draw, floorAt, resize, destroy };
}
