import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { BASE_CONFIG, ALIAS } from './vite.const'

export default defineConfig({
  ...BASE_CONFIG,
  resolve: {
    alias: {
      ...ALIAS,
    },
  },
  plugins: [react()],
})
