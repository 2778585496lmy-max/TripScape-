<template>
    <div class="popular">
        <div class="header">
            <h3>热门景点</h3>
        </div>

        <div v-if="loading" class="state">加载中...</div>
        <div v-else-if="error" class="state error">{{ error }}</div>

        <!-- 两列网格 -->
        <ul v-else class="list two-col">
            <li v-for="(spot, idx) in popularList" :key="spot.id ?? spot.name" class="item" @click="handleClick(spot)">
                <span class="rank">{{ idx + 1 }}</span>
                <span class="name">{{ spot.name }}</span>
                <span class="metric">{{ formatVisitors(spot.visitors) }}</span>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
    apiUrl: { type: String, default: '/api/popular-attractions' },
    autoFetch: { type: Boolean, default: true }
})

const emit = defineEmits(['jump'])

const loading = ref(false)
const error = ref('')
const list = ref([])

const popularList = computed(() =>
    [...list.value].sort((a, b) => (b.visitors ?? 0) - (a.visitors ?? 0))
)

onMounted(async () => {
    if (props.autoFetch) await fetchData()
})

async function fetchData() {
    loading.value = true
    error.value = ''
    try {
        const res = await fetch(props.apiUrl)
        if (!res.ok) throw new Error(`请求失败 ${res.status}`)
        const data = await res.json()
        list.value = Array.isArray(data) ? data : []
        if (!list.value.length) error.value = '暂无数据'
    } catch (e) {
        error.value = e.message || '网络错误'
    } finally {
        loading.value = false
    }
}

function formatVisitors(v) {
    const n = Number(v ?? 0)
    if (n >= 1e8) return (n / 1e8).toFixed(1).replace(/\.0$/, '') + '亿'
    if (n >= 1e4) return (n / 1e4).toFixed(1).replace(/\.0$/, '') + '万'
    return String(n)
}

function handleClick(spot) {
    const { lon, lat, name, id } = spot
    if (Number.isFinite(lon) && Number.isFinite(lat)) {
        emit('jump', { lon, lat, name, id })
    } else {
        console.warn('坐标缺失', spot)
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@100..900&display=swap');


.popular {
    display: flex;
    flex-direction: column;
    height: 100%;

}

.header {
    padding: 8px 10px;
    font-size: 16px;
    font-weight: 700;
    font-family: 'Noto+Sans+SC', sans-serif;
}

.state {
    padding: 10px;
    color: #666;
    font-family: 'Noto+Sans+SC', sans-serif;
}

.state.error {
    color: #c00;
    font-family: 'Noto+Sans+SC', sans-serif;
}

.list {
    flex: 1;
    overflow: auto;
    margin: 0;
    padding: 0 8px 8px;
    list-style: none;
    height: auto;
    font-family: 'Noto+Sans+SC', sans-serif;
}

::-webkit-scrollbar {
    width: 10px;
}

::-webkit-scrollbar-track {
    background: #ffffff;
}

::-webkit-scrollbar-thumb {
    background: #37373789;
    border-radius: 6px;
    border: #ffffff 3px solid;
}

.list.two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    /* 两列等宽 */
    gap: 8px;
    /* 列间距 & 行间距 */
}


.item {
    display: grid;
    grid-template-columns: 28px 1fr auto;
    gap: 8px;
    align-items: center;
    padding: 8px 6px;
    border-radius: 8px;
    cursor: pointer;
    transition: background .2s;
}

.item:hover {
    background: #f5f5f5;
}

.rank {
    display: inline-flex;
    width: 24px;
    height: 24px;
    align-items: center;
    justify-content: center;
    background: #000;
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    border-radius: 6px;
    flex-shrink: 0;
    font-family: 'Ubuntu', sans-serif;
}

.name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.metric {
    color: #6DE089;
    font-size: 16px;
    font-weight: 700;
    font-family: 'Ubuntu', sans-serif;
}
</style>