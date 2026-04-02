import '../../css/layout/layout.css';
import { defineComponent, ref, onMounted, onUnmounted, watch } from 'vue';
import * as THREE from 'three';
import gsap from 'gsap';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export function initThreeBackground(isDarkMode = false) {
    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;

    // ── Theme Palette ──────────────────────────────────────────────────────────
    const THEMES = {
        dark: {
            bg:             0x000000,
            scanLine:       0x00f2ff,
            nodePulse:      0x00f2ff,
            particle:       0x00ffaa,
            ripple:         0x00f2ff,
            star:           0xffffff,
            creature:       0xffb703,
            creatureWing:   0xfb8500,
            ufo:            0x8ecae6,
            bubble:         0x00f2ff,
        },
        light: {
            bg:             0xffffff,
            scanLine:       0x0a7c5c,
            nodePulse:      0x044e3a,
            particle:       0x044e3a,
            ripple:         0x0a7c5c,
            star:           0x94a3b8,
            creature:       0x8b5e00,
            creatureWing:   0xb07800,
            ufo:            0x2a7090,
            bubble:         0x044e3a,
        }
    };

    const T = () => (state.isDark ? THEMES.dark : THEMES.light);

    // ── State ──────────────────────────────────────────────────────────────────
    const state = {
        isDark: isDarkMode,
        speedMultiplier: 1,
        timeMs: Date.now()
    };
    let lastTime = Date.now();

    // ── Renderer ───────────────────────────────────────────────────────────────
    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 55;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const isMobile = () => window.innerWidth < 768;

    // ══════════════════════════════════════════════════════════════════════════
    // 1. STAR FIELD
    // ══════════════════════════════════════════════════════════════════════════
    const starCount = 5000;
    const starGeo   = new THREE.BufferGeometry();
    const starPos   = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
        starPos[i * 3]     = (Math.random() - 0.5) * 300;
        starPos[i * 3 + 1] = (Math.random() - 0.5) * 300;
        starPos[i * 3 + 2] = -60 - Math.random() * 200;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
        size: 0.18, color: 0xffffff, transparent: true,
        opacity: 0.85, blending: THREE.AdditiveBlending,
        depthWrite: false, sizeAttenuation: true
    });
    const stars = new THREE.Points(starGeo, starMat);
    stars.visible = state.isDark;
    scene.add(stars);

    // ══════════════════════════════════════════════════════════════════════════
    // 2. CELESTIAL SYSTEM — Redesigned Moon + Sun
    // ══════════════════════════════════════════════════════════════════════════

    const CELEST_R  = (isMobile() ? 35 : 48);   // sphere radius, RWD-aware

    // ── Directional light ────────────────────────────────────────────────
    const dirLight = new THREE.DirectionalLight(0xaabbdd, 1.4);
    dirLight.position.set(60, 40, 80);
    scene.add(dirLight);
    scene.add(new THREE.AmbientLight(0x111122, 0.6));

    // ────────────────────────────────────────────────────────────────────────
    // CELESTIAL PIVOT (Carousel)
    // ────────────────────────────────────────────────────────────────────────
    const celestialPivot = new THREE.Group();
    celestialPivot.position.set(0, -180, -120);
    scene.add(celestialPivot);

    // ════════════════════════════════════════════════════════════════════════
    // MOON GROUP - Redesigned (No Craters)
    // ════════════════════════════════════════════════════════════════════════
    const moonGroup = new THREE.Group();
    moonGroup.position.set(0, -180, 0);
    celestialPivot.add(moonGroup);

    // — Moon surface: Smooth sphere with subtle texture —
    const moonGeo = new THREE.SphereGeometry(CELEST_R, 80, 80);
    
    // Add subtle surface variation using vertex displacement
    {
        const pos = moonGeo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
            // Very subtle noise for texture, no harsh craters
            const noise =
                Math.sin(x * 0.3) * Math.cos(y * 0.3) * Math.sin(z * 0.3) * 0.15 +
                Math.sin(x * 0.8) * Math.cos(z * 0.7) * 0.08;
            const len = Math.sqrt(x*x + y*y + z*z);
            const s   = (CELEST_R + noise * 0.4) / len;
            pos.setXYZ(i, x * s, y * s, z * s);
        }
        moonGeo.computeVertexNormals();
    }

    // Moon material with gentle glow
    const moonSurfaceMat = new THREE.MeshStandardMaterial({
        color:             0xe8eef5,
        roughness:         0.85,
        metalness:         0.05,
        emissive:          new THREE.Color(0x4a5a88),
        emissiveIntensity: 0.18,
        transparent:       true,
    });
    const moonMesh = new THREE.Mesh(moonGeo, moonSurfaceMat);
    moonMesh.renderOrder = -1;
    moonGroup.add(moonMesh);

    // — Moonlight aura (soft glow layers) —
    const moonAuraLayers = [
        { r: 1.12, col: 0x88aadd, op: 0.15 },
        { r: 1.28, col: 0x6688cc, op: 0.08 },
        { r: 1.48, col: 0x4466bb, op: 0.04 },
    ];
    moonAuraLayers.forEach(({ r, col, op }) => {
        const mat = new THREE.MeshBasicMaterial({
            color: col, transparent: true, opacity: op,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending, depthWrite: false,
        });
        const aura = new THREE.Mesh(new THREE.SphereGeometry(CELEST_R * r, 32, 32), mat);
        moonGroup.add(aura);
    });

    // — Elegant halo ring —
    const moonHaloMat = new THREE.MeshBasicMaterial({
        color: 0x88bbff, transparent: true, opacity: 0.22,
        blending: THREE.AdditiveBlending, depthWrite: false
    });
    moonHaloMat.userData.isAnimatedOpacity = true;
    const moonHalo = new THREE.Mesh(
        new THREE.TorusGeometry(CELEST_R * 1.65, 0.15, 8, 120),
        moonHaloMat
    );
    moonHalo.rotation.x = 0.4;
    moonHalo.rotation.z = 0.25;
    moonGroup.add(moonHalo);

    // — Delicate stardust particles around moon —
    const moonDustCount = 200;
    const moonDustGeo   = new THREE.BufferGeometry();
    const moonDustPos   = new Float32Array(moonDustCount * 3);
    for (let i = 0; i < moonDustCount; i++) {
        const r   = CELEST_R * (1.2 + Math.random() * 0.9);
        const th  = Math.acos(2 * Math.random() - 1);
        const ph  = Math.random() * Math.PI * 2;
        moonDustPos[i * 3]     = r * Math.sin(th) * Math.cos(ph);
        moonDustPos[i * 3 + 1] = r * Math.cos(th);
        moonDustPos[i * 3 + 2] = r * Math.sin(th) * Math.sin(ph);
    }
    moonDustGeo.setAttribute('position', new THREE.BufferAttribute(moonDustPos, 3));
    const moonDust = new THREE.Points(moonDustGeo, new THREE.PointsMaterial({
        size: 0.1, color: 0xccddff, transparent: true, opacity: 0.6,
        blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true
    }));
    moonGroup.add(moonDust);

    // ════════════════════════════════════════════════════════════════════════
    // SUN GROUP - Redesigned with vibrant energy
    // ════════════════════════════════════════════════════════════════════════
    const sunGroup = new THREE.Group();
    sunGroup.position.set(0, 180, 0);
    celestialPivot.add(sunGroup);

    // — Sun core: Enhanced shader with more vibrant colors —
    const sunBodyMat = new THREE.ShaderMaterial({
        uniforms: {
            time:   { value: 0.0 },
            colA:   { value: new THREE.Color(0xfff200) },  // Bright yellow
            colB:   { value: new THREE.Color(0xff8c00) },  // Deep orange
            colC:   { value: new THREE.Color(0xff4500) },  // Orange-red
            globalOpacity: { value: 1.0 }
        },
        vertexShader: /* glsl */`
            uniform float time;
            varying vec2  vUv;
            varying vec3  vNormal;
            varying vec3  vPos;

            float hash(vec3 p) {
                return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
            }
            float noise(vec3 p) {
                vec3 i = floor(p);
                vec3 f = fract(p);
                f = f * f * (3.0 - 2.0 * f);
                return mix(
                    mix(mix(hash(i),             hash(i+vec3(1,0,0)), f.x),
                        mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), f.x), f.y),
                    mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), f.x),
                        mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), f.x), f.y),
                    f.z);
            }

            void main() {
                vUv    = uv;
                vNormal = normal;
                vPos   = position;
                // Dynamic plasma surface
                float n = noise(position * 0.25 + vec3(time * 0.18));
                float n2= noise(position * 0.55 - vec3(time * 0.12));
                float disp = (n * 0.8 + n2 * 0.4) * 2.0;
                vec3 displaced = position + normal * disp;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
            }
        `,
        fragmentShader: /* glsl */`
            uniform float time;
            uniform float globalOpacity;
            uniform vec3  colA;
            uniform vec3  colB;
            uniform vec3  colC;
            varying vec2  vUv;
            varying vec3  vNormal;
            varying vec3  vPos;

            float hash(vec3 p) {
                return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
            }
            float noise(vec3 p) {
                vec3 i = floor(p);
                vec3 f = fract(p);
                f = f * f * (3.0 - 2.0 * f);
                return mix(
                    mix(mix(hash(i),             hash(i+vec3(1,0,0)), f.x),
                        mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), f.x), f.y),
                    mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), f.x),
                        mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), f.x), f.y),
                    f.z);
            }

            void main() {
                float n1 = noise(vPos * 0.35 + vec3(time * 0.25));
                float n2 = noise(vPos * 0.75 - vec3(time * 0.15));
                float n3 = noise(vPos * 1.50 + vec3(time * 0.35));
                float plasma = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;

                vec3  col = mix(colA, colB, plasma);
                col = mix(col, colC, pow(plasma, 2.0));

                // Enhanced limb brightness for more vibrant look
                float facing = dot(normalize(vNormal), vec3(0.0, 0.0, 1.0));
                col *= 0.7 + 0.4 * max(0.0, facing);

                // Solar flares
                float flare = pow(max(0.0, sin(vUv.x * 30.0 + time * 1.2) * cos(vUv.y * 25.0 - time * 0.8)), 5.0);
                col += vec3(1.0, 0.95, 0.5) * flare * 0.5;

                gl_FragColor = vec4(col, globalOpacity);
            }
        `,
        transparent: true,
    });
    const sunMesh = new THREE.Mesh(
        new THREE.SphereGeometry(CELEST_R, 80, 80),
        sunBodyMat
    );
    sunMesh.renderOrder = -1;
    sunGroup.add(sunMesh);

    // — Vibrant corona layers —
    const CORONA_LAYERS = [
        { r: 1.18, col: 0xffee44, op: 0.18 },
        { r: 1.38, col: 0xffcc33, op: 0.12 },
        { r: 1.65, col: 0xff9922, op: 0.06 },
    ];
    CORONA_LAYERS.forEach(({ r, col, op }) => {
        const mat = new THREE.MeshBasicMaterial({
            color: col, transparent: true, opacity: op,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending, depthWrite: false,
        });
        sunGroup.add(new THREE.Mesh(new THREE.SphereGeometry(CELEST_R * r, 32, 32), mat));
    });

    // — Dynamic sun rays —
    const sunRayGroup = new THREE.Group();
    sunGroup.add(sunRayGroup);
    const RAY_COUNT = isMobile() ? 12 : 20;
    const sunRayMats: THREE.MeshBasicMaterial[] = [];
    for (let i = 0; i < RAY_COUNT; i++) {
        const angle  = (i / RAY_COUNT) * Math.PI * 2;
        const length = CELEST_R * (0.35 + Math.random() * 0.25);
        const width  = CELEST_R * 0.05;
        const dist   = CELEST_R + length * 0.5;
        const mat    = new THREE.MeshBasicMaterial({
            color: 0xffee00, transparent: true,
            opacity: 0.12 + Math.random() * 0.10,
            blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
        });
        mat.userData.isAnimatedOpacity = true;
        sunRayMats.push(mat);
        const ray = new THREE.Mesh(new THREE.PlaneGeometry(width, length), mat);
        ray.position.set(Math.cos(angle) * dist, Math.sin(angle) * dist, 0);
        ray.rotation.z = angle + Math.PI / 2;
        sunRayGroup.add(ray);
    }

    // — Radiant energy rings —
    const sunRingMat = new THREE.MeshBasicMaterial({
        color: 0xffbb22, transparent: true, opacity: 0.25,
        blending: THREE.AdditiveBlending, depthWrite: false,
    });
    sunRingMat.userData.isAnimatedOpacity = true;
    const sunRing = new THREE.Mesh(
        new THREE.TorusGeometry(CELEST_R * 1.15, CELEST_R * 0.06, 8, 120),
        sunRingMat
    );
    sunGroup.add(sunRing);

    // — Energy particles orbiting sun —
    const sunParticleCount = 150;
    const sunParticleGeo   = new THREE.BufferGeometry();
    const sunParticlePos   = new Float32Array(sunParticleCount * 3);
    for (let i = 0; i < sunParticleCount; i++) {
        const r   = CELEST_R * (1.3 + Math.random() * 0.7);
        const th  = Math.acos(2 * Math.random() - 1);
        const ph  = Math.random() * Math.PI * 2;
        sunParticlePos[i * 3]     = r * Math.sin(th) * Math.cos(ph);
        sunParticlePos[i * 3 + 1] = r * Math.cos(th);
        sunParticlePos[i * 3 + 2] = r * Math.sin(th) * Math.sin(ph);
    }
    sunParticleGeo.setAttribute('position', new THREE.BufferAttribute(sunParticlePos, 3));
    const sunParticles = new THREE.Points(sunParticleGeo, new THREE.PointsMaterial({
        size: 0.12, color: 0xffdd33, transparent: true, opacity: 0.7,
        blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true
    }));
    sunGroup.add(sunParticles);

    // — Brilliant sun glow sprite —
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = 256; glowCanvas.height = 256;
    const glowCtx = glowCanvas.getContext('2d')!;
    const glowGrad = glowCtx.createRadialGradient(128, 128, 0, 128, 128, 128);
    glowGrad.addColorStop(0, 'rgba(255, 250, 200, 1)');
    glowGrad.addColorStop(0.25, 'rgba(255, 240, 180, 0.8)');
    glowGrad.addColorStop(0.5, 'rgba(255, 230, 160, 0.4)');
    glowGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    glowCtx.fillStyle = glowGrad;
    glowCtx.fillRect(0, 0, 256, 256);
    const sunGlowTex = new THREE.CanvasTexture(glowCanvas);
    const sunGlowMat = new THREE.SpriteMaterial({ 
        map: sunGlowTex, 
        transparent: true, 
        blending: THREE.AdditiveBlending, 
        depthWrite: false, 
        opacity: 1.0 
    });
    const sunGlow = new THREE.Sprite(sunGlowMat);
    sunGlow.scale.set(CELEST_R * 14, CELEST_R * 14, 1);
    sunGlow.position.z = -20;
    sunGlow.renderOrder = -50;
    sunGroup.add(sunGlow);

    // Ensure all celestial objects render in background
    celestialPivot.traverse((child) => {
        if (child instanceof THREE.Mesh || child instanceof THREE.Points || child instanceof THREE.Sprite) {
            if (child.renderOrder === 0) {
                child.renderOrder = -10;
            }
        }
    });

    // ── Initial visibility & rotation ───────────────────────────────────────
    moonGroup.visible = true;
    sunGroup.visible  = true;
    
    celestialPivot.rotation.z = state.isDark ? Math.PI : 0;
    sunGroup.rotation.z = -celestialPivot.rotation.z;
    moonGroup.rotation.z = -celestialPivot.rotation.z;

    // ── Celestial transition (rotating disk effect) ──────────────────────────
    let celestTransitioning = false;

    const triggerCelestialTransition = (toDark: boolean) => {
        if (celestTransitioning) return;
        celestTransitioning = true;

        const DURATION = 2.0;
        const EASE     = 'power3.inOut';

        const currentZ = celestialPivot.rotation.z;
        const targetZ = currentZ + Math.PI;

        gsap.to(celestialPivot.rotation, {
            z: targetZ,
            duration: DURATION,
            ease: EASE,
            onUpdate: () => {
                sunGroup.rotation.z = -celestialPivot.rotation.z;
                moonGroup.rotation.z = -celestialPivot.rotation.z;
            },
            onComplete: () => {
                celestTransitioning = false;
            }
        });
    };

    // ══════════════════════════════════════════════════════════════════════════
    // 3. SCAN LINE
    // ══════════════════════════════════════════════════════════════════════════
    const scanGeo = new THREE.PlaneGeometry(140, 0.3);
    const scanMat = new THREE.MeshBasicMaterial({
        color: THEMES.dark.scanLine,
        transparent: true, opacity: 0.0,
        side: THREE.DoubleSide, depthWrite: false,
        blending: THREE.AdditiveBlending
    });
    const scanLine = new THREE.Mesh(scanGeo, scanMat);
    scanLine.rotation.x = Math.PI / 2;
    scene.add(scanLine);

    const scanRingGeo = new THREE.TorusGeometry(52, 0.12, 8, 80);
    const scanRingMat = new THREE.MeshBasicMaterial({
        color: THEMES.dark.scanLine,
        transparent: true, opacity: 0.0,
        blending: THREE.AdditiveBlending
    });
    const scanRing = new THREE.Mesh(scanRingGeo, scanRingMat);
    scene.add(scanRing);

    // ══════════════════════════════════════════════════════════════════════════
    // 4. NODE VERTICES
    // ══════════════════════════════════════════════════════════════════════════
    const buildNodeSystem = () => {
        const srcGeo  = new THREE.IcosahedronGeometry(32, 0);
        const posAttr = srcGeo.getAttribute('position');
        const unique  = new Map();

        for (let i = 0; i < posAttr.count; i++) {
            const key = `${posAttr.getX(i).toFixed(1)},${posAttr.getY(i).toFixed(1)},${posAttr.getZ(i).toFixed(1)}`;
            if (!unique.has(key))
                unique.set(key, new THREE.Vector3(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i)));
        }
        srcGeo.dispose();

        const nodes: THREE.Mesh[] = [];
        unique.forEach(v => {
            const mat  = new THREE.MeshBasicMaterial({
                color: THEMES.dark.nodePulse, transparent: true,
                opacity: 0.0, blending: THREE.AdditiveBlending
            });
            const mesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.28, 0), mat);
            mesh.position.copy(v);
            mesh.userData.phase = Math.random() * Math.PI * 2;
            mesh.userData.speed = 0.5 + Math.random() * 0.8;
            scene.add(mesh);
            nodes.push(mesh);
        });
        return nodes;
    };
    const nodes = buildNodeSystem();

    // ══════════════════════════════════════════════════════════════════════════
    // 5. DATA-STREAM PARTICLES
    // ══════════════════════════════════════════════════════════════════════════
    const STREAM_COUNT = isMobile() ? 50 : 80;
    const streamGeo   = new THREE.BufferGeometry();
    const streamPos   = new Float32Array(STREAM_COUNT * 3);
    const streamMeta: { theta: number; phi: number; speed: number; radius: number }[] = [];
    const STREAM_R    = 32.4;

    for (let i = 0; i < STREAM_COUNT; i++) {
        const theta = Math.acos(2 * Math.random() - 1);
        const phi   = Math.random() * Math.PI * 2;
        streamMeta.push({ theta, phi, speed: 0.003 + Math.random() * 0.008, radius: STREAM_R });
        streamPos[i * 3]     = STREAM_R * Math.sin(theta) * Math.cos(phi);
        streamPos[i * 3 + 1] = STREAM_R * Math.cos(theta);
        streamPos[i * 3 + 2] = STREAM_R * Math.sin(theta) * Math.sin(phi);
    }
    streamGeo.setAttribute('position', new THREE.BufferAttribute(streamPos, 3));
    const streamMat = new THREE.PointsMaterial({
        size: isMobile() ? 0.15 : 0.18,
        color: THEMES.dark.particle,
        transparent: true, opacity: 0.55,
        blending: THREE.AdditiveBlending, depthWrite: false,
        sizeAttenuation: true
    });
    const streamPoints = new THREE.Points(streamGeo, streamMat);
    scene.add(streamPoints);

    // ══════════════════════════════════════════════════════════════════════════
    // 6. ELECTROMAGNETIC RIPPLES
    // ══════════════════════════════════════════════════════════════════════════
    const MAX_RIPPLES = 4;
    const ripplePool: { mesh: THREE.Mesh; mat: THREE.MeshBasicMaterial; geo: THREE.TorusGeometry }[] = [];

    const spawnRipple = () => {
        const mat  = new THREE.MeshBasicMaterial({
            color: THEMES.dark.ripple, wireframe: true,
            transparent: true, opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        const geo  = new THREE.TorusGeometry(1, 0.04, 6, 40);
        const mesh = new THREE.Mesh(geo, mat);
        const theta = Math.acos(2 * Math.random() - 1);
        const phi   = Math.random() * Math.PI * 2;
        mesh.position.set(
            32 * Math.sin(theta) * Math.cos(phi),
            32 * Math.cos(theta),
            32 * Math.sin(theta) * Math.sin(phi)
        );
        mesh.lookAt(0, 0, 0);
        mesh.userData = { scale: 0.1, life: 1.0, active: false };
        scene.add(mesh);
        ripplePool.push({ mesh, mat, geo });
        return { mesh, mat, geo };
    };
    for (let i = 0; i < MAX_RIPPLES; i++) spawnRipple();

    let nextRippleIdx = 0;
    let rippleTimer   = 0;
    const RIPPLE_INTERVAL = 1.8;

    const triggerRipple = () => {
        const r = ripplePool[nextRippleIdx % ripplePool.length];
        nextRippleIdx++;
        const theta = Math.acos(2 * Math.random() - 1);
        const phi   = Math.random() * Math.PI * 2;
        r.mesh.position.set(
            32 * Math.sin(theta) * Math.cos(phi),
            32 * Math.cos(theta),
            32 * Math.sin(theta) * Math.sin(phi)
        );
        r.mesh.lookAt(0, 0, 0);
        r.mesh.userData = { scale: 0.1, life: 1.0, active: true };
        r.mesh.visible  = true;
        r.mat.color.setHex(T().ripple);
    };

    // ══════════════════════════════════════════════════════════════════════════
    // 7. FLOATING BUBBLES
    // ══════════════════════════════════════════════════════════════════════════
    const MAX_BUBBLES = isMobile() ? 60 : 130;
    const spreadX     = isMobile() ? 38 : 72;
    const bubbleGeo   = new THREE.IcosahedronGeometry(1, 0);
    const bubbleMat   = new THREE.MeshBasicMaterial({
        color: THEMES.dark.bubble, wireframe: true,
        transparent: true, opacity: 0.55,
        blending: THREE.AdditiveBlending, depthWrite: false
    });
    const bubbles: THREE.Mesh[] = [];
    const resetBubble = (mesh: THREE.Mesh) => {
        mesh.position.set((Math.random() - 0.5) * spreadX, -52 - Math.random() * 40, (Math.random() - 0.5) * 28);
        const s = Math.random() * (isMobile() ? 0.6 : 1.1) + 0.3;
        mesh.scale.set(s, s, s);
        mesh.userData = { speed: Math.random() * 0.055 + 0.018, wobble: Math.random() * Math.PI * 2, popping: false };
        mesh.visible = true;
    };
    for (let i = 0; i < MAX_BUBBLES; i++) {
        const m = new THREE.Mesh(bubbleGeo, bubbleMat);
        resetBubble(m);
        scene.add(m);
        bubbles.push(m);
    }

    const popParticles: { points: THREE.Points; pVelo: {x:number;y:number;z:number}[]; life: number }[] = [];
    const pop = (pos: THREE.Vector3) => {
        const pCount = 12;
        const pGeo   = new THREE.BufferGeometry();
        const pPos   = new Float32Array(pCount * 3);
        const pVelo  = [];
        for (let i = 0; i < pCount; i++) {
            pPos[i * 3]     = pos.x;
            pPos[i * 3 + 1] = pos.y;
            pPos[i * 3 + 2] = pos.z;
            pVelo.push({ x: (Math.random() - 0.5) * 0.35, y: (Math.random() - 0.5) * 0.35, z: (Math.random() - 0.5) * 0.35 });
        }
        pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
        const pMat = new THREE.PointsMaterial({
            size: 0.12, color: T().bubble,
            transparent: true, opacity: 1.0,
            blending: THREE.AdditiveBlending
        });
        const pts = new THREE.Points(pGeo, pMat);
        scene.add(pts);
        popParticles.push({ points: pts, pVelo, life: 1.0 });
    };

    // ══════════════════════════════════════════════════════════════════════════
    // 8. FLYING CREATURES
    // ══════════════════════════════════════════════════════════════════════════
    const createBird = () => {
        const bird    = new THREE.Group();
        const bodyMat = new THREE.MeshBasicMaterial({ color: THEMES.dark.creature, wireframe: true });
        const wingMat = new THREE.MeshBasicMaterial({ color: THEMES.dark.creatureWing, wireframe: true });
        const body    = new THREE.Mesh(new THREE.ConeGeometry(0.4, 1.5, 4), bodyMat);
        body.rotation.x = Math.PI / 2;
        bird.add(body);
        const makePivot = (side: number) => {
            const pivot = new THREE.Group();
            pivot.position.set(side * 0.2, 0.1, 0);
            const wing = new THREE.Mesh(new THREE.ConeGeometry(0.6, 2, 3), wingMat);
            wing.position.set(side * 1, 0, 0);
            wing.rotation.z = side * -Math.PI / 2;
            pivot.add(wing);
            bird.add(pivot);
            return pivot;
        };
        bird.userData = {
            leftWingPivot:  makePivot(-1),
            rightWingPivot: makePivot(1),
            flapSpeed: Math.random() * 0.0012 + 0.002
        };
        bird.scale.setScalar(1.08);
        return bird;
    };
    const createUFO = () => {
        const ufo  = new THREE.Group();
        const disc = new THREE.Mesh(
            new THREE.CylinderGeometry(1.5, 1.5, 0.2, 8),
            new THREE.MeshBasicMaterial({ color: THEMES.dark.ufo, wireframe: true })
        );
        ufo.add(disc);
        const dome = new THREE.Mesh(
            new THREE.IcosahedronGeometry(0.7, 1),
            new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
        );
        dome.position.y = 0.1;
        ufo.add(dome);
        ufo.scale.setScalar(1.08);
        return ufo;
    };
    const creatures: THREE.Group[] = [];
    const creatureCount = isMobile() ? 3 : 5;
    for (let i = 0; i < creatureCount; i++) {
        const wrapper = new THREE.Group();
        const bird    = createBird();
        const ufo     = createUFO();
        wrapper.add(bird);
        wrapper.add(ufo);
        wrapper.userData = {
            angle:    Math.random() * Math.PI * 2,
            radiusX:  38 + Math.random() * 38,
            radiusZ:  18 + Math.random() * 18,
            speed:    0.0018 + Math.random() * 0.002,
            baseY:    (Math.random() - 0.5) * 38,
            birdRef:  bird,
            ufoRef:   ufo
        };
        creatures.push(wrapper);
        scene.add(wrapper);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 9. POST PROCESSING
    // ══════════════════════════════════════════════════════════════════════════
    const composer  = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        state.isDark ? 2.2 : 0.7,
        0.5,
        state.isDark ? 0.65 : 0.80
    );
    bloomPass.enabled = true;
    composer.addPass(bloomPass);

    const rgbShiftPass = new ShaderPass(RGBShiftShader);
    rgbShiftPass.uniforms['amount'].value = 0.0012;
    composer.addPass(rgbShiftPass);

    // ══════════════════════════════════════════════════════════════════════════
    // THEME APPLICATION
    // ══════════════════════════════════════════════════════════════════════════
    const applyTheme = () => {
        const th = T();

        scanMat.color.setHex(th.scanLine);
        scanRingMat.color.setHex(th.scanLine);
        nodes.forEach(n => (n.material as THREE.MeshBasicMaterial).color.setHex(th.nodePulse));
        streamMat.color.setHex(th.particle);
        ripplePool.forEach(r => r.mat.color.setHex(th.ripple));
        bubbleMat.color.setHex(th.bubble);

        stars.visible   = state.isDark;
        starMat.color.setHex(th.star);
        starMat.opacity = state.isDark ? 0.85 : 0.4;
        starMat.blending = state.isDark ? THREE.AdditiveBlending : THREE.NormalBlending;
        starMat.needsUpdate = true;

        creatures.forEach(wrapper => {
            const bird = wrapper.userData.birdRef as THREE.Group;
            const ufo  = wrapper.userData.ufoRef  as THREE.Group;
            if (bird.children[0]) (bird.children[0] as THREE.Mesh).material = new THREE.MeshBasicMaterial({ color: th.creature, wireframe: true });
            if (ufo.children[0])  (ufo.children[0]  as THREE.Mesh).material = new THREE.MeshBasicMaterial({ color: th.ufo,      wireframe: true });
        });

        dirLight.color.setHex(state.isDark ? 0xaabbdd : 0xffeedd);
        dirLight.intensity = state.isDark ? 1.4 : 1.8;

        bloomPass.strength  = state.isDark ? 2.2 : 0.7;
        bloomPass.threshold = state.isDark ? 0.65 : 0.80;
    };

    applyTheme();

    // ══════════════════════════════════════════════════════════════════════════
    // ANIMATE LOOP
    // ══════════════════════════════════════════════════════════════════════════
    const animate = () => {
        requestAnimationFrame(animate);

        const now   = Date.now();
        const delta = (now - lastTime) / 1000;
        lastTime    = now;
        state.timeMs += delta * 1000 * state.speedMultiplier;
        const t  = state.timeMs * 0.001;
        const sm = state.speedMultiplier;

        // ── Moon animations ─────────────────────────────────────────────────
        if (moonGroup.visible) {
            moonMesh.rotation.y += 0.0005 * sm;
            moonMesh.rotation.x += 0.0002 * sm;
            moonHalo.rotation.z  += 0.0005 * sm;
            moonDust.rotation.y  += 0.001 * sm;
            
            // Gentle breathing and floating
            const breathe = 1 + Math.sin(t * 1.2) * 0.012;
            moonMesh.scale.setScalar(breathe);
            moonGroup.position.y = -180 + Math.sin(t * 1.8) * 2.5;
            
            // Halo gentle pulse
            moonHaloMat.opacity = 0.18 + Math.sin(t * 0.6) * 0.06;
        }

        // ── Sun animations ──────────────────────────────────────────────────
        if (sunGroup.visible) {
            sunBodyMat.uniforms.time.value = t;
            sunRayGroup.rotation.z += 0.002 * sm;
            sunMesh.rotation.y     += 0.0025 * sm;
            sunRing.rotation.z     += 0.0012 * sm;
            sunParticles.rotation.y += 0.0015 * sm;
            
            // Dynamic pulsing and floating
            const sunPulse = 1 + Math.sin(t * 1.8) * 0.018;
            sunGroup.scale.setScalar(sunPulse);
            sunGroup.position.y = 180 + Math.sin(t * 1.4) * 2.2;

            // Ray shimmer
            sunRayMats.forEach((mat, i) => {
                mat.opacity = 0.10 + Math.sin(t * 1.8 + i * 0.5) * 0.08;
            });
            
            // Ring pulse
            sunRingMat.opacity = 0.20 + Math.sin(t * 2.0) * 0.08;
        }

        // ── Stars ───────────────────────────────────────────────────────────
        stars.rotation.y += 0.00008 * sm;

        // ── Scan Line ───────────────────────────────────────────────────────
        const scanY = Math.sin(t * 0.45) * 34;
        scanLine.position.y = scanY;
        scanRing.position.y = scanY;
        const scanIntensity = 1 - Math.abs(scanY) / 34;
        scanMat.opacity     = state.isDark ? 0.55 * scanIntensity : 0.35 * scanIntensity;
        scanRingMat.opacity = state.isDark ? 0.40 * scanIntensity : 0.25 * scanIntensity;

        // ── Node pulses ──────────────────────────────────────────────────────
        nodes.forEach(node => {
            const pulse = 0.5 + 0.5 * Math.sin(t * node.userData.speed + node.userData.phase);
            (node.material as THREE.MeshBasicMaterial).opacity = state.isDark ? pulse * 0.75 : pulse * 0.50;
            node.scale.setScalar(0.9 + pulse * 0.5);
            node.rotation.y += 0.02 * sm;
        });

        // ── Data stream particles ────────────────────────────────────────────
        const sPos = streamPoints.geometry.attributes.position;
        for (let i = 0; i < STREAM_COUNT; i++) {
            const m = streamMeta[i];
            m.phi += m.speed * sm;
            if (m.phi > Math.PI * 2) {
                m.phi -= Math.PI * 2;
                m.theta = Math.acos(2 * Math.random() - 1);
            }
            sPos.array[i * 3]     = STREAM_R * Math.sin(m.theta) * Math.cos(m.phi);
            sPos.array[i * 3 + 1] = STREAM_R * Math.cos(m.theta);
            sPos.array[i * 3 + 2] = STREAM_R * Math.sin(m.theta) * Math.sin(m.phi);
        }
        sPos.needsUpdate = true;
        streamMat.opacity = state.isDark ? 0.55 : 0.38;

        // ── Ripples ──────────────────────────────────────────────────────────
        rippleTimer += delta * sm;
        if (rippleTimer >= RIPPLE_INTERVAL) {
            rippleTimer = 0;
            triggerRipple();
        }
        ripplePool.forEach(r => {
            if (!r.mesh.userData.active) return;
            r.mesh.userData.scale += delta * 14 * sm;
            r.mesh.userData.life  -= delta * 0.55 * sm;
            const s = r.mesh.userData.scale;
            r.mesh.scale.set(s, s, 1);
            r.mat.opacity = state.isDark ? Math.max(0, r.mesh.userData.life) * 0.7 : Math.max(0, r.mesh.userData.life) * 0.45;
            if (r.mesh.userData.life <= 0) {
                r.mesh.userData.active = false;
                r.mesh.visible = false;
            }
        });

        // ── Bubbles ──────────────────────────────────────────────────────────
        bubbles.forEach(mesh => {
            if (mesh.userData.popping) return;
            mesh.position.y += mesh.userData.speed * sm;
            mesh.position.x += Math.sin(t + mesh.userData.wobble) * 0.018 * sm;
            mesh.rotation.y  += 0.008 * sm;
            if (mesh.position.y > 44) {
                mesh.userData.popping = true;
                pop(mesh.position);
                mesh.visible = false;
                setTimeout(() => { mesh.userData.popping = false; resetBubble(mesh); }, 1200 + Math.random() * 2000);
            }
        });

        for (let i = popParticles.length - 1; i >= 0; i--) {
            const p   = popParticles[i];
            p.life   -= delta * 1.1 * sm;
            const pa  = p.points.geometry.attributes.position;
            for (let j = 0; j < p.pVelo.length; j++) {
                pa.array[j * 3]     += p.pVelo[j].x * sm;
                pa.array[j * 3 + 1] += p.pVelo[j].y * sm;
                pa.array[j * 3 + 2] += p.pVelo[j].z * sm;
            }
            pa.needsUpdate = true;
            (p.points.material as THREE.PointsMaterial).opacity = Math.max(0, p.life);
            if (p.life <= 0) {
                scene.remove(p.points);
                p.points.geometry.dispose();
                (p.points.material as THREE.Material).dispose();
                popParticles.splice(i, 1);
            }
        }

        // ── Creatures ────────────────────────────────────────────────────────
        creatures.forEach(wrapper => {
            const d  = wrapper.userData;
            const vm = Math.cos(d.angle * 3) * 0.0008;
            d.angle += (d.speed + vm) * sm;
            wrapper.position.x = Math.cos(d.angle) * d.radiusX;
            wrapper.position.z = Math.sin(d.angle) * d.radiusZ;
            wrapper.position.y = d.baseY + Math.sin(d.angle * 3) * 5 + Math.sin(t + d.baseY) * 0.5;
            wrapper.rotation.z = Math.sin(d.angle) * 0.2 + (state.isDark ? Math.sin(t) * 0.12 : 0);
            wrapper.rotation.y = -d.angle + Math.PI / 2;

            d.birdRef.visible = !state.isDark;
            d.ufoRef.visible  =  state.isDark;

            if (!state.isDark) {
                const flap = Math.sin(state.timeMs * d.birdRef.userData.flapSpeed);
                d.birdRef.userData.leftWingPivot.rotation.z  =  flap * 0.6;
                d.birdRef.userData.rightWingPivot.rotation.z = -flap * 0.6;
            } else {
                d.ufoRef.rotation.y += 0.1 * sm;
                wrapper.position.x  += Math.sin(t * 2) * 0.18;
            }
        });

        // ── RGB shift ────────────────────────────────────────────────────────
        rgbShiftPass.uniforms['amount'].value = state.isDark
            ? 0.0012 + Math.sin(t * 2.5) * 0.0009
            : 0.0003;

        composer.render();
    };

    // ══════════════════════════════════════════════════════════════════════════
    // RESIZE
    // ══════════════════════════════════════════════════════════════════════════
    const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    animate();

    // ══════════════════════════════════════════════════════════════════════════
    // PUBLIC API
    // ══════════════════════════════════════════════════════════════════════════
    return {
        updateTheme(newVal: boolean) {
            state.isDark = newVal;
            triggerCelestialTransition(newVal);
            applyTheme();
        },

        setSpeed(multiplier: number, duration = 0) {
            if (duration > 0) {
                gsap.to(state, { speedMultiplier: multiplier, duration, ease: 'power2.inOut' });
            } else {
                gsap.killTweensOf(state);
                state.speedMultiplier = multiplier;
            }
        },

        celebrate() {
            bubbles.forEach(b => {
                b.userData.speed *= 3.5;
                setTimeout(() => (b.userData.speed /= 3.5), 3200);
            });
            let rc = 0;
            const ri = setInterval(() => {
                triggerRipple();
                if (++rc >= 8) clearInterval(ri);
            }, 280);
            bloomPass.strength = state.isDark ? 4.5 : 2.0;
            gsap.to(bloomPass, {
                strength: state.isDark ? 2.2 : 0.7,
                duration: 2.5,
                ease: 'power2.out'
            });
            const target = state.isDark ? moonMesh : sunMesh;
            gsap.to(target.scale, { x: 1.2, y: 1.2, z: 1.2, duration: 0.4, yoyo: true, repeat: 3, ease: 'power2.inOut' });
        },

        destroy() {
            window.removeEventListener('resize', onResize);
            renderer.dispose();
        }
    };
}

export function createParticles(x: number, y: number, color: string) {
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.width  = (Math.random() * 8 + 4) + 'px';
        particle.style.height = particle.style.width;
        particle.style.backgroundColor = color;
        particle.style.left = x + 'px';
        particle.style.top  = y + 'px';
        document.body.appendChild(particle);

        const angle    = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 100 + 50;

        gsap.to(particle, {
            x: Math.cos(angle) * velocity,
            y: Math.sin(angle) * velocity,
            opacity: 0,
            scale: 0,
            duration: 0.6 + Math.random() * 0.4,
            ease: 'power2.out',
            onComplete: () => particle.remove()
        });
    }
}

