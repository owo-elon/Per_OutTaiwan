import { createApp, defineComponent, ref, reactive, computed, onMounted, watch, onUnmounted, nextTick } from 'vue';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import { LayoutComponent, createParticles } from '../../layout/layout';
import '../../../css/index.css';
import '../../../css/takelist/takelist.css';

const TakeList = defineComponent({
  name: 'TakeList',
  components: {
    LayoutComponent
  },
  setup() {
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
    const currentStep = ref(1);
    const selectedCountry = ref('');
    const selectedGender = ref('');
    const searchQuery = ref('');
    const selectedCategoryFilter = ref('All');
    const expandedCategories = ref<Record<string, boolean>>({});
    const mustItemsExpanded = ref(true);
    const isHeaderExpanded = ref(false);
    const isLeftMenuOpen = ref(false);
    const peekingActive = ref(false);
    const isAddItemModalOpen = ref(false);
    const isSearchPanelOpen = ref(false);
    const isDeleteMode = ref(false);
    const showResetModal = ref(false);
    const showAddItemModal = ref(false);
    const newItemName = ref('');
    const newItemCategory = ref('🚨 非常重要');
    const packingList = reactive([]);
    const deletedItemIds = ref<string[]>([]);
    
    // DOM Carousel State
    const carouselOffset = ref(0);
    const targetOffset = ref(0);
    const isDragging = ref(false);
    const isLongPressed = ref(false);
    const hasDragged = ref(false);
    let longPressTimer: any = null;
    const startX = ref(0);
    let startY = 0;
    const lastX = ref(0);
    const velocity = ref(0);
    const carouselContainer = ref<HTMLElement | null>(null);
    const activeCategoryIndex = ref(0);
    const prevCategory = () => {
      if (activeCategoryIndex.value > 0) {
        activeCategoryIndex.value--;
      } else {
        activeCategoryIndex.value = categories.value.length - 1;
      }
    };
    const nextCategory = () => {
      if (activeCategoryIndex.value < categories.value.length - 1) {
        activeCategoryIndex.value++;
      } else {
        activeCategoryIndex.value = 0;
      }
    };
    
    const isDark = ref(localStorage.getItem('darkMode') === 'true');

    const announcementConfig = ref({
      countries: {} as any,
      global: { show: false, message: '' }
    });

    const currentCountryAnnouncement = computed(() => {
      if (!selectedCountry.value || !announcementConfig.value.countries) return null;
      return announcementConfig.value.countries[selectedCountry.value] || null;
    });

    const countries = {
      korea: { name: '韓國', flag: '🇰🇷', implemented: true },
      japan: { name: '日本', flag: '🇯🇵', implemented: false },
      thailand: { name: '泰國', flag: '🇹🇭', implemented: false },
      usa: { name: '美國', flag: '🇺🇸', implemented: false },
      europe: { name: '歐洲', flag: '🇪🇺', implemented: false }
    };

    const defaultItems = {
      must: [
        { id: 'm1', name: '護照', checked: false },
        { id: 'm2', name: '手機', checked: false },
        { id: 'm3', name: '錢包', checked: false },
        { id: 'm4', name: '信用卡', checked: false },
        { id: 'm5', name: '網路卡/ESIM', checked: false },
        { id: 'm6', name: '錢(台幣/外幣)', checked: false }
      ],
      categories: [
        {
          name: '其他重要物品',
          icon: '💼',
          items: [
            { id: 'i1', name: '登機證(可以申請記得先申請)', checked: false },
            { id: 'i2', name: '證件(身分證 健保卡)', checked: false },
            { id: 'i3', name: '行動電源', checked: false },
            { id: 'i4', name: '雨傘', checked: false },
            { id: 'i5', name: '萬國轉接頭', checked: false },
            { id: 'i6', name: '充電頭2顆', checked: false },
            { id: 'i7', name: '充電線2條(記得拿一條跟行動電源放一起)', checked: false }
          ]
        },
        {
          name: '包包',
          icon: '🎒',
          items: [
            { id: 'b1', name: '後背包', checked: false },
            { id: 'b2', name: '側背包', checked: false },
            { id: 'b3', name: '收納腰包', checked: false },
            { id: 'b4', name: '行李替大~包 (掛行李箱上那個)', checked: false },
            { id: 'b5', name: '壓縮袋', checked: false }
          ]
        },
        {
          name: '衣物',
          icon: '👕',
          items: [
            { id: 'c1', name: '衣服(記得帶睡衣) [幾夜]', checked: false },
            { id: 'c2', name: '褲子(記得帶睡褲) [幾夜]', checked: false },
            { id: 'c3', name: '內褲 [幾天]', checked: false },
            { id: 'c4', name: '內衣 [幾天]', checked: false },
            { id: 'c5', name: '襪子 [幾天]', checked: false },
            { id: 'c6', name: '拖鞋/涼鞋/布鞋', checked: false },
            { id: 'c7', name: '外套', checked: false },
            { id: 'c8', name: '帽子', checked: false }
          ]
        },
        {
          name: '盥洗用品',
          icon: '🧴',
          items: [
            { id: 't1', name: '牙刷牙膏', checked: false },
            { id: 't2', name: '洗面乳', checked: false },
            { id: 't3', name: '護髮乳', checked: false },
            { id: 't4', name: '洗臉巾', checked: false },
            { id: 't5', name: '隱形眼鏡+清洗液', checked: false },
            { id: 't6', name: '髒衣袋', checked: false },
            { id: 't7', name: '壓縮毛巾', checked: false },
            { id: 't8', name: '牙籤', checked: false },
            { id: 't9', name: '頸枕', checked: false },
            { id: 't10', name: '眼罩', checked: false },
            { id: 't11', name: '耳塞', checked: false }
          ]
        },
        {
          name: '文具用品/3C/備品',
          icon: '📱',
          items: [
            { id: 's1', name: '小剪刀(記得丟行李箱)', checked: false },
            { id: 's2', name: '膠帶', checked: false },
            { id: 's3', name: '筆', checked: false },
            { id: 's4', name: '耳機', checked: false },
            { id: 's5', name: '自拍棒', checked: false },
            { id: 's6', name: '絕緣膠帶', checked: false },
            { id: 's7', name: '飲料提袋', checked: false },
            { id: 's8', name: '環保袋', checked: false },
            { id: 's9', name: '衛生紙', checked: false },
            { id: 's10', name: '濕紙巾', checked: false },
            { id: 's11', name: '垃圾袋', checked: false }
          ]
        },
        {
          name: '藥品',
          icon: '💊',
          items: [
            { id: 'p1', name: '小護士', checked: false },
            { id: 'p2', name: '防蚊液', checked: false },
            { id: 'p3', name: '木瓜霜', checked: false },
            { id: 'p4', name: '生理食鹽水', checked: false },
            { id: 'p5', name: '眼藥水', checked: false },
            { id: 'p6', name: '止痛藥', checked: false },
            { id: 'p7', name: 'ok蹦', checked: false },
            { id: 'p8', name: '棉花棒', checked: false }
          ]
        },
        {
          name: '化妝品',
          icon: '💄',
          items: [
            { id: 'mk1', name: '防曬', checked: false },
            { id: 'mk2', name: '粉底液+刀', checked: false },
            { id: 'mk3', name: '粉餅+海綿', checked: false },
            { id: 'mk4', name: '定妝液', checked: false },
            { id: 'mk5', name: '定妝粉', checked: false },
            { id: 'mk6', name: '腮紅', checked: false },
            { id: 'mk7', name: '眼影+刷具', checked: false },
            { id: 'mk8', name: '眉粉', checked: false },
            { id: 'mk9', name: '眼線筆', checked: false },
            { id: 'mk10', name: '睫毛膏+夾', checked: false },
            { id: 'mk11', name: '口紅', checked: false },
            { id: 'mk12', name: '卸妝水+巾', checked: false },
            { id: 'mk13', name: '梳子', checked: false },
            { id: 'mk14', name: '髮油', checked: false },
            { id: 'mk15', name: '香水', checked: false },
            { id: 'mk16', name: '髮圈', checked: false },
            { id: 'mk17', name: '鏡子', checked: false }
          ]
        },
        {
          name: '保養品',
          icon: '✨',
          items: [
            { id: 'sk1', name: '化妝水', checked: false },
            { id: 'sk2', name: '蘆薈膠', checked: false },
            { id: 'sk3', name: '乳液', checked: false }
          ]
        }
      ]
    };

    const mustItems = computed(() => {
      let items = packingList.filter(item => item.isMust);
      if (searchQuery.value) {
        items = items.filter(item => item.name.includes(searchQuery.value));
      }
      return items;
    });

    const categories = computed(() => {
      const cats = [];
      const otherItems = packingList.filter(item => !item.isMust);
      
      defaultItems.categories.forEach(defCat => {
        let items = otherItems.filter(item => item.category === defCat.name);
        
        if (items.length > 0) {
          cats.push({
            name: defCat.name,
            icon: defCat.icon,
            items: items
          });
        }
      });
      return cats;
    });

    // Carousel Logic
    const updateCarousel = () => {
      if (!isDragging.value) {
        carouselOffset.value += (targetOffset.value - carouselOffset.value) * 0.1;
      } else {
        carouselOffset.value = targetOffset.value;
      }
      
      if (Math.abs(targetOffset.value - carouselOffset.value) > 0.001 || isDragging.value) {
        requestAnimationFrame(updateCarousel);
      }
      
      // Update active index
      const N = categories.value.length;
      if (N > 0) {
        let activeIdx = Math.round(-carouselOffset.value) % N;
        if (activeIdx < 0) activeIdx += N;
        activeCategoryIndex.value = activeIdx;
      }
    };

    const rotateTo = (index: number) => {
      if (hasDragged.value) return;
      const N = categories.value.length;
      if (N === 0) return;
      
      let currentTargetIdx = Math.round(-targetOffset.value) % N;
      if (currentTargetIdx < 0) currentTargetIdx += N;
      
      let diff = index - currentTargetIdx;
      if (diff > N / 2) diff -= N;
      if (diff < -N / 2) diff += N;
      
      targetOffset.value -= diff;
      requestAnimationFrame(updateCarousel);
    };

    let isScrolling = false;
    let isInteractionStarted = false;

    const startInteraction = (clientX: number, clientY: number) => {
      // Close menus when starting interaction with carousel
      isLeftMenuOpen.value = false;
      isWeatherMenuOpen.value = false;
      isSearchPanelOpen.value = false;

      hasDragged.value = false;
      startX.value = clientX;
      startY = clientY;
      
      isInteractionStarted = true;
      isScrolling = false;
      isDragging.value = false;
    };

    const cancelInteraction = () => {
      isInteractionStarted = false;
      isScrolling = false;
    };

    const onMouseDown = (e: MouseEvent) => {
      console.log('onMouseDown triggered');
      startInteraction(e.clientX, e.clientY);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isInteractionStarted) return;
      
      const currentX = e.clientX;
      const currentY = e.clientY;
      
      if (!isDragging.value) {
        const deltaX = Math.abs(currentX - startX.value);
        const deltaY = Math.abs(currentY - startY);
        
        if (deltaX > 5 || deltaY > 5) {
          isDragging.value = true;
          lastX.value = currentX;
          velocity.value = 0;
          requestAnimationFrame(updateCarousel);
        }
      }
      
      if (isDragging.value) {
        hasDragged.value = true;
        const delta = currentX - lastX.value;
        lastX.value = currentX;
        targetOffset.value += delta * 0.005;
        velocity.value = delta * 0.005;
      }
    };

    const onMouseUp = () => {
      console.log('onMouseUp triggered');
      cancelInteraction();
      isDragging.value = false;
      
      // Snap immediately to stop sliding
      targetOffset.value = Math.round(targetOffset.value);
      carouselOffset.value = targetOffset.value;
      
      // Reset hasDragged after a short delay so click events are blocked
      setTimeout(() => {
        hasDragged.value = false;
      }, 50);
    };

    const onMouseLeave = () => {
      onMouseUp();
    };

    const onTouchStart = (e: TouchEvent) => {
      startInteraction(e.touches[0].clientX, e.touches[0].clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isInteractionStarted) return;
      
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      
      if (!isDragging.value && !isScrolling) {
        const deltaX = Math.abs(currentX - startX.value);
        const deltaY = Math.abs(currentY - startY);
        
        if (deltaX > 5 || deltaY > 5) {
          if (deltaY > deltaX) {
            isScrolling = true; // User is scrolling vertically
          } else {
            isDragging.value = true; // User is swiping horizontally
            lastX.value = currentX;
            velocity.value = 0;
            requestAnimationFrame(updateCarousel);
          }
        }
      }
      
      if (isScrolling) {
        return; // Let the browser handle vertical scroll
      }
      
      if (e.cancelable) {
        e.preventDefault(); // Prevent vertical scroll while dragging horizontally
      }
      
      if (isDragging.value) {
        hasDragged.value = true;
        const delta = currentX - lastX.value;
        lastX.value = currentX;
        targetOffset.value += delta * 0.005;
        velocity.value = delta * 0.005;
      }
    };

    // Search-based Rotation
    watch(searchQuery, (newQuery) => {
      if (!newQuery) return;
      
      const index = categories.value.findIndex(cat => 
        cat.items.some(item => item.name.toLowerCase().includes(newQuery.toLowerCase()))
      );
      
      if (index !== -1) {
        rotateTo(index);
      }
    });

    // Category Filter Rotation
    watch(selectedCategoryFilter, (newCat) => {
      if (newCat === 'All') return;
      const index = categories.value.findIndex(cat => cat.name === newCat);
      if (index !== -1) {
        rotateTo(index);
      }
    });

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          isDark.value = document.body.classList.contains('dark');
        }
      });
    });

    onMounted(() => {
      loadState();
      fetchAnnouncements();
      fetchWeather();
      
      observer.observe(document.body, { attributes: true });
      
      window.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('touchend', onMouseUp);
      window.addEventListener('touchcancel', onMouseUp);
      window.addEventListener('click', closeMenus);
      window.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('resize', updateScrollLock);
      updateScrollLock();
    });

    onUnmounted(() => {
      observer.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onMouseUp);
      window.removeEventListener('touchcancel', onMouseUp);
      window.removeEventListener('click', closeMenus);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateScrollLock);
      document.documentElement.classList.remove('lock-all-scroll');
      document.body.classList.remove('lock-all-scroll');
    });

    // Search Rotation Logic
    watch(searchQuery, (newQuery) => {
      if (!newQuery) return;
      
      const index = categories.value.findIndex(cat => 
        cat.items.some(item => item.name.toLowerCase().includes(newQuery.toLowerCase()))
      );
      
      if (index !== -1) {
        rotateTo(index);
      }
    });

    const getCategoryStyle = (index: number) => {
      const N = categories.value.length;
      if (N === 0) return {};

      let offset = (index + carouselOffset.value) % N;
      if (offset < 0) offset += N;
      if (offset > N / 2) offset -= N;

      const absOffset = Math.abs(offset);
      
      // Carousel parameters
      const isMobile = window.innerWidth < 768;
      const spacing = isMobile ? 85 : 110; 
      const scale = Math.max(0.7, 1 - absOffset * 0.15);
      const opacity = Math.max(0, 1 - absOffset * 0.6);
      const rotateY = offset * -35; 
      const translateZ = absOffset * -400; 
      const translateX = offset * (spacing * 1.2);
      
      return {
        transform: `translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
        opacity: opacity,
        zIndex: Math.round(40 - absOffset * 10),
        pointerEvents: absOffset < 2.5 ? 'auto' : 'none',
        visibility: opacity < 0.01 ? 'hidden' : 'visible',
        filter: `blur(${absOffset * 2}px)`
      };
    };

    const toggleCategory = (name: string) => {
      expandedCategories.value[name] = !expandedCategories.value[name];
    };

    const totalCount = computed(() => packingList.length);
    const packedCount = computed(() => packingList.filter(item => item.checked).length);
    const progressPercent = computed(() => totalCount.value === 0 ? 0 : Math.round((packedCount.value / totalCount.value) * 100));

    const selectCountry = (key, event) => {
      createParticles(event.clientX, event.clientY, '#10b981');
      if (!countries[key].implemented) {
        alert('此國家清單即將推出！目前請選擇韓國 🇰🇷');
        return;
      }
      selectedCountry.value = key;
      currentStep.value = 2;
      saveState();
    };

    const selectGender = (gender, event) => {
      createParticles(event.clientX, event.clientY, '#10b981');
      selectedGender.value = gender;
      currentStep.value = 3;
      initializeList();
      saveState();
    };

    const getStorageKey = () => `travel_packing_${selectedCountry.value}_${selectedGender.value}`;
    const getCustomStorageKey = () => `travel_packing_custom_${selectedCountry.value}_${selectedGender.value}`;
    const getDeletedStorageKey = () => `travel_packing_deleted_${selectedCountry.value}_${selectedGender.value}`;

    const saveCustomItems = () => {
      const customItems = packingList.filter(item => item.isCustom);
      localStorage.setItem(getCustomStorageKey(), JSON.stringify(customItems));
    };

    const saveDeletedItems = () => {
      if (deletedItemIds.value.length > 0) {
        localStorage.setItem(getDeletedStorageKey(), JSON.stringify(deletedItemIds.value));
      } else {
        localStorage.removeItem(getDeletedStorageKey());
      }
    };

    const addCustomItem = () => {
      if (!newItemName.value.trim()) return;
      
      const isMust = newItemCategory.value === '🚨 非常重要';
      const newItem = {
        id: `custom_${Date.now()}`,
        name: newItemName.value.trim(),
        checked: false,
        isMust: isMust,
        category: newItemCategory.value,
        isCustom: true
      };
      
      packingList.push(newItem);
      saveCustomItems();
      
      newItemName.value = '';
      showAddItemModal.value = false;
      
      if (isMust) {
        mustItemsExpanded.value = true;
      } else {
        expandedCategories.value[newItemCategory.value] = true;
      }
    };

    const removeItem = (id) => {
      const index = packingList.findIndex(item => item.id === id);
      if (index > -1) {
        const item = packingList[index];
        packingList.splice(index, 1);
        if (item.isCustom) {
          saveCustomItems();
        } else {
          deletedItemIds.value.push(id);
          saveDeletedItems();
        }
        saveState();
      }
    };

    const initializeList = () => {
      const list = [];
      
      // Restore deleted items
      const deletedSaved = localStorage.getItem(getDeletedStorageKey());
      if (deletedSaved) {
        try {
          deletedItemIds.value = JSON.parse(deletedSaved);
        } catch (e) {
          console.error('Failed to parse deleted items', e);
          deletedItemIds.value = [];
        }
      } else {
        deletedItemIds.value = [];
      }

      // Add Must items
      defaultItems.must.forEach(item => {
        if (!deletedItemIds.value.includes(item.id)) {
          list.push({ ...item, isMust: true, category: '🚨 絕對不能忘記' });
        }
      });

      // Add Category items
      defaultItems.categories.forEach(cat => {
        cat.items.forEach(item => {
          // Filter by gender
          if ('gender' in item && item.gender !== selectedGender.value) return;
          // Filter by country
          if ('country' in item && item.country !== selectedCountry.value) return;
          
          if (!deletedItemIds.value.includes(item.id)) {
            list.push({ ...item, isMust: false, category: cat.name });
          }
        });
      });

      // Restore custom items
      const customSaved = localStorage.getItem(getCustomStorageKey());
      if (customSaved) {
        try {
          const customItems = JSON.parse(customSaved);
          customItems.forEach(item => {
            list.push(item);
          });
        } catch (e) {
          console.error('Failed to parse custom items', e);
        }
      }

      // Restore checked state
      const saved = localStorage.getItem(getStorageKey());
      if (saved) {
        try {
          const checkedIds = JSON.parse(saved);
          list.forEach(item => {
            if (checkedIds.includes(item.id)) {
              item.checked = true;
            }
          });
        } catch (e) {
          console.error('Failed to parse saved items', e);
        }
      }

      packingList.splice(0, packingList.length, ...list);
    };

    const toggleItem = (item: any, event: Event, categoryIndex: number) => {
      if (hasDragged.value) return;
      if (activeCategoryIndex.value !== categoryIndex) {
        return; // Let the event bubble up to rotateTo
      }
      event.stopPropagation();
      
      if (isDeleteMode.value) {
        removeItem(item.id);
        return;
      }
      
      item.checked = !item.checked;
      
      if (packedCount.value === totalCount.value && totalCount.value > 0) {
        // Confetti for completion
        for(let i=0; i<5; i++) {
          setTimeout(() => {
            createParticles(window.innerWidth/2 + (Math.random()-0.5)*200, window.innerHeight/2 + (Math.random()-0.5)*200, '#10b981');
          }, i * 100);
        }
      }
      
      saveState();
    };

    const markAllPacked = () => {
      packingList.forEach(item => item.checked = true);
      saveState();
    };

    const resetList = () => {
      showResetModal.value = true;
    };

    const confirmReset = () => {
      localStorage.removeItem(getStorageKey());
      packingList.forEach(item => item.checked = false);
      showResetModal.value = false;
      createParticles(window.innerWidth/2, window.innerHeight/2, '#ef4444');
    };

    const cancelReset = () => {
      showResetModal.value = false;
    };

    const celebrateMore = () => {
      for(let i=0; i<8; i++) {
        setTimeout(() => {
          createParticles(window.innerWidth/2 + (Math.random()-0.5)*400, window.innerHeight/2 + (Math.random()-0.5)*400, i % 2 === 0 ? '#10b981' : '#6366f1');
        }, i * 150);
      }
    };

    const saveState = () => {
      if (selectedCountry.value && selectedGender.value && currentStep.value === 3) {
        const checkedItemIds = packingList.filter(item => item.checked).map(item => item.id);
        if (checkedItemIds.length > 0) {
          localStorage.setItem(getStorageKey(), JSON.stringify(checkedItemIds));
        } else {
          localStorage.removeItem(getStorageKey());
        }
      }
    };

    const loadState = () => {
      // Always start at step 1, don't remember country/gender
      currentStep.value = 1;
      selectedCountry.value = '';
      selectedGender.value = '';
    };

    const isWeatherMenuOpen = ref(false);

    // Close menus when clicking outside
    const closeMenus = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.left-menu-container')) {
        isWeatherMenuOpen.value = false;
        isLeftMenuOpen.value = false;
      }
    };




    const selectedWeatherCity = ref(localStorage.getItem('weatherCity') || 'Taipei');
    const weatherData = ref<any>(null);
    const isWeatherLoading = ref(false);

    const weatherCities = [
      { id: 'Tokyo', name: '東京', lat: 35.6895, lon: 139.6917 },
      { id: 'Seoul', name: '首爾', lat: 37.5665, lon: 126.9780 },
      { id: 'Bangkok', name: '曼谷', lat: 13.7563, lon: 100.5018 },
      { id: 'Paris', name: '巴黎', lat: 48.8566, lon: 2.3522 },
      { id: 'London', name: '倫敦', lat: 51.5074, lon: -0.1278 },
      { id: 'New York', name: '紐約', lat: 40.7128, lon: -74.0060 },
      { id: 'Taipei', name: '台北', lat: 25.0330, lon: 121.5654 }
    ];

    const fetchWeather = async () => {
      const city = weatherCities.find(c => c.id === selectedWeatherCity.value) || weatherCities[6];
      isWeatherLoading.value = true;
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true`);
        const data = await res.json();
        weatherData.value = data.current_weather;
      } catch (e) {
        console.error('天氣載入失敗:', e);
      } finally {
        isWeatherLoading.value = false;
      }
    };

    const selectWeatherCity = (event: Event) => {
      const target = event.target as HTMLSelectElement;
      selectedWeatherCity.value = target.value;
      localStorage.setItem('weatherCity', target.value);
      fetchWeather();
    };

    const getWeatherIcon = (code: number) => {
      if (code === 0) return '☀️';
      if (code === 1 || code === 2 || code === 3) return '⛅';
      if (code >= 45 && code <= 48) return '🌫️';
      if (code >= 51 && code <= 67) return '🌧️';
      if (code >= 71 && code <= 77) return '❄️';
      if (code >= 80 && code <= 82) return '🌦️';
      if (code >= 85 && code <= 86) return '🌨️';
      if (code >= 95) return '⛈️';
      return '☁️';
    };

    const fetchAnnouncements = async () => {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}announcements.json?t=${Date.now()}`);
        if (!response.ok) throw new Error('Fetch failed');
        const data = await response.json();
        
        if (data) {
          announcementConfig.value = {
            countries: data.countries || {},
            global: data.global || { show: false, message: '' }
          };
        }
      } catch (error) {
        console.error('無法載入公告資訊:', error);
      }
    };

    watch(isHeaderExpanded, (newVal) => {
      if (newVal) {
        mustItemsExpanded.value = false;
      }
    });

    const updateScrollLock = () => {
      const html = document.documentElement;
      const body = document.body;
      
      // Lock vertical scroll for all steps of the Packing List page
      // This ensures the outermost scrollbar is locked as requested.
      html.classList.add('lock-all-scroll');
      body.classList.add('lock-all-scroll');
    };

    watch(currentStep, updateScrollLock);

    const handleScroll = () => {
      isLeftMenuOpen.value = false;
      isWeatherMenuOpen.value = false;
      isSearchPanelOpen.value = false;
    };



    return {
      currentStep,
      selectedCountry,
      selectedGender,
      searchQuery,
      selectedCategoryFilter,
      expandedCategories,
      categories,
      countries,
      mustItems,
      mustItemsExpanded,
      filteredCategories: categories,
      carouselContainer,
      activeCategoryIndex,
      carouselOffset,
      isDragging,
      onMouseDown,
      onTouchStart,
      onMouseLeave,
      onMouseUp,
      getCategoryStyle,
      rotateTo,
      totalCount,
      packedCount,
      progressPercent,
      announcementConfig,
      currentCountryAnnouncement,
      isHeaderExpanded,
      isLeftMenuOpen,
      isSearchPanelOpen,
      isDeleteMode,
      peekingActive,
      showResetModal,
      showAddItemModal,
      newItemName,
      newItemCategory,
      defaultItems,
      addCustomItem,
      removeItem,
      isWeatherMenuOpen,
      selectedWeatherCity,
      weatherData,
      isWeatherLoading,
      weatherCities,
      selectCountry,
      selectGender,
      toggleCategory,
      toggleItem,
      markAllPacked,
      resetList,
      celebrateMore,
      confirmReset,
      cancelReset,
      prevCategory,
      nextCategory,
      selectWeatherCity,
      getWeatherIcon
    };
  },
  template: `
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
  `
});

const app = createApp(TakeList);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.dark',
        }
    }
});
app.mount('#app');
