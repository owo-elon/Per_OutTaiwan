import {
  computed,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  ref,
  toRef
} from 'vue';
import { useAnnouncements } from '../composables/useAnnouncements';
import { useDarkMode } from '../composables/useDarkMode';
import { initThreeBackground } from '../three/background/initThreeBackground';

export const LayoutComponent = defineComponent({
  name: 'AppLayout',
  props: {
    announcementScope: {
      type: String,
      default: 'global'
    },
    countryCode: {
      type: String,
      default: ''
    },
    showAnnouncement: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const backgroundRef = ref<HTMLElement | null>(null);
    const { isDark, toggleDarkMode } = useDarkMode();
    const { announcement } = useAnnouncements(
      props.announcementScope as 'global' | 'turntable' | 'country',
      toRef(props, 'countryCode')
    );

    const baseUrl = import.meta.env.BASE_URL;
    const navigation = [
      { label: '首頁', icon: '⌂', href: baseUrl },
      { label: '行李清單', icon: '✓', href: `${baseUrl}src/view/takelist/takelist.html` },
      { label: '命運轉盤', icon: '◎', href: `${baseUrl}src/view/turntable/turntable.html` }
    ];

    const currentPath = computed(() => window.location.pathname.toLowerCase());
    const isActive = (href: string) => {
      const normalizePath = (path: string) => path
        .toLowerCase()
        .replace(/index\.html$/, '')
        .replace(/\/+$/, '/');
      const target = new URL(href, window.location.origin).pathname;
      return normalizePath(currentPath.value) === normalizePath(target);
    };

    onMounted(() => {
      if (!backgroundRef.value) {
        return;
      }

      window.threeBg?.destroy();
      window.threeBg = initThreeBackground(backgroundRef.value);
      window.threeBg?.updateTheme(isDark.value);
    });

    onBeforeUnmount(() => {
      window.threeBg?.destroy();
      window.threeBg = null;
    });

    return {
      announcement,
      backgroundRef,
      isDark,
      isActive,
      navigation,
      toggleDarkMode
    };
  },
  template: `
    <div class="app-layout">
      <div ref="backgroundRef" class="three-background" aria-hidden="true"></div>
      <div class="app-layout__grid" aria-hidden="true"></div>

      <header class="topbar">
        <a :href="navigation[0].href" class="brand" aria-label="Per OutTaiwan 首頁">
          <span class="brand__mark">P</span>
          <span>
            <strong>PER OUTTAIWAN</strong>
            <small>MULTI-TOOL CONTROL SYSTEM</small>
          </span>
        </a>

        <div class="topbar__actions">
          <span class="system-status"><i></i> SYSTEM ONLINE</span>
          <button
            class="icon-button"
            type="button"
            :aria-label="isDark ? '切換為亮色模式' : '切換為暗色模式'"
            :title="isDark ? '切換為亮色模式' : '切換為暗色模式'"
            @click="toggleDarkMode"
          >
            {{ isDark ? '☀' : '☾' }}
          </button>
        </div>
      </header>

      <div
        v-if="showAnnouncement && announcement?.show"
        class="announcement"
        role="status"
      >
        <span class="announcement__signal" aria-hidden="true">◆</span>
        <span>{{ announcement.message }}</span>
      </div>

      <main class="app-content">
        <slot></slot>
      </main>

      <nav class="app-dock" aria-label="主要功能">
        <a
          v-for="item in navigation"
          :key="item.label"
          :href="item.href"
          class="app-dock__item"
          :class="{ 'is-active': isActive(item.href) }"
          :aria-current="isActive(item.href) ? 'page' : undefined"
        >
          <span class="app-dock__icon" aria-hidden="true">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </a>
      </nav>
    </div>
  `
});
