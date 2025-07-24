<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
    <n-message-provider>
      <div class="app-container" :class="{ dark: isDarkMode }">
        <n-layout class="main-layout">
          <app-header
            v-model="isDarkMode"
            v-model:search-query="searchQuery"
            v-model:selected-tag="selectedTag"
            v-model:current-page="currentPage"
            :tag-options="tagOptions"
            :total-pages="totalPages"
          />
          <main class="plugins-grid">
            <plugin-card
              v-for="plugin in paginatedPlugins"
              :key="plugin.name"
              :plugin="plugin"
            />
          </main>
          <app-pagination
            v-if="totalPages > 1"
            v-model="currentPage"
            :total-pages="totalPages"
          />
        </n-layout>
      </div>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { darkTheme, NConfigProvider, NMessageProvider, NLayout } from 'naive-ui'
import AppHeader from './components/AppHeader.vue'
import PluginCard from './components/PluginCard.vue'
import AppPagination from './components/AppPagination.vue'
import { themeOverrides } from './config/theme'
import { usePluginStore } from './stores/plugins'

const store = usePluginStore()

// 从store中获取状态
const { 
  isDarkMode,
  searchQuery,
  selectedTag,
  currentPage,
  tagOptions,
  totalPages,
  paginatedPlugins
} = storeToRefs(store)

// 计算属性
const theme = computed(() => (isDarkMode.value ? darkTheme : null))

// 方法
const handlePageChange = (page) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'instant' })
}

// 生命周期钩子
onMounted(() => {
  store.loadPlugins()
})
</script>

<style>
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.app-container {
  min-height: 100vh;
  background: var(--body-color, #f5f5f5);
  display: flex;
  flex-direction: column;
}

.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.plugins-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 28px;
  padding: 20px;
  max-width: 100%;
  min-height: calc(100vh - 64px); /* 减去头部高度 */
  margin: 0 auto;
  flex: 1;
}

@media (max-width: 768px) {
  .app-container {
    padding: 0;
  }
  
  .plugins-grid {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 16px;
  }
}
</style>
