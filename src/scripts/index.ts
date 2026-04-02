import { createApp, defineComponent, ref, onMounted, onUnmounted, computed, watch } from 'vue';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import { LayoutComponent } from '../layout/layout';
import { ThreeCarousel, CarouselItem } from './threecarousel';
import '../../css/index.css';
import '../../css/home.css';

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
        link: `${import.meta.env.BASE_URL}src/view/takelist/takelist.html`,
        category: 'tool'
      },
      {
        id: 'turntable',
        title: '幸運轉盤',
        description: '猶豫不決嗎？讓轉盤幫您做決定！支援自定義獎項',
        icon: '🎡',
        link: `${import.meta.env.BASE_URL}src/view/turntable/turntable.html`,
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
      return features; // Do not filter, always show all
    });

    onMounted(() => {
      if (carouselContainer.value) {
        carousel = new ThreeCarousel(carouselContainer.value, features, isDark.value, (item) => {
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

      // Watch for category changes to rotate
      watch(selectedCategory, (newCat) => {
        if (carousel) {
          if (newCat === 'all') {
            carousel.rotateToIndex(0);
          } else {
            const index = features.findIndex(f => f.category === newCat);
            if (index !== -1) {
              carousel.rotateToIndex(index);
            }
          }
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

      const closeMenus = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target.closest('.home-category-container')) {
          isCategoryMenuOpen.value = false;
        }
      };
      window.addEventListener('click', closeMenus);

      onUnmounted(() => {
        observer.disconnect();
        window.removeEventListener('click', closeMenus);
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
        <div class="home-category-container">
          <!-- Toggle Button -->
          <button @click="isCategoryMenuOpen = !isCategoryMenuOpen" 
                  class="home-category-toggle">
            <!-- Glow effect for dark mode -->
            <div class="home-category-glow"></div>
            
            <span v-if="!isCategoryMenuOpen" class="home-category-icon">{{ categories.find(c => c.id === selectedCategory)?.icon }}</span>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="home-category-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>

            <!-- Tooltip -->
            <span class="home-category-tooltip">
                {{ isCategoryMenuOpen ? '關閉選單' : '類別：' + categories.find(c => c.id === selectedCategory)?.name }}
            </span>
          </button>

          <!-- Category Menu -->
          <transition 
              enter-active-class="menu-enter-active"
              enter-from-class="menu-enter-from"
              enter-to-class="menu-enter-to"
              leave-active-class="menu-leave-active"
              leave-from-class="menu-leave-from"
              leave-to-class="menu-leave-to"
          >
            <div v-if="isCategoryMenuOpen" 
                 class="home-category-menu glass-card">
              <button v-for="cat in categories" 
                      :key="cat.id"
                      @click="selectCategory(cat.id)"
                      class="home-category-item"
                      :class="selectedCategory === cat.id ? 'home-category-item-active' : 'home-category-item-inactive'">
                <span class="home-category-item-icon">{{ cat.icon }}</span>
                <span class="home-category-item-text">{{ cat.name }}</span>
              </button>
            </div>
          </transition>
        </div>
      </template>

      <div class="home-carousel-wrapper">
        
        <!-- Three.js Container -->
        <div ref="carouselContainer" class="home-carousel-container"></div>

        <!-- Developing Toast -->
        <transition name="fade">
          <div v-if="activeItem" class="home-toast">
            <div class="home-toast-title">🚧 ACCESS DENIED 🚧</div>
            <div>{{ activeItem.title }} 正在開發中...</div>
          </div>
        </transition>

      </div>
    </LayoutComponent>
  `
});

const app = createApp(Home);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.dark',
        }
    }
});
app.mount('#app');


