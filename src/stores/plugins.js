import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const usePluginStore = defineStore('plugins', () => {
  // 状态
  const plugins = ref(null)
  const searchQuery = ref('')
  const selectedTag = ref(null)
  const currentPage = ref(1)
  const pageSize = ref(12)
  const isDarkMode = ref(false)
  const isLoading = ref(true)

  // 计算属性
  const allTags = computed(() => {
    const tags = new Set()
    if (plugins.value) {
      plugins.value.forEach(plugin => {
        if (plugin.tags) {
          plugin.tags.forEach(tag => tags.add(tag))
        }
      })
    }
    return Array.from(tags).sort()
  })

  const tagOptions = computed(() => 
    allTags.value.map(tag => ({ label: tag, value: tag }))
  )

  const filteredPlugins = computed(() => {
    if (!plugins.value) return []
    
    return plugins.value.filter(plugin => {
      const searchValue = searchQuery.value ? searchQuery.value.toLowerCase() : ''
      if (!searchValue && !selectedTag.value) return true
      
      const matchesSearch = !searchValue || 
        (plugin.name && plugin.name.toLowerCase().includes(searchValue)) ||
        (plugin.desc && plugin.desc.toLowerCase().includes(searchValue)) ||
        (plugin.author && plugin.author.toLowerCase().includes(searchValue))
      
      const matchesTag = !selectedTag.value || 
        (Array.isArray(plugin.tags) && plugin.tags.includes(selectedTag.value))
      
      return matchesSearch && matchesTag
    })
  })

  const totalPages = computed(() => Math.ceil(filteredPlugins.value.length / pageSize.value))

  const paginatedPlugins = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return filteredPlugins.value.slice(start, end)
  })

  // 动作
  async function loadPlugins() {
    isLoading.value = true
    try {
      const response = await axios.get('https://raw.githubusercontent.com/IGCrystal-NEO/Astrbot_Plugins_Market/main/plugin_cache_original.json')
      const data = response.data
      plugins.value = Object.entries(data).map(([name, details]) => ({
        name,
        ...details
      }))
    } catch (error) {
      console.error('Error loading plugins:', error)
      plugins.value = []
    } finally {
      isLoading.value = false
    }
  }

  function setDarkMode(value) {
    isDarkMode.value = value
  }

  function setSearchQuery(query) {
    searchQuery.value = query
  }

  function setSelectedTag(tag) {
    selectedTag.value = tag
  }

  function setCurrentPage(page) {
    currentPage.value = page
  }

  return {
    // 状态
    plugins,
    searchQuery,
    selectedTag,
    currentPage,
    isDarkMode,
    // 计算属性
    allTags,
    tagOptions,
    filteredPlugins,
    totalPages,
    paginatedPlugins,
    // 动作
    loadPlugins,
    setDarkMode,
    setSearchQuery,
    setSelectedTag,
    setCurrentPage
  }
})
