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
    <div class="search-box">
      <n-input
        :value="searchQuery"
        @update:value="(val) => $emit('update:searchQuery', val)"
        placeholder="搜索插件..."
        class="unified-input"
      >
        <template #prefix>
          <n-icon style="margin: 0 4px 0 12px"><search /></n-icon>
        </template>
      </n-input>
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
  background: rgba(255, 206, 0, 0.25);
  padding: 4px 8px;
  border-radius: 10px;
  font-size: 14px;
  color: #ffd700;
  font-weight: 500;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 206, 0, 0.4);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  margin-left: 5px;
  transform: translateY(-4px);
  vertical-align: middle;
}

.app-header h1 {
  margin: 0;
  color: var(--header-text-color);
  font-size: 2.75em;
  font-weight: 700;
  letter-spacing: -0.5px;
  transition: all 0.3s ease;
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
.search-box {
  display: flex;
  gap: 16px;
  max-width: 800px;
  margin: 0 auto 16px;
  padding: 20px;
  position: relative;
  z-index: 1;
  background: var(--search-bg);
  border-radius: 16px;
  border: 1px solid var(--input-border);
  transition: all 0.3s ease;
}

  /* 统一的输入框样式 - 完全移除所有边框和阴影 */
.unified-input :deep(.n-input-wrapper) {
  background-color: var(--input-bg) !important;
  border: none !important;
  border-radius: 12px !important;
  transition: all 0.3s ease !important;
  box-shadow: var(--shadow-sm) !important;
  height: 44px !important;
  padding: 0 !important;
  display: flex !important;
  align-items: center !important;
}

.unified-input :deep(.n-input-wrapper:hover) {
  background-color: var(--input-bg-hover) !important;
  border: none !important;
  box-shadow: var(--shadow-md) !important;
}

.unified-input :deep(.n-input-wrapper:focus-within) {
  background-color: var(--input-bg-focus) !important;
  border: none !important;
  box-shadow: var(--shadow-md), 0 0 0 3px rgba(96, 165, 250, 0.2) !important;
}

/* 确保Input组件也没有默认阴影 */
.unified-input :deep(.n-input) {
  --n-box-shadow-hover: none !important;
  --n-box-shadow-active: none !important;
  --n-box-shadow-focus: none !important;
}

/* 统一内部内容的垂直对齐 */
.unified-input :deep(.n-input__input-el) {
  line-height: 44px !important;
  height: 44px !important;
  display: flex !important;
  align-items: center !important;
  width: 100% !important;
  padding: 0 12px 0 0 !important;
  color: var(--input-text) !important;
  font-weight: 500;
  text-align: left !important;  
}

.unified-input :deep(.n-input__placeholder),
.unified-select :deep(.n-base-selection-placeholder) {
  color: var(--input-placeholder) !important;
  text-align: left !important;
}

/* 图标样式 */
.unified-input :deep(.n-input__prefix) {
  color: var(--input-text) !important;
  background: none !important;
  border: none !important;
}

/* 移除输入框的内部边框 */
.unified-input :deep(.n-input__border),
.unified-input :deep(.n-input__state-border) {
  border: none !important;
  box-shadow: none !important;
}

/* 分页样式 */
.top-pagination-wrapper {
  display: flex;
  justify-content: center;
  padding: 0 20px;
  margin-bottom: 20px;
}

:deep(.top-pagination-wrapper .n-pagination-item) {
  color: rgba(255, 255, 255, 0.85) !important;
  background-color: transparent !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  transition: all 0.3s ease !important;
}

:deep(.top-pagination-wrapper .n-pagination-item--active) {
  color: white !important;
  background-color: rgba(255, 255, 255, 0.2) !important;
  border-color: rgba(255, 255, 255, 0.4) !important;
  font-weight: 600;
}

:deep(.top-pagination-wrapper .n-pagination-item--clickable:hover) {
  color: white !important;
  background-color: rgba(255, 255, 255, 0.15) !important;
  border-color: rgba(255, 255, 255, 0.3) !important;
  transform: translateY(-1px);
}

:deep(.top-pagination-wrapper .n-pagination-prefix),
:deep(.top-pagination-wrapper .n-pagination-suffix) {
  color: rgba(255, 255, 255, 0.85) !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app-header {
    margin-bottom: 24px;
    padding: 20px 16px;
  }
  
  .app-header h1 {
    font-size: 2em;
    margin-bottom: 20px;
  }
  
  .search-box {
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    margin: 0 auto 16px;
  }
  
  .unified-input :deep(.n-input-wrapper),
  .unified-select :deep(.n-base-selection) {
    height: 40px !important;
    padding: 0 12px !important;
  }
}
</style>