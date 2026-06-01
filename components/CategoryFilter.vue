<script setup lang="ts">
const props = defineProps<{
  categories: { value: string; label: string }[]
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void
}>()
</script>

<template>
  <nav class="category-filter" aria-label="Filtrer par catégorie">
    <button
      v-for="cat in categories"
      :key="cat.value"
      class="category-filter__btn"
      :class="{ 'is-active': modelValue === cat.value }"
      @click="emit('update:modelValue', cat.value)"
    >
      {{ cat.label }}
    </button>
  </nav>
</template>
