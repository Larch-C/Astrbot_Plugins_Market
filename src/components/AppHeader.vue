<template>
  <header class="app-header">
    <n-space justify="end" style="padding: 16px">
      <n-switch 
        :value="modelValue" 
        @update:value="handleThemeChange"
        :rail-style="railStyle"
      >
        <template #checked>
          <n-icon><moon-sharp /></n-icon>
        </template>
        <template #unchecked>
          <n-icon><sunny-sharp /></n-icon>
        </template>
      </n-switch>
    </n-space>
    <div class="header-title">
      <img src="/logo.png" alt="Astrbot Logo" class="header-logo">
      <div class="title-wrapper">
        <h1>Astrbot 插件市场 <span class="third-party-tag">第三方</span></h1>
      </div>
    </div>
    <div class="search-container">
      <div class="custom-search-box">
        <n-icon class="search-icon"><search /></n-icon>
        <input
          :value="searchQuery"
          @input="(e) => $emit('update:searchQuery', e.target.value)"
          placeholder="搜索插件"
          class="search-input"
        />
      </div>
    </div>
    <div class="top-pagination-wrapper" v-if="totalPages > 1">
      <n-pagination
        :page="currentPage"
        @update:page="(page) => $emit('update:currentPage', page)"
        :page-count="totalPages"
        :on-update:page="onPageChange"
        size="small"
      />
    </div>
  </header>
</template>

<script setup>
import { computed, onMounted, nextTick } from 'vue'
import { NSpace, NSwitch, NInput, NPagination, NIcon } from 'naive-ui'
import { Search, MoonSharp, SunnySharp } from '@vicons/ionicons5'

const props = defineProps({
  modelValue: Boolean,
  searchQuery: String,
  currentPage: Number,
  totalPages: Number
})

const emit = defineEmits(['update:modelValue', 'update:searchQuery', 'update:currentPage'])

const handleThemeChange = (value) => {
  emit('update:modelValue', value)
  // 延迟执行样式更新
  nextTick(() => {
    setTimeout(updateDropdownStyles, 50)
  })
}

const railStyle = ({ focused, checked }) => {
  const style = {}
  if (checked) {
    style.background = '#1e293b'
  } else {
    style.background = '#60a5fa'
  }
  if (focused) {
    style.boxShadow = '0 0 0 2px rgba(96, 165, 250, 0.3)'
  }
  return style
}

const onPageChange = (page) => {
  emit('update:currentPage', page)
  window.scrollTo({ top: 0, behavior: 'instant' })
}

// 动态更新下拉菜单样式
const updateDropdownStyles = () => {
  const dropdowns = document.querySelectorAll('.n-base-select-menu')
  
  dropdowns.forEach(dropdown => {
    // 设置下拉菜单背景和边框
    dropdown.style.setProperty('background-color', 'var(--dropdown-bg)', 'important')
    dropdown.style.setProperty('border-color', 'var(--dropdown-border)', 'important')
    dropdown.style.setProperty('box-shadow', 'var(--shadow-lg)', 'important')
    
    // 设置选项文字颜色
    const options = dropdown.querySelectorAll('.n-base-select-option')
    options.forEach(option => {
      const content = option.querySelector('.n-base-select-option__content')
      if (content) {
        content.style.setProperty('color', 'var(--dropdown-text)', 'important')
      }
    })
    
    // 设置悬停状态
    const hoverOptions = dropdown.querySelectorAll('.n-base-select-option:hover')
    hoverOptions.forEach(option => {
      option.style.setProperty('background-color', 'var(--bg-hover)', 'important')
      const content = option.querySelector('.n-base-select-option__content')
      if (content) {
        content.style.setProperty('color', 'var(--primary-color)', 'important')
      }
    })
    
    // 设置选中项样式
    const selectedOptions = dropdown.querySelectorAll('.n-base-select-option--selected')
    selectedOptions.forEach(option => {
      option.style.setProperty('background-color', 'var(--primary-light)', 'important')
      const content = option.querySelector('.n-base-select-option__content')
      if (content) {
        content.style.setProperty('color', 'var(--primary-color)', 'important')
      }
    })
  })
}

