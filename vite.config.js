import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: './',  // 使用相对路径，这样本地和 GitHub Pages 都能正常工作
  assetsInclude: ['**/*.md']  // 允许导入 Markdown 文件
})
