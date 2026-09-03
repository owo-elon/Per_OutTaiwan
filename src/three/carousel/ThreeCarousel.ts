import {
  Group,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Raycaster,
  Scene,
  Vector2,
  WebGLRenderer
} from 'three';
import type { CarouselItem } from '../../types/home';
import { createCardTexture } from './createCardTexture';

type CarouselMesh = Mesh & {
  geometry: PlaneGeometry;
  material: MeshBasicMaterial;
  userData: {
    index: number;
    item: CarouselItem;
  };
};

export class ThreeCarousel {
  private readonly scene = new Scene();
  private readonly camera = new PerspectiveCamera(48, 1, 0.1, 100);
  private readonly group = new Group();
  private readonly renderer: WebGLRenderer;
  private readonly raycaster = new Raycaster();
  private readonly pointer = new Vector2();
  private readonly resizeObserver: ResizeObserver;
  private readonly themeObserver: MutationObserver;
  private cards: CarouselMesh[] = [];
  private animationFrameId: number | null = null;
  private activeIndex = 0;
  private currentRotation = 0;
  private targetRotation = 0;
  private pointerStartX = 0;
  private draggedDistance = 0;
  private isDragging = false;
  private destroyed = false;
  private isDark = document.documentElement.classList.contains('dark');

  constructor(
    private readonly container: HTMLElement,
    private items: CarouselItem[]
  ) {
    this.renderer = new WebGLRenderer({
      antialias: window.devicePixelRatio <= 1.5,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.domElement.className = 'home-carousel-canvas';
    this.renderer.domElement.setAttribute('aria-hidden', 'true');
    this.container.appendChild(this.renderer.domElement);

    this.camera.position.set(0, 0, 12);
    this.scene.add(this.group);
    this.rebuildCards();

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.container);
    this.themeObserver = new MutationObserver(this.handleThemeChange);
    this.themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    this.bindEvents();
    this.resize();
    this.animationFrameId = requestAnimationFrame(this.render);
  }

  setItems(items: CarouselItem[]) {
    this.items = items;
    this.activeIndex = 0;
    this.currentRotation = 0;
    this.targetRotation = 0;
    this.rebuildCards();
  }

  previous() {
    if (this.items.length < 2) {
      return;
    }
    this.activeIndex = (this.activeIndex - 1 + this.items.length) % this.items.length;
    this.targetRotation = -this.activeIndex * ((Math.PI * 2) / this.items.length);
  }

  next() {
    if (this.items.length < 2) {
      return;
    }
    this.activeIndex = (this.activeIndex + 1) % this.items.length;
    this.targetRotation = -this.activeIndex * ((Math.PI * 2) / this.items.length);
  }

  destroy() {
    this.destroyed = true;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.resizeObserver.disconnect();
    this.themeObserver.disconnect();
    this.unbindEvents();
    this.disposeCards();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }

  private rebuildCards() {
    this.disposeCards();
    if (this.items.length === 0) {
      return;
    }

    const radius = this.items.length <= 2 ? 5.4 : 7.2;
    this.group.position.z = -radius;
    const cardGeometry = new PlaneGeometry(5.8, 7.25);
    this.cards = this.items.map((item, index) => {
      const material = new MeshBasicMaterial({
        map: createCardTexture(item, this.isDark),
        transparent: true,
        opacity: 1
      });
      const mesh = new Mesh(cardGeometry.clone(), material) as CarouselMesh;
      const angle = (index / this.items.length) * Math.PI * 2;
      mesh.position.set(Math.sin(angle) * radius, 0, Math.cos(angle) * radius);
      mesh.rotation.y = angle;
      mesh.userData = { index, item };
      this.group.add(mesh);
      return mesh;
    });
    cardGeometry.dispose();
  }

  private disposeCards() {
    this.cards.forEach((card) => {
      card.material.map?.dispose();
      card.material.dispose();
      card.geometry.dispose();
      this.group.remove(card);
    });
    this.cards = [];
  }

  private handleThemeChange = () => {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark === this.isDark) {
      return;
    }

    this.isDark = isDark;
    this.cards.forEach((card) => {
      const previousTexture = card.material.map;
      card.material.map = createCardTexture(card.userData.item, isDark);
      card.material.needsUpdate = true;
      previousTexture?.dispose();
    });
  };

