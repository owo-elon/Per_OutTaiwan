import { createApp, defineComponent, ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { LayoutComponent } from '../Layout/Layout';
import { ThreeCarousel, CarouselItem } from './ThreeCarousel';
import '../../css/index.css';

const Home = defineComponent({
  name: 'Home',
  components: {
    LayoutComponent
  },
  setup() {
    const carouselContainer = ref<HTMLElement | null>(null);
    let carousel: ThreeCarousel | null = null;
    const activeItem = ref<CarouselItem | null>(null);
    const isDark = ref(localStorage.getItem('darkMode') === 'true');
    const selectedCategory = ref('all');
    const isCategoryMenuOpen = ref(false);

    const features: CarouselItem[] = [
      {
        id: 'packing-list',
        title: '打包清單',
        description: '出國旅行必備物品清單，幫您輕鬆整理行李',
        icon: '🧳',
        link: `${import.meta.env.BASE_URL}src/view/TakeList/TakeList.html`,
        category: 'tool'
      },
      {
        id: 'turntable',
        title: '幸運轉盤',
        description: '猶豫不決嗎？讓轉盤幫您做決定！支援自定義獎項',
        icon: '🎡',
        link: `${import.meta.env.BASE_URL}src/view/Turntable/Turntable.html`,
        category: 'game'
      },
      {
        id: 'itinerary',
        title: '行程規劃',
        description: '即將推出：智能行程規劃工具，讓您的旅程更完美',
        icon: '✈️',
        link: '#',
        category: 'tool'
      },
      {
        id: 'budget',
        title: '預算計算',
        description: '即將推出：精確的旅行預算管理，掌控每一分錢',
        icon: '💰',
        link: '#',
        category: 'tool'
      }
    ];

    const categories = [
      { id: 'all', name: '全部項目', icon: '💠' },
      { id: 'tool', name: '實用工具', icon: '🛠️' },
      { id: 'game', name: '趣味遊戲', icon: '🎮' }
    ];

    const filteredFeatures = computed(() => {
      if (selectedCategory.value === 'all') return features;
      return features.filter(f => f.category === selectedCategory.value);
    });

    onMounted(() => {
      if (carouselContainer.value) {
        carousel = new ThreeCarousel(carouselContainer.value, filteredFeatures.value, isDark.value, (item) => {
          if (item.link !== '#') {
            window.location.href = item.link;
          } else {
            activeItem.value = item;
            setTimeout(() => {
              activeItem.value = null;
            }, 2000);
          }
        });
      }

      // Watch for category changes
      watch(filteredFeatures, (newVal) => {
        if (carousel) {
          carousel.setItems(newVal);
        }
      });

      // Watch for theme changes on body class
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'class') {
            const isDarkMode = document.body.classList.contains('dark');
            isDark.value = isDarkMode;
            if (carousel) {
              carousel.updateTheme(isDarkMode);
            }
          }
        });
      });

      observer.observe(document.body, { attributes: true });

      onUnmounted(() => {
        observer.disconnect();
        if (carousel) {
          carousel.destroy();
        }
      });
    });

    const selectCategory = (catId: string) => {
      selectedCategory.value = catId;
      isCategoryMenuOpen.value = false;
    };

    return {
      carouselContainer,
      activeItem,
      features,
      selectedCategory,
      isCategoryMenuOpen,
      categories,
      filteredFeatures,
      selectCategory
    };
  },
  template: `
    <LayoutComponent title="OutTaiwan 3D 導航">
      <template #bottom-left>
        <!-- Category Selector -->
        <div class="flex flex-col-reverse items-start gap-4">
          <!-- Toggle Button -->
          <button @click="isCategoryMenuOpen = !isCategoryMenuOpen" 
                  class="w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group border-4 relative overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-400/40 text-slate-900 dark:text-slate-300 shadow-slate-200/50 dark:shadow-[0_0_20px_rgba(148,163,184,0.3)]">
            <!-- Glow effect for dark mode -->
            <div class="absolute inset-0 hidden dark:block bg-slate-400/10 animate-pulse"></div>
            
            <span v-if="!isCategoryMenuOpen" class="text-2xl relative z-10">{{ categories.find(c => c.id === selectedCategory)?.icon }}</span>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>

            <!-- Tooltip -->
            <span class="absolute left-20 bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white px-3 py-1 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-slate-200 dark:border-white/10">
                {{ isCategoryMenuOpen ? '關閉選單' : '類別：' + categories.find(c => c.id === selectedCategory)?.name }}
            </span>
          </button>

          <!-- Category Menu -->
          <transition 
              enter-active-class="transition duration-300 ease-out"
              enter-from-class="transform -translate-x-8 opacity-0"
              enter-to-class="transform translate-x-0 opacity-100"
              leave-active-class="transition duration-200 ease-in"
              leave-from-class="transform translate-x-0 opacity-100"
              leave-to-class="transform -translate-x-8 opacity-0"
          >
            <div v-if="isCategoryMenuOpen" 
                 class="w-48 glass-card p-3 rounded-3xl border border-white/20 shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl flex flex-col gap-2">
              <button v-for="cat in categories" 
                      :key="cat.id"
                      @click="selectCategory(cat.id)"
                      class="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all"
                      :class="selectedCategory === cat.id ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'hover:bg-white/50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'">
                <span class="text-xl">{{ cat.icon }}</span>
                <span class="font-bold text-sm">{{ cat.name }}</span>
              </button>
            </div>
          </transition>
        </div>
      </template>

      <div class="relative w-full h-[600px] md:h-[700px] overflow-hidden bg-transparent">
        
        <!-- Three.js Container -->
        <div ref="carouselContainer" class="w-full h-full"></div>

        <!-- Developing Toast -->
        <transition name="fade">
          <div v-if="activeItem" class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-[#1A1A1A] border border-[#00E5FF] p-6 rounded-lg shadow-[0_0_30px_rgba(0,229,255,0.3)] text-[#00E5FF] font-mono text-center">
            <div class="text-2xl mb-2">🚧 ACCESS DENIED 🚧</div>
            <div>{{ activeItem.title }} 正在開發中...</div>
          </div>
        </transition>

      </div>
    </LayoutComponent>
  `
});

createApp(Home).mount('#app');


