import { onBeforeUnmount, onMounted, ref } from 'vue';
import { readStorage, writeStorage } from '../services/storage.service';

export function useDarkMode() {
  const isDark = ref(false);
  let mediaQuery: MediaQueryList | null = null;

  const applyTheme = (dark: boolean, persist = true) => {
    isDark.value = dark;
    document.documentElement.classList.toggle('dark', dark);
    document.body.classList.toggle('dark', dark);
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
    window.threeBg?.updateTheme(dark);
    if (persist) {
      writeStorage('darkMode', String(dark));
    }
  };

  const toggleDarkMode = () => applyTheme(!isDark.value);

  const handleSystemTheme = (event: MediaQueryListEvent) => {
    if (readStorage('darkMode') === null) {
      applyTheme(event.matches, false);
    }
  };

  onMounted(() => {
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const storedTheme = readStorage('darkMode');
    applyTheme(storedTheme === null ? mediaQuery.matches : storedTheme === 'true', false);
    mediaQuery.addEventListener('change', handleSystemTheme);
  });

  onBeforeUnmount(() => {
    mediaQuery?.removeEventListener('change', handleSystemTheme);
  });

  return {
    isDark,
    toggleDarkMode
  };
}
