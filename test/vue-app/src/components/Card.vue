<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <div class="card">
    <h2>{{ title }}</h2>
    <slot />
  </div>
</template>

<style scoped>
.card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

h2 {
  margin: 0 0 16px 0;
  color: #1e293b;
  font-size: 1.25rem;
}
</style>
