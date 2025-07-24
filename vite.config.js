import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/Astrbot_Plugins_Market/',  // 添加正确的基础路径
})
