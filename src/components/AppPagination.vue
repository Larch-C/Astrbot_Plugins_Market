<template>
  <footer class="pagination-wrapper" v-if="totalPages > 1">
    <div class="pagination-container">
      <n-pagination
        :page="modelValue"
        :page-count="totalPages"
        @update:page="handlePageChange"
        :size="size"
        :show-size-picker="false"
        :show-quick-jumper="showQuickJumper"
        :page-slot="pageSlot"
      />
    </div>
  </footer>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { NPagination } from 'naive-ui'

const props = defineProps({
  modelValue: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  size: {
    type: String,
    default: 'medium'
  }
})

const emit = defineEmits(['update:modelValue'])

// 响应式状态
const screenWidth = ref(window.innerWidth)

// 计算属性
const showQuickJumper = computed(() => {
  return screenWidth.value > 768 && props.totalPages > 10
})

const pageSlot = computed(() => {
  if (screenWidth.value <= 480) {
    return 3 // 超小屏幕只显示3个页码
  } else if (screenWidth.value <= 768) {
    return 5 // 小屏幕显示5个页码
  } else {
    return 7 // 桌面端显示7个页码
  }
})

// 处理分页变化
const handlePageChange = (page) => {
  emit('update:modelValue', page)
}

// 监听屏幕尺寸变化
const handleResize = () => {
  screenWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin: 2rem auto;
  padding: 0;
  position: relative;
}

