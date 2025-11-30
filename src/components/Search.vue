<template>
    <div class="search-container">
        <div class="search-box">
            <input v-model="searchKeyword" type="text" placeholder="输入景区名称、地区或等级..." class="search-input"
                @keyup.enter="handleSearch" @input="handleInput" />
            <button class="search-btn" @click="handleSearch">
                <i class="search-icon"><ion-icon name="search-outline"></ion-icon></i>
            </button>
        </div>
        <!-- 搜索结果列表 -->
        <div v-if="searchResults.length > 0" class="search-results">
            <div class="results-info">
                找到 {{ searchResults.length }} 个景区
                <button class="clear-results" @click="clearResults">×</button>
            </div>
            <div v-for="spot in searchResults" :key="spot.id" class="result-item" @click="selectSpot(spot)">
                <div class="spot-main">
                    <div class="spot-name">{{ spot.景区名称 }}</div>
                    <div class="spot-level" :class="getLevelClass(spot.景区等级)">
                        {{ spot.景区等级 }}
                    </div>
                </div>
                <div class="spot-area">{{ spot.地区 }}</div>
            </div>
        </div>
        <!-- 搜索提示 -->
        <div v-else-if="searchKeyword && searched" class="no-results">未找到匹配的景区</div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { loadExcelData } from '@/utils/excelLoader'

const searchKeyword = ref('')
const searchResults = ref([])
const scenicSpots = ref([])
const searched = ref(false)

// 从 Excel 加载景区数据
const loadScenicSpots = async () => {
    try {
        scenicSpots.value = await loadExcelData('/A级景区.xlsx')
        console.log('加载景区数据成功:', scenicSpots.value.length, '条')
    } catch (error) {
        console.error('加载景区数据失败:', error)
    }
}

// 搜索处理函数
const handleSearch = () => {
    if (!searchKeyword.value.trim()) {
        searchResults.value = []
        searched.value = false
        return
    }

    searched.value = true
    const keyword = searchKeyword.value.toLowerCase().trim()

    searchResults.value = scenicSpots.value.filter((spot) => {
        return (
            (spot.景区名称 && spot.景区名称.toLowerCase().includes(keyword)) ||
            (spot.地区 && spot.地区.toLowerCase().includes(keyword)) ||
            (spot.景区等级 && spot.景区等级.toLowerCase().includes(keyword))
        )
    })
}

// 输入时实时搜索（防抖）
let searchTimer = null
const handleInput = () => {
    clearTimeout(searchTimer)
    searchTimer = setTimeout(() => {
        handleSearch()
    }, 300)
}

// 选择景区 - 确保传递完整数据
const selectSpot = (spot) => {
    // 发射事件给父组件，传递选中的景区完整信息
    emit('spotSelected', {
        经度: spot.经度,
        纬度: spot.纬度,
        景区名称: spot.景区名称,
        地区: spot.地区,
        景区等级: spot.景区等级,
    })

    // 清空搜索结果
    clearResults()
}

// 清空搜索结果
const clearResults = () => {
    searchResults.value = []
    searchKeyword.value = ''
    searched.value = false
}

// 获取等级样式类
const getLevelClass = (level) => {
    const levelMap = {
        '5A': 'level-5a',
        '4A': 'level-4a',
        '3A': 'level-3a',
        '2A': 'level-2a',
        '1A': 'level-1a',
    }
    return levelMap[level] || 'level-default'
}

// 定义发射的事件
const emit = defineEmits(['spotSelected'])

// 组件挂载时加载数据
onMounted(() => {
    loadScenicSpots()
})
</script>

<!-- 样式保持不变 -->

<style scoped>
/* 样式保持不变，与之前相同 */
.search-container {
    position: relative;
    width: 100%;
}

.search-box {
    display: flex;
    gap: 8px;
    align-items: center;
    width: 100%;
}

.search-input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid #dcdfe6;
    border-radius: 6px;
    outline: none;
    font-size: 13px;
    transition: border-color 0.3s;
    background: #fff;
}

.search-input:focus {
    border-color: #409eff;
}

.search-btn {
    padding: 8px;
    background: #ffffff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.search-icon ion-icon {
    font-size: 16px;
    line-height: 16px;
    color: rgb(0, 0, 0);
}
ion-icon {
  --ionicon-stroke-width: 60px;
}

.search-results {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #e4e7ed;
    border-radius: 6px;
    margin-top: 4px;
    max-height: 300px;
    overflow-y: auto;
    z-index: 9999;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.results-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background: #f5f7fa;
    border-bottom: 1px solid #e4e7ed;
    font-size: 12px;
    color: #909399;
}

.clear-results {
    background: none;
    border: none;
    font-size: 16px;
    color: #909399;
    cursor: pointer;
    padding: 0;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.clear-results:hover {
    color: #409eff;
}

.result-item {
    padding: 10px 12px;
    border-bottom: 1px solid #f0f0f0;
    cursor: pointer;
    transition: background-color 0.2s;
}

.result-item:hover {
    background: #f5f7fa;
}

.result-item:last-child {
    border-bottom: none;
}

.spot-main {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 4px;
}

.spot-name {
    font-weight: 600;
    font-size: 13px;
    color: #303133;
    flex: 1;
    margin-right: 8px;
}

.spot-level {
    padding: 2px 6px;
    border-radius: 10px;
    font-size: 10px;
    font-weight: 600;
    white-space: nowrap;
}

.level-5a {
    background: #fff7e6;
    color: #fa8c16;
    border: 1px solid #ffd591;
}

.level-4a {
    background: #f6ffed;
    color: #52c41a;
    border: 1px solid #b7eb8f;
}

.level-3a {
    background: #e6f7ff;
    color: #1890ff;
    border: 1px solid #91d5ff;
}

.level-2a,
.level-1a,
.level-default {
    background: #f9f0ff;
    color: #722ed1;
    border: 1px solid #d3adf7;
}

.spot-area {
    font-size: 12px;
    color: #606266;
}

.no-results {
    padding: 12px;
    text-align: center;
    color: #909399;
    font-size: 13px;
    background: white;
    border: 1px solid #e4e7ed;
    border-radius: 6px;
    margin-top: 4px;
}
</style>