// ══════════════════════════════════════════════════════════════════════════════
// Layout Component
// ══════════════════════════════════════════════════════════════════════════════
const LayoutComponent = defineComponent({
    name: 'LayoutComponent',
    props: {
        title: {
            type: String,
            default: 'OutTaiwan'
        }
    },
    template: `
        <div class="layout-app-bg"></div>
        <canvas id="three-canvas" class="layout-three-canvas"></canvas>

        <!-- Cyberpunk UI Borders -->
        <div class="layout-cyberpunk-borders">
            <div class="layout-scanline-overlay"></div>
        </div>

        <div v-cloak class="layout-main-content-wrapper">
            <!-- Global Announcement Banner (Overlay) -->
            <div v-if="globalAnnouncement && globalAnnouncement.show" 
                 class="layout-announcement-overlay">
                <div class="layout-announcement-card">
                    <div class="layout-announcement-icon-container">
                        <span class="layout-announcement-icon">🌍</span>
                    </div>
                    <div class="layout-announcement-content">
                        <p class="layout-announcement-text">
                            {{ globalAnnouncement.message }}
                            <span class="inline-block w-20"></span>
                            {{ globalAnnouncement.message }}
                        </p>
                    </div>
                    <button @click="globalAnnouncement.show = false" class="layout-announcement-close-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Content Area -->
            <div id="content-area" class="layout-content-area">
                <slot></slot>
            </div>
        </div>

        <!-- Collapsible Floating Menu -->
        <div class="layout-floating-menu-container">
                <!-- Menu Items (Collapsible) -->
                <div v-if="isMenuOpen" class="layout-menu-items">
                    <!-- Home Button -->
                    <button @click="goToHome(); isMenuOpen = false" 
                            class="layout-menu-btn">
                        <span class="layout-menu-btn-icon">🏠</span>
                        <span class="layout-menu-btn-tooltip">
                            回首頁
                        </span>
                    </button>

                    <!-- Back to Top -->
                    <button @click="scrollToTop(); isMenuOpen = false" 
                            class="layout-menu-btn">
                        <span class="layout-menu-btn-icon">⬆️</span>
                        <span class="layout-menu-btn-tooltip">
                            回到頂端
                        </span>
                    </button>

                    <!-- Go Back -->
                    <button @click="goBack(); isMenuOpen = false" 
                            class="layout-menu-btn">
                        <span class="layout-menu-btn-icon">⬅️</span>
                        <span class="layout-menu-btn-tooltip">
                            上一頁
                        </span>
                    </button>

                    <!-- Theme Toggle -->
                    <button @click="toggleDarkMode(); isMenuOpen = false" 
                            class="layout-menu-btn">
                        <span v-if="isDarkMode" class="layout-menu-btn-icon">☀️</span>
                        <span v-else class="layout-menu-btn-icon">🌙</span>
                        <span class="layout-menu-btn-tooltip">
                            {{ isDarkMode ? '切換亮色模式' : '切換深色模式' }}
                        </span>
                    </button>
                </div>

                <!-- Main Menu Toggle Button -->
                <button @click="isMenuOpen = !isMenuOpen" 
                        class="layout-main-menu-toggle">
                    <!-- Glow effect for dark mode -->
                    <div class="layout-main-menu-glow"></div>
                    
                    <svg v-if="!isMenuOpen" xmlns="http://www.w3.org/2000/svg" class="layout-main-menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="layout-main-menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Running Dog -->
            <div class="running-dog" v-if="dogActive" :style="dogStyle">
                <span class="dog-emoji">🐕</span>
                <div class="dog-dust"></div>
            </div>

            <!-- Peeking Animal / Spotlight -->
            <div class="peek-container" :style="peekStyle" :class="{ 'active': peekingActive }">
                <span v-if="!isDarkMode" class="peek-icon">🐱</span>
                <div v-else class="spotlight-wrapper">
                    <span class="flashlight-icon">🔦</span>
                    <div class="spotlight-beam"></div>
                </div>
            </div>

            <!-- Bottom Left Content Slot (For Category Selector, Weather, etc.) -->
            <div class="layout-bottom-left-slot">
                <slot name="bottom-left"></slot>
            </div>

        <!-- Footer -->
        <footer v-if="false" class="mt-20 pb-24 text-center text-slate-900 dark:text-slate-400 text-sm">
            <p>© 2026 Elon提醒出國玩記得注意荷包 ✈️</p>
        </footer>
    `,
    setup(props) {
        const initialDarkMode = typeof window !== 'undefined' ? localStorage.getItem('darkMode') === 'true' : false;
        const isDarkMode         = ref(initialDarkMode);
        const isMenuOpen         = ref(false);
        const dogActive          = ref(false);
        const birdActive         = ref(false);
        const peekingActive      = ref(false);
        const globalAnnouncement = ref({ show: false, message: '' });

        const triggerAnimal = (activeState: any, styleObject: any, offset: number, baseDuration: number) => {
            if (activeState.value) return;
            const fromLeft   = Math.random() > 0.5;
            const screenWidth = window.innerWidth;
            styleObject.value.left      = fromLeft ? `-${offset}px` : `${screenWidth + offset}px`;
            styleObject.value.transform = fromLeft ? 'scaleX(-1)' : 'scaleX(1)';
            activeState.value = true;
            gsap.to(styleObject.value, {
                left: fromLeft ? `${screenWidth + offset}px` : `-${offset}px`,
                duration: baseDuration + Math.random() * 2,
                ease: 'power1.inOut',
                onComplete: () => { activeState.value = false; }
            });
        };

        const toggleDarkMode = () => {
            isDarkMode.value = !isDarkMode.value;
            document.body.classList.toggle('dark', isDarkMode.value);
            localStorage.setItem('darkMode', isDarkMode.value ? 'true' : 'false');
        };
        const goToHome   = () => { window.location.href = import.meta.env.BASE_URL + 'index.html'; };
        const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };
        const goBack     = () => { window.history.back(); };

        const fetchGlobalAnnouncement = async () => {
            try {
                const response = await fetch(`${import.meta.env.BASE_URL}announcements.json?t=${Date.now()}`);
                if (!response.ok) throw new Error('Global fetch failed');
                const data = await response.json();
                if (data.global) globalAnnouncement.value = data.global;
            } catch (error) {
                console.error('Failed to fetch global announcement:', error);
            }
        };

        const handleGlobalClick = (e: MouseEvent) => {
            createParticles(e.clientX, e.clientY, isDarkMode.value ? '#94a3b8' : '#0f172a');
            const target = e.target as HTMLElement;
            if (!target.closest('.layout-floating-menu-container')) {
                isMenuOpen.value = false;
            }
        };

        const handleScroll = () => { isMenuOpen.value = false; };

        let threeBg: ReturnType<typeof initThreeBackground> = null;

        onMounted(() => {
            document.title = props.title;

            threeBg = initThreeBackground(isDarkMode.value);
            // @ts-ignore
            window.threeBg = threeBg;

            const savedDarkMode = localStorage.getItem('darkMode') === 'true';
            isDarkMode.value = savedDarkMode;
            if (savedDarkMode) {
                document.body.classList.add('no-transition');
                document.body.classList.add('dark');
                void document.body.offsetHeight;
                setTimeout(() => {
                    document.body.classList.remove('no-transition');
                }, 50);
            }

            fetchGlobalAnnouncement();
            window.addEventListener('click', handleGlobalClick);
            window.addEventListener('scroll', handleScroll, { passive: true });
        });

        onUnmounted(() => {
            window.removeEventListener('click', handleGlobalClick);
            window.removeEventListener('scroll', handleScroll);
            if (threeBg) threeBg.destroy();
        });

        watch(() => props.title, (newTitle) => { document.title = newTitle; });

        watch(isDarkMode, (newVal) => {
            if (threeBg) threeBg.updateTheme(newVal);
        });

        return {
            isDarkMode, isMenuOpen, dogActive, birdActive, peekingActive,
            globalAnnouncement, toggleDarkMode, goToHome, scrollToTop, goBack
        };
    }
});

export { LayoutComponent };