.pagination-container {
  display: flex;
  justify-content: center;
  padding: 12px 20px;
  position: relative;
  z-index: 1;
  border-radius: 50px;
  background: var(--pagination-bg, rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(10px);
  width: fit-content;
  min-width: 300px;
  box-shadow: var(--shadow-sm);
}

/* 基础分页样式 */
:deep(.n-pagination) {
  gap: 4px;
}

:deep(.n-pagination .n-pagination-item) {
  color: var(--pagination-text, rgba(0, 0, 0, 0.85)) !important;
  background: var(--pagination-item-bg, rgba(255, 255, 255, 0.08)) !important;
  border: none !important;
  transition: all 0.3s ease !important;
  backdrop-filter: blur(8px);
  min-width: 32px;
  height: 32px;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease !important;
  min-width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
}

:deep(.n-pagination .n-pagination-item--clickable:hover) {
  color: var(--primary-color) !important;
  background-color: var(--primary-light) !important;
  border-color: var(--primary-color) !important;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

:deep(.n-pagination .n-pagination-item--active) {
  color: white !important;
  background-color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
  font-weight: 600 !important;
  box-shadow: 0 2px 12px rgba(96, 165, 250, 0.3);
}

:deep(.n-pagination .n-pagination-prefix),
:deep(.n-pagination .n-pagination-suffix) {
  color: var(--text-secondary) !important;
  margin: 0 8px;
  font-size: 14px;
}

/* 快速跳转输入框样式 */
:deep(.n-pagination .n-pagination-quick-jumper) {
  margin-left: 16px;
}

:deep(.n-pagination .n-pagination-quick-jumper .n-input) {
  width: 60px !important;
}

:deep(.n-pagination .n-pagination-quick-jumper .n-input .n-input__input-el) {
  text-align: center;
  font-size: 13px !important;
}

/* ===== 响应式优化 ===== */

/* 平板设备 (768px - 1024px) */
@media (max-width: 1024px) and (min-width: 769px) {
  .pagination-wrapper {
    margin: 1.5rem 0;
    padding: 0.75rem 0;
  }
  
  :deep(.n-pagination) {
    --n-item-size: 30px;
    --n-item-font-size: 13px;
    --n-item-padding: 0 12px;
  }
  
  :deep(.n-pagination .n-pagination-item) {
    min-width: 30px;
    height: 30px;
  }
}

/* 手机设备 (最大 768px) */
@media (max-width: 768px) {
  .pagination-wrapper {
    margin: 1.25rem 0;
    padding: 0.5rem 12px;
    /* 添加轻微的背景以提高可见性 */
    background: var(--bg-secondary, rgba(0, 0, 0, 0.02));
    border-radius: 12px;
  }
  
  :deep(.n-pagination) {
    --n-item-size: 36px;
    --n-item-font-size: 14px;
    --n-item-padding: 0 10px;
    gap: 6px;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  :deep(.n-pagination .n-pagination-item) {
    min-width: 36px;
    height: 36px;
    /* 增加触摸目标大小 */
    min-height: 36px;
    border-radius: 8px;
  }
  
  /* 前进后退按钮优化 */
  :deep(.n-pagination .n-pagination-item--button) {
    padding: 0 8px !important;
    font-weight: 600;
  }
  
  /* 省略号样式 */
  :deep(.n-pagination .n-pagination-item--disabled) {
    background-color: transparent !important;
    border-color: transparent !important;
    color: var(--text-tertiary) !important;
  }
  
  /* 隐藏快速跳转 */
  :deep(.n-pagination .n-pagination-quick-jumper) {
    display: none;
  }
  
  /* 信息文字调整 */
  :deep(.n-pagination .n-pagination-prefix),
  :deep(.n-pagination .n-pagination-suffix) {
    font-size: 12px;
    margin: 0 4px;
    order: 10; /* 移到最后 */
    width: 100%;
    text-align: center;
    margin-top: 8px;
    opacity: 0.8;
  }
}

/* 小屏手机设备 (最大 480px) */
@media (max-width: 480px) {
  .pagination-wrapper {
    margin: 1rem 0;
    padding: 0.5rem 8px;
  }
  
  :deep(.n-pagination) {
    --n-item-size: 34px;
    --n-item-font-size: 13px;
    gap: 4px;
  }
  
  :deep(.n-pagination .n-pagination-item) {
    min-width: 34px;
    height: 34px;
    min-height: 34px;
  }
  
  /* 进一步简化显示 */
  :deep(.n-pagination .n-pagination-prefix),
  :deep(.n-pagination .n-pagination-suffix) {
    display: none; /* 隐藏页码信息 */
  }
  
  /* 当页数过多时的特殊处理 */
  :deep(.n-pagination .n-pagination-item--button:first-child) {
    margin-right: 8px;
  }
  
  :deep(.n-pagination .n-pagination-item--button:last-child) {
    margin-left: 8px;
  }
}

/* 超小屏幕设备 (最大 360px) */
@media (max-width: 360px) {
  .pagination-wrapper {
    margin: 0.75rem 0;
    padding: 0.5rem 4px;
  }
  
  :deep(.n-pagination) {
    --n-item-size: 32px;
    --n-item-font-size: 12px;
    gap: 3px;
  }
  
  :deep(.n-pagination .n-pagination-item) {
    min-width: 32px;
    height: 32px;
    min-height: 32px;
    padding: 0 6px !important;
  }
  
  /* 超小屏幕下的紧凑布局 */
  :deep(.n-pagination .n-pagination-item--button) {
    padding: 0 6px !important;
  }
}

/* 横屏模式优化 */
@media (max-height: 500px) and (orientation: landscape) {
  .pagination-wrapper {
    margin: 0.5rem 0;
    padding: 0.25rem 0;
  }
  
  :deep(.n-pagination) {
    --n-item-size: 28px;
    --n-item-font-size: 12px;
  }
  
  :deep(.n-pagination .n-pagination-item) {
    min-width: 28px;
    height: 28px;
  }
}

/* 触摸设备专门优化 */
@media (hover: none) and (pointer: coarse) {
  :deep(.n-pagination .n-pagination-item) {
    /* 确保触摸目标足够大 */
    min-width: 40px;
    min-height: 40px;
  }
  
  :deep(.n-pagination .n-pagination-item--clickable:hover) {
    /* 移除hover效果避免触摸设备的问题 */
    transform: none;
    box-shadow: none;
  }
  
  /* 添加点击反馈 */
  :deep(.n-pagination .n-pagination-item--clickable:active) {
    transform: scale(0.95);
    background-color: var(--primary-light) !important;
  }
}

/* 高分辨率屏幕优化 */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  :deep(.n-pagination .n-pagination-item) {
    border-width: 0.5px;
  }
  
  :deep(.n-pagination .n-pagination-item--active) {
    box-shadow: 0 1px 6px rgba(96, 165, 250, 0.4);
  }
}

/* 无障碍优化 */
@media (prefers-reduced-motion: reduce) {
  :deep(.n-pagination .n-pagination-item) {
    transition: none !important;
  }
  
  :deep(.n-pagination .n-pagination-item--clickable:hover) {
    transform: none;
  }
}

/* 深色模式特殊处理（如果需要） */
@media (prefers-color-scheme: dark) {
  .pagination-wrapper {
    background: var(--bg-secondary, rgba(255, 255, 255, 0.05));
  }
  
  :deep(.n-pagination .n-pagination-item--active) {
    box-shadow: 0 2px 12px rgba(96, 165, 250, 0.4);
  }
}
</style>