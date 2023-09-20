import { defineConfig } from 'vite'
import { BASE_CONFIG, ALIAS } from './vite.const'

export default defineConfig({
  ...BASE_CONFIG,
  resolve: {
    browserField: false,
    mainFields: ['module', 'jsnext:main', 'jsnext'],
    alias: {
      ...ALIAS,
    },
  },
  build: {
    rollupOptions: {
      external: ['dotenv'],
    },
  },
})