onMounted(() => {
  const observer = new MutationObserver(() => {
    updateDropdownStyles()
  })
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
})
</script>

<style scoped>
.app-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 32px 20px;
  background: var(--header-gradient);
  border-radius: 0 0 32px 32px;
  box-shadow: var(--shadow-lg);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.app-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--header-overlay);
  pointer-events: none;
}

.header-title {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 35px;
  gap: 16px;
}

.header-logo {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.title-wrapper {
  display: flex;
  align-items: center;
  height: 48px;  /* 与 logo 高度一致 */
}

.third-party-tag {
  display: inline-block;
  background: var(--primary-color);
  padding: 4px 8px;
  border-radius: 10px;
  font-size: 14px;
  color: var(--text-tag);
  font-weight: 600;
  text-shadow: none;
  margin-left: 5px;
  transform: translateY(-4px);
  vertical-align: middle;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

@font-face {
  font-family: 'Lexend';
  src: url('/font/lexend.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Lexend';
  src: url('/font/lexend-v25-latin-600.woff2') format('woff2');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

.app-header h1 {
  margin: 0;
  color: var(--header-text-color);
  font-size: 2.75em;
  font-weight: 600;
  letter-spacing: -0.5px;
  transition: all 0.3s ease;
  font-family: 'Lexend', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 主题切换按钮样式 */
:deep(.n-switch) {
  --n-button-color: #fff;
  --n-button-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  --n-loading-color: var(--primary-color);
  width: 50px !important;
  height: 24px !important;
}

:deep(.n-switch .n-switch__rail) {
  height: 24px !important;
}

:deep(.n-switch .n-switch__button) {
  height: 20px !important;
  width: 20px !important;
  top: 2px !important;
}

:deep(.n-switch .n-switch__button-icon) {
  font-size: 14px;
  color: var(--primary-color);
}

/* 搜索框容器 */
.search-container {
  display: flex;
  justify-content: center;
  max-width: 800px;
  margin: 0 auto 16px;
  position: relative;
  z-index: 1;
}

/* 自定义搜索框 - 简洁的单层结构 */
.custom-search-box {
  display: flex;
  align-items: center;
  width: 100%;
  height: 44px;
  background: var(--input-bg);
  border: 0px solid var(--input-border);
  border-radius: 30px;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  overflow: hidden;
  padding: 0 16px;
  gap: 12px;
}

.custom-search-box:hover {
  background: var(--input-bg-hover);
  border-color: var(--input-border-hover, var(--input-border));
  box-shadow: var(--shadow-md);
}

.custom-search-box:focus-within {
  background: var(--input-bg-focus);
  border-color: var(--primary-color);
  box-shadow: var(--shadow-md), 0 0 0 3px rgba(96, 165, 250, 0.2);
}

/* 搜索图标 */
.search-icon {
  color: var(--input-text);
  font-size: 18px;
  flex-shrink: 0;
  opacity: 0.7;
}

.custom-search-box:focus-within .search-icon {
  color: var(--primary-color);
  opacity: 1;
}

/* 搜索输入框 */
.search-input {
  flex: 1;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: var(--input-text);
  font-size: 16px;
  font-weight: 500;
  padding: 0;
  margin: 0;
}

.search-input::placeholder {
  color: var(--input-placeholder);
  font-weight: 400;
}

/* 顶部分页样式 */
.top-pagination-wrapper {
  display: flex;
  justify-content: center;
  padding: 0 20px;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}

:deep(.top-pagination-wrapper .n-pagination) {
  gap: 4px;
}

:deep(.top-pagination-wrapper .n-pagination-item) {
  color: rgba(255, 255, 255, 0.85) !important;
  background-color: rgba(255, 255, 255, 0.08) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  transition: all 0.3s ease !important;
  backdrop-filter: blur(8px);
  min-width: 32px;
  height: 32px;
  border-radius: 6px;
  font-weight: 500;
}

:deep(.top-pagination-wrapper .n-pagination-item--active) {
  color: white !important;
  background-color: rgba(255, 255, 255, 0.25) !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
  font-weight: 600;
  box-shadow: 0 2px 12px rgba(255, 255, 255, 0.2);
}

:deep(.top-pagination-wrapper .n-pagination-item--clickable:hover) {
  color: white !important;
  background-color: rgba(255, 255, 255, 0.18) !important;
  border-color: rgba(255, 255, 255, 0.4) !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(255, 255, 255, 0.15);
}

:deep(.top-pagination-wrapper .n-pagination-prefix),
:deep(.top-pagination-wrapper .n-pagination-suffix) {
  color: rgba(255, 255, 255, 0.85) !important;
  font-size: 14px;
  margin: 0 8px;
}

/* ===== 响应式设计优化 ===== */

/* 平板设备 (768px - 1024px) */
@media (max-width: 1024px) and (min-width: 769px) {
  .app-header {
    padding: 28px 18px;
  }
  
  .app-header h1 {
    font-size: 2.4em;
  }
  
  .header-title {
    gap: 14px;
  }
  
  .header-logo {
    width: 44px;
    height: 44px;
  }
  
  .title-wrapper {
    height: 44px;
  }
  
  /* 顶部分页器平板优化 */
  .top-pagination-wrapper {
    padding: 0 16px;
  }
  
  :deep(.top-pagination-wrapper .n-pagination-item) {
    min-width: 30px;
    height: 30px;
    font-size: 13px;
  }
}

/* 手机设备 (最大 768px) */
@media (max-width: 768px) {
  .app-header {
    margin-bottom: 24px;
    padding: 20px 16px;
    border-radius: 0 0 24px 24px;
  }
  
  /* 标题区域优化 */
  .header-title {
    flex-direction: column;
    gap: 12px;
    margin-bottom: 24px;
  }
  
  .header-logo {
    width: 40px;
    height: 40px;
    order: -1; /* logo 在上方 */
  }
  
  .title-wrapper {
    height: auto;
    text-align: center;
  }
  
  .app-header h1 {
    font-size: 1.8em;
    line-height: 1.3;
    letter-spacing: -0.3px;
  }
  
  .third-party-tag {
    font-size: 12px;
    padding: 3px 6px;
    margin-left: 3px;
    transform: translateY(-2px);
  }
  
  /* 搜索框优化 */
  .search-container {
    padding: 0 8px;
    margin-bottom: 12px;
  }
  
  .custom-search-box {
    height: 40px;
    padding: 0 14px;
    gap: 10px;
  }
  
  .search-icon {
    font-size: 16px;
  }
  
  .search-input {
    font-size: 15px;
  }
  
  /* 分页优化 */
  .top-pagination-wrapper {
    padding: 0 12px;
    margin-bottom: 16px;
  }
  
  :deep(.top-pagination-wrapper .n-pagination) {
    gap: 6px;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  :deep(.top-pagination-wrapper .n-pagination-item) {
    min-width: 36px !important;
    height: 36px !important;
    font-size: 14px !important;
    border-radius: 8px !important;
    /* 增强在深色背景下的可见性 */
    background-color: rgba(255, 255, 255, 0.12) !important;
    backdrop-filter: blur(12px) !important;
  }
  
  :deep(.top-pagination-wrapper .n-pagination-item--active) {
    background-color: rgba(255, 255, 255, 0.3) !important;
    border-color: rgba(255, 255, 255, 0.6) !important;
    box-shadow: 0 2px 16px rgba(255, 255, 255, 0.25) !important;
  }
  
  :deep(.top-pagination-wrapper .n-pagination-item--button) {
    padding: 0 8px !important;
    font-weight: 600 !important;
  }
  
  /* 页码信息在小屏幕下调整 */
  :deep(.top-pagination-wrapper .n-pagination-prefix),
  :deep(.top-pagination-wrapper .n-pagination-suffix) {
    font-size: 12px !important;
    margin: 0 4px !important;
    order: 10;
    width: 100%;
    text-align: center;
    margin-top: 8px !important;
    opacity: 0.9;
    background: rgba(255, 255, 255, 0.1);
    padding: 4px 8px;
    border-radius: 12px;
    backdrop-filter: blur(8px);
  }
  
  /* 主题切换按钮优化 */
  :deep(.n-switch) {
    width: 46px !important;
    height: 22px !important;
  }
  
  :deep(.n-switch .n-switch__rail) {
    height: 22px !important;
  }
  
  :deep(.n-switch .n-switch__button) {
    height: 18px !important;
    width: 18px !important;
    top: 2px !important;
  }
  
  :deep(.n-switch .n-switch__button-icon) {
    font-size: 12px;
  }
}

/* 小屏手机设备 (最大 480px) */
@media (max-width: 480px) {
  .app-header {
    padding: 16px 12px;
    border-radius: 0 0 20px 20px;
  }
  
  .app-header h1 {
    font-size: 1.6em;
    word-break: keep-all; /* 防止中文换行 */
  }
  
  .header-logo {
    width: 36px;
    height: 36px;
  }
  
  .third-party-tag {
    font-size: 11px;
    padding: 2px 5px;
    border-radius: 8px;
  }
  
  .search-container {
    padding: 0 4px;
  }
  
  .custom-search-box {
    height: 38px;
    padding: 0 12px;
    border-radius: 25px;
  }
  
  .search-input {
    font-size: 14px;
  }
  
  /* 分页在小屏幕上的特殊处理 */
  :deep(.top-pagination-wrapper .n-pagination) {
    transform: scale(0.9);
    transform-origin: center;
  }
}

/* 超小屏幕设备 (最大 360px) */
@media (max-width: 360px) {
  .app-header {
    padding: 14px 10px;
  }
  
  .app-header h1 {
    font-size: 1.4em;
  }
  
  .header-logo {
    width: 32px;
    height: 32px;
  }
  
  .custom-search-box {
    height: 36px;
    padding: 0 10px;
    gap: 8px;
  }
  
  .search-icon {
    font-size: 15px;
  }
  
  .search-input {
    font-size: 13px;
  }
  
  /* 进一步缩小顶部分页 */
  :deep(.top-pagination-wrapper .n-pagination) {
    transform: scale(0.85);
    transform-origin: center;
  }
  
  :deep(.top-pagination-wrapper .n-pagination-item) {
    min-width: 32px !important;
    height: 32px !important;
    font-size: 12px !important;
  }
}

/* 横屏模式优化 (高度较小的设备) */
@media (max-height: 500px) and (orientation: landscape) {
  .app-header {
    padding: 12px 16px;
    margin-bottom: 16px;
  }
  
  .header-title {
    margin-bottom: 16px;
    gap: 8px;
  }
  
  .app-header h1 {
    font-size: 1.5em;
  }
  
  .header-logo {
    width: 32px;
    height: 32px;
  }
  
  .custom-search-box {
    height: 36px;
  }
}

/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
  .custom-search-box {
    /* 移除hover效果，避免在触摸设备上的问题 */
  }
  
  .custom-search-box:hover {
    background: var(--input-bg);
    border-color: var(--input-border);
    box-shadow: var(--shadow-sm);
  }
  
  /* 增加触摸目标大小 */
  :deep(.n-switch) {
    min-width: 50px !important;
    min-height: 30px !important;
  }
  
  /* 顶部分页器触摸优化 */
  :deep(.top-pagination-wrapper .n-pagination-item) {
    min-width: 40px !important;
    min-height: 40px !important;
  }
  
  :deep(.top-pagination-wrapper .n-pagination-item--clickable:hover) {
    transform: none !important;
    box-shadow: 0 2px 12px rgba(255, 255, 255, 0.2) !important;
  }
  
  :deep(.top-pagination-wrapper .n-pagination-item--clickable:active) {
    transform: scale(0.95) !important;
    background-color: rgba(255, 255, 255, 0.2) !important;
  }
}

/* 高分辨率屏幕优化 */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .header-logo {
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
  }
  
  .custom-search-box {
    /* 在高分辨率屏幕上使用更精细的边框 */
    border-width: 0.5px;
  }
}
</style>