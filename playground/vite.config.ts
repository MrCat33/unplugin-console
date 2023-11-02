import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import consolePlugin from 'unplugin-console/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    consolePlugin({
      include: [/\.ts/],
      exclude: [/\.test$/],
    })
  ],
})
