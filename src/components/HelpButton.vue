<template>
  <div class="float-button-wrapper">
    <transition name="float-button-fade">
      <div class="help-button-container">
        <div class="help-text-container">
          <div class="help-text" :class="{ 'help-text--show': showHelpText }">
            安装插件遇到问题？来看看我吧！
          </div>
        </div>
        <div 
          class="float-button help-button"
          @click="toggleHelp"
          role="button"
          aria-label="帮助"
        >
          <div class="float-button__inner help-button__inner">
            <n-icon size="22" class="float-button__icon">
              <help-circle />
            </n-icon>
            <div class="float-button__ripple"></div>
          </div>
        </div>
      </div>
    </transition>

    <n-modal 
      v-model:show="showHelp" 
      :mask-closable="true" 
      preset="card" 
      class="help-modal"
      :class="{ 'help-modal--mobile': isMobile }"
      :style="modalStyle"
      transform-origin="center"
    >
      <n-card :bordered="false" size="huge" role="dialog" aria-label="帮助信息" class="help-card">
        <template #header>
          <div class="help-modal__header">
            <n-h2 class="help-modal__title">
              <n-icon size="24" class="help-modal__icon">
                <help-circle />
              </n-icon>
              {{ helpContent.title }}
            </n-h2>
          </div>
        </template>
        <n-space vertical size="large" class="help-modal__content">
          <div 
            v-for="(section, index) in helpContent.sections" 
            :key="index" 
            class="help-section"
          >
            <div class="help-section__header">
              <n-h3>{{ section.title }}</n-h3>
            </div>
            <div class="markdown-content" v-html="marked(section.content)"></div>
          </div>
        </n-space>
        <template #footer>
          <div class="help-modal__footer">
            <div class="help-modal__footer-content">
              <div class="panel-link">
                <n-text depth="3">AstrBot 面板地址：</n-text>
                <div class="panel-input-group">
                  <n-input
                    v-model:value="panelUrl"
                    type="text"
                    placeholder="例如：demo.astrbot.app"
                    class="panel-input"
                  />
                  <n-button
                    secondary
                    type="primary"
                    @click="openPanelUrl"
                    :disabled="!panelUrl"
                  >
                    <template #icon>
                      <n-icon><open-outline /></n-icon>
                    </template>
                    打开面板
                  </n-button>
                </div>
              </div>
              <n-button
                type="primary"
                @click="showHelp = false"
                class="help-modal__close-btn"
              >
                我知道了
              </n-button>
            </div>
          </div>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { NIcon, NModal, NCard, NSpace, NH2, NH3, NText, NButton, NInput } from 'naive-ui'
import { HelpCircle, OpenOutline } from '@vicons/ionicons5'
import { helpContent } from '../config/helpContent'
import { marked } from 'marked'

// 检测是否为移动设备
const isMobile = ref(window.innerWidth <= 768)
window.addEventListener('resize', () => {
  isMobile.value = window.innerWidth <= 768
})

// 计算模态框样式
const modalStyle = computed(() => {
  if (isMobile.value) {
    return {
      width: '100%',
      maxWidth: 'none'
    }
  }
  return {
    width: '90%',
    maxWidth: '600px'
  }
})

// 配置 marked
marked.setOptions({
  gfm: true,
  breaks: true
})

const showHelp = ref(false)
const showHelpText = ref(false)
const panelUrl = ref('')

const toggleHelp = () => {
  showHelp.value = !showHelp.value
}

// 自动展示/隐藏提示文本
setInterval(() => {
  showHelpText.value = !showHelpText.value
}, 3000)

const openPanelUrl = () => {
  if (panelUrl.value) {
    // 确保URL格式正确
    let url = panelUrl.value
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url
    }
    window.open(url, '_blank')
  }
}
</script>

<style scoped>
.float-button-wrapper {
  display: contents;
}

.float-button {
  width: 56px;
  height: 56px;
  cursor: pointer;
  user-select: none;
}

.float-button__inner {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: var(--shadow-md);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.help-button__inner {
  background: var(--info-color, #2080f0);
}

.float-button:hover .float-button__inner {
  transform: translateY(-3px) scale(1.05);
  box-shadow: var(--shadow-lg);
}

.help-button:hover .help-button__inner {
  background: var(--info-hover, #4098fc);
}

.float-button:active .float-button__inner {
  transform: translateY(-1px) scale(0.95);
  transition-duration: 0.1s;
}

.float-button__icon {
  position: relative;
  z-index: 2;
  transition: transform 0.3s ease;
}

.float-button:hover .float-button__icon {
  transform: translateY(-2px);
}

.float-button__ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.float-button:active .float-button__ripple {
  animation: ripple 0.6s ease-out;
}

/* 动画定义 */
@keyframes ripple {
  0% {
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    width: 60px;
    height: 60px;
    opacity: 0;
  }
}

/* 过渡动画 */
.float-button-fade-enter-active {
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.float-button-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 1, 1);
}

.float-button-fade-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

.float-button-fade-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.9);
}