  private resize() {
    const width = Math.max(1, this.container.clientWidth);
    const height = Math.max(1, this.container.clientHeight);
    this.camera.position.z = width < 640 ? 10.5 : 12;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  private bindEvents() {
    const canvas = this.renderer.domElement;
    canvas.addEventListener('pointerdown', this.handlePointerDown);
    canvas.addEventListener('pointermove', this.handlePointerMove);
    canvas.addEventListener('pointerup', this.handlePointerUp);
    canvas.addEventListener('pointercancel', this.handlePointerUp);
    canvas.addEventListener('wheel', this.handleWheel, { passive: false });
    canvas.addEventListener('click', this.handleClick);
  }

  private unbindEvents() {
    const canvas = this.renderer.domElement;
    canvas.removeEventListener('pointerdown', this.handlePointerDown);
    canvas.removeEventListener('pointermove', this.handlePointerMove);
    canvas.removeEventListener('pointerup', this.handlePointerUp);
    canvas.removeEventListener('pointercancel', this.handlePointerUp);
    canvas.removeEventListener('wheel', this.handleWheel);
    canvas.removeEventListener('click', this.handleClick);
  }

  private handlePointerDown = (event: PointerEvent) => {
    this.isDragging = true;
    this.pointerStartX = event.clientX;
    this.draggedDistance = 0;
    this.renderer.domElement.setPointerCapture(event.pointerId);
  };

  private handlePointerMove = (event: PointerEvent) => {
    if (!this.isDragging || this.items.length === 0) {
      return;
    }
    const delta = event.clientX - this.pointerStartX;
    this.draggedDistance += Math.abs(delta);
    this.pointerStartX = event.clientX;
    this.targetRotation -= delta * 0.006;
  };

  private handlePointerUp = (event: PointerEvent) => {
    if (!this.isDragging) {
      return;
    }
    this.isDragging = false;
    if (this.renderer.domElement.hasPointerCapture(event.pointerId)) {
      this.renderer.domElement.releasePointerCapture(event.pointerId);
    }
    if (this.items.length === 0) {
      return;
    }
    const step = (Math.PI * 2) / this.items.length;
    this.activeIndex = ((Math.round(-this.targetRotation / step) % this.items.length)
      + this.items.length) % this.items.length;
    this.targetRotation = -this.activeIndex * step;
  };

  private handleWheel = (event: WheelEvent) => {
    const horizontalIntent = Math.abs(event.deltaX) > Math.abs(event.deltaY) || event.shiftKey;
    if (!horizontalIntent) {
      return;
    }
    event.preventDefault();
    const delta = event.shiftKey && event.deltaX === 0 ? event.deltaY : event.deltaX;
    delta > 0 ? this.next() : this.previous();
  };

  private handleClick = (event: MouseEvent) => {
    if (this.draggedDistance > 8) {
      return;
    }

    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hit = this.raycaster.intersectObjects(this.cards)[0]?.object as CarouselMesh | undefined;
    if (!hit) {
      return;
    }

    if (hit.userData.index === this.activeIndex) {
      if (hit.userData.item.link === '#') {
        return;
      }
      window.location.href = `${import.meta.env.BASE_URL}${hit.userData.item.link}`;
      return;
    }

    this.activeIndex = hit.userData.index;
    this.targetRotation = -this.activeIndex * ((Math.PI * 2) / this.items.length);
  };

  private render = () => {
    if (this.destroyed) {
      return;
    }

    this.currentRotation += (this.targetRotation - this.currentRotation) * 0.08;
    this.group.rotation.y = this.currentRotation;
    const time = performance.now() * 0.001;
    this.cards.forEach((card, index) => {
      const distance = Math.min(
        Math.abs(index - this.activeIndex),
        this.items.length - Math.abs(index - this.activeIndex)
      );
      const isActive = distance === 0;
      const targetOpacity = isActive ? 1 : distance === 1 ? 0.62 : 0.28;
      const targetScale = isActive ? 1.08 : distance === 1 ? 0.88 : 0.76;
      card.material.opacity += (targetOpacity - card.material.opacity) * 0.08;
      card.scale.x += (targetScale - card.scale.x) * 0.08;
      card.scale.y += (targetScale - card.scale.y) * 0.08;
      card.position.y = Math.sin(time * 1.15 + index * 1.7) * (isActive ? 0.16 : 0.09);
    });
    this.renderer.render(this.scene, this.camera);
    this.animationFrameId = requestAnimationFrame(this.render);
  };
}
