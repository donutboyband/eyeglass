<script setup lang="ts">
defineProps<{
  label: string
  placeholder?: string
}>()

const model = defineModel<string>({ default: '' })
</script>

<template>
  <div class="input-field">
    <label>
      <span class="label-text">{{ label }}</span>
      <input
        type="text"
        v-model="model"
        :placeholder="placeholder"
      />
    </label>
  </div>
</template>

<style scoped>
.input-field {
  margin-bottom: 16px;
}

label {
  display: block;
}

.label-text {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
}

input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s;
}

input:focus {
  border-color: #42b883;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.1);
}
</style>
