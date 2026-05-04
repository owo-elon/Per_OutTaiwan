import{d as de,o as ue,a as pe,w as Ft,r as G}from"./vue-vendor-CPMyeukm.js";import{S as he,P as me,W as fe,B as F,d as V,e as _,A as f,f as B,g as ve,h as we,G as S,i as et,j as Me,c as ot,M as v,k as M,l as Vt,T as at,b as ge,D as _t,a as Yt,C as ye,m as be,n as jt,I as gt,E as ke,o as xe,U as De,V as Pe,p as Ae,q as Se,r as Ce,O as ze,s as Xt,t as Oe,N as Re}from"./three-DQbwDAWq.js";import{aN as W}from"./vendor-Bsgzf06I.js";(function(){const x=document.createElement("link").relList;if(x&&x.supports&&x.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))y(s);new MutationObserver(s=>{for(const m of s)if(m.type==="childList")for(const d of m.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&y(d)}).observe(document,{childList:!0,subtree:!0});function c(s){const m={};return s.integrity&&(m.integrity=s.integrity),s.referrerPolicy&&(m.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?m.credentials="include":s.crossOrigin==="anonymous"?m.credentials="omit":m.credentials="same-origin",m}function y(s){if(s.ep)return;s.ep=!0;const m=c(s);fetch(s.href,m)}})();function Ee(C=!1){const x=document.getElementById("three-canvas");if(!x)return;const c={dark:{bg:0,scanLine:62207,nodePulse:62207,particle:65450,ripple:62207,star:16777215,creature:16758531,creatureWing:16483584,ufo:9358054,bubble:62207},light:{bg:16777215,scanLine:687196,nodePulse:282170,particle:282170,ripple:687196,star:9741240,creature:9133568,creatureWing:11565056,ufo:2781328,bubble:282170}},y=()=>s.isDark?c.dark:c.light,s={isDark:C,speedMultiplier:1,timeMs:Date.now()};let m=Date.now();const d=new he,z=new me(70,window.innerWidth/window.innerHeight,.1,1e3);z.position.z=55;const O=new fe({canvas:x,alpha:!0,antialias:!0});O.setSize(window.innerWidth,window.innerHeight),O.setPixelRatio(Math.min(window.devicePixelRatio,2));const D=()=>window.innerWidth<768,Y=5e3,j=new F,L=new Float32Array(Y*3);for(let t=0;t<Y;t++)L[t*3]=(Math.random()-.5)*300,L[t*3+1]=(Math.random()-.5)*300,L[t*3+2]=-60-Math.random()*200;j.setAttribute("position",new V(L,3));const P=new _({size:.18,color:16777215,transparent:!0,opacity:.85,blending:f,depthWrite:!1,sizeAttenuation:!0}),R=new B(j,P);R.visible=s.isDark,d.add(R);const u=D()?35:48,h=new ve(11189213,1.4);h.position.set(60,40,80),d.add(h),d.add(new we(1118498,.6));const w=new S;w.position.set(0,-180,-120),d.add(w);const b=new S;b.position.set(0,-180,0),w.add(b);const nt=new et(u,80,80);{const t=nt.attributes.position;for(let e=0;e<t.count;e++){const o=t.getX(e),n=t.getY(e),r=t.getZ(e),p=Math.sin(o*.3)*Math.cos(n*.3)*Math.sin(r*.3)*.15+Math.sin(o*.8)*Math.cos(r*.7)*.08,l=Math.sqrt(o*o+n*n+r*r),a=(u+p*.4)/l;t.setXYZ(e,o*a,n*a,r*a)}nt.computeVertexNormals()}const Zt=new Me({color:15265525,roughness:.85,metalness:.05,emissive:new ot(4872840),emissiveIntensity:.18,transparent:!0}),T=new v(nt,Zt);T.renderOrder=-1,b.add(T),[{r:1.12,col:8956637,op:.15},{r:1.28,col:6719692,op:.08},{r:1.48,col:4482747,op:.04}].forEach(({r:t,col:e,op:o})=>{const n=new M({color:e,transparent:!0,opacity:o,side:Vt,blending:f,depthWrite:!1}),r=new v(new et(u*t,32,32),n);b.add(r)});const st=new M({color:8961023,transparent:!0,opacity:.22,blending:f,depthWrite:!1});st.userData.isAnimatedOpacity=!0;const X=new v(new at(u*1.65,.15,8,120),st);X.rotation.x=.4,X.rotation.z=.25,b.add(X);const yt=200,bt=new F,Z=new Float32Array(yt*3);for(let t=0;t<yt;t++){const e=u*(1.2+Math.random()*.9),o=Math.acos(2*Math.random()-1),n=Math.random()*Math.PI*2;Z[t*3]=e*Math.sin(o)*Math.cos(n),Z[t*3+1]=e*Math.cos(o),Z[t*3+2]=e*Math.sin(o)*Math.sin(n)}bt.setAttribute("position",new V(Z,3));const kt=new B(bt,new _({size:.1,color:13426175,transparent:!0,opacity:.6,blending:f,depthWrite:!1,sizeAttenuation:!0}));b.add(kt);const g=new S;g.position.set(0,180,0),w.add(g);const xt=new ge({uniforms:{time:{value:0},colA:{value:new ot(16773632)},colB:{value:new ot(16747520)},colC:{value:new ot(16729344)},globalOpacity:{value:1}},vertexShader:`
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
        `,fragmentShader:`
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
        `,transparent:!0}),q=new v(new et(u,80,80),xt);q.renderOrder=-1,g.add(q),[{r:1.18,col:16772676,op:.18},{r:1.38,col:16763955,op:.12},{r:1.65,col:16750882,op:.06}].forEach(({r:t,col:e,op:o})=>{const n=new M({color:e,transparent:!0,opacity:o,side:Vt,blending:f,depthWrite:!1});g.add(new v(new et(u*t,32,32),n))});const it=new S;g.add(it);const Dt=D()?12:20,Pt=[];for(let t=0;t<Dt;t++){const e=t/Dt*Math.PI*2,o=u*(.35+Math.random()*.25),n=u*.05,r=u+o*.5,p=new M({color:16772608,transparent:!0,opacity:.12+Math.random()*.1,blending:f,depthWrite:!1,side:_t});p.userData.isAnimatedOpacity=!0,Pt.push(p);const l=new v(new Yt(n,o),p);l.position.set(Math.cos(e)*r,Math.sin(e)*r,0),l.rotation.z=e+Math.PI/2,it.add(l)}const rt=new M({color:16759586,transparent:!0,opacity:.25,blending:f,depthWrite:!1});rt.userData.isAnimatedOpacity=!0;const At=new v(new at(u*1.15,u*.06,8,120),rt);g.add(At);const St=150,Ct=new F,$=new Float32Array(St*3);for(let t=0;t<St;t++){const e=u*(1.3+Math.random()*.7),o=Math.acos(2*Math.random()-1),n=Math.random()*Math.PI*2;$[t*3]=e*Math.sin(o)*Math.cos(n),$[t*3+1]=e*Math.cos(o),$[t*3+2]=e*Math.sin(o)*Math.sin(n)}Ct.setAttribute("position",new V($,3));const zt=new B(Ct,new _({size:.12,color:16768307,transparent:!0,opacity:.7,blending:f,depthWrite:!1,sizeAttenuation:!0}));g.add(zt);const K=document.createElement("canvas");K.width=256,K.height=256;const ct=K.getContext("2d"),H=ct.createRadialGradient(128,128,0,128,128,128);H.addColorStop(0,"rgba(255, 250, 200, 1)"),H.addColorStop(.25,"rgba(255, 240, 180, 0.8)"),H.addColorStop(.5,"rgba(255, 230, 160, 0.4)"),H.addColorStop(1,"rgba(255, 255, 255, 0)"),ct.fillStyle=H,ct.fillRect(0,0,256,256);const qt=new ye(K),$t=new be({map:qt,transparent:!0,blending:f,depthWrite:!1,opacity:1}),J=new jt($t);J.scale.set(u*14,u*14,1),J.position.z=-20,J.renderOrder=-50,g.add(J),w.traverse(t=>{(t instanceof v||t instanceof B||t instanceof jt)&&t.renderOrder===0&&(t.renderOrder=-10)}),b.visible=!0,g.visible=!0,w.rotation.z=s.isDark?Math.PI:0,g.rotation.z=-w.rotation.z,b.rotation.z=-w.rotation.z;let lt=!1;const Kt=t=>{if(lt)return;lt=!0;const e=2,o="power3.inOut",r=w.rotation.z+Math.PI;W.to(w.rotation,{z:r,duration:e,ease:o,onUpdate:()=>{g.rotation.z=-w.rotation.z,b.rotation.z=-w.rotation.z},onComplete:()=>{lt=!1}})},Jt=new Yt(140,.3),dt=new M({color:c.dark.scanLine,transparent:!0,opacity:0,side:_t,depthWrite:!1,blending:f}),ut=new v(Jt,dt);ut.rotation.x=Math.PI/2,d.add(ut);const Qt=new at(52,.12,8,80),pt=new M({color:c.dark.scanLine,transparent:!0,opacity:0,blending:f}),Ot=new v(Qt,pt);d.add(Ot);const Rt=(()=>{const t=new gt(32,0),e=t.getAttribute("position"),o=new Map;for(let r=0;r<e.count;r++){const p=`${e.getX(r).toFixed(1)},${e.getY(r).toFixed(1)},${e.getZ(r).toFixed(1)}`;o.has(p)||o.set(p,new Ce(e.getX(r),e.getY(r),e.getZ(r)))}t.dispose();const n=[];return o.forEach(r=>{const p=new M({color:c.dark.nodePulse,transparent:!0,opacity:0,blending:f}),l=new v(new ze(.28,0),p);l.position.copy(r),l.userData.phase=Math.random()*Math.PI*2,l.userData.speed=.5+Math.random()*.8,d.add(l),n.push(l)}),n})(),ht=D()?50:80,Et=new F,Q=new Float32Array(ht*3),Lt=[],E=32.4;for(let t=0;t<ht;t++){const e=Math.acos(2*Math.random()-1),o=Math.random()*Math.PI*2;Lt.push({theta:e,phi:o,speed:.003+Math.random()*.008,radius:E}),Q[t*3]=E*Math.sin(e)*Math.cos(o),Q[t*3+1]=E*Math.cos(e),Q[t*3+2]=E*Math.sin(e)*Math.sin(o)}Et.setAttribute("position",new V(Q,3));const mt=new _({size:D()?.15:.18,color:c.dark.particle,transparent:!0,opacity:.55,blending:f,depthWrite:!1,sizeAttenuation:!0}),Tt=new B(Et,mt);d.add(Tt);const te=4,N=[],ee=()=>{const t=new M({color:c.dark.ripple,wireframe:!0,transparent:!0,opacity:.8,blending:f}),e=new at(1,.04,6,40),o=new v(e,t),n=Math.acos(2*Math.random()-1),r=Math.random()*Math.PI*2;return o.position.set(32*Math.sin(n)*Math.cos(r),32*Math.cos(n),32*Math.sin(n)*Math.sin(r)),o.lookAt(0,0,0),o.userData={scale:.1,life:1,active:!1},d.add(o),N.push({mesh:o,mat:t,geo:e}),{mesh:o,mat:t,geo:e}};for(let t=0;t<te;t++)ee();let It=0,ft=0;const oe=1.8,Gt=()=>{const t=N[It%N.length];It++;const e=Math.acos(2*Math.random()-1),o=Math.random()*Math.PI*2;t.mesh.position.set(32*Math.sin(e)*Math.cos(o),32*Math.cos(e),32*Math.sin(e)*Math.sin(o)),t.mesh.lookAt(0,0,0),t.mesh.userData={scale:.1,life:1,active:!0},t.mesh.visible=!0,t.mat.color.setHex(y().ripple)},ae=D()?60:130,ne=D()?38:72,se=new gt(1,0),Bt=new M({color:c.dark.bubble,wireframe:!0,transparent:!0,opacity:.55,blending:f,depthWrite:!1}),vt=[],Wt=t=>{t.position.set((Math.random()-.5)*ne,-52-Math.random()*40,(Math.random()-.5)*28);const e=Math.random()*(D()?.6:1.1)+.3;t.scale.set(e,e,e),t.userData={speed:Math.random()*.055+.018,wobble:Math.random()*Math.PI*2,popping:!1},t.visible=!0};for(let t=0;t<ae;t++){const e=new v(se,Bt);Wt(e),d.add(e),vt.push(e)}const tt=[],ie=t=>{const o=new F,n=new Float32Array(36),r=[];for(let a=0;a<12;a++)n[a*3]=t.x,n[a*3+1]=t.y,n[a*3+2]=t.z,r.push({x:(Math.random()-.5)*.35,y:(Math.random()-.5)*.35,z:(Math.random()-.5)*.35});o.setAttribute("position",new V(n,3));const p=new _({size:.12,color:y().bubble,transparent:!0,opacity:1,blending:f}),l=new B(o,p);d.add(l),tt.push({points:l,pVelo:r,life:1})},re=()=>{const t=new S,e=new M({color:c.dark.creature,wireframe:!0}),o=new M({color:c.dark.creatureWing,wireframe:!0}),n=new v(new Xt(.4,1.5,4),e);n.rotation.x=Math.PI/2,t.add(n);const r=p=>{const l=new S;l.position.set(p*.2,.1,0);const a=new v(new Xt(.6,2,3),o);return a.position.set(p*1,0,0),a.rotation.z=p*-Math.PI/2,l.add(a),t.add(l),l};return t.userData={leftWingPivot:r(-1),rightWingPivot:r(1),flapSpeed:Math.random()*.0012+.002},t.scale.setScalar(1.08),t},ce=()=>{const t=new S,e=new v(new Oe(1.5,1.5,.2,8),new M({color:c.dark.ufo,wireframe:!0}));t.add(e);const o=new v(new gt(.7,1),new M({color:16777215,wireframe:!0}));return o.position.y=.1,t.add(o),t.scale.setScalar(1.08),t},wt=[],le=D()?3:5;for(let t=0;t<le;t++){const e=new S,o=re(),n=ce();e.add(o),e.add(n),e.userData={angle:Math.random()*Math.PI*2,radiusX:38+Math.random()*38,radiusZ:18+Math.random()*18,speed:.0018+Math.random()*.002,baseY:(Math.random()-.5)*38,birdRef:o,ufoRef:n},wt.push(e),d.add(e)}const U=new ke(O);U.addPass(new xe(d,z));const I=new De(new Pe(window.innerWidth,window.innerHeight),s.isDark?2.2:.7,.5,s.isDark?.65:.8);I.enabled=!0,U.addPass(I);const Mt=new Ae(Se);Mt.uniforms.amount.value=.0012,U.addPass(Mt);const Ht=()=>{const t=y();dt.color.setHex(t.scanLine),pt.color.setHex(t.scanLine),Rt.forEach(e=>e.material.color.setHex(t.nodePulse)),mt.color.setHex(t.particle),N.forEach(e=>e.mat.color.setHex(t.ripple)),Bt.color.setHex(t.bubble),R.visible=s.isDark,P.color.setHex(t.star),P.opacity=s.isDark?.85:.4,P.blending=s.isDark?f:Re,P.needsUpdate=!0,wt.forEach(e=>{const o=e.userData.birdRef,n=e.userData.ufoRef;o.children[0]&&(o.children[0].material=new M({color:t.creature,wireframe:!0})),n.children[0]&&(n.children[0].material=new M({color:t.ufo,wireframe:!0}))}),h.color.setHex(s.isDark?11189213:16772829),h.intensity=s.isDark?1.4:1.8,I.strength=s.isDark?2.2:.7,I.threshold=s.isDark?.65:.8};Ht();const Nt=()=>{requestAnimationFrame(Nt);const t=Date.now(),e=(t-m)/1e3;m=t,s.timeMs+=e*1e3*s.speedMultiplier;const o=s.timeMs*.001,n=s.speedMultiplier;if(b.visible){T.rotation.y+=5e-4*n,T.rotation.x+=2e-4*n,X.rotation.z+=5e-4*n,kt.rotation.y+=.001*n;const a=1+Math.sin(o*1.2)*.012;T.scale.setScalar(a),b.position.y=-180+Math.sin(o*1.8)*2.5,st.opacity=.18+Math.sin(o*.6)*.06}if(g.visible){xt.uniforms.time.value=o,it.rotation.z+=.002*n,q.rotation.y+=.0025*n,At.rotation.z+=.0012*n,zt.rotation.y+=.0015*n;const a=1+Math.sin(o*1.8)*.018;g.scale.setScalar(a),g.position.y=180+Math.sin(o*1.4)*2.2,Pt.forEach((i,A)=>{i.opacity=.1+Math.sin(o*1.8+A*.5)*.08}),rt.opacity=.2+Math.sin(o*2)*.08}R.rotation.y+=8e-5*n;const r=Math.sin(o*.45)*34;ut.position.y=r,Ot.position.y=r;const p=1-Math.abs(r)/34;dt.opacity=s.isDark?.55*p:.35*p,pt.opacity=s.isDark?.4*p:.25*p,Rt.forEach(a=>{const i=.5+.5*Math.sin(o*a.userData.speed+a.userData.phase);a.material.opacity=s.isDark?i*.75:i*.5,a.scale.setScalar(.9+i*.5),a.rotation.y+=.02*n});const l=Tt.geometry.attributes.position;for(let a=0;a<ht;a++){const i=Lt[a];i.phi+=i.speed*n,i.phi>Math.PI*2&&(i.phi-=Math.PI*2,i.theta=Math.acos(2*Math.random()-1)),l.array[a*3]=E*Math.sin(i.theta)*Math.cos(i.phi),l.array[a*3+1]=E*Math.cos(i.theta),l.array[a*3+2]=E*Math.sin(i.theta)*Math.sin(i.phi)}l.needsUpdate=!0,mt.opacity=s.isDark?.55:.38,ft+=e*n,ft>=oe&&(ft=0,Gt()),N.forEach(a=>{if(!a.mesh.userData.active)return;a.mesh.userData.scale+=e*14*n,a.mesh.userData.life-=e*.55*n;const i=a.mesh.userData.scale;a.mesh.scale.set(i,i,1),a.mat.opacity=s.isDark?Math.max(0,a.mesh.userData.life)*.7:Math.max(0,a.mesh.userData.life)*.45,a.mesh.userData.life<=0&&(a.mesh.userData.active=!1,a.mesh.visible=!1)}),vt.forEach(a=>{a.userData.popping||(a.position.y+=a.userData.speed*n,a.position.x+=Math.sin(o+a.userData.wobble)*.018*n,a.rotation.y+=.008*n,a.position.y>44&&(a.userData.popping=!0,ie(a.position),a.visible=!1,setTimeout(()=>{a.userData.popping=!1,Wt(a)},1200+Math.random()*2e3)))});for(let a=tt.length-1;a>=0;a--){const i=tt[a];i.life-=e*1.1*n;const A=i.points.geometry.attributes.position;for(let k=0;k<i.pVelo.length;k++)A.array[k*3]+=i.pVelo[k].x*n,A.array[k*3+1]+=i.pVelo[k].y*n,A.array[k*3+2]+=i.pVelo[k].z*n;A.needsUpdate=!0,i.points.material.opacity=Math.max(0,i.life),i.life<=0&&(d.remove(i.points),i.points.geometry.dispose(),i.points.material.dispose(),tt.splice(a,1))}wt.forEach(a=>{const i=a.userData,A=Math.cos(i.angle*3)*8e-4;if(i.angle+=(i.speed+A)*n,a.position.x=Math.cos(i.angle)*i.radiusX,a.position.z=Math.sin(i.angle)*i.radiusZ,a.position.y=i.baseY+Math.sin(i.angle*3)*5+Math.sin(o+i.baseY)*.5,a.rotation.z=Math.sin(i.angle)*.2+(s.isDark?Math.sin(o)*.12:0),a.rotation.y=-i.angle+Math.PI/2,i.birdRef.visible=!s.isDark,i.ufoRef.visible=s.isDark,s.isDark)i.ufoRef.rotation.y+=.1*n,a.position.x+=Math.sin(o*2)*.18;else{const k=Math.sin(s.timeMs*i.birdRef.userData.flapSpeed);i.birdRef.userData.leftWingPivot.rotation.z=k*.6,i.birdRef.userData.rightWingPivot.rotation.z=-k*.6}}),Mt.uniforms.amount.value=s.isDark?.0012+Math.sin(o*2.5)*9e-4:3e-4,U.render()},Ut=()=>{z.aspect=window.innerWidth/window.innerHeight,z.updateProjectionMatrix(),O.setSize(window.innerWidth,window.innerHeight),U.setSize(window.innerWidth,window.innerHeight)};return window.addEventListener("resize",Ut),Nt(),{updateTheme(t){s.isDark=t,Kt(),Ht()},setSpeed(t,e=0){e>0?W.to(s,{speedMultiplier:t,duration:e,ease:"power2.inOut"}):(W.killTweensOf(s),s.speedMultiplier=t)},celebrate(){vt.forEach(n=>{n.userData.speed*=3.5,setTimeout(()=>n.userData.speed/=3.5,3200)});let t=0;const e=setInterval(()=>{Gt(),++t>=8&&clearInterval(e)},280);I.strength=s.isDark?4.5:2,W.to(I,{strength:s.isDark?2.2:.7,duration:2.5,ease:"power2.out"});const o=s.isDark?T:q;W.to(o.scale,{x:1.2,y:1.2,z:1.2,duration:.4,yoyo:!0,repeat:3,ease:"power2.inOut"})},destroy(){window.removeEventListener("resize",Ut),O.dispose()}}}function Le(C,x,c){for(let y=0;y<12;y++){const s=document.createElement("div");s.className="particle",s.style.width=Math.random()*8+4+"px",s.style.height=s.style.width,s.style.backgroundColor=c,s.style.left=C+"px",s.style.top=x+"px",document.body.appendChild(s);const m=Math.random()*Math.PI*2,d=Math.random()*100+50;W.to(s,{x:Math.cos(m)*d,y:Math.sin(m)*d,opacity:0,scale:0,duration:.6+Math.random()*.4,ease:"power2.out",onComplete:()=>s.remove()})}}const Ne=de({name:"LayoutComponent",props:{title:{type:String,default:"OutTaiwan"}},template:`
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
    `,setup(C){const x=typeof window<"u"?localStorage.getItem("darkMode")==="true":!1,c=G(x),y=G(!1),s=G(!1),m=G(!1),d=G(!1),z=G({show:!1,message:""}),O=()=>{c.value=!c.value,document.body.classList.toggle("dark",c.value),localStorage.setItem("darkMode",c.value?"true":"false")},D=()=>{window.location.href="/Per_OutTaiwan/index.html"},Y=()=>{window.scrollTo({top:0,behavior:"smooth"})},j=()=>{window.history.back()},L=async()=>{try{const h=await fetch(`/Per_OutTaiwan/announcements.json?t=${Date.now()}`);if(!h.ok)throw new Error("Global fetch failed");const w=await h.json();w.global&&(z.value=w.global)}catch(h){console.error("Failed to fetch global announcement:",h)}},P=h=>{Le(h.clientX,h.clientY,c.value?"#94a3b8":"#0f172a"),h.target.closest(".layout-floating-menu-container")||(y.value=!1)},R=()=>{y.value=!1};let u=null;return ue(()=>{document.title=C.title,u=Ee(c.value),window.threeBg=u;const h=localStorage.getItem("darkMode")==="true";c.value=h,h&&(document.body.classList.add("no-transition"),document.body.classList.add("dark"),document.body.offsetHeight,setTimeout(()=>{document.body.classList.remove("no-transition")},50)),L(),window.addEventListener("click",P),window.addEventListener("scroll",R,{passive:!0})}),pe(()=>{window.removeEventListener("click",P),window.removeEventListener("scroll",R),u&&u.destroy()}),Ft(()=>C.title,h=>{document.title=h}),Ft(c,h=>{u&&u.updateTheme(h)}),{isDarkMode:c,isMenuOpen:y,dogActive:s,birdActive:m,peekingActive:d,globalAnnouncement:z,toggleDarkMode:O,goToHome:D,scrollToTop:Y,goBack:j}}});export{Ne as L,Le as c};
