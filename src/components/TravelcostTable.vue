<template>
    <div class="rounded-table-container">
        <table class="rounded-table">
            <thead>
                <tr>
                    <th v-for="(header, index) in headers" :key="index" @click="toggleSort(index)"
                        :class="{ 'sortable': true, 'sorted': sortState.column === index }">
                        {{ header }}
                        <span class="sort-indicator" v-if="sortState.column === index">
                            {{ sortState.direction === 'asc' ? '↑' : '↓' }}
                        </span>
                        <span class="sort-placeholder" v-else></span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(row, rowIndex) in sortedData" :key="rowIndex">
                    <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    headers: {
        type: Array,
        default: () => ['年份', '交通', '住宿', '餐饮', '门票', '购物', '其他', '总计']
    },
    data: {
        type: Array,
        default: () => [
            ['2020年', '¥3,200', '¥2,800', '¥3,500', '¥1,800', '-', '¥700', '¥12,000'],
            ['2021年', '¥4,200', '¥3,800', '¥4,000', '¥2,200', '¥600', '¥200', '¥15,000'],
            ['2022年', '¥5,500', '¥4,800', '¥4,200', '¥2,500', '¥1,500', '¥500', '¥18,000'],
            ['2023年', '¥7,800', '¥6,800', '¥5,500', '¥3,200', '¥1,800', '¥400', '¥25,500'],
            ['2024年', '¥8,500', '¥7,200', '¥5,500', '¥3,800', '¥2,200', '¥800', '¥28,000'],
            ['2025年', '¥8,000', '¥7,200', '¥6000', '¥3,600', '¥2,000', '¥800', '¥24,000']
        ]
    }
})

// 排序状态：列索引和方向
const sortState = ref({
    column: null,
    direction: 'asc'
})

// 切换排序
const toggleSort = (columnIndex) => {
    if (sortState.value.column === columnIndex) {
        sortState.value.direction = sortState.value.direction === 'asc' ? 'desc' : 'asc'
    } else {
        sortState.value.column = columnIndex
        sortState.value.direction = 'asc'
    }
}

// 提取数值用于排序（处理货币符号和无效值）
const extractNumber = (value) => {
    if (value === '-' || !value) return -Infinity
    const numStr = String(value).replace(/[¥,]/g, '')
    const num = parseFloat(numStr)
    return isNaN(num) ? value : num
}

// 排序后的数据
const sortedData = computed(() => {
    if (sortState.value.column === null) return props.data

    const column = sortState.value.column
    const direction = sortState.value.direction

    return [...props.data].sort((a, b) => {
        const aVal = extractNumber(a[column])
        const bVal = extractNumber(b[column])

        const comparison = typeof aVal === 'number' && typeof bVal === 'number'
            ? aVal - bVal
            : String(a[column]).localeCompare(String(b[column]))

        return direction === 'asc' ? comparison : -comparison
    })
})
</script>

<style scoped>
.rounded-table-container {
    overflow: hidden;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    background: #ffffff00;
    height: 100%;
}

.rounded-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
}

.rounded-table thead {
    background-color: #d2d2d23d;
    box-shadow: 0px 1px 10px #2c3e5021;
    color: rgb(0, 0, 0);
}

.rounded-table th {
    padding: 16px 20px;
    text-align: left;
    font-weight: 600;
    font-size: 14px;
    letter-spacing: 0.5px;
}

.rounded-table td {
    padding: 14px 20px;
    border-bottom: 1px solid #5c5c5c28;
    color: #2c3e50;
    font-size: 14px;
}

.rounded-table tbody tr:last-child td {
    border-bottom: none;
}

.rounded-table tbody tr:hover {
    background-color: #f8fafc3f;
}

/* 排序功能样式 */
.sortable {
    cursor: pointer;
    user-select: none;
    position: relative;
    transition: background-color 0.2s;
}

.sortable:hover {
    background-color: rgba(205, 205, 205, 0.77);
}

.sorted {
    background-color: rgba(52, 152, 219, 0.1);
}

.sort-indicator {
    margin-left: 8px;
    font-size: 12px;
    color: #3498db;
    font-weight: bold;
}

.sort-placeholder {
    display: inline-block;
    width: 12px;
}

@media (max-width: 768px) {
    .rounded-table-container {
        overflow-x: auto;
    }

    .rounded-table {
        min-width: 600px;
    }
}
</style>