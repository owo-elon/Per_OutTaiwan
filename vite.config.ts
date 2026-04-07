import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
        '@': path.resolve(__dirname, './'), 
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    build: {
      rollupOptions: {
        input: {
          main: 'index.html',
          takelist: 'src/view/takelist/takelist.html',
          takeList: 'src/view/takelist/takelist.html',
          turntable: 'src/view/turntable/turntable.html',
        },
      }
    }
  };
});