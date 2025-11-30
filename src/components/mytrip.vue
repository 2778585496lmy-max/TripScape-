<template>
    <h3 style="margin-left: 15px;"></h3>
    <div class="mytrip">

        <div class="trip-timeline">
            <div class="timeline-header">
                <h2 class="trip-title">我的旅游路线</h2>
                <p class="trip-subtitle">探索世界的美好足迹</p>
            </div>

            <div class="timeline-container">
                <div v-for="(item, index) in tripData" :key="index" class="timeline-item"
                    :class="{ 'reverse': index % 2 === 1 }">
                    <div class="timeline-marker"></div>
                    <div class="timeline-content" @click="toggleDetails(index)">
                        <div class="trip-card">
                            <div class="trip-year">{{ item.year }}</div>
                            <h3 class="trip-location">{{ item.location }}</h3>
                            <p class="trip-date">{{ item.date }}</p>
                            <p class="trip-description">{{ item.description }}</p>
                            <div class="trip-details" v-show="activeIndex === index">
                                <ul class="trip-activities">
                                    <li v-for="(activity, i) in item.activities" :key="i">
                                        {{ activity }}
                                    </li>
                                </ul>
                                <div class="trip-cost">总花费: {{ item.cost }}</div>
                            </div>
                            <div class="trip-images" v-if="item.images">
                                <img v-for="(img, i) in item.images" :key="i" :src="img" :alt="item.location"
                                    class="trip-image" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

// 旅游路线数据
const tripData = ref([
    {
        year: '2019',
        date: '2019年7月15日 - 7月22日',
        location: '云南大理-丽江',
        description: '苍山洱海，古城雪山，感受彩云之南的浪漫与神秘',
        activities: [
            '游览大理古城，骑行洱海',
            '攀登玉龙雪山，观看印象丽江',
            '漫步丽江古城，品尝纳西美食',
            '参观束河古镇，体验慢生活'
        ],
        cost: '¥8,500',
        images: [
            'https://picsum.photos/300/200?random=1',
            'https://picsum.photos/300/200?random=2'
        ]
    },
    {
        year: '2020',
        date: '2020年10月1日 - 10月5日',
        location: '浙江杭州-乌镇',
        description: '西湖美景，江南水乡，享受宁静致远的假期',
        activities: [
            '西湖游船，断桥残雪',
            '灵隐寺祈福，品味素斋',
            '乌镇西栅夜游，水乡人家',
            '品尝龙井茶，体验茶文化'
        ],
        cost: '¥3,200',
        images: [
            'https://picsum.photos/300/200?random=3'
        ]
    },
    {
        year: '2021',
        date: '2021年6月10日 - 6月16日',
        location: '四川成都-九寨沟',
        description: '熊猫故乡，人间仙境，探索自然与美食的天堂',
        activities: [
            '成都大熊猫基地看熊猫',
            '九寨沟深度游，五彩池',
            '品尝正宗四川火锅',
            '宽窄巷子体验市井生活'
        ],
        cost: '¥4,200'
    },
    {
        year: '2022',
        date: '2022年9月20日 - 9月26日',
        location: '西藏拉萨-林芝',
        description: '世界屋脊，雪域高原，感受心灵的洗礼',
        activities: [
            '布达拉宫朝圣',
            '大昭寺转经',
            '林芝看南迦巴瓦峰',
            '品尝藏式美食'
        ],
        cost: '¥5,500',
        images: [
            'https://picsum.photos/300/200?random=4',
            'https://picsum.photos/300/200?random=5'
        ]
    },
    {
        year: '2023',
        date: '2023年8月5日 - 8月15日',
        location: '新疆北疆环线',
        description: '天山南北，大漠孤烟，体验异域风情与壮美风光',
        activities: [
            '喀纳斯湖探寻水怪',
            '禾木村看星空',
            '赛里木湖环湖骑行',
            '吐鲁番品尝葡萄',
            '库车大峡谷探险'
        ],
        cost: '¥7,800',
        images: [
            'https://picsum.photos/300/200?random=6',
            'https://picsum.photos/300/200?random=7',
            'https://picsum.photos/300/200?random=8'
        ]
    }
])

const activeIndex = ref(null)

const toggleDetails = (index) => {
    activeIndex.value = activeIndex.value === index ? null : index
}
</script>

