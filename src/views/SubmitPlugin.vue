<template>
  <div class="submit-plugin-page">
    <n-layout-header class="page-header">
      <div class="header-content">
        <div class="header-left">
          <n-button quaternary circle @click="goBack">
            <template #icon>
              <n-icon><arrow-back /></n-icon>
            </template>
          </n-button>
          <h1>提交插件</h1>
        </div>
        <div class="header-right">
          <n-button quaternary circle @click="toggleTheme">
            <template #icon>
              <n-icon>
                <moon v-if="isDarkMode" />
                <sunny v-else />
              </n-icon>
            </template>
          </n-button>
        </div>
      </div>
    </n-layout-header>

    <div class="steps-section">
      <n-steps
        :current="currentStep"
        :status="stepStatus"
        class="submit-steps"
      >
        <n-step title="填写信息" description="填写插件基本信息" />
        <n-step title="生成JSON" description="生成并复制JSON" />
        <n-step title="提交" description="提交到GitHub" />
      </n-steps>
    </div>

    <div class="page-content">
      <div class="main-section">
        <!-- 步骤1：表单 -->
        <div v-show="currentStep === 1" class="form-section">
          <n-card title="基本信息" class="form-card">
            <n-form ref="formRef" :model="formData" :rules="rules">
              <n-grid :x-gap="24" :cols="1" :item-responsive="true">
                <n-grid-item>
                  <n-form-item label="插件名称" path="name">
                    <n-input v-model:value="formData.name" placeholder="请输入插件名称" />
                  </n-form-item>
                </n-grid-item>
                <n-grid-item>
                  <n-form-item label="插件描述" path="desc">
                    <n-input 
                      v-model:value="formData.desc" 
                      type="textarea" 
                      placeholder="请输入插件描述"
                    />
                  </n-form-item>
                </n-grid-item>
                <n-grid-item>
                  <n-form-item label="作者" path="author">
                    <n-input v-model:value="formData.author" placeholder="请输入作者名称" />
                  </n-form-item>
                </n-grid-item>
                <n-grid-item>
                  <n-form-item label="仓库地址" path="repo">
                    <n-input v-model:value="formData.repo" placeholder="请输入GitHub仓库地址" />
                  </n-form-item>
                </n-grid-item>
                <n-grid-item>
                  <n-form-item label="标签（可选，按回车添加）" path="tags">
                    <n-dynamic-tags v-model:value="formData.tags" />
                  </n-form-item>
                </n-grid-item>
                <n-grid-item>
                  <n-form-item label="社交链接（可选）" path="social_link">
                    <n-input 
                      v-model:value="formData.social_link" 
                      placeholder="请输入社交链接，如个人主页、Twitter等" 
                    />
                  </n-form-item>
                </n-grid-item>
              </n-grid>
            </n-form>
          </n-card>
        </div>

        <!-- 步骤2：JSON预览 -->
        <div v-show="currentStep === 2" class="json-preview-section">
          <n-card title="JSON预览" class="json-card">
            <template #header-extra>
              <n-button @click="copyJSON" type="primary" ghost :disabled="!generatedJSON">
                <template #icon>
                  <n-icon><copy /></n-icon>
                </template>
                复制JSON
              </n-button>
            </template>
            <n-code
              :code="generatedJSON || '点击生成按钮生成JSON'"
              language="json"
              :word-wrap="true"
            />
          </n-card>
        </div>

        <!-- 步骤3：提交指南 -->
        <div v-show="currentStep === 3" class="submit-guide-section">
          <n-card title="提交指南" class="guide-card">
            <n-timeline>
              <n-timeline-item title="复制JSON" :color="stepChecks.copied ? 'green' : 'grey'">
                确保已复制生成的JSON内容
              </n-timeline-item>
              <n-timeline-item title="打开Issue页面" :color="stepChecks.issueOpened ? 'green' : 'grey'">
                即将在新标签页中打开GitHub Issue模板
              </n-timeline-item>
              <n-timeline-item title="粘贴并提交" color="grey">
                将JSON粘贴到指定位置并提交Issue
              </n-timeline-item>
            </n-timeline>
          </n-card>
        </div>
      </div>

      <!-- 底部操作栏 -->
      <n-card class="action-bar">
        <div class="action-content">
          <div class="action-left">
            <n-button 
              v-if="currentStep > 1" 
              @click="prevStep"
              quaternary
            >
              <template #icon>
                <n-icon><arrow-back /></n-icon>
              </template>
              上一步
            </n-button>
          </div>
          <div class="action-right">
            <n-button 
              v-if="currentStep === 1"
              type="primary"
              @click="validateAndGenerateJSON"
              :disabled="!formData.name"
            >
              下一步
            </n-button>
            <n-button 
              v-else-if="currentStep === 2"
              type="primary"
              @click="nextStep"
              :disabled="!generatedJSON"
            >
              下一步
            </n-button>
            <n-button 
              v-else
              type="primary"
              @click="submitPlugin"
            >
              提交到GitHub
            </n-button>
          </div>
        </div>
      </n-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { 
  NLayoutHeader,
  NSteps,
  NStep,
  NTimeline,
  NTimelineItem,
  NGrid,
  NGridItem,
  NForm, 
  NFormItem, 
  NInput, 
  NButton,
  NDynamicTags,
  NCard,
  NIcon,
  NCode,
  useMessage
} from 'naive-ui'
import { 
  ArrowBack, 
  Copy,
  Moon,
  Sunny
} from '@vicons/ionicons5'
import { usePluginStore } from '@/stores/plugins'

