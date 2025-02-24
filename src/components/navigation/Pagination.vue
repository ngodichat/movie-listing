<template>
  <div class="pagination">
    <button
        class="prevBtn"
        @click="handlePrevious"
        :disabled="currentPage === 1"
    >
      Previous
    </button>

    <div class="pages">
      <button
          v-for="page in displayedPages"
          :key="page"
          :class="{ active: page === currentPage }"
          @click="page !== -1 ? $emit('page-change', page) : null"
      >
        {{ page === -1 ? "..." : page }}
      </button>
    </div>

    <button
        class="nextBtn"
        @click="handleNext"
        :disabled="currentPage === totalPages"
    >
      Next
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "Pagination",
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
  },
  emits: ["page-change"],
  setup(props, { emit }) {
    const displayedPages = computed(() => {
      const pages: number[] = [];

      // Always show first page
      pages.push(1);

      if (props.currentPage > 3) {
        pages.push(-1); // -1 will represent ellipsis "..."
      }

      // Show pages around current page
      for (
          let i = Math.max(2, props.currentPage - 1);
          i <= Math.min(props.totalPages - 1, props.currentPage + 1);
          i++
      ) {
        pages.push(i);
      }

      if (props.currentPage < props.totalPages - 2) {
        pages.push(-1); // ellipsis
      }

      // Always show last page if there is more than one page
      if (props.totalPages > 1) {
        pages.push(props.totalPages);
      }

      return pages;
    });

    const handlePrevious = () => {
      if (props.currentPage > 1) {
        emit("page-change", props.currentPage - 1);
      }
    };

    const handleNext = () => {
      if (props.currentPage < props.totalPages) {
        emit("page-change", props.currentPage + 1);
      }
    };

    return {
      displayedPages,
      handlePrevious,
      handleNext,
    };
  },
});
</script>

<style lang="scss">
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin: 20px 0;

  button {
    padding: 8px 16px;
    border: 1px solid #ddd;
    background: white;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      background: #f0f0f0;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &.active {
      background: #007bff;
      color: white;
      border-color: #007bff;
    }
  }

  .pages {
    display: flex;
    gap: 5px;
  }
}
</style>