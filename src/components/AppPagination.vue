<template>
  <footer class="pagination-wrapper" v-if="totalPages > 1">
    <n-pagination
      :page="modelValue"
      :page-count="totalPages"
      @update:page="handlePageChange"
      :size="size"
    />
  </footer>
</template>

<script setup>
import { NPagination } from 'naive-ui'

defineProps({
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

const handlePageChange = (page) => {
  emit('update:modelValue', page)
}
</script>

<style scoped>
.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin: 2rem 0;
  padding: 1rem 0;
}

:deep(.n-pagination) {
  --n-item-border-radius: 6px;
  --n-item-padding: 0 14px;
  --n-item-size: 32px;
  --n-item-font-size: 14px;
}

:deep(.n-pagination .n-pagination-item) {
  color: var(--text-secondary);
  transition: all 0.3s ease;
}

:deep(.n-pagination .n-pagination-item--clickable:hover) {
  color: var(--primary-color);
  background-color: var(--primary-light);
}

:deep(.n-pagination .n-pagination-item--active) {
  color: var(--primary-color) !important;
  font-weight: 600;
}

:deep(.n-pagination .n-pagination-prefix),
:deep(.n-pagination .n-pagination-suffix) {
  color: var(--text-secondary);
  margin: 0 12px;
}
</style>