const router = useRouter()
const message = useMessage()
const store = usePluginStore()
const formRef = ref(null)
const generatedJSON = ref('')
const currentStep = ref(1)
const stepStatus = ref('process')

// 从 store 中获取暗色模式状态
const { isDarkMode } = storeToRefs(store)

// 切换主题
const toggleTheme = () => {
  store.toggleTheme()
}

// 步骤检查状态
const stepChecks = reactive({
  copied: false,
  issueOpened: false
})

const formData = reactive({
  name: '',
  desc: '',
  author: '',
  repo: '',
  tags: [],
  social_link: ''
})

const rules = {
  name: {
    required: true,
    message: '请输入插件名称',
    trigger: 'blur'
  },
  desc: {
    required: true,
    message: '请输入插件描述',
    trigger: 'blur'
  },
  author: {
    required: true,
    message: '请输入作者名称',
    trigger: 'blur'
  },
  repo: {
    required: true,
    message: '请输入仓库地址',
    trigger: 'blur',
    pattern: /^https:\/\/github\.com\/[\w-]+\/[\w-]+$/,
    message: '请输入有效的GitHub仓库地址'
  }
}

const goBack = () => {
  if (currentStep.value > 1) {
    currentStep.value--
    return
  }
  router.back()
}

const validateAndGenerateJSON = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      const jsonData = {
        name: formData.name,
        desc: formData.desc,
        author: formData.author,
        repo: formData.repo,
        tags: formData.tags,
        social_link: formData.social_link
      }
      generatedJSON.value = JSON.stringify(jsonData, null, 2)
      nextStep()
    } else {
      message.error('请完善必填信息')
    }
  })
}

const copyJSON = async () => {
  try {
    await navigator.clipboard.writeText(generatedJSON.value)
    message.success('JSON已复制到剪贴板')
    stepChecks.copied = true
  } catch (err) {
    message.error('复制失败')
  }
}

const nextStep = () => {
  if (currentStep.value < 3) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const submitPlugin = () => {
  const issueUrl = 'https://github.com/AstrBotDevs/AstrBot/issues/new?template=PLUGIN_PUBLISH.md'
  window.open(issueUrl, '_blank')
  stepChecks.issueOpened = true
}
</script>

<style scoped>
.submit-plugin-page {
  min-height: 100vh;
  height: 100vh;
  background: var(--body-color);
  display: flex;
  flex-direction: column;
  --action-bar-height: 72px;
}

.page-header {
  background: var(--bg-base);
  padding: 16px 0;
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  border-bottom: 2px solid var(--border-base);
  
  &:hover {
    background: var(--bg-base);
  }
}

.header-content {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  transition: padding 0.3s ease;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-left h1 {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  transition: color 0.2s ease;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 头部按钮动画 */
.header-left .n-button,
.header-right .n-button {
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
}

.steps-section {
  padding: 24px 0;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
}

.submit-steps {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 0 16px;
  box-sizing: border-box;
}

.page-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;
  background: var(--bg-card);
  padding: 24px 24px calc(24px + var(--action-bar-height, 72px)) 24px;

  :deep(.n-card) {
    background: var(--bg-card);
  }
}

.main-section {
  flex: 1;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-sizing: border-box;
}

.form-card,
.json-card,
.guide-card {
  margin-bottom: 24px;
}

.json-preview-section {
  :deep(.n-code) {
    border-radius: 8px;
  }
}

.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 90;
  border-radius: 0;
  background: var(--bg-card);
  box-shadow: var(--shadow-lg);
}

.action-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  height: var(--action-bar-height, 72px);
  padding: 0 24px;
}

.action-left,
.action-right {
  display: flex;
  gap: 12px;
  align-items: center;
}

:deep(.n-form-item) {
  margin-bottom: 24px;
}

:deep(.n-input-group) {
  width: 100%;
}

:deep(.n-timeline) {
  padding: 16px;
}

/* 添加过渡动画 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* 优化卡片过渡效果 */
.n-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 按钮过渡效果 */
.n-button {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Steps组件过渡 */
.submit-steps :deep(.n-steps-content) {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Timeline项目过渡 */
.n-timeline-item {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 表单项过渡 */
:deep(.n-form-item) {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@media (max-width: 768px) {
  .page-header {
    padding: 12px 0;
  }

  .header-content {
    padding: 0 16px;
  }

  .steps-section {
    padding: 16px 0;
  }

  .submit-steps {
    padding: 0 16px;
    
    :deep(.n-step) {
      flex: 1;
      min-width: 0;
    }
    
    :deep(.n-step-header) {
      flex-wrap: wrap;
      min-width: 0;
    }
    
    :deep(.n-step-content__description) {
      display: none;
    }
    
    :deep(.n-step-splitor) {
      width: 24px;
      min-width: 24px;
    }
  }

  .submit-plugin-page {
    --action-bar-height: 64px;
  }
}

@media (max-width: 425px) {
  .submit-steps {
    :deep(.n-step) {
      display: none;
      
      &.n-step--current {
        display: flex;
        flex: 0 1 auto;
      }
    }
    
    :deep(.n-step-splitor) {
      display: none;
    }
    
    :deep(.n-steps-content) {
      justify-content: center;
    }
    
    :deep(.n-step-header__title) {
      font-size: 16px;
      display: block !important;
    }
  }

  .page-content {
    padding: 16px 16px calc(16px + var(--action-bar-height)) 16px;
  }

  .action-content {
    padding: 0 16px;
    height: var(--action-bar-height);
  }

  :deep(.n-card-header) {
    padding: 16px;
  }

  :deep(.n-card__content) {
    padding: 16px;
  }
}
</style>
