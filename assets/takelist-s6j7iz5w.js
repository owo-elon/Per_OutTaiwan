import{L as Ze,c as D}from"./index-C6aJeBil.js";import{c as Ke,P as Qe,i as et,d as tt,r as l,w as E,o as at,a as st,b as O,e as lt}from"./vue-vendor-CJvSAjNs.js";import"./three-DQbwDAWq.js";import"./vendor-Bsgzf06I.js";const ot=tt({name:"TakeList",components:{LayoutComponent:Ze},setup(){const be=new URLSearchParams(window.location.search).has("staratlas"),k=l(1),m=l(""),p=l(""),x=l(""),se=l("All"),P=l({}),G=l(!0),le=l(!1),W=l(!1),xe=l(!1),J=l(!1),oe=l(!1),$=l(!1),ne=l(!1),T=l(""),A=l("🚨 非常重要"),i=lt([]),h=l([]),f=l(0),c=l(0),r=l(!1),w=l(!1),U=l(0);let V=0;const b=l(0),B=l(0),ye=l(null),v=l(0),Me=()=>{v.value>0?v.value--:v.value=d.value.length-1},Ie=()=>{v.value<d.value.length-1?v.value++:v.value=0},Ce=l(localStorage.getItem("darkMode")==="true"),q=l({}),y=l({must:[],categories:[]}),Se=async()=>{try{const t=await fetch("/Per_OutTaiwan/takelist/takelist.json");if(t.ok){const a=await t.json();q.value=a.countries||{},y.value=a.defaultItems||{must:[],categories:[]}}else console.error("Fetch failed with status:",t.status)}catch(e){console.error("Failed to load takelist data",e)}},Le=O(()=>{let e=i.filter(t=>t.isMust);return x.value&&(e=e.filter(t=>t.name.includes(x.value))),e}),d=O(()=>{const e=[],t=i.filter(a=>!a.isMust);return y.value.categories.forEach(a=>{let s=t.filter(o=>o.category===a.name);s.length>0&&e.push({name:a.name,icon:a.icon,items:s})}),e}),j=()=>{r.value?f.value=c.value:f.value+=(c.value-f.value)*.1,(Math.abs(c.value-f.value)>.001||r.value)&&requestAnimationFrame(j);const e=d.value.length;if(e>0){let t=Math.round(-f.value)%e;t<0&&(t+=e),v.value=t}},_=e=>{if(w.value)return;const t=d.value.length;if(t===0)return;let a=Math.round(-c.value)%t;a<0&&(a+=t);let s=e-a;s>t/2&&(s-=t),s<-t/2&&(s+=t),c.value-=s,requestAnimationFrame(j)};let M=!1,H=!1;const ie=(e,t)=>{W.value=!1,Y.value=!1,J.value=!1,w.value=!1,U.value=e,V=t,H=!0,M=!1,r.value=!1},De=()=>{H=!1,M=!1},Ee=e=>{console.log("onMouseDown triggered"),ie(e.clientX,e.clientY)},re=e=>{if(!H)return;const t=e.clientX,a=e.clientY;if(!r.value){const s=Math.abs(t-U.value),o=Math.abs(a-V);(s>5||o>5)&&(r.value=!0,b.value=t,B.value=0,requestAnimationFrame(j))}if(r.value){w.value=!0;const s=t-b.value;b.value=t,c.value+=s*.005,B.value=s*.005}},g=()=>{console.log("onMouseUp triggered"),De(),r.value=!1,c.value=Math.round(c.value),f.value=c.value,setTimeout(()=>{w.value=!1},50)},Oe=()=>{g()},Pe=e=>{ie(e.touches[0].clientX,e.touches[0].clientY)},ce=e=>{if(!H)return;const t=e.touches[0].clientX,a=e.touches[0].clientY;if(!r.value&&!M){const s=Math.abs(t-U.value),o=Math.abs(a-V);(s>5||o>5)&&(o>s?M=!0:(r.value=!0,b.value=t,B.value=0,requestAnimationFrame(j)))}if(!M&&(e.cancelable&&e.preventDefault(),r.value)){w.value=!0;const s=t-b.value;b.value=t,c.value+=s*.005,B.value=s*.005}};E(x,e=>{if(!e)return;const t=d.value.findIndex(a=>a.items.some(s=>s.name.toLowerCase().includes(e.toLowerCase())));t!==-1&&_(t)}),E(se,e=>{if(e==="All")return;const t=d.value.findIndex(a=>a.name===e);t!==-1&&_(t)});const de=new MutationObserver(e=>{e.forEach(t=>{t.attributeName==="class"&&(Ce.value=document.body.classList.contains("dark"))})});at(async()=>{await Se(),Ge(),fe(),de.observe(document.body,{attributes:!0}),window.addEventListener("mousemove",re),document.addEventListener("mouseup",g),window.addEventListener("touchmove",ce,{passive:!1}),window.addEventListener("touchend",g),window.addEventListener("touchcancel",g),window.addEventListener("click",pe),window.addEventListener("scroll",ge,{passive:!0}),window.addEventListener("resize",z),z()}),st(()=>{de.disconnect(),window.removeEventListener("mousemove",re),window.removeEventListener("mouseup",g),window.removeEventListener("touchmove",ce),window.removeEventListener("touchend",g),window.removeEventListener("touchcancel",g),window.removeEventListener("click",pe),window.removeEventListener("scroll",ge),window.removeEventListener("resize",z),document.documentElement.classList.remove("lock-all-scroll"),document.body.classList.remove("lock-all-scroll")}),E(x,e=>{if(!e)return;const t=d.value.findIndex(a=>a.items.some(s=>s.name.toLowerCase().includes(e.toLowerCase())));t!==-1&&_(t)});const We=e=>{const t=d.value.length;if(t===0)return{};let a=(e+f.value)%t;a<0&&(a+=t),a>t/2&&(a-=t);const s=Math.abs(a);if(window.innerWidth>=768&&be){const n=e%2===0?1:-1,F=180,u=a,N=n*-5;let S=1.2,L=F;window.innerWidth>=1600?(S=1.6,L=F*1.3):window.innerWidth>=1200&&(S=1.4,L=F*1.15);const ke=n*L,Ve=100-u*250,qe=S;let R=0,ae=0;return u>=0?(R=Math.max(0,1-u*.3),ae=u*1.5):(R=Math.max(0,1+u*1.5),ae=Math.abs(u)*4),{transform:`translateX(${ke}px) translateZ(${Ve}px) rotateY(${N}deg) scale(${qe})`,opacity:R,zIndex:Math.round(40-u*10),pointerEvents:Math.abs(u)<.5?"auto":"none",visibility:R<.01?"hidden":"visible",filter:`blur(${ae}px)`}}else{const u=(window.innerWidth>400?1.1:.9)*Math.max(.7,1-s*.15),N=Math.max(0,1-s*.6),S=a*-35,L=s*-400;return{transform:`translateX(${a*(85*1.2)}%) translateZ(${L}px) rotateY(${S}deg) scale(${u})`,opacity:N,zIndex:Math.round(40-s*10),pointerEvents:s<.5?"auto":"none",visibility:N<.01?"hidden":"visible",filter:`blur(${s*2}px)`}}},$e=e=>{P.value[e]=!P.value[e]},I=O(()=>i.length),Z=O(()=>i.filter(e=>e.checked).length),Te=O(()=>I.value===0?0:Math.round(Z.value/I.value*100)),Ae=(e,t)=>{if(D(t.clientX,t.clientY,"#10b981"),!q.value[e].implemented){alert("此國家清單即將推出！目前請選擇韓國 🇰🇷");return}m.value=e,k.value=2,C()},Be=(e,t)=>{D(t.clientX,t.clientY,"#10b981"),p.value=e,k.value=3,He(),C()},X=()=>`travel_packing_${m.value}_${p.value}`,ue=()=>`travel_packing_custom_${m.value}_${p.value}`,K=()=>`travel_packing_deleted_${m.value}_${p.value}`,ve=()=>{const e=i.filter(t=>t.isCustom);localStorage.setItem(ue(),JSON.stringify(e))},je=()=>{h.value.length>0?localStorage.setItem(K(),JSON.stringify(h.value)):localStorage.removeItem(K())},_e=()=>{if(!T.value.trim())return;const e=A.value==="🚨 非常重要",t={id:`custom_${Date.now()}`,name:T.value.trim(),checked:!1,isMust:e,category:A.value,isCustom:!0};i.push(t),ve(),T.value="",ne.value=!1,e?G.value=!0:P.value[A.value]=!0},me=e=>{const t=i.findIndex(a=>a.id===e);if(t>-1){const a=i[t];i.splice(t,1),a.isCustom?ve():(h.value.push(e),je()),C()}},He=()=>{const e=[],t=localStorage.getItem(K());if(t)try{h.value=JSON.parse(t)}catch(o){console.error("Failed to parse deleted items",o),h.value=[]}else h.value=[];y.value.must.forEach(o=>{h.value.includes(o.id)||e.push({...o,isMust:!0,category:"🚨 絕對不能忘記"})}),y.value.categories.forEach(o=>{o.items.forEach(n=>{"gender"in n&&n.gender!==p.value||"country"in n&&n.country!==m.value||h.value.includes(n.id)||e.push({...n,isMust:!1,category:o.name})})});const a=localStorage.getItem(ue());if(a)try{JSON.parse(a).forEach(n=>{e.push(n)})}catch(o){console.error("Failed to parse custom items",o)}const s=localStorage.getItem(X());if(s)try{const o=JSON.parse(s);e.forEach(n=>{o.includes(n.id)&&(n.checked=!0)})}catch(o){console.error("Failed to parse saved items",o)}i.splice(0,i.length,...e)},Xe=(e,t,a)=>{if(!w.value&&v.value===a){if(t.stopPropagation(),oe.value){me(e.id);return}if(e.checked=!e.checked,Z.value===I.value&&I.value>0)for(let s=0;s<5;s++)setTimeout(()=>{D(window.innerWidth/2+(Math.random()-.5)*200,window.innerHeight/2+(Math.random()-.5)*200,"#10b981")},s*100);C()}},Ye=()=>{i.forEach(e=>e.checked=!0),C()},ze=()=>{$.value=!0},Fe=()=>{localStorage.removeItem(X()),i.forEach(e=>e.checked=!1),$.value=!1,D(window.innerWidth/2,window.innerHeight/2,"#ef4444")},Ne=()=>{$.value=!1},Re=()=>{for(let e=0;e<8;e++)setTimeout(()=>{D(window.innerWidth/2+(Math.random()-.5)*400,window.innerHeight/2+(Math.random()-.5)*400,e%2===0?"#10b981":"#6366f1")},e*150)},C=()=>{if(m.value&&p.value&&k.value===3){const e=i.filter(t=>t.checked).map(t=>t.id);e.length>0?localStorage.setItem(X(),JSON.stringify(e)):localStorage.removeItem(X())}},Ge=()=>{k.value=1,m.value="",p.value=""},Y=l(!1),pe=e=>{e.target.closest(".left-menu-container")||(Y.value=!1,W.value=!1)},Q=l(localStorage.getItem("weatherCity")||"Taipei"),he=l(null),ee=l(!1),te=[{id:"Tokyo",name:"東京",lat:35.6895,lon:139.6917},{id:"Seoul",name:"首爾",lat:37.5665,lon:126.978},{id:"Bangkok",name:"曼谷",lat:13.7563,lon:100.5018},{id:"Paris",name:"巴黎",lat:48.8566,lon:2.3522},{id:"London",name:"倫敦",lat:51.5074,lon:-.1278},{id:"New York",name:"紐約",lat:40.7128,lon:-74.006},{id:"Taipei",name:"台北",lat:25.033,lon:121.5654}],fe=async()=>{const e=te.find(t=>t.id===Q.value)||te[6];ee.value=!0;try{const a=await(await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${e.lat}&longitude=${e.lon}&current_weather=true`)).json();he.value=a.current_weather}catch(t){console.error("天氣載入失敗:",t)}finally{ee.value=!1}},Je=e=>{const t=e.target;Q.value=t.value,localStorage.setItem("weatherCity",t.value),fe()},Ue=e=>e===0?"☀️":e===1||e===2||e===3?"⛅":e>=45&&e<=48?"🌫️":e>=51&&e<=67?"🌧️":e>=71&&e<=77?"❄️":e>=80&&e<=82?"🌦️":e>=85&&e<=86?"🌨️":e>=95?"⛈️":"☁️";E(le,e=>{e&&(G.value=!1)});const z=()=>{const e=document.documentElement,t=document.body;e.classList.add("lock-all-scroll"),t.classList.add("lock-all-scroll")};E(k,z);const ge=()=>{W.value=!1,Y.value=!1,J.value=!1};return{currentStep:k,selectedCountry:m,selectedGender:p,searchQuery:x,selectedCategoryFilter:se,expandedCategories:P,categories:d,countries:q,mustItems:Le,mustItemsExpanded:G,filteredCategories:d,carouselContainer:ye,activeCategoryIndex:v,carouselOffset:f,isDragging:r,onMouseDown:Ee,onTouchStart:Pe,onMouseLeave:Oe,onMouseUp:g,getCategoryStyle:We,rotateTo:_,totalCount:I,packedCount:Z,progressPercent:Te,isHeaderExpanded:le,isLeftMenuOpen:W,isSearchPanelOpen:J,isDeleteMode:oe,peekingActive:xe,showResetModal:$,showAddItemModal:ne,newItemName:T,newItemCategory:A,defaultItems:y,addCustomItem:_e,removeItem:me,isWeatherMenuOpen:Y,selectedWeatherCity:Q,weatherData:he,isWeatherLoading:ee,weatherCities:te,selectCountry:Ae,selectGender:Be,toggleCategory:$e,toggleItem:Xe,markAllPacked:Ye,resetList:ze,celebrateMore:Re,confirmReset:Fe,cancelReset:Ne,prevCategory:Me,nextCategory:Ie,selectWeatherCity:Je,getWeatherIcon:Ue}},template:`
    <LayoutComponent title="OutTaiwan - 打包清單">
        <template #bottom-left>
            <div class="flex flex-col-reverse items-start gap-4 left-menu-container" v-if="currentStep === 3">
                <!-- Left Menu Toggle Button -->
                <button @click.stop="isLeftMenuOpen = !isLeftMenuOpen" 
                        class="layout-main-menu-toggle pointer-events-auto">
                    <div class="layout-main-menu-glow"></div>
                    <svg v-if="!isLeftMenuOpen" xmlns="http://www.w3.org/2000/svg" class="layout-main-menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="layout-main-menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <!-- Menu Items -->
                <div v-if="isLeftMenuOpen" class="flex flex-col gap-3 mb-2 animate-fade-in items-start">
                    <!-- Search Toggle Button -->
                    <button @click.stop="isSearchPanelOpen = !isSearchPanelOpen; isWeatherMenuOpen = false; isLeftMenuOpen = false" 
                            class="layout-menu-btn group relative">
                        <span class="layout-menu-btn-icon">🔍</span>
                        <span class="takelist-tooltip">
                            搜尋物品
                        </span>
                    </button>

                    <!-- Weather Toggle Button -->
                    <button @click.stop="isWeatherMenuOpen = !isWeatherMenuOpen; isSearchPanelOpen = false; isLeftMenuOpen = false" 
                            class="layout-menu-btn group relative">
                        <span class="layout-menu-btn-icon">⛅</span>
                        <span class="takelist-tooltip">
                            目的地天氣
                        </span>
                    </button>
                </div>

                <!-- Weather Panel -->
                <transition 
                    enter-active-class="transition duration-300 ease-out"
                    enter-from-class="transform -translate-x-8 opacity-0"
                    enter-to-class="transform translate-x-0 opacity-100"
                    leave-active-class="transition duration-200 ease-in"
                    leave-from-class="transform translate-x-0 opacity-100"
                    leave-to-class="transform -translate-x-8 opacity-0"
                >
                    <div v-if="isWeatherMenuOpen" 
                         class="takelist-panel absolute bottom-20 left-0 w-72 z-[70]">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-xl font-bold text-black dark:text-white flex items-center gap-2">
                                <span>🌍</span> 目的地天氣
                            </h3>
                            <button @click="isWeatherMenuOpen = false" class="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        <div class="mb-4">
                            <select @change="selectWeatherCity" :value="selectedWeatherCity"
                                    class="takelist-input w-full px-4 py-3 text-black dark:text-white font-bold appearance-none cursor-pointer">
                                <option v-for="city in weatherCities" :key="city.id" :value="city.id">
                                    {{ city.name }}
                                </option>
                            </select>
                        </div>

                        <div v-if="isWeatherLoading" class="flex justify-center py-6">
                            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                        </div>
                        
                        <div v-else-if="weatherData" class="bg-white/40 dark:bg-slate-800/40 rounded-2xl p-4 text-center border border-white/20">
                            <div class="text-5xl mb-2">{{ getWeatherIcon(weatherData.weathercode) }}</div>
                            <div class="text-3xl font-black text-black dark:text-white mb-1">
                                {{ Math.round(weatherData.temperature) }}°C
                            </div>
                            <div class="text-sm text-slate-900 dark:text-slate-400 font-bold">
                                風速: {{ weatherData.windspeed }} km/h
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
        </template>

        <!-- Step 1: Select Country -->
        <div v-if="currentStep === 1" class="takelist-step-wrapper h-full overflow-y-auto no-scrollbar pt-8 pb-20 px-4">
            <div class="step-container w-full max-w-4xl mx-auto">
                <h2 class="text-3xl font-black text-center mb-12 text-slate-900 dark:text-white">請選擇目的地</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div v-for="(country, key) in countries" :key="key" 
                         @click="selectCountry(key, $event)"
                         class="takelist-selection-card group">
                        <div class="takelist-selection-icon">{{ country.flag }}</div>
                        <div class="takelist-selection-title">{{ country.name }}</div>
                        <div v-if="!country.implemented" class="takelist-selection-subtitle">(即將推出)</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Step 2: Select Gender -->
        <div v-if="currentStep === 2" class="takelist-step-wrapper h-full overflow-y-auto no-scrollbar pt-8 pb-20 px-4">
            <div class="step-container w-full max-w-3xl mx-auto">
                <h2 class="text-3xl font-black text-center mb-12 text-slate-900 dark:text-white">請選擇性別</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-12">
                    <div @click="selectGender('male', $event)" class="takelist-selection-card group">
                        <div class="takelist-selection-icon">👨</div>
                        <div class="takelist-selection-title">男性</div>
                    </div>
                    <div @click="selectGender('female', $event)" class="takelist-selection-card group">
                        <div class="takelist-selection-icon">👩</div>
                        <div class="takelist-selection-title">女性</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Step 3: Packing List -->
        <div v-if="currentStep === 3" class="takelist-step-wrapper h-full pt-2 pb-16 px-2" :class="isHeaderExpanded ? 'overflow-y-auto no-scrollbar' : 'overflow-hidden'">
            <!-- Header & Progress -->
            <div class="takelist-header-card !mb-6"
                 :class="[
                    mustItems.some(i => !i.checked) 
                    ? 'border-red-500 animate-warning-flash' 
                    : 'border-indigo-500/20 dark:border-indigo-400/20'
                 ]">
                <!-- Title & Mobile Toggle -->
                <div @click="isHeaderExpanded = !isHeaderExpanded" class="flex items-center justify-between mb-4 cursor-pointer select-none group/header">
                    <h1 class="takelist-header-title !text-lg md:!text-2xl">
                        <span class="mr-2 text-slate-900 dark:text-white">{{ countries[selectedCountry].flag }}</span>
                        <span class="truncate">{{ countries[selectedCountry].name }}</span>
                        <span class="takelist-gender-badge ml-2">
                            {{ selectedGender === 'male' ? '👨' : '👩' }}
                        </span>
                    </h1>
                    
                    <!-- Toggle Button -->
                    <div class="takelist-header-toggle p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform duration-300" :class="{ 'rotate-180': isHeaderExpanded }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
 
                <!-- Collapsible Content -->
                <transition 
                    enter-active-class="transition duration-300 ease-out"
                    enter-from-class="transform -translate-y-4 opacity-0"
                    enter-to-class="transform translate-y-0 opacity-100"
                    leave-active-class="transition duration-200 ease-in"
                    leave-from-class="transform translate-y-0 opacity-100"
                    leave-to-class="transform -translate-y-4 opacity-0"
                >
                    <div v-show="isHeaderExpanded">
                        <div class="flex items-center justify-between mb-4 gap-3">
                            <div class="flex gap-2">
                                <button @click="showAddItemModal = true" class="takelist-header-btn takelist-header-btn-emerald !p-2" title="新增物品">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>
                                <button @click="markAllPacked" class="takelist-header-btn takelist-header-btn-indigo !p-2" title="全部完成">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </button>
                                <button @click="resetList" class="takelist-header-btn takelist-header-btn-outline !p-2" title="重置清單">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </button>
                            </div>
                            
                            <!-- Progress Bar -->
                            <div class="flex-1 max-w-[200px]">
                                <div class="takelist-progress-text !text-[10px] !mb-1">
                                    <span>進度 {{ progressPercent }}%</span>
                                    <span>{{ packedCount }}/{{ totalCount }}</span>
                                </div>
                                <div class="takelist-progress-track !h-1.5">
                                    <div class="takelist-progress-bar" :style="{ width: progressPercent + '%' }"></div>
                                </div>
                            </div>
                        </div>

                        <!-- 🚨 Absolute Must Forget Section -->
                        <div v-if="mustItems.length > 0" class="takelist-must-section !mb-0 !p-3"
                             :class="{ 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]': mustItems.some(i => !i.checked) }">
                            <div class="takelist-must-header !mb-2">
                                <span class="text-sm">🚨</span>
                                <span class="takelist-must-badge !text-[10px] !px-2 !py-0.5">
                                    必帶: {{ mustItems.filter(i => i.checked).length }}/{{ mustItems.length }}
                                </span>
                            </div>
                            
                            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                <div v-for="item in mustItems" :key="item.id" 
                                     @click="toggleItem(item, $event)"
                                     class="takelist-must-item"
                                     :class="[
                                        item.checked && !isDeleteMode ? 'opacity-50 grayscale' : '',
                                        isDeleteMode ? 'hover:border-red-500/50 hover:bg-red-50/50 dark:hover:bg-red-900/20' : ''
                                     ]">
                                    <div class="takelist-must-checkbox"
                                         :class="[
                                            item.checked && !isDeleteMode ? 'bg-emerald-500 border-emerald-500' : 'border-red-400',
                                            isDeleteMode ? 'border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-900/30' : ''
                                         ]">
                                        <svg v-if="item.checked && !isDeleteMode" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 md:h-5 md:w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                    <span class="takelist-must-text truncate" 
                                          :class="item.checked && !isDeleteMode ? 'line-through' : ''">
                                        {{ item.name }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>

            <!-- Empty Search State -->
            <div v-if="categories.length === 0 && searchQuery" class="text-center py-20">
                <div class="text-6xl mb-4">🔍</div>
                <h3 class="text-xl font-bold text-black dark:text-slate-400">找不到相關物品</h3>
                <p class="text-slate-900 dark:text-slate-400">請嘗試其他關鍵字</p>
            </div>

            <!-- Search & Filter Panel (Slide Down) -->
            <transition 
                enter-active-class="transition duration-500 ease-out"
                enter-from-class="transform -translate-y-full opacity-0"
                enter-to-class="transform translate-y-0 opacity-100"
                leave-active-class="transition duration-300 ease-in"
                leave-from-class="transform translate-y-0 opacity-100"
                leave-to-class="transform -translate-y-full opacity-0"
            >
                <div v-if="isSearchPanelOpen && currentStep === 3" class="fixed top-0 left-0 right-0 z-[100] p-4 pointer-events-none">
                    <div class="glass-card p-6 rounded-3xl shadow-2xl border border-white/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl pointer-events-auto">
                        <div class="flex flex-col sm:flex-row gap-4 w-full">
                            <!-- Dropdown -->
                            <select v-model="selectedCategoryFilter" @change="isSearchPanelOpen = false" class="takelist-input py-4 px-4 text-black dark:text-white font-bold appearance-none cursor-pointer">
                                <option value="All">全部類別</option>
                                <option v-for="cat in categories" :key="cat.name" :value="cat.name">{{ cat.icon }} {{ cat.name }}</option>
                            </select>

                            <!-- Search -->
                            <div class="relative flex-1">
                                <input v-model="searchQuery" type="text" placeholder="搜尋物品..." 
                                       class="takelist-input w-full py-4 pl-12 pr-4 text-black dark:text-white font-bold">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-4 top-4.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                        <button @click="isSearchPanelOpen = false" class="mt-4 w-full py-2 text-slate-400 hover:text-indigo-500 transition-colors flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-widest">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                            </svg>
                            收起搜尋
                        </button>
                    </div>
                </div>
            </transition>

            <!-- 3D Carousel for Categories -->
            <div class="takelist-carousel-area" 
                 :class="{ 'cursor-grabbing': isDragging, 'cursor-grab': !isDragging }"
                 @mousedown="onMouseDown" 
                 @touchstart="onTouchStart"
                 @mouseleave="onMouseLeave"
                 @mouseup="onMouseUp">
                <div class="takelist-carousel-wrapper">
                    <div v-for="(category, index) in categories" :key="category.name" 
                         class="absolute w-[90%] md:w-[450px] h-full"
                         :style="getCategoryStyle(index)"
                         @click="rotateTo(index)">
                        
                        <div class="takelist-category-card transition-all duration-300 preserve-3d"
                             :class="[
                                category.items.length > 0 && category.items.every(i => i.checked) ? 'border-emerald-400/50 dark:border-emerald-500/50 bg-emerald-50/30 dark:bg-emerald-900/10' : 'border-white/20 dark:border-white/5',
                                isDragging && activeCategoryIndex === index ? 'ring-4 ring-indigo-500/50 scale-[1.02] shadow-2xl' : ''
                             ]">
                            
                            <div class="takelist-category-header">
                                <div class="flex items-center gap-4">
                                    <div class="takelist-category-icon">
                                        {{ category.icon }}
                                    </div>
                                    <div>
                                        <h3 class="takelist-category-title">{{ category.name }}</h3>
                                        <p class="takelist-category-subtitle">
                                            {{ category.items.filter(i => i.checked).length }} / {{ category.items.length }} ITEMS
                                        </p>
                                    </div>
                                </div>
                                <div class="flex items-center gap-2">
                                    <button @click.stop="isDeleteMode = !isDeleteMode" 
                                            class="takelist-action-btn !w-10 !h-10 md:!w-12 md:!h-12"
                                            :class="isDeleteMode ? 'takelist-action-btn-danger' : 'bg-slate-200/80 dark:bg-slate-800/80 !text-slate-800 dark:!text-slate-300 hover:!text-red-600 border-slate-300/50 dark:border-white/10 hover:border-red-300 dark:hover:border-red-900'">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                    <div v-if="category.items.length > 0 && category.items.every(i => i.checked)" 
                                         class="takelist-category-complete-badge">
                                        <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                                    </div>
                                </div>
                            </div>

                            <div class="takelist-category-body">
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div v-for="item in category.items" :key="item.id" 
                                         v-show="!searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase())"
                                         @click="toggleItem(item, $event, index)"
                                         class="takelist-item-card group"
                                         :class="[
                                            item.checked && !isDeleteMode ? 'bg-slate-50/50 dark:bg-slate-800/30 border-emerald-500/10' : '',
                                            isDeleteMode ? 'hover:border-red-500/50 hover:bg-red-50/50 dark:hover:bg-red-900/20' : ''
                                         ]">
                                        <div class="takelist-item-checkbox" 
                                             :class="[
                                                item.checked && !isDeleteMode ? 'bg-slate-900 border-slate-900 dark:bg-slate-100 dark:border-slate-100' : '',
                                                isDeleteMode ? 'border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-900/30 !group-hover:border-red-600' : ''
                                             ]">
                                            <svg v-if="item.checked && !isDeleteMode" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 md:h-6 md:w-6 text-white dark:text-slate-900" viewBox="0 0 20 20" fill="currentColor">
                                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                            </svg>
                                            <svg v-if="isDeleteMode" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 md:h-5 md:w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </div>
                                        <span class="takelist-item-text" 
                                              :class="[
                                                item.checked && !isDeleteMode ? 'line-through opacity-60 translate-x-1 text-slate-500' : '',
                                                isDeleteMode ? 'group-hover:text-red-600 dark:group-hover:text-red-400' : ''
                                              ]">
                                            {{ item.name }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Drag Indicator on Card -->
                            <div class="w-full py-3 flex justify-center items-center opacity-40 pointer-events-none">
                                <div class="w-12 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Reset Confirmation Modal -->
        <div v-if="showResetModal" class="takelist-modal-overlay">
            <div class="takelist-modal-backdrop" @click="cancelReset"></div>
            <div class="takelist-modal-content">
                <div class="text-center mb-6">
                    <div class="text-5xl mb-4">⚠️</div>
                    <h3 class="text-2xl font-bold text-black dark:text-white mb-2">確定要重置嗎？</h3>
                    <p class="text-slate-900 dark:text-slate-400 mb-8">這將會清除您目前所有的打包進度，且無法復原。</p>
                    <div class="flex gap-4">
                        <button @click="cancelReset" class="takelist-btn takelist-btn-cancel">
                            取消
                        </button>
                        <button @click="confirmReset" class="takelist-btn takelist-btn-danger">
                            確定重置
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add Item Modal -->
        <div v-if="showAddItemModal" class="takelist-modal-overlay">
            <div class="takelist-modal-backdrop" @click="showAddItemModal = false"></div>
            <div class="takelist-modal-content">
                <div class="text-center mb-6">
                    <div class="text-5xl mb-4">✨</div>
                    <h3 class="text-2xl font-bold text-black dark:text-white">新增自訂物品</h3>
                </div>
                <div class="space-y-4 mb-8 text-left">
                    <div>
                        <label class="block text-sm font-bold text-slate-900 dark:text-slate-300 mb-2">物品名稱</label>
                        <input v-model="newItemName" @keyup.enter="addCustomItem" type="text" placeholder="例如：護照套..." class="takelist-input">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-900 dark:text-slate-300 mb-2">選擇分類</label>
                        <select v-model="newItemCategory" class="takelist-input appearance-none cursor-pointer">
                            <option value="🚨 絕對不能忘記">🚨 絕對不能忘記 (置頂)</option>
                            <option v-for="cat in defaultItems.categories" :key="cat.name" :value="cat.name">{{ cat.icon }} {{ cat.name }}</option>
                        </select>
                    </div>
                </div>
                <div class="flex gap-4">
                    <button @click="showAddItemModal = false" class="takelist-btn takelist-btn-cancel">
                        取消
                    </button>
                    <button @click="addCustomItem" class="takelist-btn takelist-btn-confirm">
                        確認新增
                    </button>
                </div>
            </div>
        </div>
    </LayoutComponent>
  `}),we=Ke(ot);we.use(Qe,{theme:{preset:et,options:{darkModeSelector:".dark"}}});we.mount("#app");
