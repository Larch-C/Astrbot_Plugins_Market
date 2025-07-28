<template>
  <n-card class="plugin-card" :bordered="false" :style="{ borderRadius: '16px' }" :content-style="{ padding: '20px' }">
    <template #header>
      <div class="card-header">
        <div class="plugin-name-container" ref="nameContainer">
          <h3 
            class="plugin-name" 
            :class="{ 'marquee': isTextOverflow }"
            ref="pluginNameEl"
          >
            <span class="plugin-name-text" ref="nameTextEl">{{ plugin.name }}</span>
          </h3>
        </div>
        <n-tag type="success" size="small" :bordered="false" class="version-tag">
          {{ plugin.version.startsWith('v') ? plugin.version : 'v' + plugin.version }}
        </n-tag>
      </div>
    </template>
    <n-space vertical class="card-content">
      <p class="description">{{ plugin.desc }}</p>
      <div class="tags-container">
        <n-space class="tags-space">
          <n-tag
            v-for="tag in plugin.tags"
            :key="tag"
            size="small"
            :bordered="false"
            type="info"
            class="plugin-tag"
          >
            {{ tag }}
          </n-tag>
        </n-space>
      </div>
      <div class="plugin-meta">
        <span class="author">作者: {{ plugin.author }}</span>
        <n-space align="center" class="stars">
          <n-icon><star-sharp /></n-icon>
          <span>{{ plugin.stars }}</span>
        </n-space>
      </div>
      <!-- 优化后的按钮区域 -->
      <div class="plugin-links">
        <div class="button-group">
          <n-button
            type="primary"
            secondary
            size="small"
            @click="openUrl(plugin.repo)"
            class="main-button"
          >
            查看仓库
          </n-button>
          <div class="icon-buttons">
            <n-tooltip placement="top" trigger="hover">
              <template #trigger>
                <n-button
                  secondary
                  size="small"
                  circle
                  @click="copyRepoUrl"
                >
                  <n-icon size="18">
                    <link-outline />
                  </n-icon>
                </n-button>
              </template>
              复制仓库链接
            </n-tooltip>
            <n-tooltip v-if="plugin.social_link" placement="top" trigger="hover">
              <template #trigger>
                <n-button
                  secondary
                  size="small"
                  circle
                  @click="openUrl(plugin.social_link)"
                >
                  <n-icon size="18">
                    <person-outline />
                  </n-icon>
                </n-button>
              </template>
              访问作者主页
            </n-tooltip>
          </div>
        </div>
      </div>
    </n-space>
  </n-card>
</template>

<script setup>
import { ref, onMounted, nextTick, onUnmounted, watch } from 'vue'
import {
  NCard,
  NSpace,
  NTag,
  NButton,
  NIcon,
  useMessage,
  NTooltip
} from 'naive-ui'
import { StarSharp, LinkOutline, PersonOutline } from '@vicons/ionicons5'

const props = defineProps({
  plugin: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    default: 0
  }
})

const isTextOverflow = ref(false)
const nameContainer = ref(null)
const nameTextEl = ref(null)
const pluginNameEl = ref(null)
const resizeObserver = ref(null)

const checkTextOverflow = () => {
  nextTick(() => {
    if (nameContainer.value && nameTextEl.value) {
      const containerWidth = nameContainer.value.clientWidth
      const textWidth = nameTextEl.value.scrollWidth
      const wasOverflow = isTextOverflow.value
      
      isTextOverflow.value = textWidth > containerWidth
      
      // 如果溢出状态改变，更新CSS变量
      if (isTextOverflow.value && (wasOverflow !== isTextOverflow.value)) {
        updateMarqueeAnimation(containerWidth, textWidth)
      }
    }
  })
}

const updateMarqueeAnimation = (containerWidth, textWidth) => {
  if (pluginNameEl.value) {
    const translateDistance = textWidth - containerWidth + 20 // 额外20px的缓冲
    pluginNameEl.value.style.setProperty('--translate-distance', `-${translateDistance}px`)
  }
}

onMounted(() => {
  checkTextOverflow()
  
  // 使用ResizeObserver监听容器大小变化，比window resize更精确
  if (nameContainer.value && window.ResizeObserver) {
    resizeObserver.value = new ResizeObserver(() => {
      checkTextOverflow()
    })
    resizeObserver.value.observe(nameContainer.value)
  } else {
    // 降级方案：使用window resize
    window.addEventListener('resize', checkTextOverflow)
  }
})

watch(() => props.index, (newIndex) => {
  if (pluginNameEl.value) {
    // 先移除动画
    pluginNameEl.value.style.animation = 'none'
    // 更新 index
    pluginNameEl.value.style.setProperty('--card-index', newIndex.toString())
    // 强制重排
    pluginNameEl.value.offsetHeight
    // 重新应用动画
    pluginNameEl.value.style.animation = ''
  }
}, { immediate: true })

onUnmounted(() => {
  if (resizeObserver.value) {
    resizeObserver.value.disconnect()
  } else {
    window.removeEventListener('resize', checkTextOverflow)
  }
})

const message = useMessage()

const openUrl = (url) => {
  if (url) {
    window.open(url, '_blank')
  }
}

const copyRepoUrl = async () => {
  if (props.plugin.repo) {
    try {
      await navigator.clipboard.writeText(props.plugin.repo)
      message.success('仓库链接已复制到剪贴板')
    } catch (err) {
      message.error('复制失败，请手动复制')
    }
  }
}
</script>

