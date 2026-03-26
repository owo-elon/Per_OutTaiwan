import{d as Se,e as Le,L as je,r as s,w as _,o as z,f as Ee,h,i as w,j as Ae}from"./index-DUreqkJU.js";const _e=Le({name:"TakeList",components:{LayoutComponent:je},setup(){const U=typeof window<"u"?window.innerWidth<768:!1,f=s(1),i=s(""),c=s(""),g=s(""),H=s("All"),y=s({}),W=s(!1),X=s(!U),Z=s(!1),C=s(!1),D=s(!1),M=s(""),I=s("🚨 絕對不能忘記"),l=Ae([]),u=s(0),n=s(0),d=s(!1),F=s(0),m=s(0),p=s(0),ee=s(null),N=s(0),te=s(localStorage.getItem("darkMode")==="true"),S=s({countries:{},global:{show:!1,message:""}}),ae=h(()=>!i.value||!S.value.countries?null:S.value.countries[i.value]||null),R={korea:{name:"韓國",flag:"🇰🇷",implemented:!0},japan:{name:"日本",flag:"🇯🇵",implemented:!1},thailand:{name:"泰國",flag:"🇹🇭",implemented:!1},usa:{name:"美國",flag:"🇺🇸",implemented:!1},europe:{name:"歐洲",flag:"🇪🇺",implemented:!1}},L={must:[{id:"m1",name:"護照",checked:!1},{id:"m2",name:"手機",checked:!1},{id:"m3",name:"錢包",checked:!1},{id:"m4",name:"信用卡",checked:!1},{id:"m5",name:"網路卡/ESIM",checked:!1},{id:"m6",name:"錢(台幣/外幣)",checked:!1}],categories:[{name:"其他重要物品",icon:"💼",items:[{id:"i1",name:"登機證(可以申請記得先申請)",checked:!1},{id:"i2",name:"證件(身分證 健保卡)",checked:!1},{id:"i3",name:"行動電源",checked:!1},{id:"i4",name:"雨傘",checked:!1},{id:"i5",name:"萬國轉接頭",checked:!1},{id:"i6",name:"充電頭2顆",checked:!1},{id:"i7",name:"充電線2條(記得拿一條跟行動電源放一起)",checked:!1}]},{name:"包包",icon:"🎒",items:[{id:"b1",name:"後背包",checked:!1},{id:"b2",name:"側背包",checked:!1},{id:"b3",name:"收納腰包",checked:!1},{id:"b4",name:"行李替大~包 (掛行李箱上那個)",checked:!1},{id:"b5",name:"壓縮袋",checked:!1}]},{name:"衣物",icon:"👕",items:[{id:"c1",name:"衣服(記得帶睡衣) [幾夜]",checked:!1},{id:"c2",name:"褲子(記得帶睡褲) [幾夜]",checked:!1},{id:"c3",name:"內褲 [幾天]",checked:!1},{id:"c4",name:"內衣 [幾天]",checked:!1},{id:"c5",name:"襪子 [幾天]",checked:!1},{id:"c6",name:"拖鞋/涼鞋/布鞋",checked:!1},{id:"c7",name:"外套",checked:!1},{id:"c8",name:"帽子",checked:!1}]},{name:"盥洗用品",icon:"🧴",items:[{id:"t1",name:"牙刷牙膏",checked:!1},{id:"t2",name:"洗面乳",checked:!1},{id:"t3",name:"護髮乳",checked:!1},{id:"t4",name:"洗臉巾",checked:!1},{id:"t5",name:"隱形眼鏡+清洗液",checked:!1},{id:"t6",name:"髒衣袋",checked:!1},{id:"t7",name:"壓縮毛巾",checked:!1},{id:"t8",name:"牙籤",checked:!1},{id:"t9",name:"頸枕",checked:!1},{id:"t10",name:"眼罩",checked:!1},{id:"t11",name:"耳塞",checked:!1}]},{name:"文具用品/3C/備品",icon:"📱",items:[{id:"s1",name:"小剪刀(記得丟行李箱)",checked:!1},{id:"s2",name:"膠帶",checked:!1},{id:"s3",name:"筆",checked:!1},{id:"s4",name:"耳機",checked:!1},{id:"s5",name:"自拍棒",checked:!1},{id:"s6",name:"絕緣膠帶",checked:!1},{id:"s7",name:"飲料提袋",checked:!1},{id:"s8",name:"環保袋",checked:!1},{id:"s9",name:"衛生紙",checked:!1},{id:"s10",name:"濕紙巾",checked:!1},{id:"s11",name:"垃圾袋",checked:!1}]},{name:"藥品",icon:"💊",items:[{id:"p1",name:"小護士",checked:!1},{id:"p2",name:"防蚊液",checked:!1},{id:"p3",name:"木瓜霜",checked:!1},{id:"p4",name:"生理食鹽水",checked:!1},{id:"p5",name:"眼藥水",checked:!1},{id:"p6",name:"止痛藥",checked:!1},{id:"p7",name:"ok蹦",checked:!1},{id:"p8",name:"棉花棒",checked:!1}]},{name:"化妝品",icon:"💄",items:[{id:"mk1",name:"防曬",checked:!1},{id:"mk2",name:"粉底液+刀",checked:!1},{id:"mk3",name:"粉餅+海綿",checked:!1},{id:"mk4",name:"定妝液",checked:!1},{id:"mk5",name:"定妝粉",checked:!1},{id:"mk6",name:"腮紅",checked:!1},{id:"mk7",name:"眼影+刷具",checked:!1},{id:"mk8",name:"眉粉",checked:!1},{id:"mk9",name:"眼線筆",checked:!1},{id:"mk10",name:"睫毛膏+夾",checked:!1},{id:"mk11",name:"口紅",checked:!1},{id:"mk12",name:"卸妝水+巾",checked:!1},{id:"mk13",name:"梳子",checked:!1},{id:"mk14",name:"髮油",checked:!1},{id:"mk15",name:"香水",checked:!1},{id:"mk16",name:"髮圈",checked:!1},{id:"mk17",name:"鏡子",checked:!1}]},{name:"保養品",icon:"✨",items:[{id:"sk1",name:"化妝水",checked:!1},{id:"sk2",name:"蘆薈膠",checked:!1},{id:"sk3",name:"乳液",checked:!1}]}]},se=h(()=>{let e=l.filter(t=>t.isMust);return g.value&&(e=e.filter(t=>t.name.includes(g.value))),e}),v=h(()=>{const e=[],t=l.filter(a=>!a.isMust);return L.categories.forEach(a=>{let r=t.filter(o=>o.category===a.name);r.length>0&&e.push({name:a.name,icon:a.icon,items:r})}),e}),x=()=>{d.value?u.value=n.value:u.value+=(n.value-u.value)*.1,(Math.abs(n.value-u.value)>.001||d.value)&&requestAnimationFrame(x);const e=1;N.value=Math.round(-u.value/e)},j=e=>{n.value=-e,requestAnimationFrame(x)},re=e=>{d.value=!0,F.value=e.clientX,m.value=e.clientX,p.value=0,requestAnimationFrame(x)},q=e=>{if(!d.value)return;const t=e.clientX-m.value;m.value=e.clientX,n.value+=t*.005,p.value=t*.005},E=()=>{if(!d.value)return;d.value=!1,n.value+=p.value*5,n.value=Math.round(n.value);const e=0,t=-(v.value.length-1);n.value>e&&(n.value=e),n.value<t&&(n.value=t),requestAnimationFrame(x)},oe=e=>{d.value=!0,F.value=e.touches[0].clientX,m.value=e.touches[0].clientX,p.value=0,requestAnimationFrame(x)},G=e=>{if(!d.value)return;const t=e.touches[0].clientX-m.value;m.value=e.touches[0].clientX,n.value+=t*.005,p.value=t*.005};_(g,e=>{if(!e)return;const t=v.value.findIndex(a=>a.items.some(r=>r.name.toLowerCase().includes(e.toLowerCase())));t!==-1&&j(t)}),_(H,e=>{if(e==="All")return;const t=v.value.findIndex(a=>a.name===e);t!==-1&&j(t)}),z(()=>{new MutationObserver(t=>{t.forEach(a=>{a.attributeName==="class"&&(te.value=document.body.classList.contains("dark"))})}).observe(document.body,{attributes:!0}),window.addEventListener("mousemove",q),window.addEventListener("mouseup",E),window.addEventListener("touchmove",G),window.addEventListener("touchend",E)}),Ee(()=>{window.removeEventListener("mousemove",q),window.removeEventListener("mouseup",E),window.removeEventListener("touchmove",G),window.removeEventListener("touchend",E)}),_(g,e=>{if(!e)return;const t=v.value.findIndex(a=>a.items.some(r=>r.name.toLowerCase().includes(e.toLowerCase())));t!==-1&&j(t)});const le=e=>{const t=e+u.value,a=Math.abs(t),r=100,o=Math.max(.8,1-a*.1),K=Math.max(0,1-a*.8),Me=t*-10,Ie=a*-150;return{transform:`translateX(${t*r}%) translateZ(${Ie}px) rotateY(${Me}deg) scale(${o})`,opacity:K,zIndex:Math.round(40-a*10),pointerEvents:a<.2?"auto":"none",visibility:K<.01?"hidden":"visible"}},ne=e=>{y.value[e]=!y.value[e]},k=h(()=>l.length),T=h(()=>l.filter(e=>e.checked).length),ie=h(()=>k.value===0?0:Math.round(T.value/k.value*100)),de=(e,t)=>{if(w(t.clientX,t.clientY,"#10b981"),!R[e].implemented){alert("此國家清單即將推出！目前請選擇韓國 🇰🇷");return}i.value=e,f.value=2,b()},ce=(e,t)=>{w(t.clientX,t.clientY,"#10b981"),c.value=e,f.value=3,ve(),b()},A=()=>`travel_packing_${i.value}_${c.value}`,Y=()=>`travel_packing_custom_${i.value}_${c.value}`,J=()=>{const e=l.filter(t=>t.isCustom);localStorage.setItem(Y(),JSON.stringify(e))},ue=()=>{if(!M.value.trim())return;const e=I.value==="🚨 絕對不能忘記",t={id:`custom_${Date.now()}`,name:M.value.trim(),checked:!1,isMust:e,category:I.value,isCustom:!0};l.push(t),J(),M.value="",D.value=!1,e?W.value=!0:y.value[I.value]=!0},me=e=>{const t=l.findIndex(a=>a.id===e);t>-1&&(l.splice(t,1),J(),b())},ve=()=>{const e=[];L.must.forEach(r=>{e.push({...r,isMust:!0,category:"🚨 絕對不能忘記"})}),L.categories.forEach(r=>{r.items.forEach(o=>{"gender"in o&&o.gender!==c.value||"country"in o&&o.country!==i.value||e.push({...o,isMust:!1,category:r.name})})});const t=localStorage.getItem(Y());if(t)try{JSON.parse(t).forEach(o=>{e.push(o)})}catch(r){console.error("Failed to parse custom items",r)}const a=localStorage.getItem(A());if(a)try{const r=JSON.parse(a);e.forEach(o=>{r.includes(o.id)&&(o.checked=!0)})}catch(r){console.error("Failed to parse saved items",r)}l.splice(0,l.length,...e)},he=(e,t)=>{if(e.checked=!e.checked,T.value===k.value&&k.value>0)for(let a=0;a<5;a++)setTimeout(()=>{w(window.innerWidth/2+(Math.random()-.5)*200,window.innerHeight/2+(Math.random()-.5)*200,"#10b981")},a*100);b()},fe=()=>{l.forEach(e=>e.checked=!0),b()},ge=()=>{C.value=!0},pe=()=>{localStorage.removeItem(A()),l.forEach(e=>e.checked=!1),C.value=!1,w(window.innerWidth/2,window.innerHeight/2,"#ef4444")},xe=()=>{C.value=!1},ke=()=>{for(let e=0;e<8;e++)setTimeout(()=>{w(window.innerWidth/2+(Math.random()-.5)*400,window.innerHeight/2+(Math.random()-.5)*400,e%2===0?"#10b981":"#6366f1")},e*150)},b=()=>{if(i.value&&c.value&&f.value===3){const e=l.filter(t=>t.checked).map(t=>t.id);e.length>0?localStorage.setItem(A(),JSON.stringify(e)):localStorage.removeItem(A())}},be=()=>{f.value=1,i.value="",c.value=""},B=s(!1);z(()=>{window.addEventListener("click",e=>{e.target.closest(".weather-container")||(B.value=!1)})}),z(()=>{window.addEventListener("click",e=>{e.target.closest(".weather-container")||(B.value=!1)})});const $=s(localStorage.getItem("weatherCity")||"Taipei"),Q=s(null),O=s(!1),P=[{id:"Tokyo",name:"東京",lat:35.6895,lon:139.6917},{id:"Seoul",name:"首爾",lat:37.5665,lon:126.978},{id:"Bangkok",name:"曼谷",lat:13.7563,lon:100.5018},{id:"Paris",name:"巴黎",lat:48.8566,lon:2.3522},{id:"London",name:"倫敦",lat:51.5074,lon:-.1278},{id:"New York",name:"紐約",lat:40.7128,lon:-74.006},{id:"Taipei",name:"台北",lat:25.033,lon:121.5654}],V=async()=>{const e=P.find(t=>t.id===$.value)||P[6];O.value=!0;try{const a=await(await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${e.lat}&longitude=${e.lon}&current_weather=true`)).json();Q.value=a.current_weather}catch(t){console.error("天氣載入失敗:",t)}finally{O.value=!1}},we=e=>{const t=e.target;$.value=t.value,localStorage.setItem("weatherCity",t.value),V()},ye=e=>e===0?"☀️":e===1||e===2||e===3?"⛅":e>=45&&e<=48?"🌫️":e>=51&&e<=67?"🌧️":e>=71&&e<=77?"❄️":e>=80&&e<=82?"🌦️":e>=85&&e<=86?"🌨️":e>=95?"⛈️":"☁️",Ce=async()=>{try{const e=await fetch(`/Per_OutTaiwan/announcements.json?t=${Date.now()}`);if(!e.ok)throw new Error("Fetch failed");const t=await e.json();t&&(S.value={countries:t.countries||{},global:t.global||{show:!1,message:""}})}catch(e){console.error("無法載入公告資訊:",e)}};return _(X,e=>{e&&(W.value=!1)}),z(()=>{be(),Ce(),V()}),{currentStep:f,selectedCountry:i,selectedGender:c,searchQuery:g,selectedCategoryFilter:H,expandedCategories:y,categories:v,countries:R,mustItems:se,mustItemsExpanded:W,filteredCategories:v,carouselContainer:ee,activeCategoryIndex:N,carouselOffset:u,onMouseDown:re,onTouchStart:oe,getCategoryStyle:le,rotateTo:j,totalCount:k,packedCount:T,progressPercent:ie,announcementConfig:S,currentCountryAnnouncement:ae,isHeaderExpanded:X,peekingActive:Z,showResetModal:C,showAddItemModal:D,newItemName:M,newItemCategory:I,defaultItems:L,addCustomItem:ue,removeCustomItem:me,isWeatherMenuOpen:B,selectedWeatherCity:$,weatherData:Q,isWeatherLoading:O,weatherCities:P,selectCountry:de,selectGender:ce,toggleCategory:ne,toggleItem:he,markAllPacked:fe,resetList:ge,celebrateMore:ke,confirmReset:pe,cancelReset:xe,selectWeatherCity:we,getWeatherIcon:ye}},template:`
    <LayoutComponent title="OutTaiwan - 打包清單">
        <!-- Country Announcement (Overlay) -->
        <div v-if="currentCountryAnnouncement && currentCountryAnnouncement.show" 
             class="fixed top-0 left-0 right-0 z-[60] pointer-events-none">
            <div class="max-w-5xl mx-auto mt-4 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-l-4 border-indigo-600 dark:border-indigo-400 rounded-r-2xl flex items-center overflow-hidden shadow-xl animate-fade-in pointer-events-auto">
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
            <div class="weather-container relative">
                <!-- Weather Toggle Button -->
                <button @click.stop="isWeatherMenuOpen = !isWeatherMenuOpen" 
                        class="w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group border-4 relative overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-400/40 text-slate-900 dark:text-slate-300 shadow-slate-200/50 dark:shadow-[0_0_20px_rgba(148,163,184,0.3)]">
                    <!-- Glow effect for dark mode -->
                    <div class="absolute inset-0 hidden dark:block bg-slate-400/10 animate-pulse"></div>
                    
                    <svg v-if="!isWeatherMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>

                    <!-- Tooltip -->
                    <span class="absolute left-20 bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white px-3 py-1 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-slate-200 dark:border-white/10">
                        {{ isWeatherMenuOpen ? '關閉天氣' : '目的地天氣' }}
                    </span>
                </button>

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
                         class="w-72 glass-card p-6 rounded-3xl border border-white/20 shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                        <h3 class="text-xl font-bold text-black dark:text-white mb-4 flex items-center gap-2">
                            <span>🌍</span> 目的地天氣
                        </h3>
                        
                        <div class="mb-4">
                            <select @change="selectWeatherCity" :value="selectedWeatherCity"
                                    class="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-black dark:text-white font-bold appearance-none cursor-pointer">
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
        <div v-if="currentStep === 1" class="h-[calc(100vh-120px)] overflow-y-auto no-scrollbar flex flex-col items-center justify-start pt-12 scale-90 md:scale-100">
            <div class="step-container py-4 w-full">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="(country, key) in countries" :key="key" 
                         @click="selectCountry(key, $event)"
                         class="selection-card glass-card p-8 rounded-3xl border border-white/20 shadow-lg hover:shadow-2xl transition-all cursor-pointer group">
                        <div class="text-6xl mb-4 text-center group-hover:scale-110 transition-transform">{{ country.flag }}</div>
                        <div class="text-2xl font-bold text-black dark:text-white text-center">{{ country.name }}</div>
                        <div v-if="!country.implemented" class="mt-2 text-sm text-slate-900 dark:text-slate-500 italic text-center">(即將推出)</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Step 2: Select Gender -->
        <div v-if="currentStep === 2" class="h-[calc(100vh-120px)] overflow-y-auto no-scrollbar flex flex-col items-center justify-center scale-90 md:scale-100">
            <div class="step-container py-4 w-full">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
                    <div @click="selectGender('male', $event)" class="selection-card glass-card p-12 rounded-3xl border border-white/20 shadow-lg hover:shadow-2xl transition-all cursor-pointer group">
                        <div class="text-8xl mb-6 text-center group-hover:scale-110 transition-transform">👨</div>
                        <div class="text-3xl font-bold text-black dark:text-white text-center">男性</div>
                    </div>
                    <div @click="selectGender('female', $event)" class="selection-card glass-card p-12 rounded-3xl border border-white/20 shadow-lg hover:shadow-2xl transition-all cursor-pointer group">
                        <div class="text-8xl mb-6 text-center group-hover:scale-110 transition-transform">👩</div>
                        <div class="text-3xl font-bold text-black dark:text-white text-center">女性</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Step 3: Packing List -->
        <div v-if="currentStep === 3" class="max-w-5xl mx-auto h-[calc(100vh-100px)] overflow-y-auto overflow-x-hidden custom-scrollbar pt-2 pb-8 px-4 md:px-0 scroll-smooth">
            <!-- Header & Progress -->
            <div class="bg-gradient-to-br from-white/95 to-indigo-50/95 dark:from-slate-900/95 dark:to-indigo-950/95 backdrop-blur-2xl p-6 md:p-8 rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(99,102,241,0.3)] dark:shadow-[0_10px_40px_-10px_rgba(99,102,241,0.4)] mb-4 z-50 border-2 transition-all duration-500 overflow-visible"
                 :class="[
                    mustItems.some(i => !i.checked) 
                    ? 'border-red-500 animate-warning-flash' 
                    : 'border-indigo-500/20 dark:border-indigo-400/20'
                 ]">
                <!-- Title & Mobile Toggle -->
                <div @click="isHeaderExpanded = !isHeaderExpanded" class="flex items-center justify-between mb-6 cursor-pointer select-none group/header">
                    <h1 class="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 flex items-center">
                        <span class="mr-3 text-slate-900 dark:text-white">{{ countries[selectedCountry].flag }}</span>
                        <span class="truncate">{{ countries[selectedCountry].name }} 清單</span>
                        <span class="ml-3 text-xs font-bold bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-200 dark:border-indigo-700/50">
                            {{ selectedGender === 'male' ? '👨' : '👩' }}
                        </span>
                    </h1>
                    
                    <!-- Toggle Button -->
                    <div class="p-3 text-indigo-500 dark:text-indigo-400 group-hover/header:bg-indigo-100 dark:group-hover/header:bg-indigo-900/50 rounded-2xl transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 transition-transform duration-300" :class="{ 'rotate-180': isHeaderExpanded }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
 
                <!-- Collapsible Content -->
                <div v-show="isHeaderExpanded" class="animate-in fade-in slide-in-from-top-4 duration-300">
                    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <div class="grid grid-cols-3 gap-3 w-full md:w-auto md:min-w-[300px]">
                            <button @click="showAddItemModal = true" class="flex items-center justify-center p-4 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-emerald-500/30" title="新增物品">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                            <button @click="markAllPacked" class="flex items-center justify-center p-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-600/30" title="全部完成">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </button>
                            <button @click="resetList" class="flex items-center justify-center p-4 bg-white/50 dark:bg-slate-800/50 text-indigo-900 dark:text-indigo-100 border border-indigo-200 dark:border-indigo-800/50 rounded-2xl hover:bg-white dark:hover:bg-slate-800 transition-all active:scale-95" title="重置清單">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </button>
                        </div>
                        
                        <!-- Progress Bar (Desktop) -->
                        <div class="hidden md:block flex-1 max-w-xs ml-8">
                            <div class="flex justify-between text-xs font-bold text-slate-900 dark:text-slate-300 mb-2 uppercase tracking-widest">
                                <span>打包進度</span>
                                <span :class="progressPercent === 100 ? 'text-emerald-500' : ''">{{ progressPercent }}% ({{ packedCount }}/{{ totalCount }})</span>
                            </div>
                            <div class="w-full bg-indigo-100 dark:bg-indigo-900/50 rounded-full h-3 overflow-hidden shadow-inner">
                                <div class="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 dark:from-indigo-500 dark:to-indigo-300 transition-all duration-1000 ease-out" :style="{ width: progressPercent + '%' }"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Progress Bar (Mobile) -->
                    <div class="md:hidden mb-6">
                        <div class="flex justify-between text-xs font-bold text-slate-900 dark:text-slate-300 mb-2 uppercase tracking-widest">
                            <span>打包進度</span>
                            <span :class="progressPercent === 100 ? 'text-emerald-500' : ''">{{ progressPercent }}%</span>
                        </div>
                        <div class="w-full bg-indigo-100 dark:bg-indigo-900/50 rounded-full h-3 overflow-hidden shadow-inner">
                            <div class="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 dark:from-indigo-500 dark:to-indigo-300 transition-all duration-1000 ease-out" :style="{ width: progressPercent + '%' }"></div>
                        </div>
                    </div>

                    <!-- 🚨 Absolute Must Forget Section (Merged into Header) -->
                    <div v-if="mustItems.length > 0" class="mb-8 p-4 md:p-6 rounded-3xl bg-red-50/50 dark:bg-red-900/10 border-2 border-red-500/20 transition-all duration-300 overflow-hidden"
                         :class="{ 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]': mustItems.some(i => !i.checked) }">
                        <div @click="mustItemsExpanded = !mustItemsExpanded" class="flex items-center gap-3 cursor-pointer select-none group/must">
                            <span class="text-xl">🚨</span>
                            <h2 class="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">絕對不能忘記</h2>
                            <span class="ml-auto text-xs font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-lg">
                                {{ mustItems.filter(i => i.checked).length }} / {{ mustItems.length }}
                            </span>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-400 transition-transform duration-300" :class="{ 'rotate-180': mustItemsExpanded }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                        
                        <div v-show="mustItemsExpanded" class="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div v-for="item in mustItems" :key="item.id" 
                                 @click="toggleItem(item, $event)"
                                 class="flex items-center p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-red-100 dark:border-red-900/30 cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
                                 :class="{ 'opacity-50 grayscale': item.checked }">
                                <div class="w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all"
                                     :class="item.checked ? 'bg-emerald-500 border-emerald-500' : 'border-red-400'">
                                    <svg v-if="item.checked" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                                <span class="ml-3 font-bold text-sm text-slate-900 dark:text-slate-200 truncate" :class="{ 'line-through': item.checked }">
                                    {{ item.name }}
                                </span>
                            </div>
                        </div>
                    </div>
 
                </div>
            </div>
 
            <!-- Empty Search State -->
            <div v-if="categories.length === 0 && searchQuery" class="text-center py-20">
                <div class="text-6xl mb-4">🔍</div>
                <h3 class="text-xl font-bold text-black dark:text-slate-400">找不到相關物品</h3>
                <p class="text-slate-900 dark:text-slate-400">請嘗試其他關鍵字</p>
            </div>

            <!-- Search & Filter -->
            <div class="sticky top-0 mb-4 px-4 md:px-2 py-4 z-[60] bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl rounded-3xl border border-indigo-100/50 dark:border-indigo-900/30 shadow-sm">
                <div class="flex flex-col sm:flex-row gap-4 w-full">
                    <!-- Dropdown -->
                    <select v-model="selectedCategoryFilter" class="py-4 px-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-indigo-100 dark:border-indigo-800/50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-black dark:text-white font-bold appearance-none cursor-pointer">
                        <option value="All">全部類別</option>
                        <option v-for="cat in categories" :key="cat.name" :value="cat.name">{{ cat.icon }} {{ cat.name }}</option>
                    </select>

                    <!-- Search -->
                    <div class="relative flex-1">
                        <input v-model="searchQuery" type="text" placeholder="搜尋物品..." 
                               class="w-full py-4 pl-12 pr-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-indigo-100 dark:border-indigo-800/50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-black dark:text-white font-bold">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-4 top-4.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            <!-- 3D Carousel for Categories -->
            <div class="relative min-h-[80vh] mb-20 w-full perspective-2000 z-10" 
                 @mousedown="onMouseDown" 
                 @touchstart="onTouchStart">
                <div class="absolute inset-0 flex items-start justify-center pt-4 preserve-3d transition-transform duration-75">
                    <div v-for="(category, index) in categories" :key="category.name" 
                         class="absolute w-[90%] md:w-[450px] transition-all duration-300 ease-out"
                         :style="getCategoryStyle(index)">
                        
                        <div class="glass-card rounded-3xl md:rounded-[2.5rem] shadow-2xl border-2 overflow-hidden"
                             :class="category.items.length > 0 && category.items.every(i => i.checked) ? 'border-emerald-400/50 dark:border-emerald-500/50 bg-emerald-50/30 dark:bg-emerald-900/10' : 'border-white/20 dark:border-white/5'">
                            
                            <div class="p-4 md:p-6 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20 border-b border-white/10">
                                <div class="flex items-center gap-4">
                                    <div class="w-12 h-12 md:w-14 md:h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                                        {{ category.icon }}
                                    </div>
                                    <div>
                                        <h3 class="text-xl md:text-2xl font-black text-slate-900 dark:text-white m-0">{{ category.name }}</h3>
                                        <p class="text-[10px] text-slate-900 dark:text-slate-400 uppercase tracking-widest font-bold mt-1">
                                            {{ category.items.filter(i => i.checked).length }} / {{ category.items.length }} ITEMS
                                        </p>
                                    </div>
                                </div>
                                <div v-if="category.items.length > 0 && category.items.every(i => i.checked)" 
                                     class="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 animate-in zoom-in duration-500">
                                    <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                            </div>

                            <div class="px-6 pb-6 md:px-8 md:pb-8 pt-4">
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div v-for="item in category.items" :key="item.id" 
                                         v-show="!searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase())"
                                         @click="toggleItem(item, $event)"
                                         class="flex items-center p-5 rounded-3xl hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-all group border-2 border-transparent"
                                         :class="{ 'bg-slate-50/50 dark:bg-slate-800/30 border-emerald-500/10': item.checked }">
                                        <div class="w-8 h-8 rounded-xl border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center transition-all group-hover:border-slate-900 dark:group-hover:border-slate-400" 
                                             :class="{ 'bg-slate-900 border-slate-900 dark:bg-slate-100 dark:border-slate-100': item.checked }">
                                            <svg v-if="item.checked" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white dark:text-slate-900" viewBox="0 0 20 20" fill="currentColor">
                                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                            </svg>
                                        </div>
                                        <span class="ml-4 text-slate-900 dark:text-slate-200 font-bold text-lg transition-all truncate" 
                                              :class="{ 'line-through opacity-60 translate-x-1 text-slate-500': item.checked }">
                                            {{ item.name }}
                                        </span>
                                        <button v-if="item.isCustom" @click.stop="removeCustomItem(item.id)" class="ml-auto text-slate-900 dark:text-slate-300 hover:text-red-500 transition-all p-2 -mr-2 hover:scale-125">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white dark:from-slate-950 to-transparent pointer-events-none z-10"></div>
                
                <!-- Navigation Arrows Removed -->
            </div>
        </div>

        <!-- Reset Confirmation Modal -->
        <div v-if="showResetModal" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="cancelReset"></div>
            <div class="glass-card p-8 rounded-3xl shadow-2xl max-w-sm w-full relative z-10 animate-scale-in">
                <div class="text-center mb-6">
                    <div class="text-5xl mb-4">⚠️</div>
                    <h3 class="text-2xl font-bold text-black dark:text-white mb-2">確定要重置嗎？</h3>
                    <p class="text-slate-900 dark:text-slate-400 mb-8">這將會清除您目前所有的打包進度，且無法復原。</p>
                    <div class="flex gap-4">
                        <button @click="cancelReset" class="flex-1 py-3 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold hover:bg-white dark:hover:bg-slate-800 transition-all active:scale-95">
                            取消
                        </button>
                        <button @click="confirmReset" class="flex-1 py-3 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-all active:scale-95 shadow-lg shadow-red-500/20">
                            確定重置
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add Item Modal -->
        <div v-if="showAddItemModal" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showAddItemModal = false"></div>
            <div class="glass-card p-8 rounded-3xl shadow-2xl max-w-sm w-full relative z-10 animate-scale-in">
                <div class="text-center mb-6">
                    <div class="text-5xl mb-4">✨</div>
                    <h3 class="text-2xl font-bold text-black dark:text-white">新增自訂物品</h3>
                </div>
                <div class="space-y-4 mb-8 text-left">
                    <div>
                        <label class="block text-sm font-bold text-slate-900 dark:text-slate-300 mb-2">物品名稱</label>
                        <input v-model="newItemName" @keyup.enter="addCustomItem" type="text" placeholder="例如：護照套..." class="w-full py-3 px-4 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-slate-900 dark:text-white font-bold">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-900 dark:text-slate-300 mb-2">選擇分類</label>
                        <select v-model="newItemCategory" class="w-full py-3 px-4 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-slate-900 dark:text-white font-bold appearance-none cursor-pointer">
                            <option value="🚨 絕對不能忘記">🚨 絕對不能忘記 (置頂)</option>
                            <option v-for="cat in defaultItems.categories" :key="cat.name" :value="cat.name">{{ cat.icon }} {{ cat.name }}</option>
                        </select>
                    </div>
                </div>
                <div class="flex gap-4">
                    <button @click="showAddItemModal = false" class="flex-1 py-3 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold hover:bg-white dark:hover:bg-slate-800 transition-all active:scale-95">
                        取消
                    </button>
                    <button @click="addCustomItem" class="flex-1 py-3 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-emerald-500/20">
                        確認新增
                    </button>
                </div>
            </div>
        </div>
    </LayoutComponent>
  `});Se(_e).mount("#app");
