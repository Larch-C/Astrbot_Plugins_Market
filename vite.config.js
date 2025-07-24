import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/astrbot_plugins_market/',  // 添加正确的基础路径
})
