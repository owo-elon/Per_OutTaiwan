import{d as dt,r as Pe,w as oe,o as ut,a as pt}from"./vue-vendor-CJvSAjNs.js";import{S as ht,P as mt,W as ft,B as U,d as V,e as Y,A as w,f as W,g as wt,h as vt,G as E,i as ne,j as yt,c as ae,M as v,k as y,l as Ye,T as se,b as Mt,D as _e,a as Xe,C as gt,m as bt,n as Ze,I as De,E as xt,o as kt,U as Pt,V as Dt,p as St,q as Ct,r as zt,O as At,s as je,t as Ot,N as Et}from"./three-DQbwDAWq.js";import{aN as p}from"./vendor-Bsgzf06I.js";(function(){const S=document.createElement("link").relList;if(S&&S.supports&&S.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))g(s);new MutationObserver(s=>{for(const h of s)if(h.type==="childList")for(const d of h.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&g(d)}).observe(document,{childList:!0,subtree:!0});function l(s){const h={};return s.integrity&&(h.integrity=s.integrity),s.referrerPolicy&&(h.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?h.credentials="include":s.crossOrigin==="anonymous"?h.credentials="omit":h.credentials="same-origin",h}function g(s){if(s.ep)return;s.ep=!0;const h=l(s);fetch(s.href,h)}})();function It(k=!1){const S=document.getElementById("three-canvas");if(!S)return;const l={dark:{bg:0,scanLine:62207,nodePulse:62207,particle:65450,ripple:62207,star:16777215,creature:16758531,creatureWing:16483584,ufo:9358054,bubble:62207},light:{bg:16777215,scanLine:687196,nodePulse:282170,particle:282170,ripple:687196,star:9741240,creature:9133568,creatureWing:11565056,ufo:2781328,bubble:282170}},g=()=>s.isDark?l.dark:l.light,s={isDark:k,speedMultiplier:1,timeMs:Date.now()};let h=Date.now();const d=new ht,R=new mt(70,window.innerWidth/window.innerHeight,.1,1e3);R.position.z=55;const I=new ft({canvas:S,alpha:!0,antialias:!0});I.setSize(window.innerWidth,window.innerHeight),I.setPixelRatio(Math.min(window.devicePixelRatio,2));const P=()=>window.innerWidth<768,F=5e3,z=new U,m=new Float32Array(F*3);for(let e=0;e<F;e++)m[e*3]=(Math.random()-.5)*300,m[e*3+1]=(Math.random()-.5)*300,m[e*3+2]=-60-Math.random()*200;z.setAttribute("position",new V(m,3));const B=new Y({size:.18,color:16777215,transparent:!0,opacity:.85,blending:w,depthWrite:!1,sizeAttenuation:!0}),_=new W(z,B);_.visible=s.isDark,d.add(_);const M=P()?35:48,X=new wt(11189213,1.4);X.position.set(60,40,80),d.add(X),d.add(new vt(1118498,.6));const b=new E;b.position.set(0,-180,-120),d.add(b);const x=new E;x.position.set(0,-180,0),b.add(x);const ie=new ne(M,80,80);{const e=ie.attributes.position;for(let o=0;o<e.count;o++){const t=e.getX(o),n=e.getY(o),r=e.getZ(o),u=Math.sin(t*.3)*Math.cos(n*.3)*Math.sin(r*.3)*.15+Math.sin(t*.8)*Math.cos(r*.7)*.08,c=Math.sqrt(t*t+n*n+r*r),a=(M+u*.4)/c;e.setXYZ(o,t*a,n*a,r*a)}ie.computeVertexNormals()}const re=new yt({color:15265525,roughness:.85,metalness:.05,emissive:new ae(4872840),emissiveIntensity:.18,transparent:!0}),G=new v(ie,re);G.renderOrder=-1,x.add(G),[{r:1.12,col:8956637,op:.15},{r:1.28,col:6719692,op:.08},{r:1.48,col:4482747,op:.04}].forEach(({r:e,col:o,op:t})=>{const n=new y({color:o,transparent:!0,opacity:t,side:Ye,blending:w,depthWrite:!1}),r=new v(new ne(M*e,32,32),n);x.add(r)});const Z=new y({color:8961023,transparent:!0,opacity:.22,blending:w,depthWrite:!1});Z.userData.isAnimatedOpacity=!0;const L=new v(new se(M*1.65,.15,8,120),Z);L.rotation.x=.4,L.rotation.z=.25,x.add(L);const ce=200,Se=new U,j=new Float32Array(ce*3);for(let e=0;e<ce;e++){const o=M*(1.2+Math.random()*.9),t=Math.acos(2*Math.random()-1),n=Math.random()*Math.PI*2;j[e*3]=o*Math.sin(t)*Math.cos(n),j[e*3+1]=o*Math.cos(t),j[e*3+2]=o*Math.sin(t)*Math.sin(n)}Se.setAttribute("position",new V(j,3));const le=new W(Se,new Y({size:.1,color:13426175,transparent:!0,opacity:.6,blending:w,depthWrite:!1,sizeAttenuation:!0}));x.add(le);const f=new E;f.position.set(0,180,0),b.add(f);const de=new Mt({uniforms:{time:{value:0},colA:{value:new ae(16773632)},colB:{value:new ae(16747520)},colC:{value:new ae(16729344)},globalOpacity:{value:1},uFlash:{value:0}},vertexShader:`
            uniform float time;
            uniform float uFlash;
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
                
                // Flash expansion
                float expansion = 1.0 + uFlash * 5.0;
                vec3 displaced = position * expansion + normal * disp;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
            }
        `,fragmentShader:`
            uniform float time;
            uniform float globalOpacity;
            uniform float uFlash;
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

                // ── Limb darkening: centre stays textured, edge goes orange-red ──
                // facing=1 at dead centre (normal facing camera), 0 at limb
                float facing = max(0.0, dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)));
                // Shift colour toward colC (orange-red) near the limb
                col = mix(colC * 0.75, col, pow(facing, 0.5));
                // Slight brightness fall-off toward the limb (realistic darkening)
                col *= 0.65 + 0.35 * facing;

                // Solar flares — only near the limb so centre stays varied
                float flare = pow(max(0.0, sin(vUv.x * 30.0 + time * 1.2) * cos(vUv.y * 25.0 - time * 0.8)), 5.0);
                col += vec3(1.0, 0.95, 0.5) * flare * (1.0 - facing) * 0.6;

                // Flash effect: turn white
                col = mix(col, vec3(1.0), uFlash);

                gl_FragColor = vec4(col, globalOpacity);
            }
        `,transparent:!0}),q=new v(new ne(M,80,80),de);q.renderOrder=-1,f.add(q),[{r:1.18,col:16772676,op:.18},{r:1.38,col:16763955,op:.12},{r:1.65,col:16750882,op:.06}].forEach(({r:e,col:o,op:t})=>{const n=new y({color:o,transparent:!0,opacity:t,side:Ye,blending:w,depthWrite:!1});f.add(new v(new ne(M*e,32,32),n))});const $=new E;f.add($);const Ce=P()?12:20,ue=[];for(let e=0;e<Ce;e++){const o=e/Ce*Math.PI*2,t=M*(.35+Math.random()*.25),n=M*.05,r=M+t*.5,u=new y({color:16772608,transparent:!0,opacity:.12+Math.random()*.1,blending:w,depthWrite:!1,side:_e});u.userData.isAnimatedOpacity=!0,ue.push(u);const c=new v(new Xe(n,t),u);c.position.set(Math.cos(o)*r,Math.sin(o)*r,0),c.rotation.z=o+Math.PI/2,$.add(c)}const pe=new y({color:16759586,transparent:!0,opacity:.25,blending:w,depthWrite:!1});pe.userData.isAnimatedOpacity=!0;const ze=new v(new se(M*1.15,M*.06,8,120),pe);f.add(ze);const Ae=150,Oe=new U,K=new Float32Array(Ae*3);for(let e=0;e<Ae;e++){const o=M*(1.3+Math.random()*.7),t=Math.acos(2*Math.random()-1),n=Math.random()*Math.PI*2;K[e*3]=o*Math.sin(t)*Math.cos(n),K[e*3+1]=o*Math.cos(t),K[e*3+2]=o*Math.sin(t)*Math.sin(n)}Oe.setAttribute("position",new V(K,3));const Ee=new W(Oe,new Y({size:.12,color:16768307,transparent:!0,opacity:.7,blending:w,depthWrite:!1,sizeAttenuation:!0}));f.add(Ee);const J=document.createElement("canvas");J.width=256,J.height=256;const he=J.getContext("2d"),A=he.createRadialGradient(128,128,0,128,128,128);A.addColorStop(0,"rgba(255, 220, 100, 0)"),A.addColorStop(.1,"rgba(255, 230, 120, 0.0)"),A.addColorStop(.22,"rgba(255, 220, 100, 0.55)"),A.addColorStop(.4,"rgba(255, 180,  60, 0.35)"),A.addColorStop(.6,"rgba(255, 140,  30, 0.18)"),A.addColorStop(.8,"rgba(255, 100,  10, 0.07)"),A.addColorStop(1,"rgba(255, 255, 255, 0)"),he.fillStyle=A,he.fillRect(0,0,256,256);const qe=new gt(J),$e=new bt({map:qe,transparent:!0,blending:w,depthWrite:!1,opacity:1}),Q=new Ze($e);Q.scale.set(M*14,M*14,1),Q.position.z=-20,Q.renderOrder=-50,f.add(Q),b.traverse(e=>{(e instanceof v||e instanceof W||e instanceof Ze)&&e.renderOrder===0&&(e.renderOrder=-10)}),x.visible=!0,f.visible=!0,b.rotation.z=s.isDark?Math.PI:0,f.rotation.z=-b.rotation.z,x.rotation.z=-b.rotation.z;let me=!1;const Ke=e=>{if(me)return;me=!0;const o=2,t="power3.inOut",r=b.rotation.z+Math.PI;p.to(b.rotation,{z:r,duration:o,ease:t,onUpdate:()=>{f.rotation.z=-b.rotation.z,x.rotation.z=-b.rotation.z},onComplete:()=>{me=!1}})},Je=new Xe(140,.3),fe=new y({color:l.dark.scanLine,transparent:!0,opacity:0,side:_e,depthWrite:!1,blending:w}),we=new v(Je,fe);we.rotation.x=Math.PI/2,d.add(we);const Qe=new se(52,.12,8,80),ve=new y({color:l.dark.scanLine,transparent:!0,opacity:0,blending:w}),Ie=new v(Qe,ve);d.add(Ie);const Le=(()=>{const e=new De(32,0),o=e.getAttribute("position"),t=new Map;for(let r=0;r<o.count;r++){const u=`${o.getX(r).toFixed(1)},${o.getY(r).toFixed(1)},${o.getZ(r).toFixed(1)}`;t.has(u)||t.set(u,new zt(o.getX(r),o.getY(r),o.getZ(r)))}e.dispose();const n=[];return t.forEach(r=>{const u=new y({color:l.dark.nodePulse,transparent:!0,opacity:0,blending:w}),c=new v(new At(.28,0),u);c.position.copy(r),c.userData.phase=Math.random()*Math.PI*2,c.userData.speed=.5+Math.random()*.8,d.add(c),n.push(c)}),n})(),ye=P()?50:80,Te=new U,ee=new Float32Array(ye*3),Re=[],T=32.4;for(let e=0;e<ye;e++){const o=Math.acos(2*Math.random()-1),t=Math.random()*Math.PI*2;Re.push({theta:o,phi:t,speed:.003+Math.random()*.008,radius:T}),ee[e*3]=T*Math.sin(o)*Math.cos(t),ee[e*3+1]=T*Math.cos(o),ee[e*3+2]=T*Math.sin(o)*Math.sin(t)}Te.setAttribute("position",new V(ee,3));const Me=new Y({size:P()?.15:.18,color:l.dark.particle,transparent:!0,opacity:.55,blending:w,depthWrite:!1,sizeAttenuation:!0}),Be=new W(Te,Me);d.add(Be);const et=4,H=[],tt=()=>{const e=new y({color:l.dark.ripple,wireframe:!0,transparent:!0,opacity:.8,blending:w}),o=new se(1,.04,6,40),t=new v(o,e),n=Math.acos(2*Math.random()-1),r=Math.random()*Math.PI*2;return t.position.set(32*Math.sin(n)*Math.cos(r),32*Math.cos(n),32*Math.sin(n)*Math.sin(r)),t.lookAt(0,0,0),t.userData={scale:.1,life:1,active:!1},d.add(t),H.push({mesh:t,mat:e,geo:o}),{mesh:t,mat:e,geo:o}};for(let e=0;e<et;e++)tt();let Ge=0,ge=0;const ot=1.8,We=()=>{const e=H[Ge%H.length];Ge++;const o=Math.acos(2*Math.random()-1),t=Math.random()*Math.PI*2;e.mesh.position.set(32*Math.sin(o)*Math.cos(t),32*Math.cos(o),32*Math.sin(o)*Math.sin(t)),e.mesh.lookAt(0,0,0),e.mesh.userData={scale:.1,life:1,active:!0},e.mesh.visible=!0,e.mat.color.setHex(g().ripple)},nt=P()?60:130,at=P()?38:72,st=new De(1,0),Fe=new y({color:l.dark.bubble,wireframe:!0,transparent:!0,opacity:.55,blending:w,depthWrite:!1}),be=[],He=e=>{e.position.set((Math.random()-.5)*at,-52-Math.random()*40,(Math.random()-.5)*28);const o=Math.random()*(P()?.6:1.1)+.3;e.scale.set(o,o,o),e.userData={speed:Math.random()*.055+.018,wobble:Math.random()*Math.PI*2,popping:!1},e.visible=!0};for(let e=0;e<nt;e++){const o=new v(st,Fe);He(o),d.add(o),be.push(o)}const te=[],it=e=>{const t=new U,n=new Float32Array(36),r=[];for(let a=0;a<12;a++)n[a*3]=e.x,n[a*3+1]=e.y,n[a*3+2]=e.z,r.push({x:(Math.random()-.5)*.35,y:(Math.random()-.5)*.35,z:(Math.random()-.5)*.35});t.setAttribute("position",new V(n,3));const u=new Y({size:.12,color:g().bubble,transparent:!0,opacity:1,blending:w}),c=new W(t,u);d.add(c),te.push({points:c,pVelo:r,life:1})},rt=()=>{const e=new E,o=new y({color:l.dark.creature,wireframe:!0}),t=new y({color:l.dark.creatureWing,wireframe:!0}),n=new v(new je(.4,1.5,4),o);n.rotation.x=Math.PI/2,e.add(n);const r=u=>{const c=new E;c.position.set(u*.2,.1,0);const a=new v(new je(.6,2,3),t);return a.position.set(u*1,0,0),a.rotation.z=u*-Math.PI/2,c.add(a),e.add(c),c};return e.userData={leftWingPivot:r(-1),rightWingPivot:r(1),flapSpeed:Math.random()*.0012+.002},e.scale.setScalar(1.08),e},ct=()=>{const e=new E,o=new v(new Ot(1.5,1.5,.2,8),new y({color:l.dark.ufo,wireframe:!0}));e.add(o);const t=new v(new De(.7,1),new y({color:16777215,wireframe:!0}));return t.position.y=.1,e.add(t),e.scale.setScalar(1.08),e},xe=[],lt=P()?3:5;for(let e=0;e<lt;e++){const o=new E,t=rt(),n=ct();o.add(t),o.add(n),o.userData={angle:Math.random()*Math.PI*2,radiusX:38+Math.random()*38,radiusZ:18+Math.random()*18,speed:.0018+Math.random()*.002,baseY:(Math.random()-.5)*38,birdRef:t,ufoRef:n},xe.push(o),d.add(o)}const N=new xt(I);N.addPass(new kt(d,R));const O=new Pt(new Dt(window.innerWidth,window.innerHeight),s.isDark?2.2:.7,.5,s.isDark?.65:.8);O.enabled=!0,N.addPass(O);const ke=new St(Ct);ke.uniforms.amount.value=.0012,N.addPass(ke);const Ne=()=>{const e=g();fe.color.setHex(e.scanLine),ve.color.setHex(e.scanLine),Le.forEach(o=>o.material.color.setHex(e.nodePulse)),Me.color.setHex(e.particle),H.forEach(o=>o.mat.color.setHex(e.ripple)),Fe.color.setHex(e.bubble),_.visible=s.isDark,B.color.setHex(e.star),B.opacity=s.isDark?.85:.4,B.blending=s.isDark?w:Et,B.needsUpdate=!0,xe.forEach(o=>{const t=o.userData.birdRef,n=o.userData.ufoRef;t.children[0]&&(t.children[0].material=new y({color:e.creature,wireframe:!0})),n.children[0]&&(n.children[0].material=new y({color:e.ufo,wireframe:!0}))}),X.color.setHex(s.isDark?11189213:16772829),X.intensity=s.isDark?1.4:1.8,O.strength=s.isDark?2.2:.7,O.threshold=s.isDark?.65:.8};Ne();const Ue=()=>{requestAnimationFrame(Ue);const e=Date.now(),o=(e-h)/1e3;h=e,s.timeMs+=o*1e3*s.speedMultiplier;const t=s.timeMs*.001,n=s.speedMultiplier;if(x.visible){G.rotation.y+=5e-4*n,G.rotation.x+=2e-4*n,L.rotation.z+=5e-4*n,le.rotation.y+=.001*n;const a=1+Math.sin(t*1.2)*.012;G.scale.setScalar(a),x.position.y=-180+Math.sin(t*1.8)*2.5,Z.opacity=.18+Math.sin(t*.6)*.06}if(f.visible){de.uniforms.time.value=t,$.rotation.z+=.002*n,q.rotation.y+=.0025*n,ze.rotation.z+=.0012*n,Ee.rotation.y+=.0015*n;const a=1+Math.sin(t*1.8)*.018;f.scale.setScalar(a),f.position.y=180+Math.sin(t*1.4)*2.2,ue.forEach((i,C)=>{i.opacity=.1+Math.sin(t*1.8+C*.5)*.08}),pe.opacity=.2+Math.sin(t*2)*.08}_.rotation.y+=8e-5*n;const r=Math.sin(t*.45)*34;we.position.y=r,Ie.position.y=r;const u=1-Math.abs(r)/34;fe.opacity=s.isDark?.55*u:.35*u,ve.opacity=s.isDark?.4*u:.25*u,Le.forEach(a=>{const i=.5+.5*Math.sin(t*a.userData.speed+a.userData.phase);a.material.opacity=s.isDark?i*.75:i*.5,a.scale.setScalar(.9+i*.5),a.rotation.y+=.02*n});const c=Be.geometry.attributes.position;for(let a=0;a<ye;a++){const i=Re[a];i.phi+=i.speed*n,i.phi>Math.PI*2&&(i.phi-=Math.PI*2,i.theta=Math.acos(2*Math.random()-1)),c.array[a*3]=T*Math.sin(i.theta)*Math.cos(i.phi),c.array[a*3+1]=T*Math.cos(i.theta),c.array[a*3+2]=T*Math.sin(i.theta)*Math.sin(i.phi)}c.needsUpdate=!0,Me.opacity=s.isDark?.55:.38,ge+=o*n,ge>=ot&&(ge=0,We()),H.forEach(a=>{if(!a.mesh.userData.active)return;a.mesh.userData.scale+=o*14*n,a.mesh.userData.life-=o*.55*n;const i=a.mesh.userData.scale;a.mesh.scale.set(i,i,1),a.mat.opacity=s.isDark?Math.max(0,a.mesh.userData.life)*.7:Math.max(0,a.mesh.userData.life)*.45,a.mesh.userData.life<=0&&(a.mesh.userData.active=!1,a.mesh.visible=!1)}),be.forEach(a=>{a.userData.popping||(a.position.y+=a.userData.speed*n,a.position.x+=Math.sin(t+a.userData.wobble)*.018*n,a.rotation.y+=.008*n,a.position.y>44&&(a.userData.popping=!0,it(a.position),a.visible=!1,setTimeout(()=>{a.userData.popping=!1,He(a)},1200+Math.random()*2e3)))});for(let a=te.length-1;a>=0;a--){const i=te[a];i.life-=o*1.1*n;const C=i.points.geometry.attributes.position;for(let D=0;D<i.pVelo.length;D++)C.array[D*3]+=i.pVelo[D].x*n,C.array[D*3+1]+=i.pVelo[D].y*n,C.array[D*3+2]+=i.pVelo[D].z*n;C.needsUpdate=!0,i.points.material.opacity=Math.max(0,i.life),i.life<=0&&(d.remove(i.points),i.points.geometry.dispose(),i.points.material.dispose(),te.splice(a,1))}xe.forEach(a=>{const i=a.userData,C=Math.cos(i.angle*3)*8e-4;if(i.angle+=(i.speed+C)*n,a.position.x=Math.cos(i.angle)*i.radiusX,a.position.z=Math.sin(i.angle)*i.radiusZ,a.position.y=i.baseY+Math.sin(i.angle*3)*5+Math.sin(t+i.baseY)*.5,a.rotation.z=Math.sin(i.angle)*.2+(s.isDark?Math.sin(t)*.12:0),a.rotation.y=-i.angle+Math.PI/2,i.birdRef.visible=!s.isDark,i.ufoRef.visible=s.isDark,s.isDark)i.ufoRef.rotation.y+=.1*n,a.position.x+=Math.sin(t*2)*.18;else{const D=Math.sin(s.timeMs*i.birdRef.userData.flapSpeed);i.birdRef.userData.leftWingPivot.rotation.z=D*.6,i.birdRef.userData.rightWingPivot.rotation.z=-D*.6}}),ke.uniforms.amount.value=s.isDark?.0012+Math.sin(t*2.5)*9e-4:3e-4,N.render()},Ve=()=>{R.aspect=window.innerWidth/window.innerHeight,R.updateProjectionMatrix(),I.setSize(window.innerWidth,window.innerHeight),N.setSize(window.innerWidth,window.innerHeight)};return window.addEventListener("resize",Ve),Ue(),{updateTheme(e){s.isDark=e,Ke(),Ne()},setSpeed(e,o=0){o>0?p.to(s,{speedMultiplier:e,duration:o,ease:"power2.inOut"}):(p.killTweensOf(s),s.speedMultiplier=e)},celebrate(){be.forEach(n=>{n.userData.speed*=3.5,setTimeout(()=>n.userData.speed/=3.5,3200)});let e=0;const o=setInterval(()=>{We(),++e>=8&&clearInterval(o)},280);O.strength=s.isDark?4.5:2,p.to(O,{strength:s.isDark?2.2:.7,duration:2.5,ease:"power2.out"});const t=s.isDark?G:q;p.to(t.scale,{x:1.2,y:1.2,z:1.2,duration:.4,yoyo:!0,repeat:3,ease:"power2.inOut"})},flash(){p.to(de.uniforms.uFlash,{value:1,duration:1,ease:"power2.in"}),p.to(O,{strength:8,duration:1.5,ease:"power2.in"}),p.to(f.scale,{x:18,y:18,z:18,duration:1.8,ease:"power2.in"}),ue.forEach((e,o)=>{p.to(e,{opacity:.8,duration:.5});const t=$.children[o];p.to(t.scale,{y:50,x:10,duration:1.5,ease:"power2.in"}),p.to(t.rotation,{z:t.rotation.z+Math.PI*2,duration:2.5,ease:"power2.in"})}),p.to(f.rotation,{y:f.rotation.y+Math.PI*4,duration:2,ease:"power2.in"})},blackHole(){p.to(re.color,{r:0,g:0,b:0,duration:.3}),p.to(re,{emissiveIntensity:0,duration:.3}),p.to(x.scale,{x:60,y:60,z:60,duration:2.5,ease:"power3.in"}),p.to(L.rotation,{z:L.rotation.z+Math.PI*10,duration:2,ease:"power2.in"}),p.to(L.scale,{x:2.5,y:2.5,duration:1.5,ease:"power2.in"}),p.to(Z,{opacity:1,duration:.4});const e=le.geometry.attributes.position,o={t:0};p.to(o,{t:1,duration:2,ease:"power3.in",onUpdate:()=>{for(let n=0;n<ce;n++){const r=e.array[n*3],u=e.array[n*3+1],c=e.array[n*3+2],a=.15,i=r*Math.cos(a)-c*Math.sin(a),C=r*Math.sin(a)+c*Math.cos(a);e.array[n*3]=i*.94,e.array[n*3+1]=u*.94,e.array[n*3+2]=C*.94}e.needsUpdate=!0}}),p.to(O,{strength:15,duration:.8,ease:"power2.in"});const t=document.createElement("div");t.style.position="fixed",t.style.top="0",t.style.left="0",t.style.width="100%",t.style.height="100%",t.style.backgroundColor="black",t.style.opacity="0",t.style.zIndex="9999",t.style.pointerEvents="none",document.body.appendChild(t),p.to(t.style,{opacity:"1",duration:1.8,delay:.7,ease:"power2.in"})},destroy(){window.removeEventListener("resize",Ve),I.dispose()}}}function Lt(k,S,l){for(let g=0;g<12;g++){const s=document.createElement("div");s.className="particle",s.style.width=Math.random()*8+4+"px",s.style.height=s.style.width,s.style.backgroundColor=l,s.style.left=k+"px",s.style.top=S+"px",document.body.appendChild(s);const h=Math.random()*Math.PI*2,d=Math.random()*100+50;p.to(s,{x:Math.cos(h)*d,y:Math.sin(h)*d,opacity:0,scale:0,duration:.6+Math.random()*.4,ease:"power2.out",onComplete:()=>s.remove()})}}const Ht=dt({name:"LayoutComponent",props:{title:{type:String,default:"OutTaiwan"},showAnnouncement:{type:Boolean,default:!1},announcementText:{type:String,default:"歡迎來到 OutTaiwan！探索台灣的美麗角落。🚀"}},template:`
        <div class="layout-app-bg"></div>
        <canvas id="three-canvas" class="layout-three-canvas"></canvas>

        <!-- Cyberpunk UI Borders -->
        <div class="layout-cyberpunk-borders">
            <div class="layout-scanline-overlay"></div>
        </div>

        <div v-cloak class="layout-main-content-wrapper">
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
                    <button @click.stop="goToHome(); isMenuOpen = false" 
                            class="layout-menu-btn">
                        <span class="layout-menu-btn-icon pointer-events-none">🏠</span>
                        <span class="layout-menu-btn-tooltip pointer-events-none">
                            回首頁
                        </span>
                    </button>

                    <!-- Back to Top -->
                    <button @click.stop="scrollToTop(); isMenuOpen = false" 
                            class="layout-menu-btn">
                        <span class="layout-menu-btn-icon pointer-events-none">⬆️</span>
                        <span class="layout-menu-btn-tooltip pointer-events-none">
                            回到頂端
                        </span>
                    </button>

                    <!-- Go Back -->
                    <button @click.stop="goBack(); isMenuOpen = false" 
                            class="layout-menu-btn">
                        <span class="layout-menu-btn-icon pointer-events-none">⬅️</span>
                        <span class="layout-menu-btn-tooltip pointer-events-none">
                            上一頁
                        </span>
                    </button>

                    <!-- Theme Toggle -->
                    <button @click.stop="toggleDarkMode(); isMenuOpen = false" 
                            class="layout-menu-btn">
                        <span v-if="isDarkMode" class="layout-menu-btn-icon pointer-events-none">☀️</span>
                        <span v-else class="layout-menu-btn-icon pointer-events-none">🌙</span>
                        <span class="layout-menu-btn-tooltip pointer-events-none">
                            {{ isDarkMode ? '切換亮色模式' : '切換深色模式' }}
                        </span>
                    </button>
                </div>

                <!-- Main Menu Toggle Button -->
                <button @click.stop="isMenuOpen = !isMenuOpen" 
                        class="layout-main-menu-toggle">
                    <!-- Glow effect for dark mode -->
                    <div class="layout-main-menu-glow pointer-events-none"></div>
                    
                    <svg v-if="!isMenuOpen" xmlns="http://www.w3.org/2000/svg" class="layout-main-menu-icon pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="layout-main-menu-icon pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Bottom Left Content Slot (For Category Selector, Weather, etc.) -->
            <div class="layout-bottom-left-slot">
                <slot name="bottom-left"></slot>
            </div>

        <!-- Footer -->
        <footer v-if="false" class="mt-20 pb-24 text-center text-slate-900 dark:text-slate-400 text-sm">
            <p>© 2026 Elon提醒出國玩記得注意荷包 ✈️</p>
        </footer>
    `,setup(k){const S=typeof window<"u"?localStorage.getItem("darkMode")==="true":!1,l=Pe(S),g=Pe(!1),s=Pe({show:k.showAnnouncement,message:k.announcementText});oe(()=>k.showAnnouncement,m=>{s.value.show=m}),oe(()=>k.announcementText,m=>{s.value.message=m});const h=()=>{l.value=!l.value,document.body.classList.toggle("dark",l.value),localStorage.setItem("darkMode",l.value?"true":"false")},d=()=>{window.location.href="/Per_OutTaiwan/index.html"},R=()=>{window.scrollTo({top:0,behavior:"smooth"})},I=()=>{window.history.back()},P=m=>{Lt(m.clientX,m.clientY,l.value?"#94a3b8":"#0f172a"),m.target.closest(".layout-floating-menu-container")||(g.value=!1)},F=()=>{g.value=!1};let z=null;return ut(()=>{document.title=k.title,z=It(l.value),window.threeBg=z;const m=localStorage.getItem("darkMode")==="true";l.value=m,m&&(document.body.classList.add("no-transition"),document.body.classList.add("dark"),document.body.offsetHeight,setTimeout(()=>{document.body.classList.remove("no-transition")},50)),window.addEventListener("click",P),window.addEventListener("scroll",F,{passive:!0}),pt(()=>{window.removeEventListener("click",P),window.removeEventListener("scroll",F),z&&z.destroy()})}),oe(()=>k.title,m=>{document.title=m}),oe(l,m=>{z&&z.updateTheme(m)}),{isDarkMode:l,isMenuOpen:g,globalAnnouncement:s,toggleDarkMode:h,goToHome:d,scrollToTop:R,goBack:I}}});export{Ht as L,Lt as c};
