import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const repoName = process.env.GITHUB_REPOSITORY ? process.env.GITHUB_REPOSITORY.split('/')[1] : '';
  const basePath = repoName && !repoName.endsWith('.github.io') ? `/${repoName}/` : '/';
  
  return {
    base: basePath,
    plugins: [tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        'vue': 'vue/dist/vue.esm-bundler.js',
        
        // 2. 修正別名路徑：通常指向 src 或是專案根目錄
        // 建議確保這裡與你 tsconfig.json 的 paths 一致
        '@': path.resolve(__dirname, './'), 
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    // 3. 額外保險：確保 Rollup 知道如何處理 vue
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          takeList: path.resolve(__dirname, 'src/view/TakeList/TakeList.html'),
          turntable: path.resolve(__dirname, 'src/view/Turntable/Turntable.html'),
        },
        external: [], // 確保 vue 沒有被意外排除
      }
    }
  };
});