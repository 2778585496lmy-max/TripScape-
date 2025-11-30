<template>
    <div class="search-container">
        <input v-model="searchInput" type="text" class="search-input" placeholder="搜索景点名称、关键词..." @input="handleInput"
            @keyup.enter="handleSearch">
        <button class="search-btn" @click="handleSearch">
            <span class="search-icon">🔍</span>
            搜索
        </button>
    </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';

const emit = defineEmits(['search']);

const searchInput = ref('');

const handleInput = () => {
    // 可选：实现实时搜索
    // emit('search', searchInput.value.trim());
};

const handleSearch = () => {
    const query = searchInput.value.trim();
    if (query) {
        emit('search', query);
    }
};

// 清空搜索
const clearSearch = () => {
    searchInput.value = '';
    emit('search', '');
};

defineExpose({ clearSearch });
</script>

<style scoped>
.search-container {
    display: flex;
    gap: 12px;
    max-width: 600px;
    margin: 0 auto;
}

.search-input {
    flex: 1;
    padding: 14px 20px;
    border: 2px solid #e0e0e0;
    border-radius: 30px;
    font-size: 1rem;
    outline: none;
    transition: all 0.3s ease;
    background: white;
}

.search-input:focus {
    border-color: #4a90e2;
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

.search-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 14px 24px;
    background: #4a90e2;
    color: white;
    border: none;
    border-radius: 30px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
}

.search-btn:hover {
    background: #357abd;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
}

.search-icon {
    font-size: 1.1rem;
}

@media (max-width: 600px) {
    .search-container {
        flex-direction: column;
    }

    .search-btn {
        justify-content: center;
    }
}
</style>