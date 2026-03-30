import{d as Pe,e as ze,L as We,r as s,w as _,o as H,f as oe,h as g,i as M,j as Te}from"./index-Ca1aEbo6.js";const $e=ze({name:"TakeList",components:{LayoutComponent:We},setup(){const le=typeof window<"u"?window.innerWidth<768:!1,p=s(1),i=s(""),c=s(""),x=s(""),X=s("All"),C=s({}),B=s(!1),N=s(!le),F=s(!1),ne=s(!1),ie=s(!1),R=s(!1),I=s(!1),q=s(!1),S=s(""),L=s("🚨 非常重要"),l=Te([]),u=s([]),h=s(0),d=s(0),m=s(!1),G=s(0),f=s(0),k=s(0),de=s(null),J=s(0),ce=s(localStorage.getItem("darkMode")==="true"),j=s({countries:{},global:{show:!1,message:""}}),ue=g(()=>!i.value||!j.value.countries?null:j.value.countries[i.value]||null),V={korea:{name:"韓國",flag:"🇰🇷",implemented:!0},japan:{name:"日本",flag:"🇯🇵",implemented:!1},thailand:{name:"泰國",flag:"🇹🇭",implemented:!1},usa:{name:"美國",flag:"🇺🇸",implemented:!1},europe:{name:"歐洲",flag:"🇪🇺",implemented:!1}},D={must:[{id:"m1",name:"護照",checked:!1},{id:"m2",name:"手機",checked:!1},{id:"m3",name:"錢包",checked:!1},{id:"m4",name:"信用卡",checked:!1},{id:"m5",name:"網路卡/ESIM",checked:!1},{id:"m6",name:"錢(台幣/外幣)",checked:!1}],categories:[{name:"其他重要物品",icon:"💼",items:[{id:"i1",name:"登機證(可以申請記得先申請)",checked:!1},{id:"i2",name:"證件(身分證 健保卡)",checked:!1},{id:"i3",name:"行動電源",checked:!1},{id:"i4",name:"雨傘",checked:!1},{id:"i5",name:"萬國轉接頭",checked:!1},{id:"i6",name:"充電頭2顆",checked:!1},{id:"i7",name:"充電線2條(記得拿一條跟行動電源放一起)",checked:!1}]},{name:"包包",icon:"🎒",items:[{id:"b1",name:"後背包",checked:!1},{id:"b2",name:"側背包",checked:!1},{id:"b3",name:"收納腰包",checked:!1},{id:"b4",name:"行李替大~包 (掛行李箱上那個)",checked:!1},{id:"b5",name:"壓縮袋",checked:!1}]},{name:"衣物",icon:"👕",items:[{id:"c1",name:"衣服(記得帶睡衣) [幾夜]",checked:!1},{id:"c2",name:"褲子(記得帶睡褲) [幾夜]",checked:!1},{id:"c3",name:"內褲 [幾天]",checked:!1},{id:"c4",name:"內衣 [幾天]",checked:!1},{id:"c5",name:"襪子 [幾天]",checked:!1},{id:"c6",name:"拖鞋/涼鞋/布鞋",checked:!1},{id:"c7",name:"外套",checked:!1},{id:"c8",name:"帽子",checked:!1}]},{name:"盥洗用品",icon:"🧴",items:[{id:"t1",name:"牙刷牙膏",checked:!1},{id:"t2",name:"洗面乳",checked:!1},{id:"t3",name:"護髮乳",checked:!1},{id:"t4",name:"洗臉巾",checked:!1},{id:"t5",name:"隱形眼鏡+清洗液",checked:!1},{id:"t6",name:"髒衣袋",checked:!1},{id:"t7",name:"壓縮毛巾",checked:!1},{id:"t8",name:"牙籤",checked:!1},{id:"t9",name:"頸枕",checked:!1},{id:"t10",name:"眼罩",checked:!1},{id:"t11",name:"耳塞",checked:!1}]},{name:"文具用品/3C/備品",icon:"📱",items:[{id:"s1",name:"小剪刀(記得丟行李箱)",checked:!1},{id:"s2",name:"膠帶",checked:!1},{id:"s3",name:"筆",checked:!1},{id:"s4",name:"耳機",checked:!1},{id:"s5",name:"自拍棒",checked:!1},{id:"s6",name:"絕緣膠帶",checked:!1},{id:"s7",name:"飲料提袋",checked:!1},{id:"s8",name:"環保袋",checked:!1},{id:"s9",name:"衛生紙",checked:!1},{id:"s10",name:"濕紙巾",checked:!1},{id:"s11",name:"垃圾袋",checked:!1}]},{name:"藥品",icon:"💊",items:[{id:"p1",name:"小護士",checked:!1},{id:"p2",name:"防蚊液",checked:!1},{id:"p3",name:"木瓜霜",checked:!1},{id:"p4",name:"生理食鹽水",checked:!1},{id:"p5",name:"眼藥水",checked:!1},{id:"p6",name:"止痛藥",checked:!1},{id:"p7",name:"ok蹦",checked:!1},{id:"p8",name:"棉花棒",checked:!1}]},{name:"化妝品",icon:"💄",items:[{id:"mk1",name:"防曬",checked:!1},{id:"mk2",name:"粉底液+刀",checked:!1},{id:"mk3",name:"粉餅+海綿",checked:!1},{id:"mk4",name:"定妝液",checked:!1},{id:"mk5",name:"定妝粉",checked:!1},{id:"mk6",name:"腮紅",checked:!1},{id:"mk7",name:"眼影+刷具",checked:!1},{id:"mk8",name:"眉粉",checked:!1},{id:"mk9",name:"眼線筆",checked:!1},{id:"mk10",name:"睫毛膏+夾",checked:!1},{id:"mk11",name:"口紅",checked:!1},{id:"mk12",name:"卸妝水+巾",checked:!1},{id:"mk13",name:"梳子",checked:!1},{id:"mk14",name:"髮油",checked:!1},{id:"mk15",name:"香水",checked:!1},{id:"mk16",name:"髮圈",checked:!1},{id:"mk17",name:"鏡子",checked:!1}]},{name:"保養品",icon:"✨",items:[{id:"sk1",name:"化妝水",checked:!1},{id:"sk2",name:"蘆薈膠",checked:!1},{id:"sk3",name:"乳液",checked:!1}]}]},me=g(()=>{let e=l.filter(t=>t.isMust);return x.value&&(e=e.filter(t=>t.name.includes(x.value))),e}),v=g(()=>{const e=[],t=l.filter(a=>!a.isMust);return D.categories.forEach(a=>{let o=t.filter(r=>r.category===a.name);o.length>0&&e.push({name:a.name,icon:a.icon,items:o})}),e}),b=()=>{m.value?h.value=d.value:h.value+=(d.value-h.value)*.1,(Math.abs(d.value-h.value)>.001||m.value)&&requestAnimationFrame(b);const e=v.value.length;if(e>0){let t=Math.round(-h.value)%e;t<0&&(t+=e),J.value=t}},E=e=>{const t=v.value.length;if(t===0)return;let a=(e+d.value)%t;a<0&&(a+=t),a>t/2&&(a-=t),d.value-=a,requestAnimationFrame(b)},ve=e=>{m.value=!0,G.value=e.clientX,f.value=e.clientX,k.value=0,requestAnimationFrame(b)},Y=e=>{if(!m.value)return;const t=e.clientX-f.value;f.value=e.clientX,d.value+=t*.005,k.value=t*.005},O=()=>{m.value&&(m.value=!1,d.value+=k.value*5,d.value=Math.round(d.value),requestAnimationFrame(b))},he=e=>{m.value=!0,G.value=e.touches[0].clientX,f.value=e.touches[0].clientX,k.value=0,requestAnimationFrame(b)},K=e=>{if(!m.value)return;const t=e.touches[0].clientX-f.value;f.value=e.touches[0].clientX,d.value+=t*.005,k.value=t*.005};_(x,e=>{if(!e)return;const t=v.value.findIndex(a=>a.items.some(o=>o.name.toLowerCase().includes(e.toLowerCase())));t!==-1&&E(t)}),_(X,e=>{if(e==="All")return;const t=v.value.findIndex(a=>a.name===e);t!==-1&&E(t)}),H(()=>{new MutationObserver(t=>{t.forEach(a=>{a.attributeName==="class"&&(ce.value=document.body.classList.contains("dark"))})}).observe(document.body,{attributes:!0}),window.addEventListener("mousemove",Y),window.addEventListener("mouseup",O),window.addEventListener("touchmove",K),window.addEventListener("touchend",O)}),oe(()=>{window.removeEventListener("mousemove",Y),window.removeEventListener("mouseup",O),window.removeEventListener("touchmove",K),window.removeEventListener("touchend",O)}),_(x,e=>{if(!e)return;const t=v.value.findIndex(a=>a.items.some(o=>o.name.toLowerCase().includes(e.toLowerCase())));t!==-1&&E(t)});const fe=e=>{const t=v.value.length;if(t===0)return{};let a=(e+h.value)%t;a<0&&(a+=t),a>t/2&&(a-=t);const o=Math.abs(a),r=100,n=Math.max(.8,1-o*.1),re=Math.max(0,1-o*.8),_e=a*-10,Be=o*-150;return{transform:`translateX(${a*r}%) translateZ(${Be}px) rotateY(${_e}deg) scale(${n})`,opacity:re,zIndex:Math.round(40-o*10),pointerEvents:o<.2?"auto":"none",visibility:re<.01?"hidden":"visible"}},ge=e=>{C.value[e]=!C.value[e]},w=g(()=>l.length),P=g(()=>l.filter(e=>e.checked).length),pe=g(()=>w.value===0?0:Math.round(P.value/w.value*100)),xe=(e,t)=>{if(M(t.clientX,t.clientY,"#10b981"),!V[e].implemented){alert("此國家清單即將推出！目前請選擇韓國 🇰🇷");return}i.value=e,p.value=2,y()},ke=(e,t)=>{M(t.clientX,t.clientY,"#10b981"),c.value=e,p.value=3,ye(),y()},A=()=>`travel_packing_${i.value}_${c.value}`,Q=()=>`travel_packing_custom_${i.value}_${c.value}`,z=()=>`travel_packing_deleted_${i.value}_${c.value}`,U=()=>{const e=l.filter(t=>t.isCustom);localStorage.setItem(Q(),JSON.stringify(e))},be=()=>{u.value.length>0?localStorage.setItem(z(),JSON.stringify(u.value)):localStorage.removeItem(z())},we=()=>{if(!S.value.trim())return;const e=L.value==="🚨 非常重要",t={id:`custom_${Date.now()}`,name:S.value.trim(),checked:!1,isMust:e,category:L.value,isCustom:!0};l.push(t),U(),S.value="",q.value=!1,e?B.value=!0:C.value[L.value]=!0},Z=e=>{const t=l.findIndex(a=>a.id===e);if(t>-1){const a=l[t];l.splice(t,1),a.isCustom?U():(u.value.push(e),be()),y()}},ye=()=>{const e=[],t=localStorage.getItem(z());if(t)try{u.value=JSON.parse(t)}catch(r){console.error("Failed to parse deleted items",r),u.value=[]}else u.value=[];D.must.forEach(r=>{u.value.includes(r.id)||e.push({...r,isMust:!0,category:"🚨 絕對不能忘記"})}),D.categories.forEach(r=>{r.items.forEach(n=>{"gender"in n&&n.gender!==c.value||"country"in n&&n.country!==i.value||u.value.includes(n.id)||e.push({...n,isMust:!1,category:r.name})})});const a=localStorage.getItem(Q());if(a)try{JSON.parse(a).forEach(n=>{e.push(n)})}catch(r){console.error("Failed to parse custom items",r)}const o=localStorage.getItem(A());if(o)try{const r=JSON.parse(o);e.forEach(n=>{r.includes(n.id)&&(n.checked=!0)})}catch(r){console.error("Failed to parse saved items",r)}l.splice(0,l.length,...e)},Me=(e,t)=>{if(R.value){Z(e.id);return}if(e.checked=!e.checked,P.value===w.value&&w.value>0)for(let a=0;a<5;a++)setTimeout(()=>{M(window.innerWidth/2+(Math.random()-.5)*200,window.innerHeight/2+(Math.random()-.5)*200,"#10b981")},a*100);y()},Ce=()=>{l.forEach(e=>e.checked=!0),y()},Ie=()=>{I.value=!0},Se=()=>{localStorage.removeItem(A()),l.forEach(e=>e.checked=!1),I.value=!1,M(window.innerWidth/2,window.innerHeight/2,"#ef4444")},Le=()=>{I.value=!1},je=()=>{for(let e=0;e<8;e++)setTimeout(()=>{M(window.innerWidth/2+(Math.random()-.5)*400,window.innerHeight/2+(Math.random()-.5)*400,e%2===0?"#10b981":"#6366f1")},e*150)},y=()=>{if(i.value&&c.value&&p.value===3){const e=l.filter(t=>t.checked).map(t=>t.id);e.length>0?localStorage.setItem(A(),JSON.stringify(e)):localStorage.removeItem(A())}},De=()=>{p.value=1,i.value="",c.value=""},ee=s(!1),te=e=>{e.target.closest(".left-menu-container")||(ee.value=!1,F.value=!1)};H(()=>{window.addEventListener("click",te)}),oe(()=>{window.removeEventListener("click",te)});const W=s(localStorage.getItem("weatherCity")||"Taipei"),ae=s(null),T=s(!1),$=[{id:"Tokyo",name:"東京",lat:35.6895,lon:139.6917},{id:"Seoul",name:"首爾",lat:37.5665,lon:126.978},{id:"Bangkok",name:"曼谷",lat:13.7563,lon:100.5018},{id:"Paris",name:"巴黎",lat:48.8566,lon:2.3522},{id:"London",name:"倫敦",lat:51.5074,lon:-.1278},{id:"New York",name:"紐約",lat:40.7128,lon:-74.006},{id:"Taipei",name:"台北",lat:25.033,lon:121.5654}],se=async()=>{const e=$.find(t=>t.id===W.value)||$[6];T.value=!0;try{const a=await(await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${e.lat}&longitude=${e.lon}&current_weather=true`)).json();ae.value=a.current_weather}catch(t){console.error("天氣載入失敗:",t)}finally{T.value=!1}},Ee=e=>{const t=e.target;W.value=t.value,localStorage.setItem("weatherCity",t.value),se()},Oe=e=>e===0?"☀️":e===1||e===2||e===3?"⛅":e>=45&&e<=48?"🌫️":e>=51&&e<=67?"🌧️":e>=71&&e<=77?"❄️":e>=80&&e<=82?"🌦️":e>=85&&e<=86?"🌨️":e>=95?"⛈️":"☁️",Ae=async()=>{try{const e=await fetch(`/Per_OutTaiwan/announcements.json?t=${Date.now()}`);if(!e.ok)throw new Error("Fetch failed");const t=await e.json();t&&(j.value={countries:t.countries||{},global:t.global||{show:!1,message:""}})}catch(e){console.error("無法載入公告資訊:",e)}};return _(N,e=>{e&&(B.value=!1)}),H(()=>{De(),Ae(),se()}),{currentStep:p,selectedCountry:i,selectedGender:c,searchQuery:x,selectedCategoryFilter:X,expandedCategories:C,categories:v,countries:V,mustItems:me,mustItemsExpanded:B,filteredCategories:v,carouselContainer:de,activeCategoryIndex:J,carouselOffset:h,onMouseDown:ve,onTouchStart:he,getCategoryStyle:fe,rotateTo:E,totalCount:w,packedCount:P,progressPercent:pe,announcementConfig:j,currentCountryAnnouncement:ue,isHeaderExpanded:N,isLeftMenuOpen:F,isSearchPanelOpen:ie,isDeleteMode:R,peekingActive:ne,showResetModal:I,showAddItemModal:q,newItemName:S,newItemCategory:L,defaultItems:D,addCustomItem:we,removeItem:Z,isWeatherMenuOpen:ee,selectedWeatherCity:W,weatherData:ae,isWeatherLoading:T,weatherCities:$,selectCountry:xe,selectGender:ke,toggleCategory:ge,toggleItem:Me,markAllPacked:Ce,resetList:Ie,celebrateMore:je,confirmReset:Se,cancelReset:Le,selectWeatherCity:Ee,getWeatherIcon:Oe}},template:`
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
            <div class="relative flex flex-col-reverse items-start gap-4 left-menu-container" v-if="currentStep === 3">
                <!-- Left Menu Toggle Button -->
                <button @click.stop="isLeftMenuOpen = !isLeftMenuOpen" 
                        class="w-16 h-16 rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group border-4 relative overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-400/40 text-slate-900 dark:text-slate-300 shadow-slate-200/50 dark:shadow-[0_0_20px_rgba(148,163,184,0.3)]">
                    <div class="absolute inset-0 hidden dark:block bg-slate-400/10 animate-pulse"></div>
                    <svg v-if="!isLeftMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <!-- Menu Items -->
                <div v-if="isLeftMenuOpen" class="flex flex-col gap-3 mb-2 animate-fade-in items-start">
                    <!-- Search Toggle Button -->
                    <button @click.stop="isSearchPanelOpen = !isSearchPanelOpen; isWeatherMenuOpen = false; isLeftMenuOpen = false" 
                            class="w-14 h-14 rounded-full flex items-center justify-center transition-all glass-card hover:scale-110 active:scale-95 shadow-2xl group border border-white/20 bg-indigo-600 dark:bg-indigo-500 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span class="absolute left-16 bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white px-3 py-1 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-slate-200 dark:border-white/10">
                            搜尋物品
                        </span>
                    </button>

                    <!-- Weather Toggle Button -->
                    <button @click.stop="isWeatherMenuOpen = !isWeatherMenuOpen; isSearchPanelOpen = false; isLeftMenuOpen = false" 
                            class="w-14 h-14 rounded-full flex items-center justify-center transition-all glass-card hover:scale-110 active:scale-95 shadow-2xl group border border-white/20">
                        <span class="text-2xl">⛅</span>
                        <span class="absolute left-16 bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white px-3 py-1 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-slate-200 dark:border-white/10">
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
                         class="absolute bottom-20 left-0 w-72 glass-card p-6 rounded-3xl border border-white/20 shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl z-[70]">
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
        <div v-if="currentStep === 3" class="max-w-5xl mx-auto h-full flex flex-col overflow-hidden pt-2 pb-8 px-4 md:px-0">
            <!-- Header & Progress -->
            <div class="bg-gradient-to-br from-white/95 to-indigo-50/95 dark:from-slate-900/95 dark:to-indigo-950/95 backdrop-blur-2xl p-6 md:p-8 rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(99,102,241,0.3)] dark:shadow-[0_10px_40px_-10px_rgba(99,102,241,0.4)] mb-4 z-50 border-2 transition-all duration-500 overflow-visible shrink-0"
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
                                 class="flex items-center p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-red-100 dark:border-red-900/30 cursor-pointer transition-all hover:scale-[1.02] active:scale-95 group"
                                 :class="[
                                    item.checked && !isDeleteMode ? 'opacity-50 grayscale' : '',
                                    isDeleteMode ? 'hover:border-red-500/50 hover:bg-red-50/50 dark:hover:bg-red-900/20' : ''
                                 ]">
                                <div class="w-6 h-6 shrink-0 rounded-lg border-2 flex items-center justify-center transition-all"
                                     :class="[
                                        item.checked && !isDeleteMode ? 'bg-emerald-500 border-emerald-500' : 'border-red-400',
                                        isDeleteMode ? 'border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-900/30' : ''
                                     ]">
                                    <svg v-if="item.checked && !isDeleteMode" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                    </svg>
                                    <svg v-if="isDeleteMode" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </div>
                                <span class="ml-3 font-bold text-sm text-slate-900 dark:text-slate-200 truncate" 
                                      :class="[
                                        item.checked && !isDeleteMode ? 'line-through' : '',
                                        isDeleteMode ? 'group-hover:text-red-600 dark:group-hover:text-red-400' : ''
                                      ]">
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
                    <div class="max-w-5xl mx-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl p-6 rounded-b-[2.5rem] rounded-t-2xl shadow-2xl border-x-2 border-b-2 border-indigo-500/20 pointer-events-auto">
                        <div class="flex flex-col sm:flex-row gap-4 w-full">
                            <!-- Dropdown -->
                            <select v-model="selectedCategoryFilter" @change="isSearchPanelOpen = false" class="py-4 px-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-indigo-100 dark:border-indigo-800/50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-black dark:text-white font-bold appearance-none cursor-pointer">
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
            <div class="relative flex-1 min-h-0 mb-12 w-full perspective-2000 z-10" 
                 @mousedown="onMouseDown" 
                 @touchstart="onTouchStart">
                <div class="absolute inset-0 flex items-start justify-center pt-4 pb-4 preserve-3d transition-transform duration-75">
                    <div v-for="(category, index) in categories" :key="category.name" 
                         class="absolute w-[90%] md:w-[450px] h-full transition-all duration-300 ease-out"
                         :style="getCategoryStyle(index)">
                        
                        <div class="glass-card rounded-3xl md:rounded-[2.5rem] shadow-2xl border-2 overflow-hidden h-full flex flex-col"
                             :class="category.items.length > 0 && category.items.every(i => i.checked) ? 'border-emerald-400/50 dark:border-emerald-500/50 bg-emerald-50/30 dark:bg-emerald-900/10' : 'border-white/20 dark:border-white/5'">
                            
                            <div class="p-4 md:p-6 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20 border-b border-white/10 shrink-0">
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
                                <div class="flex items-center gap-2">
                                    <button @click.stop="isDeleteMode = !isDeleteMode" 
                                            class="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 border"
                                            :class="isDeleteMode ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/30' : 'bg-white/50 dark:bg-slate-800/50 text-slate-400 hover:text-red-500 border-transparent hover:border-red-200 dark:hover:border-red-900'">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                    <div v-if="category.items.length > 0 && category.items.every(i => i.checked)" 
                                         class="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 animate-in zoom-in duration-500">
                                        <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                                    </div>
                                </div>
                            </div>

                            <div class="px-6 pb-6 md:px-8 md:pb-8 pt-4 flex-1 overflow-y-auto custom-scrollbar">
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div v-for="item in category.items" :key="item.id" 
                                         v-show="!searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase())"
                                         @click="toggleItem(item, $event)"
                                         class="flex items-center p-4 md:p-5 rounded-3xl hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-all group border-2 border-transparent"
                                         :class="[
                                            item.checked && !isDeleteMode ? 'bg-slate-50/50 dark:bg-slate-800/30 border-emerald-500/10' : '',
                                            isDeleteMode ? 'hover:border-red-500/50 hover:bg-red-50/50 dark:hover:bg-red-900/20' : ''
                                         ]">
                                        <div class="w-6 h-6 md:w-8 md:h-8 shrink-0 rounded-lg md:rounded-xl border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center transition-all group-hover:border-slate-900 dark:group-hover:border-slate-400" 
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
                                        <span class="ml-3 md:ml-4 text-slate-900 dark:text-slate-200 font-bold text-base md:text-lg transition-all truncate" 
                                              :class="[
                                                item.checked && !isDeleteMode ? 'line-through opacity-60 translate-x-1 text-slate-500' : '',
                                                isDeleteMode ? 'group-hover:text-red-600 dark:group-hover:text-red-400' : ''
                                              ]">
                                            {{ item.name }}
                                        </span>
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
  `});Pe($e).mount("#app");
