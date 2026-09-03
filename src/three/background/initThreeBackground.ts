import {
  AdditiveBlending,
  BufferGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  Float32BufferAttribute,
  FogExp2,
  Group,
  IcosahedronGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  TorusGeometry,
  WebGLRenderer,
  type Material,
  type Object3D
} from 'three';
import type { ThreeBackgroundController } from '../../types/app';

interface ThemePalette {
  background: number;
  creature: number;
  creatureWing: number;
  fog: number;
  star: number;
  ufo: number;
  ufoDome: number;
  wire: number[];
}

const DARK_PALETTE: ThemePalette = {
  background: 0x050816,
  creature: 0xffb703,
  creatureWing: 0xfb8500,
  fog: 0x050816,
  star: 0xc4b5fd,
  ufo: 0x8ecae6,
  ufoDome: 0xffffff,
  wire: [0x8b5cf6, 0x22d3ee, 0xf472b6]
};

const LIGHT_PALETTE: ThemePalette = {
  background: 0xeef2ff,
  creature: 0x8b5e00,
  creatureWing: 0xb07800,
  fog: 0xeef2ff,
  star: 0x6366f1,
  ufo: 0x2a7090,
  ufoDome: 0x6366f1,
  wire: [0x7c3aed, 0x0891b2, 0xdb2777]
};

interface FlyingCreature {
  wrapper: Group;
  bird: Group;
  leftWing: Group;
  rightWing: Group;
  birdBodyMaterial: MeshBasicMaterial;
  birdWingMaterial: MeshBasicMaterial;
  ufo: Group;
  ufoDiscMaterial: MeshBasicMaterial;
  ufoDomeMaterial: MeshBasicMaterial;
  angle: number;
  baseY: number;
  flapSpeed: number;
  radiusX: number;
  radiusZ: number;
  speed: number;
}

function supportsWebGl() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch {
    return false;
  }
}

function disposeObject(object: Object3D) {
  object.traverse((child) => {
    if (!(child instanceof Mesh) && !(child instanceof Points)) {
      return;
    }

    child.geometry.dispose();
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach((material: Material) => material.dispose());
  });
}

function createBird(palette: ThemePalette) {
  const bird = new Group();
  const birdBodyMaterial = new MeshBasicMaterial({
    color: palette.creature,
    wireframe: true
  });
  const birdWingMaterial = new MeshBasicMaterial({
    color: palette.creatureWing,
    wireframe: true
  });
  const body = new Mesh(new ConeGeometry(0.4, 1.5, 4), birdBodyMaterial);
  body.rotation.x = Math.PI / 2;
  bird.add(body);

  const createWing = (side: -1 | 1) => {
    const pivot = new Group();
    pivot.position.set(side * 0.2, 0.1, 0);
    const wing = new Mesh(new ConeGeometry(0.6, 2, 3), birdWingMaterial);
    wing.position.set(side, 0, 0);
    wing.rotation.z = side * -Math.PI / 2;
    pivot.add(wing);
    bird.add(pivot);
    return pivot;
  };

  bird.scale.setScalar(1.08);
  return {
    bird,
    birdBodyMaterial,
    birdWingMaterial,
    leftWing: createWing(-1),
    rightWing: createWing(1)
  };
}

function createUfo(palette: ThemePalette) {
  const ufo = new Group();
  const ufoDiscMaterial = new MeshBasicMaterial({
    color: palette.ufo,
    wireframe: true
  });
  const ufoDomeMaterial = new MeshBasicMaterial({
    color: palette.ufoDome,
    wireframe: true
  });
  const disc = new Mesh(new CylinderGeometry(1.5, 1.5, 0.2, 8), ufoDiscMaterial);
  const dome = new Mesh(new IcosahedronGeometry(0.7, 1), ufoDomeMaterial);
  dome.position.y = 0.1;
  ufo.add(disc, dome);
  ufo.scale.setScalar(1.08);
  return {
    ufo,
    ufoDiscMaterial,
    ufoDomeMaterial
  };
}

