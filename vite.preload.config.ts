import { defineConfig } from 'vite'
import { BASE_CONFIG, ALIAS } from './vite.const'

export default defineConfig({
  ...BASE_CONFIG,
  resolve: {
    alias: {
      ...ALIAS,
    },
  },
})