<style scoped>
.mytrip {
    height: 680px;
    width: 100%;
    padding: 40px 20px;
    box-sizing: border-box;
    overflow-y: auto;
    margin-top: 15px;
    border: #2c3e50 1px solid;
    border-radius: 15px;
}

.trip-timeline {
    max-width: 1200px;
    
}

.timeline-header {
    text-align: center;
    margin-bottom: 50px;
    color: rgb(37, 35, 35);
}

.trip-title {
    font-size: 36px;
    font-weight: 700;
    margin: 0 0 10px 0;
}

.trip-subtitle {
    font-size: 18px;
    opacity: 0.9;
    margin: 0;
}

.timeline-container {
    position: relative;
    padding: 20px 0;
}

/* 时间轴中线 */
.timeline-container::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(to bottom, #fff, #ddd, #fff);
    transform: translateX(-50%);
    border-radius: 2px;
}

.timeline-item {
    position: relative;
    display: flex;
    margin-bottom: 60px;
    align-items: center;
}

.timeline-item.reverse {
    flex-direction: row-reverse;
}

/* 时间点标记 */
.timeline-marker {
    position: absolute;
    left: 50%;
    width: 20px;
    height: 20px;
    background: #fff;
    border: 4px solid #3498db;
    border-radius: 50%;
    transform: translateX(-50%);
    z-index: 1;
    box-shadow: 0 0 0 6px rgba(52, 152, 219, 0.2);
    transition: all 0.3s ease;
}

.timeline-item:hover .timeline-marker {
    transform: translateX(-50%) scale(1.2);
    border-color: #e74c3c;
    box-shadow: 0 0 0 8px rgba(231, 76, 60, 0.2);
}

/* 内容卡片 */
.timeline-content {
    flex: 1;
    padding: 0 60px;
    cursor: pointer;
}

.trip-card {
    background: rgba(255, 255, 255, 0);
    border-radius: 16px;
    padding: 30px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.trip-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.trip-year {
    display: inline-block;
    background: linear-gradient(135deg, #3498db, #2c3e50);
    color: rgb(255, 255, 255);
    padding: 6px 18px;
    border-radius: 20px;
    font-weight: 700;
    font-size: 14px;
    margin-bottom: 15px;
    letter-spacing: 1px;
}

.trip-location {
    font-size: 24px;
    font-weight: 700;
    color: #2c3e50;
    margin: 0 0 10px 0;
}

.trip-date {
    color: #7f8c8d;
    font-size: 14px;
    margin: 0 0 15px 0;
    font-weight: 500;
}

.trip-description {
    color: #34495e;
    line-height: 1.6;
    margin: 0 0 20px 0;
    font-size: 16px;
}

/* 详情展开区 */
.trip-details {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.trip-activities {
    list-style: none;
    padding: 0;
    margin: 0 0 15px 0;
}

.trip-activities li {
    padding: 8px 0;
    position: relative;
    padding-left: 24px;
    color: #2c3e50;
}

.trip-activities li::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: #2ecc71;
    font-weight: bold;
    font-size: 16px;
}

.trip-cost {
    font-size: 18px;
    font-weight: 700;
    color: #e74c3c;
    text-align: right;
}

/* 图片展示 */
.trip-images {
    display: flex;
    gap: 10px;
    margin-top: 20px;
    flex-wrap: wrap;
}

.trip-image {
    width: 200px;
    height: 150px;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
}

.trip-image:hover {
    transform: scale(1.05);
}

/* 响应式设计 */
@media (max-width: 768px) {
    .timeline-container::before {
        left: 30px;
    }

    .timeline-item,
    .timeline-item.reverse {
        flex-direction: column;
        margin-bottom: 40px;
    }

    .timeline-marker {
        left: 30px;
    }

    .timeline-content {
        padding-left: 70px;
        padding-right: 20px;
    }

    .trip-card {
        padding: 20px;
    }

    .trip-images {
        justify-content: center;
    }

    .trip-image {
        width: 100%;
        max-width: 300px;
    }
}

/* 滚动条美化 */
.mytrip::-webkit-scrollbar {
    width: 8px;
}

.mytrip::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
}

.mytrip::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
}

.mytrip::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
}
</style>