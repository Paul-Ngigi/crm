<!-- src/components/Modal.vue -->
<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="bg-white rounded-lg w-full max-w-md mx-4 p-6 relative">
      <button @click="$emit('close')" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
        ✕
      </button>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(['close']);
</script>

<style scoped>
/* Add modal specific styles if necessary */
</style>