<style scoped>
@keyframes cardAppear {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.plugin-card {
  position: relative;
  overflow: visible;
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  border: 3px solid var(--border-base);
  box-shadow: var(--shadow-sm);
  background-color: var(--bg-card);
  height: 495px;
  display: flex;
  flex-direction: column;
  min-width: 100%;
  animation: cardAppear 0.5s cubic-bezier(0.23, 1, 0.32, 1) backwards;
  /* 在 header 动画进行到一半时开始加载卡片，每个卡片间隔 0.08s */
  animation-delay: calc(0.4s + (var(--card-index, 0) * 0.08s));
}

.plugin-card:hover {
  transform: translateY(-4px);
  border-color: var(--border-hover);
  box-shadow: var(--shadow-md);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--border-base);
  background: var(--bg-card);
  border-radius: 15px 15px 0 0;
  min-height: 70px;
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

.plugin-name-container {
  max-width: 70%;
  overflow: hidden;
  position: relative;
}

/* 只有在需要走马灯时才添加边缘过渡效果 */
.plugin-name-container:has(.plugin-name.marquee) {
  mask: linear-gradient(to right, 
    transparent 0%, 
    black 10px, 
    black calc(100% - 10px), 
    transparent 100%);
  -webkit-mask: linear-gradient(to right, 
    transparent 0%, 
    black 10px, 
    black calc(100% - 10px), 
    transparent 100%);
}

.card-header h3 {
  margin: 0;
  font-size: 1.25em;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.3px;
  font-family: 'Lexend', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  white-space: nowrap;
  --translate-distance: 0px;
}

.plugin-name-text {
  display: inline-block;
  transition: transform 0.3s ease;
}

.plugin-name.marquee .plugin-name-text {
  animation: marqueeSlide 6s ease-in-out infinite;
}

.plugin-name.marquee:hover .plugin-name-text {
  animation-play-state: paused;
}

/* 优化后的走马灯动画 */
@keyframes marqueeSlide {
  0% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(var(--translate-distance));
  }
  70% {
    transform: translateX(var(--translate-distance));
  }
  100% {
    transform: translateX(0);
  }
}

/* 媒体查询优化不同屏幕尺寸 */
@media (max-width: 768px) {
  .plugin-name-container {
    max-width: 65%;
  }
  
  @keyframes marqueeSlide {
    0% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(0);
    }
    50% {
      transform: translateX(var(--translate-distance));
    }
    75% {
      transform: translateX(var(--translate-distance));
    }
    100% {
      transform: translateX(0);
    }
  }
}

@media (max-width: 480px) {
  .plugin-name-container {
    max-width: 60%;
  }
  
  .card-header h3 {
    font-size: 1.1em;
  }
}

.version-tag {
  background-color: var(--bg-n-tag) !important;
  color: var(--text-n-tag) !important;
  border: none !important;
  padding: 2px 10px !important;
  font-weight: 600;
  flex-shrink: 0;
}

.card-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 280px;
}

.description {
  margin: 12px 0;
  line-height: 1.7;
  font-size: 0.95em;
  height: 5.1em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  text-overflow: ellipsis;
  color: var(--text-secondary);
}

.tags-container {
  margin: 12px 0;
  min-height: 40px;
  display: flex;
  align-items: flex-start;
}

.tags-space {
  width: 100%;
  flex-wrap: wrap;
}

.plugin-tag {
  transition: all 0.2s ease;
  margin-bottom: 4px;
  background-color: var(--primary-color) !important;
  color: var(--text-tag) !important;
  border: none !important;
  padding: 2px 10px !important;
}

.plugin-tag:hover {
  transform: scale(1.05);
  opacity: 0.9;
}

.plugin-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9em;
  padding: 12px 0;
  margin: 0px 0;
  border-top: 1px solid var(--border-base);
  color: var(--text-tertiary);
  min-height: 50px;
}

.author {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  color: var(--text-secondary);
}

.stars {
  color: var(--primary-color);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* 优化后的按钮区域样式 */
.plugin-links {
  margin-top: 8px;
  min-height: 40px;
  display: flex;
}

.button-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
}

.button-group :deep(.main-button) {
  border-radius: 8px;
  height: 32px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-buttons :deep(.n-button) {
  width: 32px;
  height: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  background-color: var(--bg-hover);
  border: 1px solid var(--border-base);
  transition: all 0.2s ease;
  border-radius: 8px;
}

.icon-buttons :deep(.n-button:hover) {
  color: var(--primary-color);
  border-color: var(--primary-color);
  background-color: var(--primary-light);
  transform: translateY(-1px);
}

/* 响应式按钮布局 */
@media (max-width: 480px) {
  .button-group :deep(.n-button) {
    font-size: 0.9em;
    height: 28px;
  }
  
  .button-group :deep(.main-button) {
    padding: 0 12px;
  }
  
  .icon-buttons :deep(.n-button) {
    width: 28px;
    height: 28px;
  }
  
  .icon-buttons :deep(.n-button .n-icon) {
    font-size: 16px;
  }
}

:deep(.n-card) {
  height: 100%;
}

:deep(.n-card__content) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.tags-container:empty::before {
  content: '';
  display: block;
  height: 40px;
}

/* 添加预加载动画优化 */
.plugin-name-text {
  will-change: transform;
}

/* 减少动画时的性能消耗 */
.plugin-name.marquee .plugin-name-text {
  backface-visibility: hidden;
  perspective: 1000px;
}
</style>