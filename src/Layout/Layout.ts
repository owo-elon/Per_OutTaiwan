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
            gridPrimary:    0x00f2ff,   // cyan
            gridSecondary:  0x0066ff,   // electric blue
            nodePulse:      0x00f2ff,
            scanLine:       0x00f2ff,
            particle:       0x00ffaa,
            ripple:         0x00f2ff,
            star:           0xffffff,
            creature:       0xffb703,
            creatureWing:   0xfb8500,
            ufo:            0x8ecae6,
            bubble:         0x00f2ff,
        },
        light: {
            bg:             0xf0f4f8,
            gridPrimary:    0x044e3a,   // deep teal
            gridSecondary:  0x0a7c5c,   // mid teal
            nodePulse:      0x044e3a,
            scanLine:       0x0a7c5c,
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
    // 2. OUTER CAGE — single low-detail ghost ring, barely visible
    // ══════════════════════════════════════════════════════════════════════════
    const cageMat = new THREE.MeshBasicMaterial({
        color: THEMES.dark.gridPrimary,
        wireframe: true, transparent: true, opacity: 0.04,   // ← was 0.08
        side: THREE.DoubleSide
    });
    // detail: 1 → 80 triangles only, much sparser than detail: 2 (320 tri)
    const cage = new THREE.Mesh(new THREE.IcosahedronGeometry(58, 1), cageMat);
    scene.add(cage);
 
    // ══════════════════════════════════════════════════════════════════════════
    // 3. MAIN TECH GRID — ONE primary + ONE ghost layer (removed inner sphere)
    //
    //  Before: 3 layers (r32d2 + r20d1 + r44d1) → too many overlapping edges
    //  After:  2 layers (r32d1 + r46d1)
    //    - Primary  r32 detail 1 → 80 clean triangles, clearly readable
    //    - Ghost    r46 detail 1 → very low opacity, gives depth without clutter
    // ══════════════════════════════════════════════════════════════════════════
    const gridLayers = [];
 
    const GRID_DEFS = [
        // Main hero sphere — detail 1 keeps edges wide & legible
        { radius: 32, detail: 1, opacityDark: 0.38, opacityLight: 0.42,
          rotSpeedY:  0.0005, rotSpeedX: 0.00015, primary: true  },
        // Ghost halo — just enough to imply depth
        { radius: 46, detail: 1, opacityDark: 0.07, opacityLight: 0.09,
          rotSpeedY: -0.0003, rotSpeedX: 0.00020, primary: false },
    ];
 
    GRID_DEFS.forEach(def => {
        const mat = new THREE.MeshBasicMaterial({
            color: def.primary ? THEMES.dark.gridPrimary : THEMES.dark.gridSecondary,
            wireframe: true, transparent: true,
            opacity: state.isDark ? def.opacityDark : def.opacityLight,
            side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(def.radius, def.detail), mat);
        scene.add(mesh);
        gridLayers.push({ mesh, mat, def });
    });
 
    // ══════════════════════════════════════════════════════════════════════════
    // 4. SCAN LINE — a glowing plane sweeping through the sphere
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
 
    // Glow ring accompanying the scan line
    const scanRingGeo = new THREE.TorusGeometry(52, 0.12, 8, 80);
    const scanRingMat = new THREE.MeshBasicMaterial({
        color: THEMES.dark.scanLine,
        transparent: true, opacity: 0.0,
        blending: THREE.AdditiveBlending
    });
    const scanRing = new THREE.Mesh(scanRingGeo, scanRingMat);
    scene.add(scanRing);
 
    // ══════════════════════════════════════════════════════════════════════════
    // 5. NODE VERTICES — 12 anchor points only (base icosahedron, detail 0)
    //    Before: detail 2 → ~42 unique verts → too many dots cluttering the mesh
    //    After:  detail 0 → exactly 12 verts  → clean, intentional accents
    // ══════════════════════════════════════════════════════════════════════════
    const buildNodeSystem = () => {
        // detail 0 = raw icosahedron: 12 vertices, perfectly spaced
        const srcGeo  = new THREE.IcosahedronGeometry(32, 0);
        const posAttr = srcGeo.getAttribute('position');
        const unique  = new Map();
 
        for (let i = 0; i < posAttr.count; i++) {
            const key = `${posAttr.getX(i).toFixed(1)},${posAttr.getY(i).toFixed(1)},${posAttr.getZ(i).toFixed(1)}`;
            if (!unique.has(key))
                unique.set(key, new THREE.Vector3(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i)));
        }
        srcGeo.dispose();
 
        const nodes = [];
        unique.forEach(v => {
            const geo  = new THREE.OctahedronGeometry(0.28, 0);   // slightly larger, fewer = more readable
            const mat  = new THREE.MeshBasicMaterial({
                color: THEMES.dark.nodePulse, transparent: true,
                opacity: 0.0, blending: THREE.AdditiveBlending
            });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.copy(v);
            mesh.userData.phase = Math.random() * Math.PI * 2;
            mesh.userData.speed = 0.5 + Math.random() * 0.8;      // slower pulse range
            scene.add(mesh);
            nodes.push(mesh);
        });
 
        return nodes;
    };
 
    const nodes = buildNodeSystem();
 
    // ══════════════════════════════════════════════════════════════════════════
    // 6. DATA-STREAM PARTICLES — reduced count to avoid noise on the mesh
    //    Before: 260 particles → creates dense fog over the grid
    //    After:  80 / 50      → sparse trails, grid remains legible
    // ══════════════════════════════════════════════════════════════════════════
    const STREAM_COUNT = isMobile() ? 50 : 80;
    const streamGeo   = new THREE.BufferGeometry();
    const streamPos   = new Float32Array(STREAM_COUNT * 3);
    const streamMeta  = []; // { theta, phi, speed, radius }
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
        size: isMobile() ? 0.15 : 0.18,          // smaller dots
        color: THEMES.dark.particle,
        transparent: true, opacity: 0.55,         // was 0.75 — more subtle
        blending: THREE.AdditiveBlending, depthWrite: false,
        sizeAttenuation: true
    });
    const streamPoints = new THREE.Points(streamGeo, streamMat);
    scene.add(streamPoints);
 
    // ══════════════════════════════════════════════════════════════════════════
    // 7. ELECTROMAGNETIC RIPPLES — expanding torus rings
    // ══════════════════════════════════════════════════════════════════════════
    const MAX_RIPPLES   = 4;
    const ripplePool    = [];
 
    const spawnRipple   = () => {
        const mat  = new THREE.MeshBasicMaterial({
            color: THEMES.dark.ripple, wireframe: true,
            transparent: true, opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        const geo  = new THREE.TorusGeometry(1, 0.04, 6, 40);
        const mesh = new THREE.Mesh(geo, mat);
 
        // Random orientation on icosahedron surface
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
    const RIPPLE_INTERVAL = 1.8; // seconds between spawns
 
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
    // 8. FLOATING BUBBLES (wire polyhedra)
    // ══════════════════════════════════════════════════════════════════════════
    const MAX_BUBBLES   = isMobile() ? 60 : 130;
    const spreadX       = isMobile() ? 38 : 72;
    const bubbleGeo     = new THREE.IcosahedronGeometry(1, 0);
    const bubbleMat     = new THREE.MeshBasicMaterial({
        color: THEMES.dark.bubble, wireframe: true,
        transparent: true, opacity: 0.55,
        blending: THREE.AdditiveBlending, depthWrite: false
    });
 
    const bubbles = [];
    const resetBubble = (mesh) => {
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
 
    const popParticles = [];
    const pop = (pos) => {
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
    // 9. FLYING CREATURES (Birds / UFOs)
    // ══════════════════════════════════════════════════════════════════════════
    const createBird = () => {
        const bird    = new THREE.Group();
        const bodyMat = new THREE.MeshBasicMaterial({ color: THEMES.dark.creature, wireframe: true });
        const wingMat = new THREE.MeshBasicMaterial({ color: THEMES.dark.creatureWing, wireframe: true });
 
        const body = new THREE.Mesh(new THREE.ConeGeometry(0.4, 1.5, 4), bodyMat);
        body.rotation.x = Math.PI / 2;
        bird.add(body);
 
        const makePivot = (side) => {
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
 
    const creatures     = [];
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
    // 10. POST PROCESSING
    // ══════════════════════════════════════════════════════════════════════════
    const composer  = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
 
    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.8,   // strength — boosted for more visible glow on mesh
        0.5,   // radius
        0.75   // threshold — lowered to catch dimmer emissives
    );
    bloomPass.enabled = state.isDark;
    composer.addPass(bloomPass);
 
    const rgbShiftPass = new ShaderPass(RGBShiftShader);
    rgbShiftPass.uniforms['amount'].value = 0.0012;
    composer.addPass(rgbShiftPass);
 
    // ══════════════════════════════════════════════════════════════════════════
    // HELPERS — apply theme colours to every material
    // ══════════════════════════════════════════════════════════════════════════
    const applyTheme = () => {
        const th = T();
 
        // Grid layers
        gridLayers.forEach(({ mesh, mat, def }) => {
            mat.color.setHex(def.primary ? th.gridPrimary : th.gridSecondary);
            mat.opacity = state.isDark ? def.opacityDark : def.opacityLight;
        });
 
        // Cage
        cageMat.color.setHex(th.gridPrimary);
 
        // Scan
        scanMat.color.setHex(th.scanLine);
        scanRingMat.color.setHex(th.scanLine);
 
        // Nodes
        nodes.forEach(n => n.material.color.setHex(th.nodePulse));
 
        // Streams
        streamMat.color.setHex(th.particle);
 
        // Ripples
        ripplePool.forEach(r => r.mat.color.setHex(th.ripple));
 
        // Bubbles
        bubbleMat.color.setHex(th.bubble);
 
        // Stars
        stars.visible = state.isDark;
        starMat.color.setHex(th.star);
        starMat.opacity = state.isDark ? 0.85 : 0.4;
        starMat.blending = state.isDark ? THREE.AdditiveBlending : THREE.NormalBlending;
        starMat.needsUpdate = true;
 
        // Creatures
        creatures.forEach(wrapper => {
            const bird = wrapper.userData.birdRef;
            const ufo  = wrapper.userData.ufoRef;
            if (bird.children[0]) bird.children[0].material.color.setHex(th.creature);
            if (bird.children[1]?.children[0]) bird.children[1].children[0].material.color.setHex(th.creatureWing);
            if (bird.children[2]?.children[0]) bird.children[2].children[0].material.color.setHex(th.creatureWing);
            if (ufo.children[0]) ufo.children[0].material.color.setHex(th.ufo);
        });
 
        // Bloom
        bloomPass.enabled = state.isDark;
    };
 
    applyTheme();
 
    // ══════════════════════════════════════════════════════════════════════════
    // ANIMATE LOOP
    // ══════════════════════════════════════════════════════════════════════════
    const animate = () => {
        requestAnimationFrame(animate);
 
        const now   = Date.now();
        const delta = (now - lastTime) / 1000; // seconds
        lastTime    = now;
        state.timeMs += delta * 1000 * state.speedMultiplier;
        const t = state.timeMs * 0.001;
        const sm = state.speedMultiplier;
 
        // ── Grid layers ─────────────────────────────────────────────────────
        gridLayers.forEach(({ mesh, def }) => {
            mesh.rotation.y += def.rotSpeedY * sm;
            mesh.rotation.x += def.rotSpeedX * sm;
        });
 
        // ── Cage (very slow) ────────────────────────────────────────────────
        cage.rotation.y -= 0.00015 * sm;
        cage.rotation.z += 0.00008 * sm;
 
        // ── Stars ───────────────────────────────────────────────────────────
        stars.rotation.y += 0.00008 * sm;
 
        // ── Scan Line — sweeps Y from -34 to +34 ────────────────────────────
        const scanY = Math.sin(t * 0.45) * 34;
        scanLine.position.y = scanY;
        scanRing.position.y = scanY;
        // Fade at extremes, bright in mid-range
        const scanIntensity = 1 - Math.abs(scanY) / 34;
        scanMat.opacity     = state.isDark
            ? 0.55 * scanIntensity
            : 0.35 * scanIntensity;
        scanRingMat.opacity = state.isDark
            ? 0.4 * scanIntensity
            : 0.25 * scanIntensity;
 
        // ── Node pulses ──────────────────────────────────────────────────────
        nodes.forEach(node => {
            const pulse = 0.5 + 0.5 * Math.sin(t * node.userData.speed + node.userData.phase);
            node.material.opacity = state.isDark
                ? pulse * 0.75
                : pulse * 0.5;
            node.scale.setScalar(0.9 + pulse * 0.5);
            node.rotation.y += 0.02 * sm;
        });
 
        // ── Data stream particles ────────────────────────────────────────────
        const sPos = streamPoints.geometry.attributes.position;
        for (let i = 0; i < STREAM_COUNT; i++) {
            const m = streamMeta[i];
            // Travel along phi (longitude)
            m.phi += m.speed * sm;
            if (m.phi > Math.PI * 2) {
                m.phi -= Math.PI * 2;
                m.theta = Math.acos(2 * Math.random() - 1); // re-seed latitude
            }
            sPos.array[i * 3]     = STREAM_R * Math.sin(m.theta) * Math.cos(m.phi);
            sPos.array[i * 3 + 1] = STREAM_R * Math.cos(m.theta);
            sPos.array[i * 3 + 2] = STREAM_R * Math.sin(m.theta) * Math.sin(m.phi);
        }
        sPos.needsUpdate = true;
        streamMat.opacity = state.isDark ? 0.55 : 0.38;  // was 0.75/0.55
 
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
            r.mat.opacity = state.isDark
                ? Math.max(0, r.mesh.userData.life) * 0.7
                : Math.max(0, r.mesh.userData.life) * 0.45;
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
 
        // Pop particles
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
            p.points.material.opacity = Math.max(0, p.life);
            if (p.life <= 0) {
                scene.remove(p.points);
                p.points.geometry.dispose();
                p.points.material.dispose();
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
            d.ufoRef.visible  = state.isDark;
 
            if (!state.isDark) {
                const flap = Math.sin(state.timeMs * d.birdRef.userData.flapSpeed);
                d.birdRef.userData.leftWingPivot.rotation.z  = flap * 0.6;
                d.birdRef.userData.rightWingPivot.rotation.z = -flap * 0.6;
            } else {
                d.ufoRef.rotation.y += 0.1 * sm;
                wrapper.position.x  += Math.sin(t * 2) * 0.18;
            }
        });
 
        // ── RGB shift pulse ───────────────────────────────────────────────────
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
        /**
         * Call this from your Vue watcher:
         * watch(isDark, val => bg.updateTheme(val))
         */
        updateTheme(newVal) {
            state.isDark = newVal;
            applyTheme();
        },
 
        /**
         * Smoothly change speed.
         * @param {number} multiplier  — e.g. 3 for triple speed
         * @param {number} duration    — seconds (0 = instant)
         */
        setSpeed(multiplier, duration = 0) {
            if (duration > 0) {
                gsap.to(state, { speedMultiplier: multiplier, duration, ease: 'power2.inOut' });
            } else {
                gsap.killTweensOf(state);
                state.speedMultiplier = multiplier;
            }
        },
 
        /**
         * Trigger a celebrate animation burst.
         */
        celebrate() {
            // 1. Bubble burst
            bubbles.forEach(b => {
                b.userData.speed *= 3.5;
                setTimeout(() => (b.userData.speed /= 3.5), 3200);
            });
            // 2. Flash grid to gold
            gridLayers.forEach(({ mat }) => mat.color.setHex(0xffd700));
            setTimeout(() => applyTheme(), 3200);
            // 3. Rapid ripples
            let rc = 0;
            const ri = setInterval(() => {
                triggerRipple();
                if (++rc >= 8) clearInterval(ri);
            }, 280);
            // 4. Bloom spike
            if (state.isDark) {
                bloomPass.strength = 3.2;
                gsap.to(bloomPass, { strength: 1.8, duration: 2.5, ease: 'power2.out' });
            }
        },
 
        /**
         * Clean up event listeners (call on Vue component unmount)
         */
        destroy() {
            window.removeEventListener('resize', onResize);
            renderer.dispose();
        }
    };
}

export function createParticles(x, y, color) {
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.width = (Math.random() * 8 + 4) + 'px';
        particle.style.height = particle.style.width;
        particle.style.backgroundColor = color;
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        document.body.appendChild(particle);

        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 100 + 50;
        
        gsap.to(particle, {
            x: Math.cos(angle) * velocity,
            y: Math.sin(angle) * velocity,
            opacity: 0,
            scale: 0,
            duration: 0.6 + Math.random() * 0.4,
            ease: "power2.out",
            onComplete: () => particle.remove()
        });
    }
}

// Define Layout Component
const LayoutComponent = defineComponent({
    name: 'LayoutComponent',
    props: {
        title: {
            type: String,
            default: 'OutTaiwan'
        }
    },
    template: `
        <div class="app-bg"></div>
        <canvas id="three-canvas" class="three-canvas"></canvas>

        <!-- Cyberpunk UI Borders -->
        <div class="pointer-events-none fixed inset-0 z-50 overflow-hidden">
            <!-- Scanline Overlay (CSS fallback if Three.js FilmPass is subtle) -->
            <div class="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_4px] opacity-10 dark:opacity-40 pointer-events-none mix-blend-overlay"></div>
        </div>

        <div v-cloak class="relative z-10 h-screen overflow-hidden py-4 px-4 md:px-8 flex flex-col">
            <!-- Global Announcement Banner (Overlay) -->
            <div v-if="globalAnnouncement && globalAnnouncement.show" 
                 class="fixed top-0 left-0 right-0 z-[70] pointer-events-none">
                <div class="max-w-5xl mx-auto mt-4 glass-card overflow-hidden flex items-center border-l-4 border-blue-500 animate-fade-in pointer-events-auto shadow-2xl">
                    <div class="px-4 py-3 bg-blue-500/10 text-blue-500">
                        <span class="text-xl">🌍</span>
                    </div>
                    <div class="marquee-container flex-1 py-3">
                        <p class="marquee-content text-black font-bold text-sm md:text-base">
                            {{ globalAnnouncement.message }}
                            <span class="inline-block w-20"></span>
                            {{ globalAnnouncement.message }}
                        </p>
                    </div>
                    <button @click="globalAnnouncement.show = false" class="px-4 text-slate-900 dark:text-slate-400 hover:text-black dark:hover:text-slate-300 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Collapsible Floating Menu -->
            <div class="fixed bottom-4 right-4 flex flex-col items-end gap-3 z-[100]">
                <!-- Menu Items (Collapsible) -->
                <div v-if="isMenuOpen" class="flex flex-col gap-3 mb-1 animate-slide-up">
                    <!-- Home Button -->
                    <button @click="goToHome(); isMenuOpen = false" 
                            class="w-14 h-14 rounded-full flex items-center justify-center transition-all glass-card hover:scale-110 active:scale-95 shadow-2xl group border border-white/20">
                        <span class="text-2xl">🏠</span>
                        <span class="absolute right-16 bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white px-3 py-1 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-slate-200 dark:border-white/10">
                            回首頁
                        </span>
                    </button>

                    <!-- Back to Top -->
                    <button @click="scrollToTop(); isMenuOpen = false" 
                            class="w-14 h-14 rounded-full flex items-center justify-center transition-all glass-card hover:scale-110 active:scale-95 shadow-2xl group border border-white/20">
                        <span class="text-2xl">⬆️</span>
                        <span class="absolute right-16 bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white px-3 py-1 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-slate-200 dark:border-white/10">
                            回到頂端
                        </span>
                    </button>

                    <!-- Go Back -->
                    <button @click="goBack(); isMenuOpen = false" 
                            class="w-14 h-14 rounded-full flex items-center justify-center transition-all glass-card hover:scale-110 active:scale-95 shadow-2xl group border border-white/20">
                        <span class="text-2xl">⬅️</span>
                        <span class="absolute right-16 bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white px-3 py-1 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-slate-200 dark:border-white/10">
                            上一頁
                        </span>
                    </button>

                    <!-- Theme Toggle -->
                    <button @click="toggleDarkMode(); isMenuOpen = false" 
                            class="w-14 h-14 rounded-full flex items-center justify-center transition-all glass-card hover:scale-110 active:scale-95 shadow-2xl group border border-white/20">
                        <span v-if="isDarkMode" class="text-2xl">☀️</span>
                        <span v-else class="text-2xl">🌙</span>
                        <span class="absolute right-16 bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white px-3 py-1 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-slate-200 dark:border-white/10">
                            {{ isDarkMode ? '切換亮色模式' : '切換深色模式' }}
                        </span>
                    </button>
                </div>

                <!-- Main Menu Toggle Button -->
                <button @click="isMenuOpen = !isMenuOpen" 
                        class="w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group border-4 relative overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-400/40 text-slate-900 dark:text-slate-300 shadow-slate-200/50 dark:shadow-[0_0_20px_rgba(148,163,184,0.3)]">
                    <!-- Glow effect for dark mode -->
                    <div class="absolute inset-0 hidden dark:block bg-slate-400/10 animate-pulse"></div>
                    
                    <svg v-if="!isMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <div class="fixed bottom-4 left-4 z-[60] flex flex-col-reverse items-start gap-4">
                <slot name="bottom-left"></slot>
            </div>

        <!-- Content Area -->
            <div id="content-area" class="flex-1 overflow-y-auto">
                <slot></slot>
            </div>
        </div>

        <!-- Footer -->
        <footer v-if="false" class="mt-20 pb-24 text-center text-slate-900 dark:text-slate-400 text-sm">
            <p>© 2026 Elon提醒出國玩記得注意荷包 ✈️</p>
        </footer>
    `,
    setup(props) {
        const isDarkMode = ref(false);
        const isMenuOpen = ref(false);
        const dogActive = ref(false);
        const birdActive = ref(false);
        const peekingActive = ref(false);
        const globalAnnouncement = ref({ show: false, message: '' });
        
        // ==========================================
        // --- 小圖示設計 ---
        // ==========================================
        const triggerAnimal = (activeState, styleObject, offset, baseDuration) => {
            if (activeState.value) return;

            const fromLeft = Math.random() > 0.5;
            const screenWidth = window.innerWidth;
            
            styleObject.value.left = fromLeft ? `-${offset}px` : `${screenWidth + offset}px`;
            styleObject.value.transform = fromLeft ? 'scaleX(-1)' : 'scaleX(1)';
            activeState.value = true;

            gsap.to(styleObject.value, {
                left: fromLeft ? `${screenWidth + offset}px` : `-${offset}px`,
                duration: baseDuration + Math.random() * 2, 
                ease: "power1.inOut",
                onComplete: () => {
                    activeState.value = false;
                }
            });
        };

        /* 暫時不用
        const dogStyle = ref({
            left: '-100px',
            transform: 'scaleX(1)'
        });

        const triggerDog = () => triggerAnimal(dogActive, dogStyle, 150, 7.5);

        setInterval(() => {
            const rand = Math.random();
            if (rand > 0.25) triggerDog();
        }, 1500);
        */


        // ==========================================
        // --- Global Method ---
        // ==========================================
        const toggleDarkMode = () => {
            isDarkMode.value = !isDarkMode.value;
            document.body.classList.toggle('dark', isDarkMode.value);
            localStorage.setItem('darkMode', isDarkMode.value ? 'true' : 'false');
        };
        const goToHome = () => {
            window.location.href = import.meta.env.BASE_URL + 'index.html';
        };
        const scrollToTop = () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        const goBack = () => {
            window.history.back();
        };
        const fetchGlobalAnnouncement = async () => {
            try {
                const response = await fetch(`${import.meta.env.BASE_URL}announcements.json?t=${Date.now()}`);
                if (!response.ok) throw new Error('Global fetch failed');
                const data = await response.json();
                if (data.global) {
                    globalAnnouncement.value = data.global;
                }
            } catch (error) {
                console.error('Failed to fetch global announcement:', error);
            }
        };
        const handleGlobalClick = (e: MouseEvent) => {
            createParticles(e.clientX, e.clientY, isDarkMode.value ? '#94a3b8' : '#0f172a');
            
            // Auto-collapse menus when clicking elsewhere
            const target = e.target as HTMLElement;
            if (!target.closest('.fixed')) {
                isMenuOpen.value = false;
                // We can't directly close weather menu here as it's in the slot, 
                // but we can emit or use a shared state if needed.
                // For now, we'll handle it in the component itself.
            }
        };

        // ==========================================
        // --- Mounted ---
        // ==========================================
        let threeBg = null;
        onMounted(() => {
            document.title = props.title;

            threeBg = initThreeBackground(isDarkMode.value);
            // @ts-ignore
            window.threeBg = threeBg;

            const savedDarkMode = localStorage.getItem('darkMode') === 'true';
            isDarkMode.value = savedDarkMode;
            if (savedDarkMode)  document.body.classList.add('dark');
        
            fetchGlobalAnnouncement();
            window.addEventListener('click', handleGlobalClick);
        });

        onUnmounted(() => {
            window.removeEventListener('click', handleGlobalClick);
        });
        
        // ==========================================
        // --- Watchers ---
        // ==========================================
        watch(() => props.title, (newTitle) => {
            document.title = newTitle;
        });

        watch(isDarkMode, (newVal) => {
            if (threeBg) {
                threeBg.updateTheme(newVal);
            }
        });

        return {
            isDarkMode,
            isMenuOpen,
            dogActive,
            birdActive,
            peekingActive,
            globalAnnouncement,
            toggleDarkMode,
            goToHome,
            scrollToTop,
            goBack
        };
    }
});

// Export Layout Component
export { LayoutComponent };
