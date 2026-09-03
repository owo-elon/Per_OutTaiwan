import { createApp, defineComponent, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { LayoutComponent } from '../../layout/layout';
import { useHomeDashboard } from '../../composables/useHomeDashboard';
import { ThreeCarousel } from '../../three/carousel/ThreeCarousel';
import type { CarouselItem } from '../../types/home';
import '../../css/_global/index.css';
import '../../css/_global/layout.css';
import '../../css/home/home.css';

const HomeApp = defineComponent({
  name: 'HomeApp',
  components: {
    LayoutComponent
  },
  setup() {
    const carouselHost = ref<HTMLElement | null>(null);
    const dashboard = useHomeDashboard();
    let carousel: ThreeCarousel | null = null;
    let stopWatching: (() => void) | null = null;

    const featureHref = (feature: CarouselItem) => (
      feature.link === '#'
        ? '#'
        : `${import.meta.env.BASE_URL}${feature.link}`
    );

    const rebuildCarousel = async () => {
      await nextTick();
      if (!carouselHost.value) {
        return;
      }

      if (!carousel) {
        carousel = new ThreeCarousel(carouselHost.value, dashboard.filteredFeatures.value);
      } else {
        carousel.setItems(dashboard.filteredFeatures.value);
      }
    };

    onMounted(() => {
      stopWatching = watch(dashboard.filteredFeatures, rebuildCarousel, { immediate: true });
    });

    onBeforeUnmount(() => {
      stopWatching?.();
      carousel?.destroy();
    });

    return {
      ...dashboard,
      carouselHost,
      featureHref,
      previousFeature: () => carousel?.previous(),
      nextFeature: () => carousel?.next()
    };
  },
  template: `
    <LayoutComponent>
      <section class="home-dashboard">
        <div class="home-hero">
          <div class="home-hero__copy">
            <p class="eyebrow">MULTI-TOOL CONTROL / SYSTEM ONLINE</p>
          </div>

          <div class="mission-metrics" aria-label="系統摘要">
            <div>
              <span>{{ features.length.toString().padStart(2, '0') }}</span>
              <small>MODULES</small>
            </div>
            <div>
              <span>{{ categories.length.toString().padStart(2, '0') }}</span>
              <small>CHANNELS</small>
            </div>
            <div>
              <span>24/7</span>
              <small>READY</small>
            </div>
          </div>
        </div>

        <div class="module-toolbar">
          <div class="module-toolbar__heading">
            <span>01</span>
            <div>
              <p>SELECT CHANNEL</p>
              <h2>選擇任務模組</h2>
            </div>
          </div>

          <div class="category-filter" role="group" aria-label="功能分類">
            <button
              v-for="category in categories"
              :key="category.id"
              type="button"
              :class="{ 'is-active': activeCategory === category.id }"
              :aria-pressed="activeCategory === category.id"
              @click="selectCategory(category.id)"
            >
              <span aria-hidden="true">{{ category.icon }}</span>
              {{ category.name }}
            </button>
          </div>
        </div>

        <div v-if="isLoading" class="state-panel" role="status">
          <span class="loading-ring" aria-hidden="true"></span>
          正在連接任務資料…
        </div>
        <div v-else-if="errorMessage" class="state-panel state-panel--error" role="alert">
          {{ errorMessage }}
        </div>

        <template v-else>
          <div class="carousel-shell">
            <button
              class="carousel-control carousel-control--previous"
              type="button"
              aria-label="上一個功能"
              @click="previousFeature"
            >←</button>
            <div ref="carouselHost" class="home-carousel-stage"></div>
            <button
              class="carousel-control carousel-control--next"
              type="button"
              aria-label="下一個功能"
              @click="nextFeature"
            >→</button>
            <p class="carousel-hint">拖曳、水平滾動或使用方向按鈕切換；點擊中央卡片開啟。</p>
          </div>

          <div class="module-shortcuts" aria-label="功能快速連結">
            <template v-for="feature in filteredFeatures" :key="feature.id">
              <a
                v-if="feature.link !== '#'"
                class="module-shortcut"
                :href="featureHref(feature)"
              >
                <span class="module-shortcut__icon" aria-hidden="true">{{ feature.icon }}</span>
                <span>
                  <strong>{{ feature.title }}</strong>
                  <small>{{ feature.description }}</small>
                </span>
                <i aria-hidden="true">↗</i>
              </a>
              <button
                v-else
                class="module-shortcut is-disabled"
                type="button"
                disabled
              >
                <span class="module-shortcut__icon" aria-hidden="true">{{ feature.icon }}</span>
                <span>
                  <strong>{{ feature.title }}</strong>
                  <small>{{ feature.description }}</small>
                </span>
                <i aria-hidden="true">SOON</i>
              </button>
            </template>
          </div>
        </template>
      </section>
    </LayoutComponent>
  `
});

createApp(HomeApp).mount('#homeApp');
