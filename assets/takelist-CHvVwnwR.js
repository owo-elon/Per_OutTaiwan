import{d as qe,e as Ge,i as Je,f as Ve,L as Ue,r as l,w as I,o as Ke,h as Qe,j as b,k as S,l as Ze}from"./index-BJwqhLFL.js";const et=Ve({name:"TakeList",components:{LayoutComponent:Ue},setup(){const p=l(1),c=l(""),m=l(""),x=l(""),U=l("All"),L=l({}),Y=l(!0),K=l(!1),D=l(!1),he=l(!1),z=l(!1),Q=l(!1),E=l(!1),Z=l(!1),O=l(""),A=l("🚨 非常重要"),i=Ze([]),h=l([]),f=l(0),d=l(0),r=l(!1),g=l(!1),N=l(0);let F=0;const w=l(0),j=l(0),fe=l(null),v=l(0),ke=()=>{v.value>0?v.value--:v.value=u.value.length-1},pe=()=>{v.value<u.value.length-1?v.value++:v.value=0},ge=l(localStorage.getItem("darkMode")==="true"),T=l({countries:{},global:{show:!1,message:""}}),we=b(()=>!c.value||!T.value.countries?null:T.value.countries[c.value]||null),ee={korea:{name:"韓國",flag:"🇰🇷",implemented:!0},japan:{name:"日本",flag:"🇯🇵",implemented:!1},thailand:{name:"泰國",flag:"🇹🇭",implemented:!1},usa:{name:"美國",flag:"🇺🇸",implemented:!1},europe:{name:"歐洲",flag:"🇪🇺",implemented:!1}},P={must:[{id:"m1",name:"護照",checked:!1},{id:"m2",name:"手機",checked:!1},{id:"m3",name:"錢包",checked:!1},{id:"m4",name:"信用卡",checked:!1},{id:"m5",name:"網路卡/ESIM",checked:!1},{id:"m6",name:"錢(台幣/外幣)",checked:!1}],categories:[{name:"其他重要物品",icon:"💼",items:[{id:"i1",name:"登機證(可以申請記得先申請)",checked:!1},{id:"i2",name:"證件(身分證 健保卡)",checked:!1},{id:"i3",name:"行動電源",checked:!1},{id:"i4",name:"雨傘",checked:!1},{id:"i5",name:"萬國轉接頭",checked:!1},{id:"i6",name:"充電頭2顆",checked:!1},{id:"i7",name:"充電線2條(記得拿一條跟行動電源放一起)",checked:!1}]},{name:"包包",icon:"🎒",items:[{id:"b1",name:"後背包",checked:!1},{id:"b2",name:"側背包",checked:!1},{id:"b3",name:"收納腰包",checked:!1},{id:"b4",name:"行李替大~包 (掛行李箱上那個)",checked:!1},{id:"b5",name:"壓縮袋",checked:!1}]},{name:"衣物",icon:"👕",items:[{id:"c1",name:"衣服(記得帶睡衣) [幾夜]",checked:!1},{id:"c2",name:"褲子(記得帶睡褲) [幾夜]",checked:!1},{id:"c3",name:"內褲 [幾天]",checked:!1},{id:"c4",name:"內衣 [幾天]",checked:!1},{id:"c5",name:"襪子 [幾天]",checked:!1},{id:"c6",name:"拖鞋/涼鞋/布鞋",checked:!1},{id:"c7",name:"外套",checked:!1},{id:"c8",name:"帽子",checked:!1}]},{name:"盥洗用品",icon:"🧴",items:[{id:"t1",name:"牙刷牙膏",checked:!1},{id:"t2",name:"洗面乳",checked:!1},{id:"t3",name:"護髮乳",checked:!1},{id:"t4",name:"洗臉巾",checked:!1},{id:"t5",name:"隱形眼鏡+清洗液",checked:!1},{id:"t6",name:"髒衣袋",checked:!1},{id:"t7",name:"壓縮毛巾",checked:!1},{id:"t8",name:"牙籤",checked:!1},{id:"t9",name:"頸枕",checked:!1},{id:"t10",name:"眼罩",checked:!1},{id:"t11",name:"耳塞",checked:!1}]},{name:"文具用品/3C/備品",icon:"📱",items:[{id:"s1",name:"小剪刀(記得丟行李箱)",checked:!1},{id:"s2",name:"膠帶",checked:!1},{id:"s3",name:"筆",checked:!1},{id:"s4",name:"耳機",checked:!1},{id:"s5",name:"自拍棒",checked:!1},{id:"s6",name:"絕緣膠帶",checked:!1},{id:"s7",name:"飲料提袋",checked:!1},{id:"s8",name:"環保袋",checked:!1},{id:"s9",name:"衛生紙",checked:!1},{id:"s10",name:"濕紙巾",checked:!1},{id:"s11",name:"垃圾袋",checked:!1}]},{name:"藥品",icon:"💊",items:[{id:"p1",name:"小護士",checked:!1},{id:"p2",name:"防蚊液",checked:!1},{id:"p3",name:"木瓜霜",checked:!1},{id:"p4",name:"生理食鹽水",checked:!1},{id:"p5",name:"眼藥水",checked:!1},{id:"p6",name:"止痛藥",checked:!1},{id:"p7",name:"ok蹦",checked:!1},{id:"p8",name:"棉花棒",checked:!1}]},{name:"化妝品",icon:"💄",items:[{id:"mk1",name:"防曬",checked:!1},{id:"mk2",name:"粉底液+刀",checked:!1},{id:"mk3",name:"粉餅+海綿",checked:!1},{id:"mk4",name:"定妝液",checked:!1},{id:"mk5",name:"定妝粉",checked:!1},{id:"mk6",name:"腮紅",checked:!1},{id:"mk7",name:"眼影+刷具",checked:!1},{id:"mk8",name:"眉粉",checked:!1},{id:"mk9",name:"眼線筆",checked:!1},{id:"mk10",name:"睫毛膏+夾",checked:!1},{id:"mk11",name:"口紅",checked:!1},{id:"mk12",name:"卸妝水+巾",checked:!1},{id:"mk13",name:"梳子",checked:!1},{id:"mk14",name:"髮油",checked:!1},{id:"mk15",name:"香水",checked:!1},{id:"mk16",name:"髮圈",checked:!1},{id:"mk17",name:"鏡子",checked:!1}]},{name:"保養品",icon:"✨",items:[{id:"sk1",name:"化妝水",checked:!1},{id:"sk2",name:"蘆薈膠",checked:!1},{id:"sk3",name:"乳液",checked:!1}]}]},be=b(()=>{let e=i.filter(t=>t.isMust);return x.value&&(e=e.filter(t=>t.name.includes(x.value))),e}),u=b(()=>{const e=[],t=i.filter(a=>!a.isMust);return P.categories.forEach(a=>{let s=t.filter(n=>n.category===a.name);s.length>0&&e.push({name:a.name,icon:a.icon,items:s})}),e}),B=()=>{r.value?f.value=d.value:f.value+=(d.value-f.value)*.1,(Math.abs(d.value-f.value)>.001||r.value)&&requestAnimationFrame(B);const e=u.value.length;if(e>0){let t=Math.round(-f.value)%e;t<0&&(t+=e),v.value=t}},W=e=>{if(g.value)return;const t=u.value.length;if(t===0)return;let a=Math.round(-d.value)%t;a<0&&(a+=t);let s=e-a;s>t/2&&(s-=t),s<-t/2&&(s+=t),d.value-=s,requestAnimationFrame(B)};let y=!1,$=!1;const te=(e,t)=>{D.value=!1,H.value=!1,z.value=!1,g.value=!1,N.value=e,F=t,$=!0,y=!1,r.value=!1},xe=()=>{$=!1,y=!1},ye=e=>{console.log("onMouseDown triggered"),te(e.clientX,e.clientY)},ae=e=>{if(!$)return;const t=e.clientX,a=e.clientY;if(!r.value){const s=Math.abs(t-N.value),n=Math.abs(a-F);(s>5||n>5)&&(r.value=!0,w.value=t,j.value=0,requestAnimationFrame(B))}if(r.value){g.value=!0;const s=t-w.value;w.value=t,d.value+=s*.005,j.value=s*.005}},k=()=>{console.log("onMouseUp triggered"),xe(),r.value=!1,d.value=Math.round(d.value),f.value=d.value,setTimeout(()=>{g.value=!1},50)},Me=()=>{k()},Ce=e=>{te(e.touches[0].clientX,e.touches[0].clientY)},se=e=>{if(!$)return;const t=e.touches[0].clientX,a=e.touches[0].clientY;if(!r.value&&!y){const s=Math.abs(t-N.value),n=Math.abs(a-F);(s>5||n>5)&&(n>s?y=!0:(r.value=!0,w.value=t,j.value=0,requestAnimationFrame(B)))}if(!y&&(e.cancelable&&e.preventDefault(),r.value)){g.value=!0;const s=t-w.value;w.value=t,d.value+=s*.005,j.value=s*.005}};I(x,e=>{if(!e)return;const t=u.value.findIndex(a=>a.items.some(s=>s.name.toLowerCase().includes(e.toLowerCase())));t!==-1&&W(t)}),I(U,e=>{if(e==="All")return;const t=u.value.findIndex(a=>a.name===e);t!==-1&&W(t)});const le=new MutationObserver(e=>{e.forEach(t=>{t.attributeName==="class"&&(ge.value=document.body.classList.contains("dark"))})});Ke(()=>{He(),ze(),de(),le.observe(document.body,{attributes:!0}),window.addEventListener("mousemove",ae),document.addEventListener("mouseup",k),window.addEventListener("touchmove",se,{passive:!1}),window.addEventListener("touchend",k),window.addEventListener("touchcancel",k),window.addEventListener("click",re),window.addEventListener("scroll",ue,{passive:!0}),window.addEventListener("resize",X),X()}),Qe(()=>{le.disconnect(),window.removeEventListener("mousemove",ae),window.removeEventListener("mouseup",k),window.removeEventListener("touchmove",se),window.removeEventListener("touchend",k),window.removeEventListener("touchcancel",k),window.removeEventListener("click",re),window.removeEventListener("scroll",ue),window.removeEventListener("resize",X),document.documentElement.classList.remove("lock-all-scroll"),document.body.classList.remove("lock-all-scroll")}),I(x,e=>{if(!e)return;const t=u.value.findIndex(a=>a.items.some(s=>s.name.toLowerCase().includes(e.toLowerCase())));t!==-1&&W(t)});const Ie=e=>{const t=u.value.length;if(t===0)return{};let a=(e+f.value)%t;a<0&&(a+=t),a>t/2&&(a-=t);const s=Math.abs(a),o=window.innerWidth<768?85:110,Ne=Math.max(.7,1-s*.15),ve=Math.max(0,1-s*.6),Fe=a*-35,Re=s*-400;return{transform:`translateX(${a*(o*1.2)}%) translateZ(${Re}px) rotateY(${Fe}deg) scale(${Ne})`,opacity:ve,zIndex:Math.round(40-s*10),pointerEvents:s<2.5?"auto":"none",visibility:ve<.01?"hidden":"visible",filter:`blur(${s*2}px)`}},Se=e=>{L.value[e]=!L.value[e]},M=b(()=>i.length),R=b(()=>i.filter(e=>e.checked).length),Le=b(()=>M.value===0?0:Math.round(R.value/M.value*100)),De=(e,t)=>{if(S(t.clientX,t.clientY,"#10b981"),!ee[e].implemented){alert("此國家清單即將推出！目前請選擇韓國 🇰🇷");return}c.value=e,p.value=2,C()},Ee=(e,t)=>{S(t.clientX,t.clientY,"#10b981"),m.value=e,p.value=3,je(),C()},_=()=>`travel_packing_${c.value}_${m.value}`,ne=()=>`travel_packing_custom_${c.value}_${m.value}`,q=()=>`travel_packing_deleted_${c.value}_${m.value}`,ie=()=>{const e=i.filter(t=>t.isCustom);localStorage.setItem(ne(),JSON.stringify(e))},Oe=()=>{h.value.length>0?localStorage.setItem(q(),JSON.stringify(h.value)):localStorage.removeItem(q())},Ae=()=>{if(!O.value.trim())return;const e=A.value==="🚨 非常重要",t={id:`custom_${Date.now()}`,name:O.value.trim(),checked:!1,isMust:e,category:A.value,isCustom:!0};i.push(t),ie(),O.value="",Z.value=!1,e?Y.value=!0:L.value[A.value]=!0},oe=e=>{const t=i.findIndex(a=>a.id===e);if(t>-1){const a=i[t];i.splice(t,1),a.isCustom?ie():(h.value.push(e),Oe()),C()}},je=()=>{const e=[],t=localStorage.getItem(q());if(t)try{h.value=JSON.parse(t)}catch(n){console.error("Failed to parse deleted items",n),h.value=[]}else h.value=[];P.must.forEach(n=>{h.value.includes(n.id)||e.push({...n,isMust:!0,category:"🚨 絕對不能忘記"})}),P.categories.forEach(n=>{n.items.forEach(o=>{"gender"in o&&o.gender!==m.value||"country"in o&&o.country!==c.value||h.value.includes(o.id)||e.push({...o,isMust:!1,category:n.name})})});const a=localStorage.getItem(ne());if(a)try{JSON.parse(a).forEach(o=>{e.push(o)})}catch(n){console.error("Failed to parse custom items",n)}const s=localStorage.getItem(_());if(s)try{const n=JSON.parse(s);e.forEach(o=>{n.includes(o.id)&&(o.checked=!0)})}catch(n){console.error("Failed to parse saved items",n)}i.splice(0,i.length,...e)},Te=(e,t,a)=>{if(!g.value&&v.value===a){if(t.stopPropagation(),Q.value){oe(e.id);return}if(e.checked=!e.checked,R.value===M.value&&M.value>0)for(let s=0;s<5;s++)setTimeout(()=>{S(window.innerWidth/2+(Math.random()-.5)*200,window.innerHeight/2+(Math.random()-.5)*200,"#10b981")},s*100);C()}},Pe=()=>{i.forEach(e=>e.checked=!0),C()},Be=()=>{E.value=!0},We=()=>{localStorage.removeItem(_()),i.forEach(e=>e.checked=!1),E.value=!1,S(window.innerWidth/2,window.innerHeight/2,"#ef4444")},$e=()=>{E.value=!1},_e=()=>{for(let e=0;e<8;e++)setTimeout(()=>{S(window.innerWidth/2+(Math.random()-.5)*400,window.innerHeight/2+(Math.random()-.5)*400,e%2===0?"#10b981":"#6366f1")},e*150)},C=()=>{if(c.value&&m.value&&p.value===3){const e=i.filter(t=>t.checked).map(t=>t.id);e.length>0?localStorage.setItem(_(),JSON.stringify(e)):localStorage.removeItem(_())}},He=()=>{p.value=1,c.value="",m.value=""},H=l(!1),re=e=>{e.target.closest(".left-menu-container")||(H.value=!1,D.value=!1)},G=l(localStorage.getItem("weatherCity")||"Taipei"),ce=l(null),J=l(!1),V=[{id:"Tokyo",name:"東京",lat:35.6895,lon:139.6917},{id:"Seoul",name:"首爾",lat:37.5665,lon:126.978},{id:"Bangkok",name:"曼谷",lat:13.7563,lon:100.5018},{id:"Paris",name:"巴黎",lat:48.8566,lon:2.3522},{id:"London",name:"倫敦",lat:51.5074,lon:-.1278},{id:"New York",name:"紐約",lat:40.7128,lon:-74.006},{id:"Taipei",name:"台北",lat:25.033,lon:121.5654}],de=async()=>{const e=V.find(t=>t.id===G.value)||V[6];J.value=!0;try{const a=await(await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${e.lat}&longitude=${e.lon}&current_weather=true`)).json();ce.value=a.current_weather}catch(t){console.error("天氣載入失敗:",t)}finally{J.value=!1}},Xe=e=>{const t=e.target;G.value=t.value,localStorage.setItem("weatherCity",t.value),de()},Ye=e=>e===0?"☀️":e===1||e===2||e===3?"⛅":e>=45&&e<=48?"🌫️":e>=51&&e<=67?"🌧️":e>=71&&e<=77?"❄️":e>=80&&e<=82?"🌦️":e>=85&&e<=86?"🌨️":e>=95?"⛈️":"☁️",ze=async()=>{try{const e=await fetch(`/Per_OutTaiwan/announcements.json?t=${Date.now()}`);if(!e.ok)throw new Error("Fetch failed");const t=await e.json();t&&(T.value={countries:t.countries||{},global:t.global||{show:!1,message:""}})}catch(e){console.error("無法載入公告資訊:",e)}};I(K,e=>{e&&(Y.value=!1)});const X=()=>{const e=document.documentElement,t=document.body;e.classList.add("lock-all-scroll"),t.classList.add("lock-all-scroll")};I(p,X);const ue=()=>{D.value=!1,H.value=!1,z.value=!1};return{currentStep:p,selectedCountry:c,selectedGender:m,searchQuery:x,selectedCategoryFilter:U,expandedCategories:L,categories:u,countries:ee,mustItems:be,mustItemsExpanded:Y,filteredCategories:u,carouselContainer:fe,activeCategoryIndex:v,carouselOffset:f,isDragging:r,onMouseDown:ye,onTouchStart:Ce,onMouseLeave:Me,onMouseUp:k,getCategoryStyle:Ie,rotateTo:W,totalCount:M,packedCount:R,progressPercent:Le,announcementConfig:T,currentCountryAnnouncement:we,isHeaderExpanded:K,isLeftMenuOpen:D,isSearchPanelOpen:z,isDeleteMode:Q,peekingActive:he,showResetModal:E,showAddItemModal:Z,newItemName:O,newItemCategory:A,defaultItems:P,addCustomItem:Ae,removeItem:oe,isWeatherMenuOpen:H,selectedWeatherCity:G,weatherData:ce,isWeatherLoading:J,weatherCities:V,selectCountry:De,selectGender:Ee,toggleCategory:Se,toggleItem:Te,markAllPacked:Pe,resetList:Be,celebrateMore:_e,confirmReset:We,cancelReset:$e,prevCategory:ke,nextCategory:pe,selectWeatherCity:Xe,getWeatherIcon:Ye}},template:`
    <LayoutComponent title="OutTaiwan - 打包清單">
        <!-- Country Announcement (Overlay) -->
        <div v-if="currentCountryAnnouncement && currentCountryAnnouncement.show" 
             class="takelist-announcement-overlay">
            <div class="takelist-announcement-banner">
                <div class="px-4 text-indigo-600 dark:text-indigo-400">
                    <span class="text-xl">📢</span>
                </div>
                <div class="marquee-container flex-1 py-1">
                    <p class="marquee-content text-slate-900 dark:text-slate-100 font-black text-sm md:text-base">
                        {{ currentCountryAnnouncement.message }}
                        <span class="inline-block w-20"></span>
                        {{ currentCountryAnnouncement.message }}
                    </p>
                </div>
                <button @click="currentCountryAnnouncement.show = false" class="px-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>

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
        <div v-if="currentStep === 1" class="takelist-step-wrapper h-full overflow-y-auto pt-8 pb-20 px-4">
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
        <div v-if="currentStep === 2" class="takelist-step-wrapper h-full overflow-y-auto pt-8 pb-20 px-4">
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
        <div v-if="currentStep === 3" class="takelist-step-wrapper h-full pt-2 pb-16 px-2" :class="isHeaderExpanded ? 'overflow-y-auto' : 'overflow-hidden'">
            <!-- Header & Progress -->
            <div class="takelist-header-card !mb-2"
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
  `}),me=qe(et);me.use(Ge,{theme:{preset:Je,options:{darkModeSelector:".dark"}}});me.mount("#app");
