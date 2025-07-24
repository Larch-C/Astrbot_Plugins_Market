<template>
  <n-card class="plugin-card" :bordered="false" :style="{ borderRadius: '16px' }" :content-style="{ padding: '20px' }">
    <template #header>
      <div class="card-header">
        <h3 class="plugin-name">{{ plugin.name }}</h3>
        <n-tag type="success" size="small">
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
      <n-space justify="space-between" class="plugin-links">
        <n-button
          type="primary"
          secondary
          @click="openUrl(plugin.repo)"
          :style="{ borderRadius: '8px' }"
        >
          查看仓库
        </n-button>
        <n-button
          v-if="plugin.social_link"
          @click="openUrl(plugin.social_link)"
          :style="{ borderRadius: '8px' }"
        >
          作者主页
        </n-button>
      </n-space>
    </n-space>
  </n-card>
</template>

<script setup>
import {
  NCard,
  NSpace,
  NTag,
  NButton,
  NIcon,
} from 'naive-ui'
import { StarSharp } from '@vicons/ionicons5'

defineProps({
  plugin: {
    type: Object,
    required: true
  }
})

const openUrl = (url) => {
  if (url) {
    window.open(url, '_blank')
  }
}
</script>

<style scoped>
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
  min-height: 70px; /* 固定头部高度 */
}

.card-header h3 {
  margin: 0;
  font-size: 1.25em;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 70%;
  color: var(--text-primary);
  letter-spacing: -0.3px;
}

.card-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 280px; /* 固定内容区域最小高度 */
}

.description {
  margin: 12px 0;
  line-height: 1.7;
  font-size: 0.95em;
  height: 5.1em; /* 固定描述高度 - 3行文本 */
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
  min-height: 40px; /* 固定标签区域高度 */
  display: flex;
  align-items: flex-start;
}

.tags-space {
  width: 100%;
  flex-wrap: wrap;
}

.plugin-tag {
  transition: transform 0.2s ease;
  margin-bottom: 4px; /* 标签换行时的间距 */
}

.plugin-tag:hover {
  transform: scale(1.05);
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
  min-height: 50px; /* 固定元信息高度 */
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

.plugin-links {
  margin-top: 8px; /* 减小顶部间距但保持按钮在底部 */
  min-height: 40px; /* 固定按钮区域高度 */
  display: flex;
  align-items: center;
}

/* 确保父容器网格布局中卡片等高 */
:deep(.n-card) {
  height: 100%;
}

:deep(.n-card__content) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 针对没有标签的情况，确保标签区域仍占位 */
.tags-container:empty::before {
  content: '';
  display: block;
  height: 40px;
}

/* 针对没有社交链接按钮的情况，确保按钮区域对齐 */
.plugin-links :deep(.n-space-item:only-child) {
  margin-right: auto;
}
</style>