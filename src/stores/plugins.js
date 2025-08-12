import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
// 用原生 fetch 降低依赖体积

export const usePluginStore = defineStore('plugins', () => {
  // 从 localStorage 获取主题偏好
  const savedTheme = localStorage.getItem('theme-preference')
  
  // 状态
  const plugins = ref(null)
  const searchQuery = ref('')
  const selectedTag = ref(null)
  const currentPage = ref(1)
  const pageSize = ref(12)
  const isDarkMode = ref(savedTheme === 'dark')
  const isLoading = ref(true)
  const sortBy = ref('default') // 默认使用原始顺序
  // 随机排序用的稳定种子，避免每次计算都重新打乱
  const randomSeed = ref(0)

  // 用户画像（本地个性化）：标签/作者/关键词偏好
  const userProfile = ref({
    tagCount: {},
    authorCount: {},
    keywordCount: {},
    totalInteractions: 0
  })

  // 从 localStorage 读取画像
  try {
    const raw = localStorage.getItem('pm_user_profile')
    if (raw) userProfile.value = JSON.parse(raw)
  } catch (_) {}

  function persistProfile() {
    try { localStorage.setItem('pm_user_profile', JSON.stringify(userProfile.value)) } catch(_) {}
  }
  
  // 监听主题变化并保存到 localStorage
  watch(isDarkMode, (newValue) => {
    localStorage.setItem('theme-preference', newValue ? 'dark' : 'light')
  })

  // 当排序方式改为随机时，生成一个新的种子（兼容 v-model 直接赋值场景）
  watch(sortBy, (value) => {
    if (value === 'random') {
      randomSeed.value = Math.random()
    }
  })

  // 切换主题的方法
  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
  }

  // 简单稳定哈希：基于名字与种子生成稳定的“随机分数”
  function stableHash(input, seedNumber) {
    let h = (Math.floor(seedNumber * 1e9) ^ 5381) >>> 0
    for (let i = 0; i < input.length; i += 1) {
      h = (((h << 5) + h) + input.charCodeAt(i)) >>> 0 // h * 33 + c
    }
    return h >>> 0
  }

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

  // 统计信息用于归一化
  const stats = computed(() => {
    const list = plugins.value || []
    let maxStars = 1
    let newestTs = 0
    let oldestTs = Date.now()
    list.forEach(p => {
      if (p.stars) maxStars = Math.max(maxStars, p.stars)
      const ts = p.updated_at ? new Date(p.updated_at).getTime() : 0
      if (ts) {
        newestTs = Math.max(newestTs, ts)
        oldestTs = Math.min(oldestTs, ts)
      }
    })
    if (!newestTs) { newestTs = Date.now(); oldestTs = newestTs - 1000 * 3600 * 24 * 365 }
    const span = Math.max(1, newestTs - oldestTs)
    return { maxStars, newestTs, oldestTs, span }
  })

  // 计算推荐得分（0-1）
  function computeScore(plugin) {
    const s = stats.value
    // 热度
    const starsNorm = Math.min(1, (plugin.stars || 0) / s.maxStars)
    // 新鲜度（越近越高）
    const ts = plugin.updated_at ? new Date(plugin.updated_at).getTime() : 0
    const recencyNorm = ts ? (1 - (s.newestTs - ts) / s.span) : 0
    // 标签匹配
    const tags = Array.isArray(plugin.tags) ? plugin.tags : []
    const tagCount = userProfile.value.tagCount || {}
    let tagScore = 0
    tags.forEach(t => { tagScore += (tagCount[t] || 0) })
    const tagDen = Math.max(1, userProfile.value.totalInteractions)
    const tagMatchNorm = Math.min(1, tagScore / tagDen)
    // 作者偏好
    const authorCnt = (userProfile.value.authorCount || {})[plugin.author] || 0
    const authorPref = Math.min(1, authorCnt / tagDen)
    // 关键词匹配（搜索/历史关键词）
    const kwCount = userProfile.value.keywordCount || {}
    let kwScore = 0
    const text = `${plugin.name || ''} ${plugin.desc || ''}`.toLowerCase()
    Object.keys(kwCount).forEach(k => {
      if (!k || k.length < 2) return
      if (text.includes(k)) kwScore += kwCount[k]
    })
    const textMatchNorm = Math.min(1, kwScore / tagDen)
    // 组合权重（可微调）
    const score = 0.30 * starsNorm + 0.20 * recencyNorm + 0.30 * tagMatchNorm + 0.10 * authorPref + 0.10 * textMatchNorm
    return score
  }

  const filteredPlugins = computed(() => {
    if (!plugins.value) return []
    
    let filtered = plugins.value.filter(plugin => {
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

    // 根据排序选项对结果进行排序
    if (sortBy.value === 'stars') {
      // 按照 stars 数量排序
      filtered.sort((a, b) => (b.stars || 0) - (a.stars || 0))
    } else if (sortBy.value === 'updated') {
      // 按照更新时间排序
      filtered.sort((a, b) => {
        const dateA = a.updated_at ? new Date(a.updated_at) : new Date(0)
        const dateB = b.updated_at ? new Date(b.updated_at) : new Date(0)
        return dateB - dateA
      })
    } else if (sortBy.value === 'random') {
      // 使用稳定的种子 + 名称哈希，避免每次响应式更新都抖动
      filtered.sort((a, b) => {
        const ha = stableHash(a.name || '', randomSeed.value)
        const hb = stableHash(b.name || '', randomSeed.value)
        return ha - hb
      })
    } else {
      // 默认使用原始顺序，不进行排序
      filtered.sort((a, b) => {
        const indexA = plugins.value.findIndex(p => p.name === a.name)
        const indexB = plugins.value.findIndex(p => p.name === b.name)
        return indexA - indexB
      })
    }

    return filtered
  })

  // 为你推荐（Top K）
  const recommendedForYou = computed(() => {
    const list = (plugins.value || []).slice()
    if (!list.length) return []
    // 冷启动：交互过少时按 stars/new 更新混排
    const cold = (userProfile.value.totalInteractions || 0) < 3
    if (cold) {
      return list
        .sort((a,b)=>((b.stars||0)-(a.stars||0)) || (new Date(b.updated_at||0)-new Date(a.updated_at||0)))
        .slice(0, 6)
    }
    return list
      .map(p => ({ p, score: computeScore(p) }))
      .sort((a,b) => b.score - a.score)
      .slice(0, 6)
      .map(x => x.p)
  })

  // 相关推荐：基于标签 Jaccard + 作者加成
  function getSimilarPlugins(target, k = 6) {
    if (!target) return []
    const tagsA = new Set(Array.isArray(target.tags) ? target.tags : [])
    const list = (plugins.value || []).filter(p => p.name !== target.name)
    const scored = list.map(p => {
      const tagsB = new Set(Array.isArray(p.tags) ? p.tags : [])
      let inter = 0
      tagsB.forEach(t => { if (tagsA.has(t)) inter += 1 })
      const union = Math.max(1, tagsA.size + tagsB.size - inter)
      const jaccard = inter / union
      const authorBonus = p.author && target.author && p.author === target.author ? 0.2 : 0
      const hot = Math.min(1, (p.stars || 0) / Math.max(1, stats.value.maxStars)) * 0.1
      return { p, s: jaccard + authorBonus + hot }
    })
    return scored.sort((a,b)=>b.s-a.s).slice(0,k).map(x=>x.p)
  }

  const totalPages = computed(() => {
    if (sortBy.value === 'random') {
      return filteredPlugins.value.length > 0 ? 1 : 0
    }
    return Math.ceil(filteredPlugins.value.length / pageSize.value)
  })

  const paginatedPlugins = computed(() => {
    if (sortBy.value === 'random') {
      // 随机排序仅展示一页，直接取前 pageSize 条
      return filteredPlugins.value.slice(0, pageSize.value)
    }
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return filteredPlugins.value.slice(start, end)
  })

  async function loadPlugins() {
    isLoading.value = true
    try {
      const response = await fetch('https://api.wenturc.com/astrbot/plugins/', { cache: 'no-store' })
      const data = await response.json()
      plugins.value = Object.entries(data).map(([name, details]) => {
        const tags = details.tags ? 
          (Array.isArray(details.tags) ? details.tags : [details.tags]) 
          : []
          
        return {
          name,
          ...details,
          tags
        }
      })
    } catch (error) {
      console.error('Error loading plugins:', error)
      plugins.value = []
    } finally {
      isLoading.value = false
    }
  }

  // 记录交互，更新用户画像
  function trackInteraction(type, plugin) {
    if (!plugin) return
    const weights = { impression: 0.2, open: 1.0, detail: 1.2, copy: 1.5, social: 1.0, favorite: 2.0 }
    const w = weights[type] || 0.5
    userProfile.value.totalInteractions += w
    // 标签
    const tags = Array.isArray(plugin.tags) ? plugin.tags : []
    tags.forEach(t => { userProfile.value.tagCount[t] = (userProfile.value.tagCount[t] || 0) + w })
    // 作者
    if (plugin.author) {
      userProfile.value.authorCount[plugin.author] = (userProfile.value.authorCount[plugin.author] || 0) + w
    }
    persistProfile()
  }

  // 记录搜索关键词
  function trackSearch(query) {
    if (!query) return
    const tokens = String(query).toLowerCase().split(/[^a-z0-9\u4e00-\u9fa5]+/).filter(t => t && t.length >= 2)
    if (!tokens.length) return
    tokens.forEach(t => { userProfile.value.keywordCount[t] = (userProfile.value.keywordCount[t] || 0) + 1 })
    userProfile.value.totalInteractions += 0.5
    persistProfile()
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

  function setSortBy(value) {
    sortBy.value = value
    if (value === 'random') {
      randomSeed.value = Math.random()
    }
    currentPage.value = 1
  }

  function refreshRandomOrder() {
    if (sortBy.value === 'random') {
      randomSeed.value = Math.random()
    }
  }

  return {
    // 状态
    plugins,
    searchQuery,
    selectedTag,
    currentPage,
    isDarkMode,
    sortBy,
    isLoading,
    randomSeed,
    userProfile,
    // 计算属性
    allTags,
    tagOptions,
    filteredPlugins,
    totalPages,
    paginatedPlugins,
    recommendedForYou,
    // 动作
    loadPlugins,
    setDarkMode,
    setSearchQuery,
    setSelectedTag,
    setCurrentPage,
    setSortBy,
    toggleTheme,
    refreshRandomOrder,
    trackInteraction,
    getSimilarPlugins,
    trackSearch
  }
})
