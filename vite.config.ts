import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(() => {
  const repoName = process.env.GITHUB_REPOSITORY ? process.env.GITHUB_REPOSITORY.split('/')[1] : '';
  const basePath = repoName ? `/${repoName}/` : '/';

  return {
    base: basePath,
    plugins: [tailwindcss()],
    define: {
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
    },
    resolve: {
      alias: [
        {
          find: /^vue$/,
          replacement: 'vue/dist/vue.esm-bundler.js',
        },
        {
          find: /^three$/,
          replacement: path.resolve(__dirname, 'node_modules/three/src/Three.js'),
        },
        {
          find: '@',
          replacement: path.resolve(__dirname, 'src'),
        },
      ],
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    build: {
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        input: {
          main: 'index.html',
          takelist: 'src/view/takelist/takelist.html',
          turntable: 'src/view/turntable/turntable.html',
        },
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('/node_modules/three/')) return 'three';
              if (/\/node_modules\/(@vue|vue)\//.test(id)) return 'vue-vendor';
              return 'vendor';
            }
          }
        }
      }
    }
  };
});