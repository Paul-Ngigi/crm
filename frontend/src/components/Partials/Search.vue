<template>
  <div class="relative">
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search"
      class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      @input="emitSearch"
    />
    <button
      class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
      @click="emitSearch"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M10 2a8 8 0 105.292 14.707l4.001 4a1 1 0 001.415-1.414l-4.001-4A8 8 0 0010 2zm-6 8a6 6 0 1110.12 4.001l-.005.005-.001.001-2.122 2.121A6 6 0 014 10z"
        />
      </svg>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";

export default defineComponent({
  name: "SearchBar",
  props: {
    initialQuery: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit }) {
    const searchQuery = ref<string>(props.initialQuery);
    let debounce: NodeJS.Timeout;

    watch(
      searchQuery,
      () => {
        clearTimeout(debounce);
        debounce = setTimeout(() => emit("search", searchQuery.value), 500);
      },
      { immediate: true }
    );

    return {
      searchQuery,
    };
  },
});
</script>
