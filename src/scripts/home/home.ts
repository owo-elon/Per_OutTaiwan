import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';

import { createApp, defineComponent, ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { LayoutComponent } from '../_global/layout';
import { ThreeCarousel, CarouselItem } from '../_global/threecarousel';
import '../../css/_global/index.css';
import '../../css/home/home.css';

const _HomeObj = {
  name: 'Home',
  setup() {
    const carouselContainer = ref<HTMLElement | null>(null);
    let carousel: ThreeCarousel | null = null;
    const activeItem = ref<CarouselItem | null>(null);
    const isDark = ref(localStorage.getItem('darkMode') === 'true');
    const selectedCategory = ref('all');
    const isCategoryMenuOpen = ref(false);

    const features = ref<CarouselItem[]>([]);
    const categories = ref<any[]>([]);

    const loadHomeData = async () => {
      try {
        const url = `${import.meta.env.BASE_URL}home/home.json`;
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          features.value = data.features || [];
          categories.value = data.categories || [];

          // Initialize carousel after data is loaded
          initCarousel();
        } else {
          console.error("Fetch failed with status:", response.status);
        }
      } catch (e) {
        console.error('Failed to load home data', e);
      }
    };

    const filteredFeatures = computed(() => {
      return features.value; // Do not filter, always show all
    });

    const initCarousel = () => {
      if (carouselContainer.value && features.value.length > 0) {
        carousel = new ThreeCarousel(carouselContainer.value, features.value, isDark.value, (item) => {
          if (item.link !== '#') {
            // Use router for navigation instead of direct href if possible, but since it's MPA, we use href
            window.location.href = `${import.meta.env.BASE_URL}${item.link}`;
          } else {
            activeItem.value = item;
            setTimeout(() => {
              activeItem.value = null;
            }, 2000);
          }
        });
      }
    };

    onMounted(() => {
      loadHomeData();

      // Watch for category changes to rotate
      watch(selectedCategory, (newCat) => {
        if (carousel) {
          if (newCat === 'all') {
            carousel.rotateToIndex(0);
          } else {
            const index = features.value.findIndex(f => f.category === newCat);
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
      const handleScroll = () => {
        isCategoryMenuOpen.value = false;
      };
      window.addEventListener('click', closeMenus);
      window.addEventListener('scroll', handleScroll, { passive: true });

      onUnmounted(() => {
        observer.disconnect();
        window.removeEventListener('click', closeMenus);
        window.removeEventListener('scroll', handleScroll);
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
    <LayoutComponent title="elon Tools" :show-announcement="false">
      <template #bottom-left>
        <!-- Category Selector -->
        <div class="home-category-container">
          <!-- Toggle Button -->
          <button @click.stop="isCategoryMenuOpen = !isCategoryMenuOpen" 
                  class="home-category-toggle">
            <!-- Glow effect for dark mode -->
            <div class="home-category-glow pointer-events-none"></div>
            
            <span v-if="!isCategoryMenuOpen" class="home-category-icon pointer-events-none">{{ categories.find(c => c.id === selectedCategory)?.icon }}</span>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="home-category-svg pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>

            <!-- Tooltip -->
            <span class="home-category-tooltip pointer-events-none">
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
            <div>{{ activeItem?.title }} 正在開發中...</div>
          </div>
        </transition>

      </div>
    </LayoutComponent>
  `
};

const homeApp_instance = createApp(_HomeObj);

homeApp_instance.component('LayoutComponent', LayoutComponent);
homeApp_instance.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.dark',
    }
  }
});
homeApp_instance.mount('#homeApp');
