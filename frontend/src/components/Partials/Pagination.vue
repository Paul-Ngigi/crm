<template>
  <div class="flex items-center justify-between space-x-4 py-4">
    <!-- Pagination Controls -->
    <div class="flex items-center space-x-2">
      <button
        @click="goToPreviousPage"
        :disabled="currentPage === 1"
        class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>

      <span class="text-gray-700">Page {{ currentPage }} of {{ paginationData.totalPages }}</span>

      <button
        @click="goToNextPage"
        :disabled="currentPage === paginationData.totalPages"
        class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>

    <!-- Items per Page Selector -->
    <div class="flex items-center space-x-2">
      <label for="itemsPerPage" class="text-gray-700">Items per page:</label>
      <select
        id="itemsPerPage"
        v-model="currentLimit"
        @change="onLimitChange"
        class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option v-for="option in limitOptions" :key="option" :value="option">{{ option }}</option>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, PropType } from "vue";

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default defineComponent({
  name: "Pagination",
  props: {
    paginationData: {
      type: Object as PropType<PaginationData>,
      required: true,
    },
    limitOptions: {
      type: Array as PropType<number[]>,
      default: () => [10, 20, 50, 100],
    },
  },
  setup(props, { emit }) {
    const currentPage = ref<number>(props.paginationData.page);
    const currentLimit = ref<number>(props.paginationData.limit);

    watch(
      () => props.paginationData,
      (newVal) => {
        currentPage.value = newVal.page;
        currentLimit.value = newVal.limit;
      },
      { deep: true }
    );

    const goToPreviousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
        emit("page-change", currentPage.value);
      }
    };

    const goToNextPage = () => {
      if (currentPage.value < props.paginationData.totalPages) {
        currentPage.value++;
        emit("page-change", currentPage.value);
      }
    };

    const onLimitChange = () => emit("limit-change", currentLimit.value);

    return {
      currentPage,
      currentLimit,
      goToPreviousPage,
      goToNextPage,
      onLimitChange,
    };
  },
});
</script>
