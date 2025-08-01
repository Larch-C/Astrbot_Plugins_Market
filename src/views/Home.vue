<template>
  <n-layout class="main-layout">
    <app-header
      v-model="isDarkMode"
      v-model:search-query="searchQuery"
      v-model:selected-tag="selectedTag"
      v-model:current-page="currentPage"
      v-model:sort-by="sortBy"
      :tag-options="tagOptions"
      :total-pages="totalPages"
    />
    <app-pagination
      v-if="totalPages > 1"
      v-model="currentPage"
      :total-pages="totalPages"
      class="top-pagination"
    />
    <main class="plugins-grid">
      <plugin-card
        v-for="(plugin, index) in paginatedPlugins"
        :key="`${plugin.name}-${filterKey}`"
        :plugin="plugin"
        :index="index"
      />
    </main>
    <app-pagination
      v-if="totalPages > 1"
      v-model="currentPage"
      :total-pages="totalPages"
    />
    <app-footer />
  </n-layout>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { NLayout } from 'naive-ui'
import AppHeader from '../components/AppHeader.vue'
import PluginCard from '../components/PluginCard.vue'
import AppPagination from '../components/AppPagination.vue'
import AppFooter from '../components/AppFooter.vue'
import { usePluginStore } from '../stores/plugins'

const store = usePluginStore()

// 从store中获取状态
const { 
  isDarkMode,
  searchQuery,
  selectedTag,
  currentPage,
  sortBy,
  tagOptions,
  totalPages,
  paginatedPlugins
} = storeToRefs(store)

// 计算属性
const filterKey = computed(() => {
  return `${searchQuery.value}-${selectedTag.value}-${sortBy.value}-${currentPage.value}`
})

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

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.plugins-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  max-width: 1400px;
  gap: 24px;
  padding: 20px;
  min-height: calc(100vh - 64px); /* 减去头部高度 */
  margin: 0 auto;
  flex: 1;
  animation: gridAppear 0.3s ease-out;
  animation-delay: 0.7s;
  animation-fill-mode: backwards;
}

@keyframes gridAppear {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .plugins-grid {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 16px;
  }
}
</style>
