<template>
    <div class="filter-container">
        <span class="filter-label">分类筛选：</span>
        <div class="category-group">
            <button v-for="category in categories" :key="category" class="category-btn"
                :class="{ active: activeCategory === category }" @click="selectCategory(category)">
                {{ category }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
    categories: {
        type: Array,
        required: true
    },
    activeCategory: {
        type: String,
        required: true
    }
});

const emit = defineEmits(['category-change']);

const selectCategory = (category) => {
    emit('category-change', category);
};
</script>

<style scoped>
.filter-container {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
}

.filter-label {
    font-weight: 500;
    color: #2c3e50;
    white-space: nowrap;
}

.category-group {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.category-btn {
    padding: 8px 16px;
    border: 2px solid #e0e0e0;
    background: white;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;
    color: #666;
}

.category-btn:hover {
    border-color: #4a90e2;
    color: #4a90e2;
    transform: translateY(-1px);
}

.category-btn.active {
    background: #4a90e2;
    border-color: #4a90e2;
    color: white;
}

@media (max-width: 600px) {
    .filter-container {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>