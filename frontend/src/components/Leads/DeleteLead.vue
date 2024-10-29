<template>
  <div class="modal">
    <div class="modal-content">
      <h2 class="text-lg font-semibold mb-4">Delete Lead</h2>
      <p>Are you sure you want to delete this lead? This action cannot be undone.</p>
      <div class="flex justify-end mt-6">
        <button @click="closeModal"
          class="mr-2 bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400">Cancel</button>
        <button @click="handleDelete" :disabled="loading"
          class="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700">
          {{ loading ? 'Loading...' : 'Delete' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, ref } from 'vue';

import { deleteLead } from '../../api/leads';
import { useHttpErrorHandler } from '../../api/error-handling';

const props = defineProps<{
  leadId: number;
}>();

const { processHttpError } = useHttpErrorHandler();

const loading = ref(false);

const emit = defineEmits<{
  (e: 'deleted'): void;
  (e: 'close'): void;
}>();

// Handle the deletion process
const handleDelete = async () => {
  loading.value = true; // Set loading to true when starting deletion
  try {
    await deleteLead(props.leadId);
    emit('deleted');
  } catch (error) {
    processHttpError(error);
  } finally {
    loading.value = false; // Reset loading state
  }
};

// Close modal function
const closeModal = () => {
  emit('close'); // Emit 'close' event on modal close
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 400px;
}
</style>
