<template>
    <div class="recommend-container">
        <!-- 超美搜索框 + 标题 -->
        <div class="sidebar-header">
            <div class="modern-search">
                <i class="search-icon">Search</i>
                <input type="text" placeholder="搜索路线或景点..." v-model="searchQuery" class="search-input" />
                <button v-if="searchQuery" @click="searchQuery = ''" class="clear-btn" title="清空">
                    X
                </button>
            </div>

            <h3 class="header-title">
                <i class="title-icon">Route</i>
                推荐路线
            </h3>
        </div>

        <!-- 卡片列表 -->
        <div class="card-list">
            <div v-for="route in filteredRoutes" :key="route.id" class="route-card" @click="selectRoute(route)">
                <div class="card-image">
                    <img :src="route.image" :alt="route.title" />
                    <span class="tag" v-if="route.tag">{{ route.tag }}</span>
                </div>

                <div class="card-content">
                    <h3 class="route-title">{{ route.title }}</h3>

                    <div class="route-meta">
                        <span class="meta-item">
                            <span class="icon">路线长度</span> {{ route.distance }}km
                        </span>
                        <span class="meta-item">
                            <span class="icon">时长</span> {{ route.duration }}
                        </span>
                    </div>

                    <p class="route-desc">{{ route.description }}</p>

                    <div class="card-footer">
                        <span class="rating">Star {{ route.rating }}</span>
                        <button class="view-btn" @click.stop="selectRoute(route)">
                            立即查看
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 搜索
const searchQuery = ref('')

// 推荐路线（含真实 path 坐标）
const routes = ref([
    {
        id: 1,
        title: '西湖环线骑行',
        description: '途经断桥、苏堤、雷峰塔，经典西湖全景路线，适合休闲骑行。',
        distance: '12.5',
        duration: '1.5小时',
        rating: 4.8,
        image: 'https://hzyly.com/upload/201908/26/201908261930373237.jpg',
        tag: '热门',
        path: [[120.1368, 30.2583], [120.1402, 30.2489], [120.1456, 30.2387], [120.1398, 30.2281], [120.1299, 30.2256], [120.1203, 30.2358], [120.1245, 30.2523]]
    },
    {
        id: 2,
        title: '灵隐寺静心徒步',
        description: '从西湖西侧进入飞来峰，穿越古树步道，探访千年灵隐寺。',
        distance: '5.2',
        duration: '2小时',
        rating: 4.9,
        image: 'https://th.bing.com/th/id/OIP.xopDRz3bluAPdsyb0ejV8QHaEe?w=800',
        tag: '推荐',
        path: [[120.1089, 30.2421], [120.1056, 30.2398], [120.1012, 30.2415], [120.0978, 30.2432], [120.0956, 30.2409]]
    },
    {
        id: 3,
        title: '上海外滩夜跑',
        description: '经典外滩-陆家嘴对望路线，夜景天花板，建议傍晚出发。',
        distance: '7.5',
        duration: '45分钟',
        rating: 4.9,
        image: 'https://bpic.588ku.com/photo_water_img/24/03/20/c4b0ff83bd6cd6ba1250f749748f007e.jpg!/fw/750',
        tag: '夜景天花板',
        path: [[121.4968, 31.2456], [121.4942, 31.2401], [121.4911, 31.2356], [121.4889, 31.2302]]
    },
    {
        id: 4,
        title: '重庆洪崖洞夜景',
        description: '魔幻8D城市核心区，穿梭千层吊脚楼，赛博朋克感拉满！',
        distance: '6.8',
        duration: '55分钟',
        rating: 5.0,
        image: 'https://img95.699pic.com/photo/50018/8215.jpg_wh860.jpg',
        tag: '赛博城市',
        path: [[106.5769, 29.5624], [106.5798, 29.5601], [106.5823, 29.5589], [106.5845, 29.5578], [106.5881, 29.5602], [106.5903, 29.5631]]
    }
])

// 搜索过滤
const filteredRoutes = computed(() => {
    if (!searchQuery.value.trim()) return routes.value
    const q = searchQuery.value.toLowerCase()
    return routes.value.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        (r.tag && r.tag.toLowerCase().includes(q))
    )
})

// 发射事件给父组件
const emit = defineEmits(['select'])
const selectRoute = (route) => {
    emit('select', route)
}
</script>

<style scoped>
::-webkit-scrollbar {
    width: 8px;
    background: linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%);
}

::-webkit-scrollbar-track {
    background:linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%);
}

::-webkit-scrollbar-thumb {
    background: inear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%);
    border-radius: 4px;
    border: #00000000 solid 2px;
}

.recommend-container {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    color: #fff;
    border-radius: 10px;
}

.sidebar-header {
    padding: 20px 16px 16px;
    flex-shrink: 0;
}

.modern-search {
    position: relative;
    margin-bottom: 16px;
}

.search-input {
    width: 100%;
    padding: 12px 40px 12px 44px;
    background: rgba(255, 255, 255, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 16px;
    color: #fff;
    font-size: 15px;
    outline: none;
    backdrop-filter: blur(12px);
    transition: all 0.3s ease;
}

.search-input:focus {
    background: rgba(255, 255, 255, 0.18);
    border-color: #409EFF;
    box-shadow: 0 0 0 4px rgba(64, 158, 255, 0.25);
}

.search-input::placeholder {
    color: rgba(255, 255, 255, 0.5);
}

.search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 18px;
    color: #888;
    pointer-events: none;
}

.clear-btn {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-35%);
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    color: #ddd;
    font-size: 18px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.clear-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    color: #fff;
}

.header-title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
}

.title-icon {
    font-size: 20px;
}

.card-list {
    flex: 1;
    overflow-y: auto;
    padding: 0 16px 20px;
}

.route-card {
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: all 0.3s;
    cursor: pointer;
}

.route-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.card-image {
    height: 140px;
    position: relative;
}

.card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.tag {
    position: absolute;
    top: 10px;
    left: 10px;
    background: rgba(255, 102, 0, 0.9);
    color: #fff;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: bold;
}

.card-content {
    padding: 14px;
    color: #333;
}

.route-title {
    margin: 0 0 8px;
    font-size: 16px;
    font-weight: 600;
}

.route-meta {
    display: flex;
    gap: 12px;
    margin-bottom: 8px;
    font-size: 13px;
    color: #666;
}

.route-desc {
    font-size: 13px;
    color: #777;
    margin: 0 0 12px;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-clamp: 2;
}

.card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 10px;
    border-top: 1px solid #f0f0f0;
}

.rating {
    color: rgba(255, 102, 0, 1);
    font-weight: bold;
    font-size: medium;
}

.view-btn {
    background: #409EFF;
    color: white;
    border: none;
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 13px;
    cursor: pointer;
}

.view-btn:hover {
    background: #66b1ff;
}
</style>