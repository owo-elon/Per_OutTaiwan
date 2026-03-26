import { defineComponent, ref, onMounted, onUnmounted, watch } from 'vue';
import * as THREE from 'three';
import gsap from 'gsap';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';

export function initThreeBackground(isDarkMode = false) {
    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;

    // 建立一個內部狀態供 animate 讀取，避免重複初始化
    const state = { isDark: isDarkMode, speedMultiplier: 1, timeMs: Date.now() };
    let lastTime = Date.now();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // --- 響應式配置 ---
    const isMobile = window.innerWidth < 768;
    const MAX_BUBBLES = isMobile ? 80 : 180;
    const spreadX = isMobile ? 40 : 80;

    // ==========================================
    // --- 1. 背景 A: 燈光系統 ---
    // ==========================================
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1.2);
    pointLight.position.set(20, 30, 20);
    scene.add(pointLight);

    // ==========================================
    // --- 2. 背景 B: 星空 ---
    // ==========================================
    const starCount = 6000;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
        starPositions[i * 3] = (Math.random() - 0.5) * 300;
        starPositions[i * 3 + 1] = (Math.random() - 0.5) * 300;
        starPositions[i * 3 + 2] = -50 - Math.random() * 200;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
        size: 0.18, color: 0xffffff, transparent: true, opacity: 0.9,
        blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // ==========================================
    // --- 3. 背景 C: 幾何網格 ---
    // ==========================================
    const geoNetGeometry = new THREE.IcosahedronGeometry(56, 2);
    const geoNetMaterial = new THREE.MeshBasicMaterial({
        color: state.isDark ? 0x00f2ff : 0x044e3a, 
        wireframe: true, 
        transparent: true, 
        opacity: 0.2,
        side: THREE.DoubleSide // 關鍵：確保相機在內部也看得到網格
    });
    const geoNet = new THREE.Mesh(geoNetGeometry, geoNetMaterial);
    scene.add(geoNet);

    // ==========================================
    // --- 4. 背景 D: 泡泡 ---
    // ==========================================
    const bubbleGeometry = new THREE.SphereGeometry(1, 24, 24);
    const bubbleMaterial = new THREE.MeshPhysicalMaterial({
        color: state.isDark ? 0x00f2ff : 0x044e3a, 
        transmission: 0.5, 
        opacity: 0.8, 
        transparent: true,
        roughness: 0.1, 
        thickness: 2, 
        depthWrite: false, // 關鍵：防止透明泡泡互相遮擋消失
    });

    const bubbles = [];
    const resetBubble = (mesh) => {
        mesh.position.set((Math.random() - 0.5) * spreadX, -50 - Math.random() * 50, (Math.random() - 0.5) * 30);
        const s = Math.random() * (isMobile ? 0.7 : 1.26) + 0.35;
        mesh.scale.set(s, s, s);
        mesh.userData = { speed: Math.random() * 0.06 + 0.02, wobble: Math.random() * Math.PI * 2, popping: false };
        mesh.visible = true;
    };

    for (let i = 0; i < MAX_BUBBLES; i++) {
        const mesh = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
        resetBubble(mesh);
        scene.add(mesh);
        bubbles.push(mesh);
    }

    const popParticles = [];
    const pop = (pos, color) => {
        const pCount = 10;
        const pGeom = new THREE.BufferGeometry();
        const pPos = new Float32Array(pCount * 3);
        const pVelo = [];
        for (let i = 0; i < pCount; i++) {
            pPos[i * 3] = pos.x; pPos[i * 3 + 1] = pos.y; pPos[i * 3 + 2] = pos.z;
            pVelo.push({ x: (Math.random() - 0.5) * 0.3, y: (Math.random() - 0.5) * 0.3, z: (Math.random() - 0.5) * 0.3 });
        }
        pGeom.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
        const pMat = new THREE.PointsMaterial({ size: 0.1, color: color, transparent: true, opacity: 1.0 });
        const points = new THREE.Points(pGeom, pMat);
        scene.add(points);
        popParticles.push({ points, pVelo, life: 1.0 });
    };

    // ==========================================
    // --- 5. 背景 E: 動態飛行生物 ---
    // ==========================================
    const creatures = [];
    const creatureCount = isMobile ? 3 : 5;

    const createBird = () => {
        const bird = new THREE.Group();
        const bodyMat = new THREE.MeshStandardMaterial({ color: 0xffb703, flatShading: true });
        const wingMat = new THREE.MeshStandardMaterial({ color: 0xfb8500, flatShading: true });

        const body = new THREE.Mesh(new THREE.ConeGeometry(0.4, 1.5, 4), bodyMat);
        body.rotation.x = Math.PI / 2;
        bird.add(body);

        const leftWingPivot = new THREE.Group();
        leftWingPivot.position.set(-0.2, 0.1, 0);
        const leftWing = new THREE.Mesh(new THREE.ConeGeometry(0.6, 2, 3), wingMat);
        leftWing.position.set(-1, 0, 0);
        leftWing.rotation.z = Math.PI / 2;
        leftWingPivot.add(leftWing);
        bird.add(leftWingPivot);

        const rightWingPivot = new THREE.Group();
        rightWingPivot.position.set(0.2, 0.1, 0);
        const rightWing = new THREE.Mesh(new THREE.ConeGeometry(0.6, 2, 3), wingMat);
        rightWing.position.set(1, 0, 0);
        rightWing.rotation.z = -Math.PI / 2;
        rightWingPivot.add(rightWing); 
        bird.add(rightWingPivot);

        // --- 調整處：將 flapSpeed 調小（原本是 0.003 + 0.004），使其揮動更慢 ---
        bird.userData = { leftWingPivot, rightWingPivot, flapSpeed: Math.random() * 0.001 + 0.002 };
        
        // --- 調整處：體型放大 5% ---
        bird.scale.set(1.05, 1.05, 1.05);
        
        return bird;
    };

    const createUFO = () => {
        const ufo = new THREE.Group();
        const disc = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.2, 16), new THREE.MeshStandardMaterial({ color: 0x8ecae6, metalness: 0.8 }));
        ufo.add(disc);
        const dome = new THREE.Mesh(new THREE.SphereGeometry(0.7, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, transparent: true }));
        dome.position.y = 0.1;
        ufo.add(dome);

        // --- 調整處：體型放大 5% ---
        ufo.scale.set(1.05, 1.05, 1.05);

        return ufo;
    };

    for (let i = 0; i < creatureCount; i++) {
        const wrapper = new THREE.Group();
        const bird = createBird();
        const ufo = createUFO();
        wrapper.add(bird);
        wrapper.add(ufo);

        wrapper.userData = {
            angle: Math.random() * Math.PI * 2,
            radiusX: 40 + Math.random() * 40,
            radiusZ: 20 + Math.random() * 20,
            speed: 0.002 + Math.random() * 0.002,
            baseY: (Math.random() - 0.5) * 40,
            birdRef: bird,
            ufoRef: ufo
        };

        creatures.push(wrapper);
        scene.add(wrapper);
    }

    // ==========================================
    // --- Post-Processing (Cyberpunk UI Borders) ---
    // ==========================================
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const rgbShiftPass = new ShaderPass(RGBShiftShader);
    rgbShiftPass.uniforms['amount'].value = 0.0015; // 輕微的 RGB 位移
    composer.addPass(rgbShiftPass);

    const filmPass = new FilmPass(
        0.35,   // noise intensity
        0.025,  // scanline intensity
        648,    // scanline count
        false   // grayscale
    );
    composer.addPass(filmPass);

    const animate = () => {
        requestAnimationFrame(animate);
        const now = Date.now();
        const delta = now - lastTime;
        lastTime = now;
        state.timeMs += delta * state.speedMultiplier;
        const time = state.timeMs * 0.001;

        // 即時修正顏色邏輯，改為從 state 讀取
        const activeColor = state.isDark ? 0x00f2ff : 0x044e3a; 
        geoNetMaterial.color.setHex(activeColor);
        bubbleMaterial.color.setHex(activeColor);
        geoNetMaterial.opacity = state.isDark ? 0.1 : 0.2;

        stars.rotation.y += 0.0001 * state.speedMultiplier;
        geoNet.rotation.y += 0.0004 * state.speedMultiplier;

        // 飛行生物邏輯
        creatures.forEach(wrapper => {
            const data = wrapper.userData;
            
            // 1. 動態速度：俯衝加速，上升減速
            const verticalMomentum = Math.cos(data.angle * 3) * 0.001; 
            data.angle += (data.speed + verticalMomentum) * state.speedMultiplier;

            wrapper.position.x = Math.cos(data.angle) * data.radiusX;
            wrapper.position.z = Math.sin(data.angle) * data.radiusZ;
            
            const hover = Math.sin(data.angle * 3) * 5; 
            const jitter = Math.sin(time + data.baseY) * 0.5; 
            wrapper.position.y = data.baseY + hover + jitter;

            // 2. 轉彎傾斜：讓飛行更生動
            const bankAngle = Math.sin(data.angle) * 0.2; 
            wrapper.rotation.z = bankAngle + (state.isDark ? Math.sin(time) * 0.15 : 0);
            wrapper.rotation.y = -data.angle + Math.PI / 2;

            data.birdRef.visible = !state.isDark;
            data.ufoRef.visible = state.isDark;

            if (!state.isDark) {
                // 翅膀邏輯：使用變慢後的 flapSpeed
                const flap = Math.sin(state.timeMs * data.birdRef.userData.flapSpeed);
                data.birdRef.userData.leftWingPivot.rotation.z = flap * 0.6;
                data.birdRef.userData.rightWingPivot.rotation.z = -flap * 0.6;
                data.birdRef.rotation.x = Math.sin(time * 5) * 0.05;
            } else {
                data.ufoRef.rotation.y += 0.1 * state.speedMultiplier;
                wrapper.position.x += Math.sin(time * 2) * 0.2;
            }
        });

        // 泡泡運動
        bubbles.forEach(mesh => {
            if (mesh.userData.popping) return;
            mesh.position.y += mesh.userData.speed * state.speedMultiplier;
            mesh.position.x += Math.sin(time + mesh.userData.wobble) * 0.02 * state.speedMultiplier;

            if (mesh.position.y > 45) {
                mesh.userData.popping = true;
                pop(mesh.position, bubbleMaterial.color);
                mesh.visible = false;
                setTimeout(() => {
                    mesh.userData.popping = false;
                    resetBubble(mesh);
                }, 1000 + Math.random() * 2000);
            }
        });

        // 粒子邏輯
        for (let i = popParticles.length - 1; i >= 0; i--) {
            const p = popParticles[i];
            p.life -= 0.02;
            const posArr = p.points.geometry.attributes.position;
            for (let j = 0; j < p.pVelo.length; j++) {
                posArr.array[j * 3] += p.pVelo[j].x;
                posArr.array[j * 3 + 1] += p.pVelo[j].y;
                posArr.array[j * 3 + 2] += p.pVelo[j].z;
            }
            posArr.needsUpdate = true;
            p.points.material.opacity = p.life;
            if (p.life <= 0) {
                scene.remove(p.points);
                p.points.geometry.dispose();
                p.points.material.dispose();
                popParticles.splice(i, 1);
            }
        }

        // 動態調整 RGB Shift 強度，模擬能量脈衝
        rgbShiftPass.uniforms['amount'].value = 0.0015 + Math.sin(time * 2) * 0.001;

        composer.render();
    };

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        composer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();

    // 回傳控制接口給外部 watch 使用
    return {
        updateTheme: (newVal) => {
            state.isDark = newVal;
        },
        setSpeed: (multiplier, duration = 0) => {
            if (duration > 0) {
                gsap.to(state, {
                    speedMultiplier: multiplier,
                    duration: duration,
                    ease: "power2.inOut"
                });
            } else {
                gsap.killTweensOf(state);
                state.speedMultiplier = multiplier;
            }
        },
        celebrate: () => {
            // 1. 泡泡加速
            bubbles.forEach(b => {
                b.userData.speed *= 3;
                setTimeout(() => b.userData.speed /= 3, 3000);
            });

            // 2. 網格變色
            const originalColor = geoNetMaterial.color.getHex();
            geoNetMaterial.color.setHex(0xffd700); // Gold
            setTimeout(() => geoNetMaterial.color.setHex(originalColor), 3000);

            // 3. 星空閃爍加速
            const originalSize = starMaterial.size;
            starMaterial.size = 0.5;
            setTimeout(() => starMaterial.size = originalSize, 3000);
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
            <!-- Top Left Asymmetric Border -->
            <div class="absolute top-0 left-0 w-64 h-64">
                <svg viewBox="0 0 256 256" class="w-full h-full drop-shadow-[0_0_8px_rgba(0,242,255,0.8)]">
                    <path d="M 0 64 L 64 0 L 256 0" fill="none" stroke="rgba(0,242,255,0.5)" stroke-width="2" />
                    <path d="M 0 80 L 80 0 L 256 0" fill="none" class="animate-pulse" stroke="#00f2ff" stroke-width="4" stroke-dasharray="50 200" stroke-dashoffset="0">
                        <animate attributeName="stroke-dashoffset" values="250;0" dur="2s" repeatCount="indefinite" />
                    </path>
                </svg>
            </div>
            <!-- Bottom Right Asymmetric Border -->
            <div class="absolute bottom-0 right-0 w-64 h-64 rotate-180">
                <svg viewBox="0 0 256 256" class="w-full h-full drop-shadow-[0_0_8px_rgba(0,242,255,0.8)]">
                    <path d="M 0 64 L 64 0 L 256 0" fill="none" stroke="rgba(0,242,255,0.5)" stroke-width="2" />
                    <path d="M 0 80 L 80 0 L 256 0" fill="none" class="animate-pulse" stroke="#00f2ff" stroke-width="4" stroke-dasharray="50 200" stroke-dashoffset="0">
                        <animate attributeName="stroke-dashoffset" values="250;0" dur="2s" repeatCount="indefinite" />
                    </path>
                </svg>
            </div>
            <!-- Scanline Overlay (CSS fallback if Three.js FilmPass is subtle) -->
            <div class="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_4px] opacity-20 dark:opacity-40 pointer-events-none mix-blend-overlay"></div>
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
        const dogStyle = ref({
            left: '-100px',
            transform: 'scaleX(1)'
        });
        const peekStyle = ref({
            top: 'auto',
            bottom: 'auto',
            left: 'auto',
            right: 'auto',
            transform: 'none',
            opacity: 0,
            x: 0,
            y: 0
        });
        const triggerDog = () => triggerAnimal(dogActive, dogStyle, 150, 7.5);
        const triggerPeek = () => {
            if (peekingActive.value) return;

            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            const centerX = screenWidth / 2;
            const centerY = screenHeight / 2;
            
            const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
            const pos = Math.random() * 80 + 10; // 10% to 90%
            
            // Reset styles completely
            peekStyle.value = {
                top: 'auto',
                bottom: 'auto',
                left: 'auto',
                right: 'auto',
                transform: 'none',
                opacity: 0,
                x: 0,
                y: 0
            };

            if (isDarkMode.value) {
                // Dark Mode: Flashlight at edges pointing to center
                let startX = 0, startY = 0;
                
                switch(side) {
                    case 0: // Top
                        startX = (pos / 100) * screenWidth;
                        startY = -60;
                        break;
                    case 1: // Right
                        startX = screenWidth + 60;
                        startY = (pos / 100) * screenHeight;
                        break;
                    case 2: // Bottom
                        startX = (pos / 100) * screenWidth;
                        startY = screenHeight + 60;
                        break;
                    case 3: // Left
                        startX = -60;
                        startY = (pos / 100) * screenHeight;
                        break;
                }

                peekStyle.value.left = `${startX}px`;
                peekStyle.value.top = `${startY}px`;
                
                // Calculate angle to center
                const angle = Math.atan2(centerY - startY, centerX - startX) * (180 / Math.PI);
                peekStyle.value.transform = `rotate(${angle + 135}deg)`;
                
                peekingActive.value = true;

                const tl = gsap.timeline({
                    onComplete: () => {
                        peekingActive.value = false;
                        peekStyle.value.opacity = 0;
                    }
                });

                const moveDist = 380; // Increased distance so flashlight body is visible
                const moveX = Math.cos(angle * Math.PI / 180) * moveDist;
                const moveY = Math.sin(angle * Math.PI / 180) * moveDist;

                tl.to(peekStyle.value, { opacity: 1, duration: 0.3 })
                  .to(peekStyle.value, { x: moveX, y: moveY, duration: 1.5, ease: "back.out(1.2)" })
                  .to(peekStyle.value, { rotation: '+=40', duration: 1.2, ease: "sine.inOut" })
                  .to(peekStyle.value, { rotation: '-=80', duration: 1.8, ease: "sine.inOut" })
                  .to(peekStyle.value, { x: 0, y: 0, opacity: 0, duration: 0.6, delay: 1 });

            } else {
                // Light Mode: Curious Cat peeking from edges
                let moveX = 0, moveY = 0, rotate = 0;

                switch(side) {
                    case 0: // Top
                        peekStyle.value.top = '-80px';
                        peekStyle.value.left = `${pos}%`;
                        moveY = 100;
                        rotate = 180;
                        break;
                    case 1: // Right
                        peekStyle.value.right = '-80px';
                        peekStyle.value.top = `${pos}%`;
                        moveX = -100;
                        rotate = -90;
                        break;
                    case 2: // Bottom
                        peekStyle.value.bottom = '-80px';
                        peekStyle.value.left = `${pos}%`;
                        moveY = -100;
                        rotate = 0;
                        break;
                    case 3: // Left
                        peekStyle.value.left = '-80px';
                        peekStyle.value.top = `${pos}%`;
                        moveX = 100;
                        rotate = 90;
                        break;
                }

                peekStyle.value.transform = `rotate(${rotate}deg)`;
                peekStyle.value.opacity = 1;
                peekingActive.value = true;

                gsap.to(peekStyle.value, {
                    x: moveX,
                    y: moveY,
                    duration: 0.8,
                    ease: "back.out(2.5)",
                    onComplete: () => {
                        setTimeout(() => {
                            gsap.to(peekStyle.value, {
                                x: 0,
                                y: 0,
                                opacity: 0,
                                duration: 0.6,
                                onComplete: () => {
                                    peekingActive.value = false;
                                }
                            });
                        }, 2500);
                    }
                });
            }
        };

        setInterval(() => {
            const rand = Math.random();
            if (rand > 0.5) triggerPeek();
            if (rand > 0.25) triggerDog();
        }, 1500);


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
            dogStyle,
            peekStyle,
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