export function initThreeBackground(container: HTMLElement): ThreeBackgroundController | null {
  if (!supportsWebGl()) {
    container.classList.add('three-background-fallback');
    return null;
  }

  const scene = new Scene();
  const isInitiallyDark = document.documentElement.classList.contains('dark');
  const initialPalette = isInitiallyDark ? DARK_PALETTE : LIGHT_PALETTE;
  scene.background = new Color(initialPalette.background);
  scene.fog = new FogExp2(initialPalette.fog, 0.035);

  const camera = new PerspectiveCamera(58, 1, 0.1, 100);
  camera.position.set(0, 0, 16);

  const renderer = new WebGLRenderer({
    antialias: window.devicePixelRatio <= 1.5,
    alpha: false,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.domElement.className = 'three-background-canvas';
  renderer.domElement.setAttribute('aria-hidden', 'true');
  container.appendChild(renderer.domElement);

  const starGeometry = new BufferGeometry();
  const starCount = window.innerWidth < 768 ? 180 : 360;
  const starPositions = new Float32Array(starCount * 3);
  for (let index = 0; index < starCount; index += 1) {
    const offset = index * 3;
    starPositions[offset] = (Math.random() - 0.5) * 44;
    starPositions[offset + 1] = (Math.random() - 0.5) * 30;
    starPositions[offset + 2] = -4 - Math.random() * 25;
  }
  starGeometry.setAttribute('position', new Float32BufferAttribute(starPositions, 3));
  const starMaterial = new PointsMaterial({
    color: initialPalette.star,
    size: 0.075,
    transparent: true,
    opacity: isInitiallyDark ? 0.75 : 0.32,
    blending: AdditiveBlending,
    depthWrite: false
  });
  const stars = new Points(starGeometry, starMaterial);
  scene.add(stars);

  const geometryGroup = new Group();
  geometryGroup.position.set(0, 0, -5);
  scene.add(geometryGroup);

  const shapes = [
    new Mesh(
      new IcosahedronGeometry(3.4, 1),
      new MeshBasicMaterial({
        color: initialPalette.wire[0],
        wireframe: true,
        transparent: true,
        opacity: isInitiallyDark ? 0.16 : 0.1
      })
    ),
    new Mesh(
      new TorusGeometry(5.3, 0.04, 8, 96),
      new MeshBasicMaterial({
        color: initialPalette.wire[1],
        transparent: true,
        opacity: isInitiallyDark ? 0.38 : 0.2
      })
    ),
    new Mesh(
      new TorusGeometry(6.8, 0.025, 8, 96),
      new MeshBasicMaterial({
        color: initialPalette.wire[2],
        transparent: true,
        opacity: isInitiallyDark ? 0.24 : 0.14
      })
    )
  ];
  shapes[1].rotation.x = Math.PI / 2.7;
  shapes[2].rotation.set(Math.PI / 2.1, Math.PI / 4, 0);
  shapes.forEach((shape) => geometryGroup.add(shape));

  const creaturesGroup = new Group();
  scene.add(creaturesGroup);
  const creatureCount = window.innerWidth < 768 ? 2 : 4;
  const creatures: FlyingCreature[] = Array.from({ length: creatureCount }, (_, index) => {
    const birdParts = createBird(initialPalette);
    const ufoParts = createUfo(initialPalette);
    const wrapper = new Group();
    wrapper.add(birdParts.bird, ufoParts.ufo);
    creaturesGroup.add(wrapper);

    return {
      wrapper,
      ...birdParts,
      ...ufoParts,
      angle: (index / creatureCount) * Math.PI * 2 + Math.random() * 0.8,
      baseY: (Math.random() - 0.5) * 10,
      flapSpeed: 5.5 + Math.random() * 2,
      radiusX: 13 + Math.random() * 5,
      radiusZ: 3 + Math.random() * 3,
      speed: 0.12 + Math.random() * 0.08
    };
  });
  creatures.forEach((creature) => {
    creature.wrapper.position.set(
      Math.cos(creature.angle) * creature.radiusX,
      creature.baseY + Math.sin(creature.angle * 2.4) * 2.2,
      -9 + Math.sin(creature.angle) * creature.radiusZ
    );
    creature.wrapper.rotation.y = -creature.angle + Math.PI / 2;
    creature.bird.visible = !isInitiallyDark;
    creature.ufo.visible = isInitiallyDark;
  });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let animationFrameId: number | null = null;
  let celebrationTimer: number | null = null;
  let destroyed = false;
  let pointerX = 0;
  let pointerY = 0;
  let currentSpeed = 1;
  let targetSpeed = 1;
  let speedTransitionEnd = 0;
  let previousTime = performance.now();

  const resize = () => {
    const width = Math.max(1, container.clientWidth);
    const height = Math.max(1, container.clientHeight);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  };

  const handlePointerMove = (event: PointerEvent) => {
    pointerX = (event.clientX / window.innerWidth - 0.5) * 0.5;
    pointerY = (event.clientY / window.innerHeight - 0.5) * 0.35;
  };

  const render = (time: number) => {
    if (destroyed) {
      return;
    }

    const delta = Math.min((time - previousTime) / 1000, 0.05);
    previousTime = time;
    const easing = speedTransitionEnd > time ? 0.06 : 0.14;
    currentSpeed += (targetSpeed - currentSpeed) * easing;

    if (!document.hidden && !reducedMotion.matches) {
      geometryGroup.rotation.y += delta * 0.055 * currentSpeed;
      geometryGroup.rotation.x += delta * 0.018 * currentSpeed;
      stars.rotation.y -= delta * 0.006 * currentSpeed;
      creatures.forEach((creature) => {
        creature.angle += delta * creature.speed * currentSpeed;
        creature.wrapper.position.set(
          Math.cos(creature.angle) * creature.radiusX,
          creature.baseY + Math.sin(creature.angle * 2.4) * 2.2,
          -9 + Math.sin(creature.angle) * creature.radiusZ
        );
        creature.wrapper.rotation.y = -creature.angle + Math.PI / 2;
        creature.wrapper.rotation.z = Math.sin(creature.angle) * 0.18;

        if (creature.bird.visible) {
          const flap = Math.sin(time * 0.001 * creature.flapSpeed);
          creature.leftWing.rotation.z = flap * 0.6;
          creature.rightWing.rotation.z = -flap * 0.6;
        } else {
          creature.ufo.rotation.y += delta * 1.8 * currentSpeed;
          creature.ufo.position.y = Math.sin(time * 0.003 + creature.angle) * 0.25;
        }
      });
      camera.position.x += (pointerX - camera.position.x) * 0.018;
      camera.position.y += (-pointerY - camera.position.y) * 0.018;
      camera.lookAt(0, 0, -5);
    }

    renderer.render(scene, camera);
    animationFrameId = requestAnimationFrame(render);
  };

  const updateTheme = (isDark: boolean) => {
    const palette = isDark ? DARK_PALETTE : LIGHT_PALETTE;
    scene.background = new Color(palette.background);
    if (scene.fog instanceof FogExp2) {
      scene.fog.color.setHex(palette.fog);
    }
    starMaterial.color.setHex(palette.star);
    starMaterial.opacity = isDark ? 0.75 : 0.32;
    shapes.forEach((shape, index) => {
      const material = shape.material as MeshBasicMaterial;
      material.color.setHex(palette.wire[index]);
      material.opacity = isDark
        ? [0.16, 0.38, 0.24][index]
        : [0.1, 0.2, 0.14][index];
    });
    creatures.forEach((creature) => {
      creature.bird.visible = !isDark;
      creature.ufo.visible = isDark;
      creature.birdBodyMaterial.color.setHex(palette.creature);
      creature.birdWingMaterial.color.setHex(palette.creatureWing);
      creature.ufoDiscMaterial.color.setHex(palette.ufo);
      creature.ufoDomeMaterial.color.setHex(palette.ufoDome);
    });
  };

  const setSpeed = (multiplier: number, duration = 450) => {
    targetSpeed = Math.max(0.15, Math.min(multiplier, 4));
    speedTransitionEnd = performance.now() + duration;
  };

  const celebrate = () => {
    if (celebrationTimer !== null) {
      clearTimeout(celebrationTimer);
    }
    setSpeed(3.2, 180);
    shapes.forEach((shape) => {
      (shape.material as MeshBasicMaterial).opacity = 0.72;
    });
    celebrationTimer = window.setTimeout(() => {
      updateTheme(document.documentElement.classList.contains('dark'));
      setSpeed(1, 850);
      celebrationTimer = null;
    }, 1200);
  };

  const destroy = () => {
    if (destroyed) {
      return;
    }

    destroyed = true;
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
    }
    if (celebrationTimer !== null) {
      clearTimeout(celebrationTimer);
    }
    window.removeEventListener('resize', resize);
    window.removeEventListener('pointermove', handlePointerMove);
    disposeObject(stars);
    disposeObject(geometryGroup);
    disposeObject(creaturesGroup);
    renderer.dispose();
    renderer.domElement.remove();
  };

  resize();
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('pointermove', handlePointerMove, { passive: true });
  animationFrameId = requestAnimationFrame(render);

  return {
    updateTheme,
    setSpeed,
    celebrate,
    destroy
  };
}
