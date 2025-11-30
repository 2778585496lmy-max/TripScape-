<template>
    <div class="pagination-container">
        <button class="page-btn prev" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
            ← 上一页
        </button>

        <div class="page-numbers">
            <button v-for="page in visiblePages" :key="page" class="page-number"
                :class="{ active: page === currentPage }" :disabled="page === '...'"
                @click="page !== '...' && changePage(page)">
                {{ page }}
            </button>
        </div>

        <button class="page-btn next" :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">
            下一页 →
        </button>
    </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue';

const props = defineProps({
    currentPage: {
        type: Number,
        required: true
    },
    totalPages: {
        type: Number,
        required: true
    }
});

const emit = defineEmits(['page-change']);

const changePage = (page) => {
    if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
        emit('page-change', page);
    }
};

// 计算可见页码（显示当前页附近的页码）
const visiblePages = computed(() => {
    const pages = [];
    const { currentPage, totalPages } = props;

    if (totalPages <= 7) {
        // 页数少时显示全部
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    } else {
        // 页数多时显示省略号
        pages.push(1);

        if (currentPage > 3) {
            pages.push('...');
        }

        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (currentPage < totalPages - 2) {
            pages.push('...');
        }

        pages.push(totalPages);
    }

    return pages;
});
</script>

<style scoped>
.pagination-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 2rem 0;
}

.page-btn {
    padding: 8px 16px;
    border: 1px solid #e0e0e0;
    background: white;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #666;
    font-size: 0.9rem;
}

.page-btn:hover:not(:disabled) {
    border-color: #4a90e2;
    color: #4a90e2;
    transform: translateY(-1px);
}

.page-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.page-numbers {
    display: flex;
    gap: 4px;
}

.page-number {
    padding: 8px 12px;
    border: 1px solid #e0e0e0;
    background: white;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #666;
    min-width: 36px;
}

.page-number:hover:not(:disabled) {
    border-color: #4a90e2;
    color: #4a90e2;
}

.page-number.active {
    background: #4a90e2;
    border-color: #4a90e2;
    color: white;
}

.page-number:disabled {
    cursor: default;
    color: #ccc;
    border-color: #f0f0f0;
}

@media (max-width: 600px) {
    .pagination-container {
        flex-wrap: wrap;
    }
}
</style>