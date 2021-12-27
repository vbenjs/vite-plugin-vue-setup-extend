import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

import plugin from '../core/dist/index.js';

export default defineConfig({
  plugins: [vue(), plugin()],
});