/* 帮助按钮容器和提示文本 */
.help-button-container {
  display: flex;
  align-items: center;
}

.help-text-container {
  height: 56px;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.help-text {
  background: var(--bg-card);
  padding: 0 12px;
  border-radius: 28px;
  font-size: 14px;
  height: 40px;
  line-height: 40px;
  color: var(--text-secondary);
  white-space: nowrap;
  margin-right: -56px;
  transform: translateX(-100%);
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-sm);
}

.help-text--show {
  transform: translateX(0);
  opacity: 1;
  margin-right: 12px;
}

@media (max-width: 768px) {
  .help-text-container {
    height: 48px;
  }
  .help-text {
    height: 36px;
    line-height: 36px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .help-text-container {
    height: 44px;
  }
  .help-text {
    height: 32px;
    line-height: 32px;
    font-size: 12px;
  }
}

/* 帮助模态框样式 */
.help-modal {
  --modal-padding: 24px;
}

.help-modal--mobile {
  --modal-padding: 16px;
}

.help-modal--mobile :deep(.n-modal) {
  position: fixed !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  width: 100% !important;
  height: auto !important;
  max-width: none !important;
  margin: 0 !important;
  border-radius: 12px !important;
}

.help-modal--mobile .help-card {
  max-height: 70vh;
  border-radius: 12px;
}

.help-card {
  background: var(--bg-card) !important;
}

.help-modal__header {
  padding: 0 var(--modal-padding);
  margin: calc(-1 * var(--modal-padding)) calc(-1 * var(--modal-padding)) 0;
  padding-top: var(--modal-padding);
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-base);
}

.help-modal__title {
  margin: 0;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: var(--modal-padding);
}

.help-modal__icon {
  color: var(--primary-color);
}

.help-modal__content {
  padding: var(--modal-padding) 0;
  max-height: 60vh;
  overflow-y: auto;
  scrollbar-gutter: stable;
}

.help-modal__content::-webkit-scrollbar {
  width: 8px;
}

.help-modal__content::-webkit-scrollbar-track {
  background: transparent;
}

.help-modal__content::-webkit-scrollbar-thumb {
  background: var(--scrollbar-color, rgba(0, 0, 0, 0.2));
  border-radius: 4px;
}

.help-modal__content::-webkit-scrollbar-thumb:hover {
  background: var(--scrollbar-color-hover, rgba(0, 0, 0, 0.3));
}

.help-section {
  padding: 16px var(--modal-padding);
  margin: 0 calc(-1 * var(--modal-padding));
  transition: background-color 0.2s ease;
}

.help-section:hover {
  background: var(--bg-hover);
}

.help-section__header {
  margin-bottom: 8px;
}

.help-section :deep(h3) {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.1em;
}

.markdown-content {
  color: var(--text-secondary);
  line-height: 1.6;
  font-size: 0.95em;
}

.markdown-content :deep(ul), 
.markdown-content :deep(ol) {
  margin: 8px 0;
  padding-left: 24px;
}

.markdown-content :deep(li) {
  margin: 4px 0;
}

.markdown-content :deep(p) {
  margin: 8px 0;
}

.markdown-content :deep(code) {
  background: var(--code-bg, rgba(0, 0, 0, 0.04));
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9em;
}

.markdown-content :deep(pre) {
  background: var(--code-block-bg, rgba(0, 0, 0, 0.04));
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 12px 0;
}

.markdown-content :deep(pre code) {
  background: none;
  padding: 0;
  border-radius: 0;
}

.markdown-content :deep(blockquote) {
  margin: 12px 0;
  padding-left: 16px;
  border-left: 4px solid var(--primary-color);
  color: var(--text-tertiary);
}

.markdown-content :deep(a) {
  color: var(--primary-color);
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.markdown-content :deep(a:hover) {
  opacity: 0.8;
}

.help-modal__footer {
  padding: var(--modal-padding);
  margin: 0 calc(-1 * var(--modal-padding));
  margin-top: calc(-1 * var(--modal-padding));
  display: flex;
  justify-content: flex-end;
}

.help-modal__footer-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.panel-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--bg-card-hover, rgba(0, 0, 0, 0.02));
  border-radius: 8px;
  flex-wrap: wrap;
}

.panel-input-group {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.panel-input {
  flex: 1;
  min-width: 200px;
}

.help-modal__close-btn {
  min-width: 100px;
  font-weight: 500;
  align-self: flex-end;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .float-button {
    width: 48px;
    height: 48px;
  }
  
  .float-button__icon {
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .float-button {
    width: 44px;
    height: 44px;
  }
}

/* 减少动画的可访问性支持 */
@media (prefers-reduced-motion: reduce) {
  .float-button__inner,
  .float-button__icon,
  .float-button-fade-enter-active,
  .float-button-fade-leave-active {
    transition-duration: 0.1s;
  }
  
  .float-button__ripple {
    display: none;
  }
}
</style>
